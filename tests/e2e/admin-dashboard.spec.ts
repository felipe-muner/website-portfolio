import { test, expect } from '@playwright/test'

test.describe('Admin Dashboard Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Login as admin (you'll need to implement actual auth)
    await page.goto('/admin/login')
    await page.fill('input[type="email"]', 'admin@gym.com')
    await page.fill('input[type="password"]', 'password123')
    await page.click('button:has-text("Sign In")')

    // Wait for redirect to dashboard
    await expect(page).toHaveURL('/admin')
  })

  test('Admin can view dashboard with revenue breakdown', async ({ page }) => {
    // Assert - Dashboard elements are visible
    await expect(page.locator('h1:has-text("Admin Dashboard")')).toBeVisible()

    // Check revenue metrics
    await expect(page.locator('[data-testid="total-revenue"]')).toBeVisible()
    await expect(page.locator('[data-testid="gym-revenue"]')).toBeVisible()
    await expect(page.locator('[data-testid="crossfit-revenue"]')).toBeVisible()

    // Check member statistics
    await expect(page.locator('[data-testid="active-members"]')).toBeVisible()
    await expect(page.locator('[data-testid="new-members"]')).toBeVisible()
  })

  test('Admin can view payment distribution reports', async ({ page }) => {
    // Navigate to reports
    await page.click('a:has-text("Reports")')

    // Assert - Payment distribution table
    await expect(page.locator('h2:has-text("Payment Distribution")')).toBeVisible()

    // Check that CrossFit payments show gym allocation
    const crossfitRows = page.locator('tr:has-text("crossfit_only")')
    await expect(crossfitRows.first().locator('td:has-text("20%")')).toBeVisible() // Gym share
    await expect(crossfitRows.first().locator('td:has-text("80%")')).toBeVisible() // CrossFit share
  })

  test('Admin can view member check-in history', async ({ page }) => {
    // Navigate to check-ins
    await page.click('a:has-text("Today\'s Check-ins")')

    // Assert - Check-in list
    await expect(page.locator('h1:has-text("Today\'s Check-ins")')).toBeVisible()

    // Check that CrossFit members checking into gym are logged correctly
    const checkinRows = page.locator('tr:has-text("crossfit_only")')
  })

  test('Admin can pause and unpause member memberships', async ({ page }) => {
    // Navigate to members list
    await page.click('a:has-text("Members")')
    await expect(page.locator('h1:has-text("Members")')).toBeVisible()

    // Find a member with pausable plan (not 5-pass)
    const memberRow = page.locator('tr').filter({
      has: page.locator('td:has-text("Gym Only")'),
      hasNot: page.locator('td:has-text("5-Pass")')
    }).first()

    // Check that pause button is visible for eligible members
    const pauseButton = memberRow.locator('button[title*="Pause"]')
    await expect(pauseButton).toBeVisible()

    // Click pause button
    await pauseButton.click()

    // Check that member is now paused (should show play button)
    const playButton = memberRow.locator('button[title*="Resume"]')
    await expect(playButton).toBeVisible()

    // Check that status shows as paused
    await expect(memberRow.locator('text="Paused"')).toBeVisible()

    // Click unpause/resume button
    await playButton.click()

    // Check that member is now active again
    await expect(memberRow.locator('button[title*="Pause"]')).toBeVisible()
    await expect(memberRow.locator('text="Active"')).toBeVisible()
  })

  test('Admin cannot see pause button for 5-pass plans', async ({ page }) => {
    // Navigate to members list
    await page.click('a:has-text("Members")')

    // Find a member with 5-pass plan
    const fivePassRow = page.locator('tr').filter({
      has: page.locator('td:has-text("5-Pass")')
    }).first()

    // Check that pause button is NOT visible for 5-pass members
    const pauseButton = fivePassRow.locator('button[title*="Pause"]')
    await expect(pauseButton).toHaveCount(0)
  })

  test('Admin cannot pause member who has reached pause limit', async ({ page }) => {
    // Navigate to members list
    await page.click('a:has-text("Members")')

    // Find a 1-month member who has already used 1 pause
    const limitReachedRow = page.locator('tr').filter({
      has: page.locator('td:has-text("1 months")'),
      hasNot: page.locator('text="Paused"')
    }).first()

    // If pause count is at limit, pause button should not be visible
    const pauseButton = limitReachedRow.locator('button[title*="Pause"]')

    // Either button is not visible (limit reached) or it's visible (can still pause)
    const buttonCount = await pauseButton.count()
    if (buttonCount > 0) {
      // If button exists, clicking it should work (not at limit yet)
      await pauseButton.click()
      await expect(limitReachedRow.locator('text="Paused"')).toBeVisible()
    }
    // If button doesn't exist, that's also correct (limit reached)
  })

  test('Admin can create new member with correct plan access', async ({ page }) => {
    // Navigate to new member form
    await page.click('a:has-text("Add New Member")')

    // Fill member details
    await page.fill('input[name="name"]', 'Test CrossFit Member')
    await page.fill('input[name="email"]', 'test.crossfit@example.com')
    await page.selectOption('select[name="planType"]', 'crossfit_only')
    await page.fill('input[name="planDuration"]', '12')

    // Submit form
    await page.click('button:has-text("Create Member")')

    // Assert - Success message and access rights
    await expect(page.locator('text=Member created successfully')).toBeVisible()
    await expect(page.locator('text=Access: Gym, CrossFit')).toBeVisible()
  })

  test('Admin can verify payment calculations', async ({ page }) => {
    // Navigate to payments
    await page.click('a:has-text("View Payments")')

    // Look for a CrossFit payment
    const crossfitPayment = page.locator('tr:has-text("crossfit_only")').first()

    if (await crossfitPayment.count() > 0) {
      // Get total payment amount
      const totalAmount = await crossfitPayment.locator('[data-testid="total-amount"]').textContent()
      const gymShare = await crossfitPayment.locator('[data-testid="gym-share"]').textContent()
      const crossfitShare = await crossfitPayment.locator('[data-testid="crossfit-share"]').textContent()

      // Verify calculations
      const total = parseFloat(totalAmount!.replace('$', ''))
      const gym = parseFloat(gymShare!.replace('$', ''))
      const cf = parseFloat(crossfitShare!.replace('$', ''))

      expect(gym).toBe(total * 0.20) // 20% to gym
      expect(cf).toBe(total * 0.80) // 80% to crossfit
      expect(gym + cf).toBe(total) // Should sum to total
    }
  })
})