import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    emptyOutDir: false,
    rollupOptions: {
      input: 'src/interceptor/index.ts',
      output: {
        dir: 'public',
        entryFileNames: 'interceptor.js',
        format: 'iife',
      },
    },
  },
  envDir: '../',
});
