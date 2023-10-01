/*
 * forgerock-sample-web-react
 *
 * request.js
 *
 * Copyright (c) 2021 ForgeRock. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

import { HttpClient } from '@forgerock/javascript-sdk';
import { request } from '@forgerock/login-widget';

import * as c from '../constants';

/**
 * @function request - A convenience function for wrapping around HttpClient
 * @param {string} resource - the resource path for the API server
 * @param {string} method - the method (GET, POST, etc) for the API server
 * @param {string} data - the data to POST against the API server
 * @return {Object} - JSON response from API
 */
export default async function apiRequest(
  resource: string,
  method: string,
  data?: any,
) {
  // Config.set({
  //   clientId: c.WEB_OAUTH_CLIENT,
  //   redirectUri: c.REDIRECT_URI,
  //   scope: c.OAUTH_SCOPE,
  //   serverConfig: {
  //     baseUrl: c.AM_URL,
  //     timeout: Number(c.TIMEOUT),
  //   },
  // });
  let json;
  let req;

  if (c.USE_LOGIN_WIDGET) {
    req = request;
  } else {
    req = HttpClient.request;
  }
  try {
    /** ***********************************************************************
     * SDK INTEGRATION POINT
     * Summary: HttpClient for protected resource server requests.
     * ------------------------------------------------------------------------
     * Details: This helper retrieves your access token from storage and adds
     * it to the authorization header as a bearer token for making HTTP
     * requests to protected resource APIs. It's a wrapper around the native
     * fetch method.
     *********************************************************************** */
    const response = await req({
      url: `${c.API_URL}/${resource}`,
      init: {
        body: data && JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
        method: method,
      },
      timeout: 3000,
    });
    if (!response.ok) {
      throw new Error(`Status ${response.status}: API request failed`);
    }
    json = await response.json();
  } catch (err) {
    console.error(`Error: API request; ${err}`);

    json = {
      error: err instanceof Error ? err.message : 'Unknown error',
    };
  }

  return json;
}
