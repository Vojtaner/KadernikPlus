import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  build: { emptyOutDir: true },
  plugins: [react()],

  server: {
    host: true,
    port: 8083,
    watch: { usePolling: true },
  },
})
