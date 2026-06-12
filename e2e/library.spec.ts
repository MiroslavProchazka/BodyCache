import { test, expect } from '@playwright/test'

/** Create an exercise from the library and confirm it persists in the list. */
test('create an exercise and find it in the library', async ({ page }) => {
  await page.goto('/library')

  // Empty state and header both expose a "Create exercise" control; take the first.
  await page.getByRole('button', { name: 'Create exercise' }).first().click()

  await page.getByPlaceholder('e.g. Chest Press Machine').fill('Bench Press')
  await page.getByRole('button', { name: 'Chest', exact: true }).click()
  await page.getByRole('button', { name: 'Save exercise' }).click()

  // Lands on the new exercise's detail page.
  await expect(page).toHaveURL(/\/library\/[\w-]+$/)
  await expect(page.getByText('Bench Press')).toBeVisible()

  // And it shows up back in the library grid.
  await page.getByRole('link', { name: 'Library' }).click()
  await expect(page.getByText('Bench Press')).toBeVisible()
})
