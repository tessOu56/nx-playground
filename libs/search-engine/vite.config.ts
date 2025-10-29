import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    dts({
      entryRoot: 'src',
      tsconfigPath: resolve(__dirname, 'tsconfig.lib.json'),
      outDir: resolve(__dirname, '../../dist/libs/search-engine'),
    }),
  ],
  build: {
    outDir: resolve(__dirname, '../../dist/libs/search-engine'),
    emptyOutDir: true,
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'SearchEngine',
      fileName: 'index',
      formats: ['es'],
    },
    rollupOptions: {
      external: [],
    },
  },
});
