import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
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
