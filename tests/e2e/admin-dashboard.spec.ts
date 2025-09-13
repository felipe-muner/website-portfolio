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
    const gymCheckins = checkinRows.locator('td:has-text("gym")')

    if (await gymCheckins.count() > 0) {
      await expect(gymCheckins.first()).toBeVisible()
      // Verify this is recorded as valid access
      await expect(checkinRows.first().locator('td:has-text("✓")')).toBeVisible()
    }
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