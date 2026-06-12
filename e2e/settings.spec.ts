import { test, expect } from './fixtures'

test.describe('Settings', () => {
  test('the unit preference persists across reloads', async ({ page }) => {
    await page.goto('/settings')

    const pounds = page.getByRole('button', { name: 'Pounds' })
    await pounds.click()
    await expect(pounds).toHaveAttribute('aria-pressed', 'true')

    await page.reload()
    await expect(page.getByRole('button', { name: 'Pounds' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
  })

  test('"Back up now" downloads a backup file', async ({ page }) => {
    await page.goto('/settings')

    const downloadPromise = page.waitForEvent('download')
    await page.getByRole('button', { name: 'Back up now' }).click()
    const download = await downloadPromise

    expect(download.suggestedFilename()).toMatch(/^bodycache-backup-.*\.json$/)
  })
})
