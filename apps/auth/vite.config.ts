import { resolve } from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const envDir = resolve(__dirname, '../..');
  loadEnv(mode, envDir, '');
  return {
  plugins: [react()],
  root: __dirname,
  envDir,
  define: {
    'process.env': process.env,
  },
  server: {
    host: '0.0.0.0',
    port: 3004,
    allowedHosts: ['localhost', 'frontend.nx-playground.local'],
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      // Point to src/ directory for CSS imports to work
      '@nx-playground/design-system': resolve(
        __dirname,
        '../../libs/design-system/src'
      ),
      '@nx-playground/ui-components': resolve(
        __dirname,
        '../../libs/ui-components/src/index.ts'
      ),
      '@nx-playground/api-client': resolve(
        __dirname,
        '../../libs/api-client/src/index.ts'
      ),
      '@nx-playground/logger': resolve(
        __dirname,
        '../../libs/logger/src/index.ts'
      ),
    },
  },
  build: {
    chunkSizeWarningLimit: 2048,
  },
  };
});
