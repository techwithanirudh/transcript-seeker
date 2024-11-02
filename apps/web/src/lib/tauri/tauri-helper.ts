// Add type definition for the Tauri window object
declare global {
  interface Window {
    __TAURI__?: {
      [key: string]: any;
    };
  }
}

// Simple check to see if we're running in Tauri
export const isInTauri = typeof window !== 'undefined' && window.__TAURI__ !== undefined;
