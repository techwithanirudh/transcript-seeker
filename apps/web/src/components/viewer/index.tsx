import type { formSchema as chatSchema } from '@/components/viewer/chat/chat-input';
import type { Meeting, Message } from '@/types';
import type { MediaPlayerInstance } from '@vidstack/react';
import type { JSONContent } from 'novel';
import type { z } from 'zod';
import * as React from 'react';
import Chat from '@/components/viewer/chat';
import Editor from '@/components/viewer/editor';
import Transcript from '@/components/viewer/transcript';
import { Player as VideoPlayer } from '@/components/viewer/video-player';
import { useApiKey } from '@/hooks/use-api-key';
import { useChat } from '@/hooks/use-chat';
import { useEditor } from '@/hooks/use-editor';
import { useMediaQuery } from '@/hooks/use-media-query';
import {
  BLANK_EDITOR_DATA,
  LOADING_EDITOR_DATA,
  VITE_PROXY_URL,
  VITE_S3_PREFIX,
} from '@/lib/constants';
import { setChat, setEditor as setEditorDB } from '@/queries';
import { DownloadIcon } from 'lucide-react';
import OpenAI from 'openai';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { mutate } from 'swr';

import { cn } from '@meeting-baas/ui';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@meeting-baas/ui/breadcrumb';
import { Button, buttonVariants } from '@meeting-baas/ui/button';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@meeting-baas/ui/resizable';

import { ModeToggle } from '../mode-toggle';

interface ViewerProps {
  botId: string;
  isLoading: boolean;
  meeting: Meeting;
}

export function Viewer({ botId, isLoading, meeting }: ViewerProps) {
  const [data] = React.useState<Meeting>(meeting);
  const [transcripts, setTranscripts] = React.useState<any[]>([
    {
      speaker: '',
      words: [
        {
          start_time: 0,
          end_time: 0,
          text: '',
        },
      ],
    },
  ]);

  const [editor, setEditor] = React.useState<JSONContent | undefined>(undefined);

  const [player, setPlayer] = React.useState<MediaPlayerInstance>();
  const [currentTime, setCurrentTime] = React.useState(0);

  const [video, setVideo] = React.useState<string | Blob>();

  const { apiKey: openAIApiKey } = useApiKey({ type: 'openai' });
  const { editor: editorDB, isLoading: isEditorLoading } = useEditor({ meetingId: meeting.id });

  const { chat, isLoading: isChatLoading } = useChat({ meetingId: meeting.id });

  const [messages, setMessages] = React.useState<Message[]>([]);
  const isDesktop = useMediaQuery('(min-width: 768px)');

  const handleEditorChange = async (content: JSONContent) => {
    if (!meeting) return;
    await setEditorDB({ meetingId: meeting.id, content: content });
    mutate(['editor', meeting.id]);
  };

  const handleMessageChange = async (messages: Message[]) => {
    if (!meeting) return;
    await setChat({
      meetingId: meeting.id,
      messages,
    });
    mutate(['chat', meeting.id]);
  };

  const handleChatSubmit = async (values: z.infer<typeof chatSchema>) => {
    const message = values.message;
    setMessages((prev) => [...prev, { content: message, role: 'user' }]);

    try {
      const messagesList: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [];

      transcripts.forEach((transcript) => {
        let text = '';
        transcript.words.forEach((word: { text: string }) => {
          text += word.text + ' ';
        });
        messagesList.push({ content: text, role: 'user' });
      });

      messagesList.push(...messages);
      messagesList.push({ content: message, role: 'user' });

      let res: {
        data: {
          response: string;
        };
      };

      // todo: create a proxy openai server instead idk
      // todo: allow options for the proxy server to include api keys so no need for clients
      if (!openAIApiKey) return;
      const openai = new OpenAI({
        apiKey: openAIApiKey,
        dangerouslyAllowBrowser: true,
        // https://help.openai.com/en/articles/5112595-best-practices-for-api-key-safety
      });

      const systemPrompt =
        'You are a helpful assistant named AI Meeting Bot. You will be given a context of a meeting and some meeting notes, you will answer questions based on the context.';
      const result = await openai.chat.completions.create({
        messages: [{ role: 'system', content: systemPrompt }, ...messagesList],
        model: 'gpt-4o-mini',
      });

      res = {
        data: {
          response: result.choices[0]?.message.content || '',
        },
      };

      setMessages((prev) => [...prev, { content: res.data.response, role: 'assistant' }]);
    } catch (error) {
      console.error('error', error);
      toast.error('Oops! Something went wrong.');
      setMessages((prev) => [
        ...prev,
        { content: `Oops! Something went wrong. ${error}`, role: 'assistant' },
      ]);
      return;
    }
  };

  const handleTimeUpdate = React.useCallback((time: number) => {
    setCurrentTime(time);
  }, []);

  const handleSeek = React.useCallback(
    (time: number) => {
      if (player) {
        player.currentTime = time;
      }
    },
    [player],
  );

  const setPlayerRef = React.useCallback((player: MediaPlayerInstance) => {
    setPlayer(player);
  }, []);

  React.useEffect(() => {
    if (data.type === 'meetingbaas') {
      if (!data.assets.video_url) return;
      const url = data.assets.video_url.replace(VITE_S3_PREFIX, '');
      setVideo(`${VITE_PROXY_URL}/api/s3${url}`);
    }
    if (data.type === 'local') {
      if (!data.assets.video_blob) return;
      setVideo(data.assets.video_blob);
    }
  }, [data]);

  React.useEffect(() => {
    if (data.transcripts) {
      const transcripts: Meeting['transcripts'] = data.transcripts;
      console.log('parsed transcript:', transcripts);
      setTranscripts(transcripts);
    }
  }, [data]);

  React.useEffect(() => {
    if (editorDB?.content) {
      editor?.commands.setContent(editorDB.content);
    } else {
      editor?.commands.setContent(BLANK_EDITOR_DATA);
    }
  }, [isEditorLoading]);

  React.useEffect(() => {
    if (messages.length > 0) {
      handleMessageChange(messages);
    } else if (messages.length === 0 && chat) {
      if (!chat.messages) return;
      setMessages(chat.messages);
    }
  }, [isChatLoading, messages]);

  return (
    <div className="min-h-svh">
      <div className="w-full">
        <header className="sticky top-0 flex h-16 shrink-0 items-center justify-between gap-2 bg-background px-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>

              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Recording</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="flex-grow text-center">
            <h1 className="text-xl font-semibold">{meeting.name}</h1>
          </div>
          <div className='flex gap-2'>
            <Link
              to={`/share/${botId}`}
              className={cn(
                buttonVariants({ variant: 'outline' }),
                'pointer-events-none opacity-50',
                '',
              )}
            >
              Share
            </Link>
            <ModeToggle />
          </div>
        </header>
      </div>
      <ResizablePanelGroup
        className="flex min-h-[200dvh] lg:min-h-[calc(100svh-theme(spacing.16))]"
        direction={isDesktop ? 'horizontal' : 'vertical'}
      >
        <ResizablePanel defaultSize={33} minSize={25}>
          <ResizablePanelGroup direction="vertical" className={cn('flex h-full w-full')}>
            <ResizablePanel defaultSize={50} minSize={25}>
              <div className="flex h-full flex-1 overflow-hidden rounded-b-none border-0 border-x border-b border-t lg:border-0 lg:border-b lg:border-l lg:border-t">
                {video && (
                  <VideoPlayer
                    // @ts-ignore
                    src={{
                      src: video,
                      type: data.type === 'meetingbaas' ? 'video/mp4' : 'video/object',
                    }}
                    onTimeUpdate={handleTimeUpdate}
                    setPlayer={setPlayerRef}
                    assetTitle={meeting.name}
                  />
                )}
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={50} minSize={15}>
              <div className="h-full max-h-full flex-1 space-y-2 overflow-auto rounded-t-none border-0 border-x bg-background p-4 md:p-6 lg:border-0 lg:border-b lg:border-l">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2 className="px-0.5 text-2xl font-bold md:text-3xl">Transcript</h2>
                  <div className="flex gap-2">
                    <Button className="h-8" size="sm">
                      <DownloadIcon className="h-4 w-4" /> Download JSON
                    </Button>
                    <Button className="h-8" size="sm">
                      <DownloadIcon className="h-4 w-4" /> Download Video
                    </Button>
                  </div>
                </div>
                {isLoading && <div className="flex px-0.5">Loading...</div>}
                <Transcript
                  transcript={transcripts}
                  currentTime={currentTime}
                  onWordClick={handleSeek}
                />
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={67} minSize={25}>
          <ResizablePanelGroup direction="vertical" className={cn('flex h-full w-full')}>
            <ResizablePanel defaultSize={67} minSize={25}>
              <Editor
                initialValue={LOADING_EDITOR_DATA}
                onCreate={({ editor }) => setEditor(editor)}
                onChange={handleEditorChange}
              />
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={33} minSize={25}>
              <Chat
                messages={messages}
                handleSubmit={handleChatSubmit}
                disabled={{
                  value: !openAIApiKey || isChatLoading,
                  reason: isChatLoading ? 'loading' : 'openai',
                }}
              />
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
