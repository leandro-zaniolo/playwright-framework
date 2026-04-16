import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  timeout: 60_000,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: [['list'], ['html', { open: 'never' }]],

  use: {
    ...devices['Desktop Chrome'],
    channel: 'chrome',
    baseURL: process.env.HUB_URL || 'https://atlas.atlasdevel5.com/hub/',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
    viewport: { width: 2000, height: 1080 },
    launchOptions: {
      args: ['--disable-blink-features=AutomationControlled'],
    },
  },

  projects: [
    {
      name: 'auth',
      testDir: './tests/setup',
      testMatch: 'auth.setup.ts',
    },
    {
      name: 'ui',
      testDir: './tests/ui',
      dependencies: ['auth'],
      use: {
        storageState: '.auth/state.json',
      },
    },
    {
      name: 'api',
      testDir: './tests/api',
      dependencies: ['auth'],
      use: {
        storageState: '.auth/state.json',
      },
    },
  ],
});
