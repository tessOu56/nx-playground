import { defineConfig, devices } from '@playwright/test';

const port = Number(process.env.PORTAL_SMOKE_PORT ?? 3000);
const baseURL = `http://127.0.0.1:${port}`;

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  timeout: 60_000,
  use: {
    baseURL,
    trace: 'off',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: `pnpm exec next start --port ${port}`,
    url: `${baseURL}/zh-TW/events`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    cwd: __dirname,
    env: {
      ...process.env,
      NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL ?? baseURL,
      BETTER_AUTH_URL: process.env.BETTER_AUTH_URL ?? baseURL,
      BETTER_AUTH_SECRET:
        process.env.BETTER_AUTH_SECRET ?? 'ci-only-better-auth-secret',
    },
  },
});
