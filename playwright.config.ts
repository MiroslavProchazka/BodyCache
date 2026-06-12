import { defineConfig, devices } from '@playwright/test'

/**
 * Playwright E2E config for BodyCache.
 *
 * These tests drive the real app — including Evolu's local-first SQLite store —
 * so they need a Chromium browser. In this project's remote sandbox the browser
 * download host (cdn.playwright.dev) is blocked, so run them locally or in CI:
 *
 *   npm run e2e:install   # one-time: download Chromium
 *   npm run e2e
 *
 * Each test gets a fresh browser context, so IndexedDB / OPFS start empty and
 * tests don't leak state into each other.
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    viewport: { width: 390, height: 844 }, // mobile-first, one-handed
  },
  projects: [{ name: 'chromium', use: { ...devices['Pixel 7'] } }],
  webServer: {
    command: 'npm run dev -- --port 5173 --strictPort',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
})
