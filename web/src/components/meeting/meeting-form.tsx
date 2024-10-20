'use client';

import { joinMeetingWrapper as joinMeeting } from '@/lib/axios';
import { useServerAvailabilityStore } from '@/store';

import { zodResolver } from '@hookform/resolvers/zod';
import * as MeetingBaas from '@meeting-baas/shared';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

// Remove the axios import

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import ServerAlert from '@/components/server-alert';
import { Meeting } from '@/types';

import useSWR from 'swr';
import { createMeeting, getAPIKey, getMeetings } from '@/queries';
import type { SelectAPIKey } from '@/db/schema';

// const fetchMeetings = async () => {
//   const meetings = await getMeetings();
//   if (!meetings) return [];
//   if (Array.isArray(meetings)) {
//     return meetings;
//   }
//   return [];
// };
const fetchAPIKey = async (type: SelectAPIKey['type']) => await getAPIKey({ type });

const formSchema = z.object({
  meetingURL: z.string().url().min(1, 'Meeting URL is required'),
  meetingBotName: z.string().optional(),
  meetingBotImage: z.string().url().optional(),
  meetingBotEntryMessage: z.string().optional(),
});

export function MeetingForm() {
  const serverAvailability = useServerAvailabilityStore((state) => state.serverAvailability);
  const { data: baasApiKey } = useSWR('meetingbaas', () => fetchAPIKey('meetingbaas'));
  // const { data: meetings } = useSWR('meetings', () => fetchMeetings());

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      meetingURL: '',
      meetingBotName: MeetingBaas.DEFAULT_BOT_NAME,
      meetingBotEntryMessage: MeetingBaas.DEFAULT_ENTRY_MESSAGE,
      meetingBotImage: MeetingBaas.DEFAULT_BOT_IMAGE,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const { meetingURL, meetingBotName, meetingBotImage, meetingBotEntryMessage } = values;
      const result = await joinMeeting({
        baasApiKey: baasApiKey?.content ?? "",
        serverAvailability,
        params: {
          meetingURL,
          meetingBotName,
          meetingBotEntryMessage,
          meetingBotImage,
          apiKey: baasApiKey?.content,
        },
      });

      if ('error' in result) {
        throw new Error(result.error);
      }

      const newMeeting: Omit<Meeting, "id"> = {
        bot_id: String(result.data.bot_id),
        name: 'MeetingBaas Recorded Meeting',
        attendees: ['-'],
        createdAt: new Date(),
        status: 'loading',
      };
  
      createMeeting(newMeeting);
      toast.success(`Meeting bot created successfully!`);
    } catch (error) {
      console.error('Error adding meeting bot:', error);
      toast.error('Failed to create meeting bot');
    }
  }

  return (
    <>
      <div className="my-2 bg-white">
        <ServerAlert mode={serverAvailability} />
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="meetingURL"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Meeting URL *</FormLabel>
                <FormControl>
                  <Input type="url" placeholder="Enter meeting URL" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="meetingBotName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Meeting Bot Name (optional)</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder={MeetingBaas.DEFAULT_BOT_NAME}
                    className={!field.value ? 'text-gray-400' : ''}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="meetingBotImage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Meeting Bot Image (optional)</FormLabel>
                <FormControl>
                  <Input
                    placeholder={MeetingBaas.DEFAULT_BOT_IMAGE}
                    className={!field.value ? 'text-gray-400' : ''}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="meetingBotEntryMessage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Meeting Bot Entry Message (optional)</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder={MeetingBaas.DEFAULT_ENTRY_MESSAGE}
                    className={!field.value ? 'text-gray-400' : ''}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* this doesn't really make sense if you think about it */}
          {/* <FormField
            control={form.control}
            name="apiKey"
            render={({ field }) => (
              <FormItem>
                <FormLabel>API Key (optional)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Enter API key" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /> */}
          <Button type="submit" className='w-full'>Submit</Button>
        </form>
      </Form>
    </>
  );
}