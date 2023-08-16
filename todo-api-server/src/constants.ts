/*
 * forgerock-sample-web-react
 *
 * constants.mjs
 *
 * Copyright (c) 2021 ForgeRock. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

import { Buffer } from 'buffer';

export const AM_URL = (() => {
  try {
    const lastChar = process.env.VITE_AM_URL.slice(-1);
    if (lastChar !== '/') {
      return process.env.VITE_AM_URL + '/';
    }
    return process.env.VITE_AM_URL;
  } catch (err) {
    console.error(
      'AM CONFIG ERROR: Missing .env value. Ensure you have an .env file within the root of this sample app.',
    );
    return '';
  }
})();

export const CONFIDENTIAL_CLIENT = Buffer.from(
  `${process.env.AM_REST_OAUTH_CLIENT}:${process.env.AM_REST_OAUTH_SECRET}`,
).toString('base64');

const APP_URL = new URL(process.env.VITE_API_URL);
export const PORT = Number(APP_URL.port) || 5174;

export const REALM_PATH = process.env.VITE_AM_REALM_PATH;
