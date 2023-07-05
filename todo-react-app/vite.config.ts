import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  envDir: '../',
  plugins: [react()],
  server: {
    headers: {
      'Service-Worker-Allowed': '/',
      'Service-Worker': 'script',
    },
    port: 5173,
  },
  worker: {
    format: 'es',
  },
});
