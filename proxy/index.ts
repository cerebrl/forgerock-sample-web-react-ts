import { proxy } from '@forgerock/token-vault';

// Initialize the token vault proxy
proxy({
  app: {
    origin: import.meta.env.VITE_TOKEN_VAULT_APP_ORIGIN,
  },
  forgerock: {
    clientId: import.meta.env.VITE_AM_WEB_OAUTH_CLIENT,
    // oauthThreshold: 5000,
    scope: import.meta.env.VITE_AM_WEB_OAUTH_SCOPE,
    serverConfig: {
      baseUrl: import.meta.env.VITE_AM_URL,
      timeout: import.meta.env.VITE_AM_TIMEOUT,
    },
    realmPath: import.meta.env.VITE_AM_REALM,
  },
});
