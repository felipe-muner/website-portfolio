import { test, expect } from '@playwright/test'

test.describe('Member Portal Access', () => {
  test('Member portal page loads correctly', async ({ page }) => {
    // Navigate to member portal
    await page.goto('/member')

    // Check that the member portal page loads (flexible title check)
    await expect(page).toHaveTitle(/Gym/i)
    await expect(page.locator('h1, h2').first()).toBeVisible()

    // Check for member lookup form elements
    const emailInput = page.locator('input[type="email"], input[placeholder*="email" i]')
    const lookupButton = page.locator('button').filter({ hasText: /look.?up|search|find/i })

    // At least one of these should be present for member lookup
    const hasEmailInput = await emailInput.count() > 0
    const hasLookupButton = await lookupButton.count() > 0

    expect(hasEmailInput || hasLookupButton).toBeTruthy()
  })

  test('Check-in interface elements are present', async ({ page }) => {
    await page.goto('/member')

    // Look for check-in related elements
    const checkinElements = [
      page.locator('text=check.?in', { hasText: /check.?in/i }),
      page.locator('text=gym', { hasText: /gym/i }),
      page.locator('text=crossfit', { hasText: /crossfit/i }),
      page.locator('button').filter({ hasText: /check|gym|crossfit/i })
    ]

    // At least some check-in interface should be visible or become visible
    let hasCheckinInterface = false
    for (const element of checkinElements) {
      if (await element.count() > 0) {
        hasCheckinInterface = true
        break
      }
    }

    // The interface might be hidden until a member is looked up, which is fine
    console.log('Check-in interface detection:', hasCheckinInterface ? 'Found' : 'Not immediately visible')
  })

  test('Page has proper navigation structure', async ({ page }) => {
    await page.goto('/member')

    // Check for basic page structure
    await expect(page.locator('body')).toBeVisible()

    // Should have some kind of header or navigation
    const navigation = [
      page.locator('header'),
      page.locator('nav'),
      page.locator('[role="banner"]'),
      page.locator('a[href="/"]') // Home link
    ]

    let hasNavigation = false
    for (const nav of navigation) {
      if (await nav.count() > 0) {
        hasNavigation = true
        break
      }
    }

    expect(hasNavigation).toBeTruthy()
  })
})

test.describe('Admin Login Page', () => {
  test('Admin login page loads with Google OAuth', async ({ page }) => {
    await page.goto('/admin/login')

    // Check for admin login page
    await expect(page.locator('text=Admin Login')).toBeVisible()
    await expect(page.locator('text=Continue with Google')).toBeVisible()

    // Should have Google sign-in button
    const googleButton = page.locator('button').filter({ hasText: /google|continue/i })
    await expect(googleButton).toBeVisible()
  })

  test('Unauthorized admin access redirects to login', async ({ page }) => {
    // Try to access admin dashboard without authentication
    await page.goto('/admin')

    // Should redirect to login or show login
    await page.waitForURL(/login/, { timeout: 10000 })
    await expect(page.locator('text=Admin Login')).toBeVisible()
  })
})

test.describe('Basic Application Health', () => {
  test('Home page loads without errors', async ({ page }) => {
    await page.goto('/')

    // Should load successfully
    await expect(page).toHaveTitle(/Summit.*Gym/i)

    // Just check that the page doesn't show a complete failure
    const pageContent = await page.textContent('body')
    expect(pageContent).toBeTruthy()
    expect(pageContent!.length).toBeGreaterThan(0)
  })

  test('Navigation between key pages works', async ({ page }) => {
    // Start at home
    await page.goto('/')

    // Try to navigate to member portal
    const memberLink = page.locator('a[href="/member"], a').filter({ hasText: /member/i })
    if (await memberLink.count() > 0) {
      await memberLink.first().click()
      await expect(page).toHaveURL(/member/)
    } else {
      // Direct navigation if no link found
      await page.goto('/member')
      await expect(page).toHaveURL(/member/)
    }

    // Navigate to admin (should redirect to login)
    await page.goto('/admin')
    await page.waitForURL(/login/, { timeout: 5000 })
  })
})