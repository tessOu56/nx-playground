import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  root: __dirname,
  define: {
    'process.env': process.env,
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
    allowedHosts: ['localhost', 'frontend.nx-playground.local'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      // Point to src/ directory for CSS imports to work
      '@nx-playground/design-system': path.resolve(
        __dirname,
        '../../libs/design-system/src'
      ),
      '@nx-playground/ui-components': path.resolve(
        __dirname,
        '../../libs/ui-components/src/index.ts'
      ),
      '@nx-playground/api-client': path.resolve(
        __dirname,
        '../../libs/api-client/src/index.ts'
      ),
    },
  },
  build: {
    chunkSizeWarningLimit: 2048,
  },
});
