import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      //'/.netlify/functions': {
        '/api/askGemini': {
        //target: 'http://localhost:8888',
        target:'http://127.0.0.1:5001/strady-imo/us-central1/askGemini',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/askGemini/, ''),
      },
    },
  },
  build: {
    rollupOptions: {
      external: ['@netlify/functions'],
    },
  },
  optimizeDeps: {
    // This is a workaround for a known issue with @google/generative-ai and Vite
    exclude: ['@google/generative-ai'],
  },
  test: {
    environment: 'jsdom',
    setupFiles: './src/hooks/useAnalysis.test.js',
  },
})
