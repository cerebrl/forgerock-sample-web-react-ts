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
  /** ***************************************************************************
   * SDK INTEGRATION POINT
   * Summary: Configure the SDK
   * ----------------------------------------------------------------------------
   * Details: Below, you will see the following settings:
   * - clientId: (OAuth 2.0 only) this is the OAuth 2.0 client you created in ForgeRock, such as `ForgeRockSDKClient`
   * - redirectUri: (OAuth 2.0 only) this is the URI/URL of this app to which the
   *   OAuth 2.0 flow redirects
   * - scope: (OAuth 2.0 only) these are the OAuth scopes that you will request from
   *   ForgeRock
   * - serverConfig: this includes the baseUrl of your ForgeRock AM, and should
   *   include the deployment path at the end, such as `/am/` or `/openam/`
   * - realmPath: this is the realm to use within ForgeRock. such as `alpha` or `root`
   * - tree: The authentication journey/tree to use, such as `sdkAuthenticationTree`
   *************************************************************************** */
  Config.set({
    clientId: c.WEB_OAUTH_CLIENT,
    redirectUri: c.REDIRECT_URI,
    scope: c.OAUTH_SCOPE,
    serverConfig: {
      baseUrl: c.AM_URL,
      timeout: c.TIMEOUT,
    },
    realmPath: c.REALM_PATH,
  });
  /** *************************************************************************
   * SDK INTEGRATION POINT
   * Summary: Get OAuth/OIDC tokens from storage
   * --------------------------------------------------------------------------
   * Details: We can immediately call TokenStorage.get() to check for stored
   * tokens. If we have them, you can cautiously assume the user is
   * authenticated.
   ************************************************************************* */
  let isAuthenticated = false;
  try {
    isAuthenticated = !((await TokenStorage.get()) == null);
  } catch (err) {
    console.error(`Error: token retrieval for hydration; ${err}`);
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
