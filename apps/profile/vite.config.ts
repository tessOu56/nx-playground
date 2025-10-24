/// <reference types='vitest' />
import { readFile } from 'fs/promises';
import { join, resolve } from 'path';

import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import type { Plugin } from 'vite';

/**
 * Vite plugin to serve README and Spec markdown files
 */
function markdownLoaderPlugin(): Plugin {
  const workspaceRoot = resolve(__dirname, '../..');

  return {
    name: 'markdown-loader',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url || '';

        // Match /apps/{id}/README*.md or /libs/{id}/README*.md
        const readmeMatch = url.match(
          /^\/(apps|libs)\/([^/]+)\/(README(?:\.zh-TW)?\.md)$/
        );
        if (readmeMatch) {
          const [, type, id, fileName] = readmeMatch;
          const filePath = join(workspaceRoot, type, id, fileName);

          try {
            const content = await readFile(filePath, 'utf-8');
            res.setHeader('Content-Type', 'text/markdown; charset=utf-8');
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.end(content);
            return;
          } catch (error) {
            // File not found, continue
          }
        }

        // Match /specs/**/*.md
        const specMatch = url.match(/^\/specs\/(.+\.md)$/);
        if (specMatch) {
          const [, specPath] = specMatch;
          const filePath = join(workspaceRoot, 'specs', specPath);

          try {
            const content = await readFile(filePath, 'utf-8');
            res.setHeader('Content-Type', 'text/markdown; charset=utf-8');
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.end(content);
            return;
          } catch (error) {
            // File not found, continue
          }
        }

        next();
      });
    },
  };
}

export default defineConfig(() => ({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/apps/profile',
  server: {
    port: 3003,
    host: '0.0.0.0',
    fs: {
      allow: ['..', '../..'], // 允許訪問上層目錄（讀取 specs/ 和各專案 README）
    },
  },
  assetsInclude: ['**/*.md'], // 包含 .md 檔案作為資源
  preview: {
    port: 3003,
    host: '0.0.0.0',
  },
  plugins: [markdownLoaderPlugin(), react(), vanillaExtractPlugin()],
  define: {
    'process.env': process.env,
    global: 'globalThis',
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
    },
  },

  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@nx-playground/api-client': resolve(
        __dirname,
        '../../libs/api-client/src/index.ts'
      ),
      '@nx-playground/auth-client': resolve(
        __dirname,
        '../../libs/auth-client/src/index.ts'
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
      '@nx-playground/hooks': resolve(
        __dirname,
        '../../libs/hooks/src/index.ts'
      ),
      '@nx-playground/tech-stack-data': resolve(
        __dirname,
        '../../libs/tech-stack-data/src/index.ts'
      ),
      '@nx-playground/search-engine': resolve(
        __dirname,
        '../../libs/search-engine/src/index.ts'
      ),
    },
  },
  build: {
    outDir: '../../dist/apps/profile',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    assetsInlineLimit: 4096, // Inline assets < 4KB as base64
    chunkSizeWarningLimit: 500, // Warn if chunk > 500KB
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

          // UI 組件庫
          if (id.includes('@nx-playground/ui-components')) {
            return 'ui-components';
          }
          if (id.includes('@nx-playground/design-system')) {
            return 'design-system';
          }

          // Feature libraries
          if (id.includes('@nx-playground/search-engine')) {
            return 'search-engine';
          }
          if (id.includes('@nx-playground/i18n')) {
            return 'i18n';
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
      reportsDirectory: '../../coverage/apps/profile',
      provider: 'v8' as const,
    },
  },
}));
