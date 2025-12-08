import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Base path for GitHub Pages - change this to match your repository name
  // For local development, this will be ignored
  base: process.env.VITE_BASE_PATH || '/',
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: process.env.VITE_NOMIKOS_URL || 'http://localhost:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      }
    }
  },
  build: {
    outDir: 'dist',
  }
})
