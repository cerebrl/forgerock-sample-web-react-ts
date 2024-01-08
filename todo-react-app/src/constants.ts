/*
 * forgerock-sample-web-react
 *
 * constants.js
 *
 * Copyright (c) 2021 ForgeRock. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

const env = import.meta.env;

// System settings
export const AM_URL = env.VITE_AM_URL;
export const APP_URL = env.VITE_APP_URL;
export const API_URL = env.VITE_API_URL;
export const PROXY_URL = env.VITE_PROXY_URL;

// AM settings
export const JOURNEY_LOGIN = env.VITE_AM_JOURNEY_LOGIN;
export const JOURNEY_REGISTER = env.VITE_AM_JOURNEY_REGISTER;
export const WEB_OAUTH_CLIENT = env.VITE_AM_WEB_OAUTH_CLIENT;
export const REALM_PATH = env.VITE_AM_REALM_PATH;
export const REDIRECT_URI = `${env.VITE_APP_URL}/login`;
export const OAUTH_SCOPE = env.VITE_AM_WEB_OAUTH_SCOPE;
export const SESSION_URL = `${AM_URL}json/realms/root/sessions`;
export const TIMEOUT = env.VITE_AM_TIMEOUT;

// Token Vault settings
export const TOKEN_VAULT_APP_ORIGIN = new URL(APP_URL).origin;
export const TOKEN_VAULT_PROXY_ORIGIN = new URL(PROXY_URL).origin;

// Client settings
// Yes, the debugger boolean is intentionally reversed
export const DEBUGGER = env.VITE_DEBUGGER_OFF !== 'true';
export const DEVELOPMENT = env.VITE_DEVELOPMENT === 'true';

// UX settings
export const USE_EMBEDDED_LOGIN = env.VITE_USE_EMBEDDED_LOGIN === 'true';
export const USE_LOGIN_WIDGET = env.VITE_USE_LOGIN_WIDGET === 'true';
export const USE_TOKEN_VAULT = env.VITE_USE_TOKEN_VAULT === 'true';
