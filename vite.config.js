import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
        '/api/askGemini': {
        target: 'http://127.0.0.1:5001/strady-imo/us-central1/askGemini',
        changeOrigin: true,
        rewrite: (path) => '',
      },
    },
  },
  build: {
    rollupOptions: {
    },
  },
  
  test: {
    environment: 'jsdom',
    setupFiles: './src/hooks/useAnalysis.test.js',
  },
})
