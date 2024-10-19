import Join from '@/routes/join';
import Layout from '@/routes/layout';
import Meeting from '@/routes/recording';
import Recordings from '@/routes/recordings';
import NotFound from '@/routes/not-found';
import Root from '@/routes/root';
import Settings from '@/routes/settings';
import Upload from '@/routes/upload';

import { Route, Routes } from 'react-router-dom';

import { Toaster } from '@/components/ui/sonner';

export default function App() {
  return (
    <>
      <Toaster />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Root />} />
          <Route path="settings" element={<Settings />} />
          <Route path="recordings" element={<Recordings />} />
          <Route path="join" element={<Join />} />
          {/*
          <Route path="upload" element={<Upload />} />
  
          <Route path="/meeting/:botId" element={<Meeting />} /> */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  );
}
