import { test as base, expect, type Page } from '@playwright/test'

/**
 * Complete the required first-run onboarding so the app shell becomes
 * reachable. Each test runs in a fresh context (empty OPFS/IndexedDB), so the
 * profile gate shows onboarding until we fill it in. Idempotent: a no-op if the
 * profile already exists (the form isn't shown).
 */
export async function completeOnboarding(page: Page): Promise<void> {
  await page.goto('/')
  const name = page.getByPlaceholder('What should we call you?')
  // Wait for Evolu to boot and the gate to resolve to onboarding (or the app).
  if (await name.isVisible({ timeout: 30_000 }).catch(() => false)) {
    await name.fill('Tester')
    await page.getByRole('button', { name: 'Prefer not to say' }).click()
    await page.getByRole('button', { name: 'Start lifting' }).click()
    // Onboarding swaps in the app shell once the profile is created.
    await expect(page.getByPlaceholder('What should we call you?')).toHaveCount(0)
  }
}

/**
 * Shared fixture that (1) forwards browser console errors and uncaught page
 * errors to the test stdout — when the app fails to render (e.g. Evolu /
 * SQLite-WASM init throwing), a failing run shows the *reason* in the terminal
 * without unpacking the Playwright trace — and (2) clears the first-run
 * onboarding gate before each test so specs start from the app shell.
 */
export const test = base.extend({
  page: async ({ page }, use) => {
    page.on('console', (msg) => {
      if (msg.type() === 'error') console.log(`[browser console error] ${msg.text()}`)
    })
    page.on('pageerror', (err) => console.log(`[pageerror] ${err.message}`))
    await completeOnboarding(page)
    await use(page)
  },
})

export { expect }
