import { sentryVitePlugin } from "@sentry/vite-plugin";
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  build: {
    emptyOutDir: true,
    sourcemap: true
  },
  plugins: [react(), sentryVitePlugin({
    org: "kadernik",
    project: "javascript-react"
  })],

  server: {
    host: true,
    port: 8083,
    watch: { usePolling: true },
  },
})