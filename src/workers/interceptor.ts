import { interceptor } from '@forgerock/token-vault';

// Initialize the token vault interceptor
interceptor({
  interceptor: {
    urls: ['https://fr-todos-api.crbrl.io/*'],
  },
  forgerock: {
    serverConfig: {
      baseUrl: import.meta.env.VITE_AM_URL,
      timeout: 5000,
    },
    realmPath: import.meta.env.VITE_AM_REALM_PATH,
  },
});