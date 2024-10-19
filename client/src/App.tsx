import Join from '@/routes/join';
import Layout from '@/routes/layout';
import Meeting from '@/routes/meeting';
import Recordings from '@/routes/recordings';
import NotFound from '@/routes/not-found';
import Root from '@/routes/root';
import Settings from '@/routes/settings';
import Upload from '@/routes/upload';

import { Route, Routes } from 'react-router-dom';

import { Toaster } from '@/components/ui/sonner';

// todo: idk the use for this but. later iug
// export const VITE_SERVER_API_URL = import.meta.env.VITE_SERVER_API_URL;
// export const PROXY_URL = import.meta.env.VITE_BAAS_PROXY_URL;
// export const S3_PROXY_URL = import.meta.env.VITE_S3_PROXY_URL;
// export const PROFILE = import.meta.env.VITE_PROFILE;

export default function App() {
  return (
    <>
      <Toaster />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Root />} />
          <Route path="settings" element={<Settings />} />
          <Route path="recordings" element={<Recordings />} />
          {/* <Route path="join" element={<Join />} />
          <Route path="upload" element={<Upload />} />
          <Route path="meetings" element={<Meetings />} />
          
          <Route path="/meeting/:botId" element={<Meeting />} /> */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  );
}
