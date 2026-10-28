/// <reference types="vitest" />
import { fileURLToPath, URL } from "node:url"

import react from "@vitejs/plugin-react"
import { defineConfig } from "vitest/config"

export default defineConfig({
  root: fileURLToPath(new URL(".", import.meta.url)),
  cacheDir: "../../node_modules/.vite/apps/mfe-ui",
  plugins: [react()],
  test: {
    watch: false,
    globals: true,
    environment: "jsdom",
    include: ["src/**/*.{test,spec}.{js,jsx}"],
    setupFiles: ["./vitest.setup.js"],
    reporters: ["default"],
  },
})
