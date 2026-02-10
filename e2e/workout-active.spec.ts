import { expect, test } from '@playwright/test'

test('user can start, rename, reload, and finish a workout session', async ({ page }) => {
  await page.goto('/workout/active')

  await page.getByLabel('Session name').fill('Pull Day')
  await page.getByRole('button', { name: 'Start session' }).click()

  await expect(page.getByText('Current session')).toBeVisible()

  await page.getByLabel('Session name').fill('Pull Day Heavy')
  await page.reload()

  await expect(page.getByText('Current session')).toBeVisible()
  await expect(page.getByLabel('Session name')).toHaveValue('Pull Day Heavy')

  await page.getByRole('button', { name: 'Finish session' }).click()

  await expect(page.getByRole('button', { name: 'Start session' })).toBeVisible()
  await expect(page.getByText('Recent sessions')).toBeVisible()
})
