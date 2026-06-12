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

  test('the profile created at onboarding is shown and editable', async ({ page }) => {
    await page.goto('/settings')

    // The fixture onboarded as "Tester"; the profile card heads Settings.
    await expect(page.getByText('Tester')).toBeVisible()
    await page.getByText('Tester').click()
    await expect(page).toHaveURL(/\/settings\/profile$/)

    const name = page.getByPlaceholder('What should we call you?')
    await name.fill('Renamed')
    await page.getByRole('button', { name: 'Save profile' }).click()

    await expect(page).toHaveURL(/\/settings$/)
    await expect(page.getByText('Renamed')).toBeVisible()
  })
})
