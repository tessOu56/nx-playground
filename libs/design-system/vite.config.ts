/// <reference types='vitest' />
import { resolve } from 'path';

import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'NX PlaygroundDesignSystem',
      fileName: 'index',
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
  },
  plugins: [
    // 使用 nxViteTsPaths 來解析 tsconfig 中的路徑別名
    nxViteTsPaths(),
    // 確保 dts 插件正確生成型別宣告
    dts({
      // 輸出目錄指向 dist/libs/design-system，
      // 這是 ui-components 所期望的位置。
      outDir: resolve(__dirname, '../../dist/libs/design-system'),
      // 忽略 tsconfig.json 中多餘的 rootDir 屬性，確保檔案直接輸出。
      // skipDiagnostics: true, // 保留此行以兼容舊版本，並避免其他潛在問題
      // logLevel: 'info', // 啟用日誌，讓我們可以看到 dts 插件的詳細輸出
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
});
