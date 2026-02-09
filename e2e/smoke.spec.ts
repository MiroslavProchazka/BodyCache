import { test, expect } from '@playwright/test'

test('app shell navigation is reachable', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('link', { name: 'BodyCache' })).toBeVisible()
  await page.getByRole('link', { name: 'Exercises' }).click()
  await expect(page.getByText('Exercise library')).toBeVisible()
  await page.getByRole('link', { name: 'Templates' }).click()
  await expect(page.getByText('Workout templates')).toBeVisible()
})
