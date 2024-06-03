import fs from 'node:fs';

import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

const dir = process.cwd();

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, `${process.cwd()}/../`);
  const port = Number(new URL(env.VITE_APP_URL).port);
  const useHttps = env.VITE_LOCAL_HTTPS === 'true';

  let httpsOptions: { key: Buffer; cert: Buffer } | false;

  if (useHttps) {
    httpsOptions = {
      key: fs.readFileSync(`${dir}/../key.pem`),
      cert: fs.readFileSync(`${dir}/../cert.pem`),
    };
  } else {
    httpsOptions = false;
  }

  return {
    envDir: '../',
    plugins: [react()],
    server: {
      hmr: {
        overlay: true,
      },
      headers: {
        'Service-Worker-Allowed': '/',
        'Service-Worker': 'script',
      },
      port,
      strictPort: true,
      https: httpsOptions,
    },
  };
});
