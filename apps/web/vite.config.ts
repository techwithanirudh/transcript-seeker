import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import checker from 'vite-plugin-checker';

// @ts-ignore
export default defineConfig(() => {
  // const CLIENT_PORT: number = Number(process.env.VITE_CLIENT_PORT) || 5173;
  // always use port 5173 as tauri expects a fixed port
  const CLIENT_PORT: number = 5173;
  const CLIENT_HOST: string = process.env.VITE_CLIENT_HOST || 'localhost';

  return {
    // fix: https://answers.netlify.com/t/failed-to-load-module-script-expected-a-javascript-module-script-but-the-server-responded-with-a-mime-type-of-text-html-strict-mime-type-checking-is-enforced-for-module-scripts-per-html-spec/122743/8
    plugins: [
      react(),
      checker({
        typescript: true,
      }),
    ],
    server: {
      // Tauri expects a fixed port, fail if that port is not available
      strictPort: true,

      port: CLIENT_PORT,
      host: CLIENT_HOST || false,
    },
    // Env variables starting with the item of `envPrefix` will be exposed in tauri's source code through `import.meta.env`.
    envPrefix: ['VITE_', 'TAURI_ENV_*'],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@meeting-baas/ui': path.resolve(__dirname, '../../packages/ui/src'),
      },
    },
    optimizeDeps: { exclude: ['@electric-sql/pglite', '@meeting-baas/ui'] },
    build: {
      // Tauri uses Chromium on Windows and WebKit on macOS and Linux
      target: process.env.TAURI_ENV_PLATFORM == 'windows' ? 'chrome105' : 'safari14',
      // don't minify for debug builds
      minify: !process.env.TAURI_ENV_DEBUG ? 'esbuild' : false,
      // produce sourcemaps for debug builds
      sourcemap: !!process.env.TAURI_ENV_DEBUG,
    },
  };
});
