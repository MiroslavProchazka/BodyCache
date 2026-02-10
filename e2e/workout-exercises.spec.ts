import { expect, test } from '@playwright/test'

test('user can add exercises to an active workout and keep them after reload', async ({ page }) => {
  await page.goto('/workout/active')

  await page.getByLabel('Session name').fill('Upper Body')
  await page.getByRole('button', { name: 'Start session' }).click()

  await page.getByLabel('Exercise search').fill('Bench')
  await page.getByRole('button', { name: 'Add first match' }).click()

  await expect(page.getByText('1.')).toBeVisible()
  await expect(page.getByText('Barbell Bench Press')).toBeVisible()

  await page.reload()

  await expect(page.getByText('Barbell Bench Press')).toBeVisible()

  await page.getByRole('link', { name: 'Open detail' }).click()
  await expect(page.getByText('Barbell Bench Press')).toBeVisible()
})
