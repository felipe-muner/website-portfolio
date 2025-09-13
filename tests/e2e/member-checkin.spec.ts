import { test, expect } from '@playwright/test'

test.describe('Member Check-in Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to member portal
    await page.goto('/member')
  })

  test('CrossFit member can check into gym (key business requirement)', async ({ page }) => {
    // Arrange - Look up a CrossFit member
    await page.fill('input[placeholder*="email"]', 'crossfit.member@example.com')
    await page.click('button:has-text("Look Up Member")')

    // Wait for member data to load
    await expect(page.locator('text=CrossFit Member')).toBeVisible()
    await expect(page.locator('text=crossfit_only')).toBeVisible()

    // Act - Try to check into gym
    await page.click('button:has-text("Check into Gym")')

    // Assert - Check-in should be successful
    await expect(page.locator('text=successfully checked in')).toBeVisible()
    await expect(page.locator('text=Gym access included with CrossFit membership')).toBeVisible()
  })

  test('5-pass member visit count decreases after check-in', async ({ page }) => {
    // Arrange - Look up a 5-pass member
    await page.fill('input[placeholder*="email"]', '5pass.member@example.com')
    await page.click('button:has-text("Look Up Member")')

    // Wait for member data and note remaining visits
    await expect(page.locator('text=5-Pass Member')).toBeVisible()
    const initialVisits = await page.locator('[data-testid="remaining-visits"]').textContent()

    // Act - Check in
    await page.click('button:has-text("Check into Gym")')

    // Assert - Visits should decrease
    await expect(page.locator('text=successfully checked in')).toBeVisible()

    // Refresh member data to see updated visits
    await page.click('button:has-text("Look Up Member")')
    const updatedVisits = await page.locator('[data-testid="remaining-visits"]').textContent()

    expect(parseInt(updatedVisits!)).toBe(parseInt(initialVisits!) - 1)
  })

  test('Member with no remaining visits cannot check in', async ({ page }) => {
    // Arrange - Look up member with 0 visits
    await page.fill('input[placeholder*="email"]', 'novisits.member@example.com')
    await page.click('button:has-text("Look Up Member")')

    // Wait for member data
    await expect(page.locator('text=0 visits remaining')).toBeVisible()

    // Act - Try to check in
    await page.click('button:has-text("Check into Gym")')

    // Assert - Should show error
    await expect(page.locator('text=No remaining visits')).toBeVisible()
  })

  test('Inactive member cannot check in', async ({ page }) => {
    // Arrange - Look up inactive member
    await page.fill('input[placeholder*="email"]', 'inactive.member@example.com')
    await page.click('button:has-text("Look Up Member")')

    // Assert - Check-in button should be disabled
    await expect(page.locator('button:has-text("Check into Gym")')).toBeDisabled()
    await expect(page.locator('text=Membership is inactive')).toBeVisible()
  })

  test('Expired member cannot check in', async ({ page }) => {
    // Arrange - Look up expired member
    await page.fill('input[placeholder*="email"]', 'expired.member@example.com')
    await page.click('button:has-text("Look Up Member")')

    // Assert - Should show expiration warning
    await expect(page.locator('text=Membership has expired')).toBeVisible()
    await expect(page.locator('button:has-text("Check into Gym")')).toBeDisabled()
  })
})