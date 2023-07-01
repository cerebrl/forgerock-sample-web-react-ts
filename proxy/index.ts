import { proxy } from '@forgerock/token-vault';

// Initialize the token vault proxy
proxy({
  app: {
    origin: 'http://localhost:5173',
  },
  forgerock: {
    clientId: import.meta.env.VITE_AM_WEB_OAUTH_CLIENT,
    // oauthThreshold: 5000,
    scope: 'openid profile me.read',
    serverConfig: {
      baseUrl: import.meta.env.VITE_AM_URL,
      timeout: 50000,
    },
    realmPath: import.meta.env.VITE_AM_REALM,
  },
});
