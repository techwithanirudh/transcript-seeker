import { buttonVariants } from '@meeting-baas/ui/button';
import { CreateCalendar } from './create-calendar';

interface NoCalendarsProps {
  mutate: () => Promise<void>;
}

export function NoCalendars({ mutate }: NoCalendarsProps) {
  return (
    <div className="flex h-full flex-1 flex-col items-center justify-center">
      <h2 className="mb-4 text-2xl font-bold">You don't have any calendars yet</h2>
      <p className="mb-6 text-muted-foreground">Create a calendar to get started</p>
      <CreateCalendar mutate={mutate} className={buttonVariants({ variant: 'default' })} />
    </div>
  );
}
