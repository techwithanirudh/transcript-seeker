import ServerAlert from '@/components/server-alert';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { baasApiKeyAtom, serverAvailabilityAtom } from '@/store';
import { useAtom } from 'jotai';
import { SettingsIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

function RootPage() {
  const [serverAvailability] = useAtom(serverAvailabilityAtom);
  const [baasApiKey] = useAtom(baasApiKeyAtom);

  return (
    <div className="relative flex h-full min-h-[calc(100dvh-94px)] flex-col items-center justify-center space-y-2 px-4">
      <div className="fixed left-0 right-0 top-4 z-50 mx-4 flex justify-center">
        <div className="max-w-md">
          <ServerAlert mode={serverAvailability} />
        </div>
      </div>

      <div className="flex w-full max-w-md flex-col items-center justify-center">
        <h1 className="mb-2 text-center text-4xl font-bold">Transcript Seeker</h1>
        <p className="mb-6 text-center text-lg">
          Open-source interface by{' '}
          <a
            href="https://github.com/meeting-baas/meeting-bot-as-a-service/apps/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            Meeting Baas 🐟
          </a>
        </p>
        <div className="flex w-full items-center gap-4 pb-2">
          <Link to="/settings" className={cn(buttonVariants({ variant: 'secondary' }), "flex-1")}>
            <SettingsIcon className="mr-2 h-4 w-4" /> API Keys
          </Link>
          <Link to="/meetings" className={cn(buttonVariants({ variant: 'outline' }), "flex-1")}>
            Recordings
          </Link>
        </div>
        <div className="flex w-full gap-4">
          <Link
            to="/upload"
            className={cn(buttonVariants({ variant: 'default' }), 'h-16 flex-1 text-lg')}
          >
            Upload File
          </Link>
          <Link
            to="/join"
            className={cn(buttonVariants({ variant: 'default' }), 'h-16 flex-1 text-lg', {
              'pointer-events-none opacity-50': !baasApiKey,
            })}
          >
            Record Meeting
          </Link>
        </div>
      </div>
    </div>
  );
}

export default RootPage;