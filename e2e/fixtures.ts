import { test as base, expect } from '@playwright/test'

/**
 * Shared fixture that forwards browser console errors and uncaught page errors
 * to the test stdout. When the app fails to render (e.g. Evolu / SQLite-WASM
 * init throwing), a failing run then shows the *reason* in the terminal without
 * needing to open devtools or unpack the Playwright trace.
 */
export const test = base.extend({
  page: async ({ page }, use) => {
    page.on('console', (msg) => {
      if (msg.type() === 'error') console.log(`[browser console error] ${msg.text()}`)
    })
    page.on('pageerror', (err) => console.log(`[pageerror] ${err.message}`))
    await use(page)
  },
})

export { expect }
