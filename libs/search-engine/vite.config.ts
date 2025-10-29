import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { join } from 'path';

export default defineConfig({
  plugins: [
    dts({
      entryRoot: 'src',
      tsconfigPath: join(__dirname, 'tsconfig.lib.json'),
    }),
  ],
  build: {
    outDir: '../../dist/libs/search-engine',
    emptyOutDir: true,
    lib: {
      entry: join(__dirname, 'src/index.ts'),
      name: 'SearchEngine',
      fileName: 'index',
      formats: ['es'],
    },
    rollupOptions: {
      external: [],
    },
  },
});
