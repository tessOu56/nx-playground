/// <reference types='vitest' />
import { resolve } from 'path';

import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv, type Plugin } from 'vite';

import {
  cmsBffOriginsFromEnv,
  createCmsBffMiddleware,
  nestApiBaseFromEnv,
} from './server/cms-bff';

function cmsOrganizerBffPlugin(env: Record<string, string | undefined>): Plugin {
  const middleware = createCmsBffMiddleware({
    nestApiBaseUrl: nestApiBaseFromEnv(env),
    adminApiToken: env.ADMIN_API_TOKEN,
    kratosPublicUrl: env.KRATOS_PUBLIC_URL ?? env.VITE_KRATOS_PUBLIC_URL,
    allowedOrganizerEmails: env.ALLOWED_ORGANIZER_EMAILS,
    eventStackCmsDevAuth: env.EVENT_STACK_CMS_DEV_AUTH,
    nodeEnv: env.NODE_ENV,
    allowedOrigins: cmsBffOriginsFromEnv(env),
  });
  return {
    name: 'cms-organizer-bff',
    configureServer(server) {
      server.middlewares.use('/cms-api', middleware);
    },
    configurePreviewServer(server) {
      server.middlewares.use('/cms-api', middleware);
    },
  };
}

export default defineConfig(({ mode }) => {
  const envDir = resolve(__dirname, '../..');
  const fileEnv = loadEnv(mode, envDir, '');
  const env: Record<string, string | undefined> = {
    ...fileEnv,
    ...process.env,
    NODE_ENV: process.env.NODE_ENV ?? mode,
  };
  const kratosPublicUrl =
    env.VITE_KRATOS_PUBLIC_URL ?? 'http://localhost:4433';
  const authAppUrl = env.VITE_AUTH_APP_URL ?? 'http://localhost:3004';

  return {
  root: __dirname,
  envDir,
  server: {
    port: 3002,
    host: '0.0.0.0',
  },
  preview: {
    port: 3002,
    host: '0.0.0.0',
  },
  plugins: [react(), vanillaExtractPlugin(), cmsOrganizerBffPlugin(env)],
  define: {
    'process.env.VITE_API_BASE_URL': JSON.stringify('/cms-api'),
    'process.env.VITE_KRATOS_PUBLIC_URL': JSON.stringify(kratosPublicUrl),
    'process.env.VITE_AUTH_APP_URL': JSON.stringify(authAppUrl),
    'process.env.NODE_ENV': JSON.stringify(mode),
  },

  resolve: {
    alias: {
      '@nx-playground/api-client': resolve(
        __dirname,
        '../../libs/api-client/src/index.ts'
      ),
      '@nx-playground/auth-client': resolve(
        __dirname,
        '../../libs/auth-client/src/index.ts'
      ),
      '@nx-playground/charts': resolve(
        __dirname,
        '../../libs/charts/src/index.ts'
      ),
      '@nx-playground/charts/recharts': resolve(
        __dirname,
        '../../libs/charts/src/recharts/index.ts'
      ),
      '@nx-playground/charts/chartjs': resolve(
        __dirname,
        '../../libs/charts/src/chartjs/index.ts'
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
          // 第三方庫分組
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
            if (id.includes('date-fns') || id.includes('lodash')) {
              return 'vendor-utils';
            }
            return 'vendor-other';
          }

          // 功能模組分組
          if (id.includes('/features/dashboard/')) {
            return 'feature-dashboard';
          }
          if (id.includes('/features/events/')) {
            return 'feature-events';
          }
          if (id.includes('/features/form/')) {
            return 'feature-forms';
          }
          if (id.includes('/features/settings/')) {
            return 'feature-settings';
          }

          // UI 組件庫
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
    include: ['{src,tests,server}/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    reporters: ['default'],
    coverage: {
      reportsDirectory: './test-output/vitest/coverage',
      provider: 'v8' as const,
    },
  },
  };
});
