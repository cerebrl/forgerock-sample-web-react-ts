import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './e2e/widget',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: 'http://127.0.0.1:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    baseURL: process.env.LOCAL_HTTPS
      ? 'https://localhost:5173'
      : 'http://localhost:5173',
  },
  webServer: [
    {
      command: 'npm run build; npm run serve',
      port: 5173,
      env: {
        VITE_AM_URL: 'https://openam-protect2.forgeblocks.com/am/',
        VITE_APP_URL: 'http://localhost:5173',
        VITE_API_URL: 'http://localhost:5174',
        VITE_PROXY_URL: 'http://localhost:5175',
        VITE_LOCAL_HTTPS: 'false', //# Do not use with Token Vault

        // # AM settings
        VITE_AM_JOURNEY_LOGIN: 'protect',
        VITE_AM_JOURNEY_REGISTER: 'Registration',
        VITE_AM_TIMEOUT: '5000',
        VITE_AM_REALM_PATH: 'alpha',
        VITE_AM_WEB_OAUTH_CLIENT: 'WebOAuthClient',
        VITE_AM_WEB_OAUTH_SCOPE: 'openid email profile',

        // # UX settings
        VITE_USE_EMBEDDED_LOGIN: 'false',
        VITE_USE_LOGIN_WIDGET: 'true',
        VITE_USE_TOKEN_VAULT: 'false',

        // # Development settings
        VITE_DEBUGGER_OFF: 'true',
        VITE_DEVELOPMENT: 'true',
      },
    },
    // {
    //   command: 'npm run build:api; npm run serve:api',
    //   port: 5174,
    //   env: {
    //     // # AM settings for your API (todos) server
    //     // # (does not need VITE prefix)
    //     AM_REST_OAUTH_CLIENT: 'RestOAuthClient',
    //     AM_REST_OAUTH_SECRET: '0tg8s3s35L7zHr0df34kZZ',
    //   },
    // },
  ],

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      grepInvert: /widget/,
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      grep: /widget/,
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      grep: /widget/,
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
