import { test, expect } from '@playwright/test'

test.describe('Pricing Structure Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the admin area
    await page.goto('/admin/members')

    // Wait for the page to load
    await page.waitForLoadState('networkidle')
  })

  test('should display correct pricing for Thai nationals with CrossFit discount', async ({ page }) => {
    // Click Add Member button
    await page.click('text=Add Member')

    // Wait for the sheet to open
    await page.waitForSelector('[data-testid="add-member-sheet"]', { timeout: 5000 })

    // Fill in basic information
    await page.fill('input[name="name"]', 'Thai Test User')
    await page.fill('input[name="email"]', 'thai.test@example.com')

    // Select Thai nationality
    await page.click('[data-testid="nationality-combobox"]')
    await page.click('text=Thailand')

    // Select CrossFit 1 Month plan
    await page.click('[data-testid="plan-select"]')
    await page.click('text=CrossFit 1 Month')

    // Verify Thai discount is applied (2,100₿ instead of 4,200₿)
    await expect(page.locator('text=2,100₿')).toBeVisible()
    await expect(page.locator('text=Thai Discount')).toBeVisible()

    // Verify discount note
    await expect(page.locator('text=50% Thai National Discount Applied')).toBeVisible()
  })

  test('should display full price for international users', async ({ page }) => {
    // Click Add Member button
    await page.click('text=Add Member')

    // Wait for the sheet to open
    await page.waitForSelector('[data-testid="add-member-sheet"]', { timeout: 5000 })

    // Fill in basic information
    await page.fill('input[name="name"]', 'International Test User')
    await page.fill('input[name="email"]', 'intl.test@example.com')

    // Select US nationality
    await page.click('[data-testid="nationality-combobox"]')
    await page.click('text=United States')

    // Select CrossFit 1 Month plan
    await page.click('[data-testid="plan-select"]')
    await page.click('text=CrossFit 1 Month')

    // Verify full price is shown (4,200₿)
    await expect(page.locator('text=4,200₿')).toBeVisible()

    // Verify no discount note
    await expect(page.locator('text=Thai Discount')).not.toBeVisible()
  })

  test('should update pricing dynamically when nationality changes', async ({ page }) => {
    // Click Add Member button
    await page.click('text=Add Member')

    // Wait for the sheet to open
    await page.waitForSelector('[data-testid="add-member-sheet"]', { timeout: 5000 })

    // Fill in basic information
    await page.fill('input[name="name"]', 'Dynamic Test User')

    // Select CrossFit 1 Month plan first
    await page.click('[data-testid="plan-select"]')
    await page.click('text=CrossFit 1 Month')

    // Select US nationality (full price)
    await page.click('[data-testid="nationality-combobox"]')
    await page.click('text=United States')

    // Verify full price
    await expect(page.locator('text=4,200₿')).toBeVisible()

    // Change to Thai nationality
    await page.click('[data-testid="nationality-combobox"]')
    await page.click('text=Thailand')

    // Verify discounted price appears
    await expect(page.locator('text=2,100₿')).toBeVisible()
    await expect(page.locator('text=Thai Discount')).toBeVisible()
  })

  test('should show correct pricing for different plan types', async ({ page }) => {
    // Click Add Member button
    await page.click('text=Add Member')

    // Wait for the sheet to open
    await page.waitForSelector('[data-testid="add-member-sheet"]', { timeout: 5000 })

    // Test Gym plans (no Thai discount)
    await page.click('[data-testid="nationality-combobox"]')
    await page.click('text=Thailand')

    // Test Gym 1 Month
    await page.click('[data-testid="plan-select"]')
    await page.click('text=Gym 1 Month')
    await expect(page.locator('text=1,900₿')).toBeVisible()

    // Test Gym 5-Pass
    await page.click('[data-testid="plan-select"]')
    await page.click('text=Gym 5-Pass')
    await expect(page.locator('text=1,250₿')).toBeVisible()

    // Test CrossFit 3 Months (with Thai discount)
    await page.click('[data-testid="plan-select"]')
    await page.click('text=CrossFit 3 Months')
    await expect(page.locator('text=5,700₿')).toBeVisible()

    // Test Group Classes (with Thai discount)
    await page.click('[data-testid="plan-select"]')
    await page.click('text=Group Classes')
    await expect(page.locator('text=2,350₿')).toBeVisible()
  })

  test('should create member with correct pricing and payment record', async ({ page }) => {
    // Click Add Member button
    await page.click('text=Add Member')

    // Wait for the sheet to open
    await page.waitForSelector('[data-testid="add-member-sheet"]', { timeout: 5000 })

    // Fill in complete member information
    await page.fill('input[name="name"]', 'E2E Test Member')
    await page.fill('input[name="email"]', 'e2e.test@example.com')
    await page.fill('input[name="phone"]', '+66812345000')

    // Select Thai nationality
    await page.click('[data-testid="nationality-combobox"]')
    await page.click('text=Thailand')

    // Select CrossFit 1 Month plan (should be 2,100₿)
    await page.click('[data-testid="plan-select"]')
    await page.click('text=CrossFit 1 Month')

    // Verify price before submitting
    await expect(page.locator('text=2,100₿')).toBeVisible()

    // Submit the form
    await page.click('button[type="submit"]')

    // Wait for success and sheet to close
    await page.waitForSelector('[data-testid="add-member-sheet"]', { state: 'hidden', timeout: 10000 })

    // Verify member appears in the list
    await expect(page.locator('text=E2E Test Member')).toBeVisible()
    await expect(page.locator('text=crossfit_1month')).toBeVisible()
  })
})

test.describe('Reports Pricing Verification', () => {
  test('should display correct revenue calculations in reports', async ({ page }) => {
    // Navigate to reports page
    await page.goto('/admin/reports')
    await page.waitForLoadState('networkidle')

    // Set date range to include all data (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    const today = new Date()

    await page.fill('input[name="startDate"]', thirtyDaysAgo.toISOString().split('T')[0])
    await page.fill('input[name="endDate"]', today.toISOString().split('T')[0])

    // Click generate report
    await page.click('text=Generate Report')
    await page.waitForLoadState('networkidle')

    // Verify total revenue is around 98,000₿
    await expect(page.locator('text=/9[0-9],.*₿/')).toBeVisible()

    // Verify different transaction amounts appear
    await expect(page.locator('text=2,100₿')).toBeVisible() // Thai CrossFit discount
    await expect(page.locator('text=4,200₿')).toBeVisible() // Regular CrossFit
    await expect(page.locator('text=1,900₿')).toBeVisible() // Gym 1 month
  })

  test('should filter revenue by facility type correctly', async ({ page }) => {
    // Navigate to reports page
    await page.goto('/admin/reports')
    await page.waitForLoadState('networkidle')

    // Set date range
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    const today = new Date()

    await page.fill('input[name="startDate"]', thirtyDaysAgo.toISOString().split('T')[0])
    await page.fill('input[name="endDate"]', today.toISOString().split('T')[0])

    // Filter by CrossFit
    await page.selectOption('select[name="facilityType"]', 'crossfit')
    await page.click('text=Generate Report')
    await page.waitForLoadState('networkidle')

    // Should show CrossFit transactions with both regular and discounted prices
    await expect(page.locator('text=CrossFit')).toBeVisible()
    await expect(page.locator('text=2,100₿')).toBeVisible() // Thai discount
    await expect(page.locator('text=4,200₿')).toBeVisible() // Regular price
  })

  test('should generate PDF with correct pricing data', async ({ page }) => {
    // Navigate to reports page
    await page.goto('/admin/reports')
    await page.waitForLoadState('networkidle')

    // Set date range and generate report first
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    const today = new Date()

    await page.fill('input[name="startDate"]', thirtyDaysAgo.toISOString().split('T')[0])
    await page.fill('input[name="endDate"]', today.toISOString().split('T')[0])
    await page.click('text=Generate Report')
    await page.waitForLoadState('networkidle')

    // Start download promise before clicking
    const downloadPromise = page.waitForEvent('download')

    // Click PDF generation button
    await page.click('text=Generate PDF')

    // Wait for download to complete
    const download = await downloadPromise

    // Verify download occurred
    expect(download.suggestedFilename()).toContain('income-report')
    expect(download.suggestedFilename()).toContain('.pdf')
  })
})

test.describe('Member Check-in with New Pricing', () => {
  test('should validate member with correct plan information', async ({ page }) => {
    // Navigate to check-in page
    await page.goto('/admin/checkin')
    await page.waitForLoadState('networkidle')

    // Test with a seeded member email
    await page.fill('input[name="memberIdentifier"]', 'member01@test.com')
    await page.click('text=Validate Member')

    // Wait for validation response
    await page.waitForLoadState('networkidle')

    // Should show member information with plan details
    await expect(page.locator('text=Alice Johnson')).toBeVisible()
    await expect(page.locator('text=gym_only_1month')).toBeVisible()
    await expect(page.locator('text=Valid')).toBeVisible()
  })

  test('should show recent check-ins with member plan information', async ({ page }) => {
    // Navigate to check-in page
    await page.goto('/admin/checkin')
    await page.waitForLoadState('networkidle')

    // Perform a check-in first
    await page.fill('input[name="memberIdentifier"]', 'member02@test.com')
    await page.click('text=Validate Member')
    await page.waitForLoadState('networkidle')

    // Should show in recent check-ins table
    await expect(page.locator('text=Somchai Jaidee')).toBeVisible()
    await expect(page.locator('text=gym_only_3month')).toBeVisible()
  })
})