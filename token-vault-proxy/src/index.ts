import { proxy } from '@forgerock/token-vault';

// Initialize the token vault proxy
proxy({
  app: {
    origin: new URL(import.meta.env.VITE_APP_URL).origin,
  },
  forgerock: {
    clientId: import.meta.env.VITE_AM_WEB_OAUTH_CLIENT,
    scope: import.meta.env.VITE_AM_WEB_OAUTH_SCOPE,
    serverConfig: {
      baseUrl: import.meta.env.VITE_AM_URL,
      timeout: import.meta.env.VITE_AM_TIMEOUT,
    },
    realmPath: import.meta.env.VITE_AM_REALM_PATH,
  },
  proxy: {
    urls: [`${import.meta.env.VITE_API_URL}/*`],
  },
});
