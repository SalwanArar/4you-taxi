import { defineConfig, devices } from '@playwright/test';

/**
 * Browser tests for the built site (`npm test`). They run against `npm run preview`, so build first:
 * `npm run build; npm test` (PowerShell) or `npm run build && npm test`.
 * PW_CHROMIUM may point to an already installed Chromium; otherwise run `npx playwright install chromium` once.
 */
export default defineConfig({
  testDir: 'tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: 'http://localhost:4321',
    trace: 'off',
    launchOptions: { executablePath: process.env.PW_CHROMIUM || undefined },
  },
  projects: [
    { name: 'phone', use: { ...devices['Pixel 7'] } },
    {
      name: 'desktop',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 800 } },
    },
  ],
  webServer: {
    // --ignore-lock keeps the server in the foreground (Astro moves it to the background when an AI agent runs it).
    command: 'npx astro preview --port 4321 --ignore-lock',
    url: 'http://localhost:4321',
    reuseExistingServer: !process.env.CI,
  },
});
