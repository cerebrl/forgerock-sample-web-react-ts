/*
 * forgerock-sample-web-react
 *
 * constants.js
 *
 * Copyright (c) 2021 ForgeRock. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

export const AM_URL = import.meta.env.VITE_AM_URL;
export const API_URL = import.meta.env.VITE_API_URL;
// Yes, the debugger boolean is intentionally reversed
export const DEBUGGER = import.meta.env.VITE_DEBUGGER_OFF === 'true' ? false : true;
export const JOURNEY_LOGIN = import.meta.env.VITE_JOURNEY_LOGIN;
export const JOURNEY_REGISTER = import.meta.env.VITE_JOURNEY_REGISTER;
export const WEB_OAUTH_CLIENT = import.meta.env.VITE_WEB_OAUTH_CLIENT;
export const REALM_PATH = import.meta.env.VITE_REALM_PATH;
export const SESSION_URL = `${AM_URL}json/realms/root/sessions`;
