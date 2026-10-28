/// <reference types="vitest" />
import { fileURLToPath, URL } from "node:url"

import vue from "@vitejs/plugin-vue"
import { defineConfig } from "vitest/config"

// GitHub Pages serves this app under /nx-playground/vue-motion/
export default defineConfig(({ mode }) => ({
  root: fileURLToPath(new URL(".", import.meta.url)),
  cacheDir: "../../node_modules/.vite/apps/vue-motion",
  base: mode === "production" ? "/nx-playground/vue-motion/" : "/",
  plugins: [vue()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    port: 8080,
    host: "127.0.0.1",
    strictPort: true,
    fs: { strict: true },
  },
  preview: {
    port: 8080,
    host: "127.0.0.1",
  },
  build: {
    outDir: "../../dist/apps/vue-motion",
    emptyOutDir: true,
    reportCompressedSize: true,
    sourcemap: true,
  },
  test: {
    watch: false,
    globals: true,
    environment: "jsdom",
    include: ["src/**/*.{test,spec}.{js,ts}"],
    setupFiles: ["./vitest.setup.js"],
    reporters: ["default"],
    coverage: {
      reportsDirectory: "../../coverage/apps/vue-motion",
      provider: "v8",
    },
  },
}))
