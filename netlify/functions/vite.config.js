import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    // This is a workaround for a known issue with @google/generative-ai and Vite
    exclude: ['@google/generative-ai'],
  },
});