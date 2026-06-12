import { test, expect } from '@playwright/test'

/**
 * The core journey BodyCache exists for: start a workout, create an exercise on
 * the spot, log a set, finish, and see it remembered. Exercises the full stack
 * — routing, Evolu writes, and the derived "recent" rail.
 */
test('log a workout from an on-the-fly exercise', async ({ page }) => {
  await page.goto('/')

  // Start an empty session.
  await page.getByRole('button', { name: 'Start workout' }).click()
  await expect(page).toHaveURL(/\/workout$/)

  // Add → create a new exercise (carries the active session).
  await page.getByRole('button', { name: 'Add exercise' }).click()
  await page.getByRole('button', { name: /Create new exercise/ }).click()
  await page.getByPlaceholder('e.g. Chest Press Machine').fill('Leg Press')
  await page.getByRole('button', { name: 'Legs', exact: true }).click()
  await page.getByRole('button', { name: 'Save exercise' }).click()

  // Logger seeds one set from defaults (reps > 0), so it can save immediately.
  await expect(page).toHaveURL(/\/workout\/log\//)
  await page.getByRole('button', { name: /^Save \d+ sets?$/ }).click()
  await expect(page).toHaveURL(/\/workout$/)

  // Finish and confirm the recap.
  await page.getByRole('button', { name: 'Finish workout' }).click()
  await expect(page.getByRole('heading', { name: 'Nice work.' })).toBeVisible()
  await page.getByRole('button', { name: 'Done' }).click()

  // Home now surfaces the exercise in the "Recent exercises" rail.
  await expect(page).toHaveURL(/\/$/)
  await expect(page.getByText('Leg Press')).toBeVisible()
})

test('an empty workout can be discarded', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Start workout' }).click()

  page.on('dialog', (d) => d.accept())
  await page.getByRole('button', { name: 'Discard workout' }).click()

  await expect(page).toHaveURL(/\/$/)
  await expect(page.getByRole('button', { name: 'Start workout' })).toBeVisible()
})
