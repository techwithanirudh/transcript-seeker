import { StrictMode } from 'react';
import { NuqsAdapter } from 'nuqs/adapters/react-router';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import '@/styles/globals.css';
import '@/styles/prosemirror.css';

import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <NuqsAdapter>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </NuqsAdapter>
  </StrictMode>,
);
