import { defineConfig, loadEnv } from 'vite';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, `${process.cwd()}/../`);
  const port = Number(new URL(env.VITE_PROXY_URL).port);

  return {
    envDir: '../', // Points to the `.env` created in the root dir
    root: process.cwd(),
    server: {
      port,
      strictPort: true,
    },
  };
});
