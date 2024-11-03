import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import checker from 'vite-plugin-checker';

export default defineConfig(() => {
  const CLIENT_PORT: number = Number(process.env.VITE_CLIENT_PORT) || 5173;
  const CLIENT_HOST: string =
    process.env.TAURI_DEV_HOST || process.env.VITE_CLIENT_HOST || 'localhost';

  return {
    clearScreen: false,
    plugins: [
      react(),
      checker({
        typescript: true,
      }),
    ],
    server: {
      port: CLIENT_PORT,
      host: CLIENT_HOST,
      strictPort: true,
      cors: true,
      hmr: {
        protocol: 'ws',
        host: CLIENT_HOST,
        port: CLIENT_PORT,
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@meeting-baas/ui': path.resolve(__dirname, '../../packages/ui/src'),
      },
    },
    optimizeDeps: {
      exclude: ['@electric-sql/pglite', '@meeting-baas/ui'],
    },
    build: {
      target: process.env.TAURI_ENV_PLATFORM === 'windows' ? 'chrome105' : 'safari13',
      minify: !process.env.TAURI_ENV_DEBUG ? 'esbuild' : false,
      sourcemap: !!process.env.TAURI_ENV_DEBUG,
    },
    envPrefix: ['VITE_', 'TAURI_', 'TAURI_ENV_', 'TAURI_DEBUG'],
  };
});
