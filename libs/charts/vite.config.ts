import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: '../../dist/libs/charts',
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        recharts: resolve(__dirname, 'src/recharts/index.ts'),
        chartjs: resolve(__dirname, 'src/chartjs/index.ts'),
      },
      formats: ['es'],
    },
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        'recharts',
        'chart.js',
        'react-chartjs-2',
      ],
      output: {
        preserveModules: false,
      },
    },
  },
});
