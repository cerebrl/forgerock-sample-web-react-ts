import { interceptor } from '@forgerock/token-vault';

// Initialize the token vault interceptor
interceptor({
  interceptor: {
    urls: [`${import.meta.env.VITE_API_URL}/*`],
  },
  forgerock: {
    serverConfig: {
      baseUrl: import.meta.env.VITE_AM_URL,
      timeout: import.meta.env.VITE_AM_TIMEOUT,
    },
    realmPath: import.meta.env.VITE_AM_REALM_PATH,
  },
});