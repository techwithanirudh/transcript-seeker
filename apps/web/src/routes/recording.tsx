'use client';

import type { Meeting as MeetingT } from '@/types';
import { Suspense } from 'react';
import FullSpinner from '@/components/loader';
import { Viewer } from '@/components/viewer';
import { useApiKey } from '@/hooks/use-api-key';
import { fetchBotDetails } from '@/lib/meetingbaas';
import { StorageBucketAPI } from '@/lib/storage-bucket-api';
import { createMeeting, getMeetingByBotId, updateMeeting } from '@/queries';
import { useParams } from 'react-router-dom';
import useSWR from 'swr';
import { useQueryState } from 'nuqs';

import ErrorPage from './error';
import NotFoundPage from './not-found';

const fetchMeeting = async (botId: string, baasApiKey: string, isHeadless: boolean): Promise<MeetingT | null> => {
  if (!botId) throw new Error('No bot ID provided');

  let meeting: MeetingT | null | undefined = await getMeetingByBotId({ botId });
  if (!meeting && !isHeadless) return null;

  if (meeting?.type === 'local') {
    const storageAPI = new StorageBucketAPI('local_files');
    await storageAPI.init();

    const videoContent = await storageAPI.get(`${meeting.botId}.mp4`);
    if (videoContent && meeting.assets) meeting.assets.video_blob = videoContent;
  } else if (meeting?.type === 'meetingbaas' && baasApiKey) {
    const data = await fetchBotDetails({
      botId: meeting.botId,
      apiKey: baasApiKey,
    });

    if (data) {
      await updateMeeting({ id: meeting.id, values: { ...data } });
      meeting = { ...meeting, ...data };
    }
  } else if (isHeadless) {
    const data = await fetchBotDetails({
      botId: botId,
      apiKey: baasApiKey,
    });

    if (data) {
      meeting = {
        id: 10,
        type: 'meetingbaas',
        name: 'Imported Meeting',
        ...data,
        status: 'loaded',
      };
    }
  }

  return meeting ?? null;
};

function MeetingContent({ botId, baasApiKey, isHeadless }: { botId: string; baasApiKey: string; isHeadless: boolean }) {
  const { data: meeting, isLoading, error } = useSWR<MeetingT | null>(
    ['meeting', botId, baasApiKey, isHeadless],
    () => fetchMeeting(botId, baasApiKey, isHeadless),
    {
      refreshInterval: (meeting: MeetingT) => (meeting && !meeting.endedAt && isHeadless ? 5000 : 0),
      revalidateOnFocus: false,
    }
  );

  if (isLoading) return <FullSpinner />;
  if (error) return <ErrorPage>Error loading meeting: {error?.message}</ErrorPage>;
  if (!meeting) return <NotFoundPage />;

  return <Viewer botId={botId} isLoading={false} meeting={meeting} />;
}

export default function RecordingPage() {
  const { botId } = useParams<{ botId: string }>();
  const [code] = useQueryState('code', { defaultValue: '' })
  const { apiKey: baasKey } = useApiKey({ type: 'meetingbaas' });

  const baasApiKey = code || baasKey;

  return (
    <Suspense fallback={<FullSpinner />}>
      <MeetingContent botId={botId!} baasApiKey={baasApiKey} isHeadless={!!code} />
    </Suspense>
  );
}