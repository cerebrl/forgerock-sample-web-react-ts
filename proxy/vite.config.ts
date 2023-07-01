import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig(() => {

  return {
    envDir: '../',
    root: process.cwd(),
    server: {
      port: 5174,
    },
  };
})
