import { defineConfig } from '@playwright/test';
import { getLandingPort } from './scripts/config.mjs';

const localURL = `http://127.0.0.1:${getLandingPort()}`;
const remoteURL = process.env.LANDING_BASE_URL;

export default defineConfig({
  testDir: './tests/browser',
  fullyParallel: true,
  workers: 2,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: remoteURL ?? localURL,
    browserName: 'chromium',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  webServer: remoteURL
    ? undefined
    : {
        command: 'node scripts/serve.mjs',
        url: localURL,
        reuseExistingServer: !process.env.CI,
      },
});
