/// <reference types='vitest' />
import { resolve } from 'path';

import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig(() => ({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/apps/APP_NAME',
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
  preview: {
    port: 3000,
    host: '0.0.0.0',
  },
  plugins: [react(), vanillaExtractPlugin()],
  define: {
    'process.env': process.env,
  },

  resolve: {
    alias: {
      '@nx-playground/api-client': resolve(
        __dirname,
        '../../libs/api-client/src/index.ts'
      ),
      '@nx-playground/design-system': resolve(
        __dirname,
        '../../libs/design-system/src'
      ),
      '@nx-playground/ui-components': resolve(
        __dirname,
        '../../libs/ui-components/src/index.ts'
      ),
      '@nx-playground/i18n': resolve(__dirname, '../../libs/i18n/src/index.ts'),
    },
  },
  build: {
    outDir: './dist',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    rollupOptions: {
      output: {
        manualChunks: id => {
          if (id.includes('node_modules')) {
            if (
              id.includes('react') ||
              id.includes('react-dom') ||
              id.includes('react-router')
            ) {
              return 'vendor-react';
            }
            if (id.includes('@radix-ui')) {
              return 'vendor-radix';
            }
            return 'vendor-other';
          }

          if (id.includes('@nx-playground/ui-components')) {
            return 'ui-components';
          }
          if (id.includes('@nx-playground/design-system')) {
            return 'design-system';
          }
        },
      },
    },
  },
  test: {
    watch: false,
    globals: true,
    environment: 'jsdom',
    include: ['{src,tests}/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    reporters: ['default'],
    coverage: {
      reportsDirectory: './test-output/vitest/coverage',
      provider: 'v8' as const,
    },
  },
}));

