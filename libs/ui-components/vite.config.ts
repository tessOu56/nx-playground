import * as path from 'path';

// import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig(() => ({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/libs/ui-components',
  plugins: [
    // nxViteTsPaths(),
    vanillaExtractPlugin(),
    react(),
    // 新增 dts 插件以生成型別宣告檔
    dts({
      entryRoot: 'src',
      // 指定 TypeScript 配置檔案的路徑
      tsconfigPath: path.join(__dirname, 'tsconfig.lib.json'),
      // skipDiagnostics: true,
    }),
  ],
  build: {
    // 輸出目錄修改為本地 dist
    outDir: '../../dist/libs/ui-components',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    lib: {
      entry: 'src/index.ts',
      name: '@nx-playground/ui-components',
      fileName: 'index',
      formats: ['es' as const, 'cjs' as const],
    },
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        '@radix-ui/react-dialog',
        '@radix-ui/react-dropdown-menu',
        '@radix-ui/react-icons',
        '@radix-ui/react-label',
        '@radix-ui/react-navigation-menu',
        '@radix-ui/react-primitive',
        '@radix-ui/react-separator',
        '@radix-ui/react-slot',
        '@radix-ui/react-tabs',
        'class-variance-authority',
        'tailwind-merge',
        'clsx',
        '@vanilla-extract/css',
        '@vanilla-extract/recipes',
        '@vanilla-extract/sprinkles',
        '@nx-playground/i18n',
        '@nx-playground/design-system',
      ],
    },
  },
  test: {
    // ...
  },
}));
