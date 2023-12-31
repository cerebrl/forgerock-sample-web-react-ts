/*
 * forgerock-sample-web-react
 *
 * constants.js
 *
 * Copyright (c) 2021 ForgeRock. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

// System settings
export const AM_URL = import.meta.env.VITE_AM_URL;
export const APP_URL = import.meta.env.VITE_APP_URL;
export const API_URL = import.meta.env.VITE_API_URL;
export const PROXY_URL = import.meta.env.VITE_PROXY_URL;

// AM settings
export const JOURNEY_LOGIN = import.meta.env.VITE_AM_JOURNEY_LOGIN;
export const JOURNEY_REGISTER = import.meta.env.VITE_AM_JOURNEY_REGISTER;
export const WEB_OAUTH_CLIENT = import.meta.env.VITE_AM_WEB_OAUTH_CLIENT;
export const REALM_PATH = import.meta.env.VITE_AM_REALM_PATH;
export const REDIRECT_URI = `${import.meta.env.VITE_APP_URL}/login`;
export const OAUTH_SCOPE = import.meta.env.VITE_AM_WEB_OAUTH_SCOPE;
export const SESSION_URL = `${AM_URL}json/realms/root/sessions`;
export const TIMEOUT = import.meta.env.VITE_AM_TIMEOUT;

// Token Vault settings
export const TOKEN_VAULT_APP_ORIGIN = new URL(APP_URL).origin;
export const TOKEN_VAULT_PROXY_ORIGIN = new URL(PROXY_URL).origin;

// Client settings
// Yes, the debugger boolean is intentionally reversed
export const DEBUGGER = import.meta.env.VITE_DEBUGGER_OFF !== 'true';
export const DEVELOPMENT = import.meta.env.VITE_DEVELOPMENT === 'true';

// UX settings
export const EMBEDDED_LOGIN = import.meta.env.VITE_EMBEDDED_LOGIN === 'true';
export const USE_LOGIN_WIDGET =
  import.meta.env.VITE_USE_LOGIN_WIDGET === 'true';
export const USE_TOKEN_VAULT = import.meta.env.VITE_USE_TOKEN_VAULT === 'true';
