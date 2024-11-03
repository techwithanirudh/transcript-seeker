// Add type definition for the Tauri window object
declare global {
  interface Window {
    __TAURI__?: {
      invoke(cmd: string, args?: unknown): Promise<any>;
      [key: string]: any;
    };
    __TAURI_INTERNALS__?: {
      metadata: {
        currentWindow: { label: string };
        currentWebview: { label: string };
      };
    };
    isTauri?: boolean;
  }
}

// Enhanced check for Tauri environment
export const isInTauri =
  typeof window !== 'undefined' &&
  (window.__TAURI__ !== undefined ||
    window.__TAURI_INTERNALS__ !== undefined ||
    window.isTauri === true);

// Add more detailed debugging
async function checkTauriEnvironment() {
  console.log('Window object:', typeof window !== 'undefined' ? 'defined' : 'undefined');
  console.log('isTauri flag:', window?.isTauri);
  console.log('__TAURI__ object:', window?.__TAURI__);
  console.log('__TAURI_INTERNALS__:', window?.__TAURI_INTERNALS__);

  if (isInTauri) {
    console.log('Running in Tauri environment');
  } else {
    console.log('Not running in Tauri environment');
  }
}

checkTauriEnvironment();
