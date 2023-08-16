import fs from 'node:fs';

import { defineConfig, loadEnv } from 'vite';

const dir = process.cwd();

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, `${process.cwd()}/../`);
  const port = Number(new URL(env.VITE_PROXY_URL).port);
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
    root: process.cwd(),
    server: {
      port,
      strictPort: true,
      https: httpsOptions,
    },
  };
});
