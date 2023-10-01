/*
 * forgerock-sample-web-react
 *
 * index.js
 *
 * Copyright (c) 2021 ForgeRock. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

// Import libraries
import { Config, TokenStorage } from '@forgerock/javascript-sdk';
import { configuration, user } from '@forgerock/login-widget';
import { OAuthTokenStoreValue } from '@forgerock/login-widget/types';
import { client } from '@forgerock/token-vault';
import ReactDOM from 'react-dom/client';

// Import bootstrap modules
import './bootstrap';

// Import constants
import * as c from './constants';

// Import state and router mgmt
import { AppContext, useGlobalStateMgmt } from './global-state';
import Router from './router';

/**
 * Initialize the React application
 */
(async function initAndHydrate() {
  let isAuthenticated = false;
  let tokenStore;

  // Is Token Vault enabled?
  if (c.USE_TOKEN_VAULT) {
    // Initialize Token Vault Client and register Interceptor, Proxy and Store
    const register = client({
      app: {
        origin: c.TOKEN_VAULT_APP_ORIGIN,
      },
      interceptor: {
        file: '/interceptor.js',
      },
      proxy: {
        origin: c.TOKEN_VAULT_PROXY_ORIGIN,
      },
    });

    // Register the Token Vault Interceptor
    await register.interceptor();

    // Register the Token Vault Proxy
    await register.proxy(document.getElementById('token-vault') as HTMLElement);

    // Register the Token Vault Store
    tokenStore = register.store();
  }

  /**
   * Use appropriate configuration for Widget or SDK usage, and
   * then attempt to check if access tokens are already present.
   */
  if (c.USE_LOGIN_WIDGET) {
    configuration().set({
      forgerock: {
        clientId: c.WEB_OAUTH_CLIENT,
        redirectUri: c.REDIRECT_URI,
        scope: c.OAUTH_SCOPE,
        serverConfig: {
          baseUrl: c.AM_URL,
          timeout: Number(c.TIMEOUT),
        },
        realmPath: c.REALM_PATH,
        tokenStore: 'localStorage',
      },
      links: {
        termsAndConditions: '/public/terms-conditions.html',
      },
    });

    try {
      const event = (await user.tokens().get()) as OAuthTokenStoreValue;
      isAuthenticated = !!event?.response?.accessToken;
    } catch (err) {
      console.info(`Info: no existing tokens for hydration; ${err}`);
    }
  } else {
    Config.set({
      clientId: c.WEB_OAUTH_CLIENT,
      redirectUri: c.REDIRECT_URI,
      scope: c.OAUTH_SCOPE,
      serverConfig: {
        baseUrl: c.AM_URL,
        timeout: c.TIMEOUT,
      },
      realmPath: c.REALM_PATH,
      ...(c.USE_TOKEN_VAULT && { tokenStore }),
    });

    try {
      isAuthenticated = c.USE_TOKEN_VAULT
        ? !!(await tokenStore?.has())?.hasTokens
        : !((await TokenStorage.get()) == null);
    } catch (err) {
      console.info(`Info: no existing token for hydration; ${err}`);
    }
  }

  /**
   * Pull custom values from outside of the app to (re)hydrate state.
   */
  const prefersDarkTheme = window.matchMedia(
    '(prefers-color-scheme: dark)',
  ).matches;
  const email = window.sessionStorage.getItem('sdk_email');
  const username = window.sessionStorage.getItem('sdk_username');
  const rootEl = document.getElementById('root') as HTMLElement;

  if (prefersDarkTheme) {
    document.body.classList.add('cstm_bg-dark', 'bg-dark');
    document.getElementById('login-modal')?.classList.add('tw_dark'); // tw_dark controls Login Widget theme
  }

  /**
   * @function Init - Initializes React and global state
   * @returns {Object} - React component object
   */
  function Init() {
    /**
     * This leverages "global state" with React's Context API.
     * This can be useful to share state with any component without
     * having to pass props through deeply nested components,
     * authentication status and theme state are good examples.
     *
     * If global state becomes a more complex function of the app,
     * something like Redux might be a better option.
     */
    const stateMgmt = useGlobalStateMgmt({
      email,
      isAuthenticated,
      username,
      prefersDarkTheme,
    });

    return (
      <AppContext.Provider value={stateMgmt}>
        <Router />
      </AppContext.Provider>
    );
  }

  ReactDOM.createRoot(rootEl).render(<Init />);
})();
