/*
 * forgerock-sample-web-react
 *
 * index.mjs
 *
 * Copyright (c) 2021 ForgeRock. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */
import { readFileSync } from 'fs';
import { createServer } from 'http';
import { createServer as createSecureServer } from 'https';
import { env } from 'process';

import cors from 'cors';
import express from 'express';
import cookieParser from 'cookie-parser';

import { AM_URL, PORT } from './constants.js';
import routes from './routes.js';

/**
 * Prepare for HTTPS, if configured
 */
// Env variables are always strings
const useHttps = env.VITE_LOCAL_HTTPS === 'true';

let key: Buffer;
let cert: Buffer;

if (useHttps) {
  // Read in self-signed certs if secure server is configured
  key = readFileSync(`${process.cwd()}/../key.pem`);
  cert = readFileSync(`${process.cwd()}/../cert.pem`);
}

/**
 * Create and configure Express
 */
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: function (_, callback) {
      // DON'T DO THIS IN PRODUCTION!
      return callback(null, true);
    },
  }),
);

/**
 * Log all server interactions
 */
app.use((req, _, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

/**
 * Initialize routes
 */
routes(app);

/**
 * Attach application to port and listen for requests
 */

if (!AM_URL) {
  // Detect lack of .env file
  console.log('Creating noop Node HTTP server');

  // Create noop server to avoid crashing
  createServer(() => null).listen(PORT);

  console.error(
    `ERROR: Missing .env value. Ensure you have an .env file within the dir of this sample app.\nEnsure you have a .env file with appropriate values.\nPlease stop this process and verify your .env file.`,
  );
} else if (useHttps && !key && !cert) {
  // Detect lack of security certificates if HTTPS is configured
  console.log('Creating noop Node HTTP server');

  // Create noop server to avoid crashing
  createServer(() => null).listen(PORT);

  console.error(
    `ERROR: Missing security certificates needed for secure server. Ensure you have a self-signed cert and key file in the root directory. \nPlease stop this process and verify your files.`,
  );
} else if (useHttps) {
  // Check if HTTPS is configured
  console.log('Creating Node HTTPS (secure) server');

  // Ignore self-signed certs
  env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

  createSecureServer({ key, cert }, app).listen(PORT);
} else {
  // Run as non-secure server
  console.log('Creating Node HTTP (insecure) server');
  createServer(app).listen(PORT);
}

console.log(`Node server listening on port: ${PORT}.`);
