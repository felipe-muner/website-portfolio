import {
  PRICING,
  formatCurrency,
  getPlanPrice,
  getPlanDuration,
  isPassBasedPlan,
  getPassVisitCount
} from '@/lib/constants/pricing'

describe('Pricing Constants', () => {
  describe('PRICING object structure', () => {
    test('should have all required gym pricing tiers', () => {
      expect(PRICING.GYM.DROP_IN).toBe(300)
      expect(PRICING.GYM.PASS_5).toBe(1250)
      expect(PRICING.GYM.MONTH_1).toBe(1900)
      expect(PRICING.GYM.MONTH_3).toBe(5100)
      expect(PRICING.GYM.MONTH_6).toBe(9000)
      expect(PRICING.GYM.MONTH_12).toBe(16000)
    })

    test('should have fitness pricing', () => {
      expect(PRICING.FITNESS_CLASSES.DROP_IN).toBe(350)
      expect(PRICING.FITNESS_CLASSES.PASS_5).toBe(1500)
      expect(PRICING.FITNESS_CLASSES.MONTH_1).toBe(3000)
    })

    test('should have crossfit pricing with Thai discounts', () => {
      expect(PRICING.CROSSFIT.DROP_IN.REGULAR).toBe(600)
      expect(PRICING.CROSSFIT.DROP_IN.THAI_DISCOUNT).toBe(300)
      expect(PRICING.CROSSFIT.MONTH_1.REGULAR).toBe(4200)
      expect(PRICING.CROSSFIT.MONTH_1.THAI_DISCOUNT).toBe(2100)
      expect(PRICING.CROSSFIT.MONTH_3.REGULAR).toBe(11400)
      expect(PRICING.CROSSFIT.MONTH_3.THAI_DISCOUNT).toBe(5700)
    })

    test('should have group classes combo pricing with Thai discounts', () => {
      expect(PRICING.GROUP_CLASSES_COMBO.MONTH_1.REGULAR).toBe(4700)
      expect(PRICING.GROUP_CLASSES_COMBO.MONTH_1.THAI_DISCOUNT).toBe(2350)
      expect(PRICING.GROUP_CLASSES_COMBO.MONTH_3.REGULAR).toBe(12900)
      expect(PRICING.GROUP_CLASSES_COMBO.MONTH_3.THAI_DISCOUNT).toBe(6450)
    })

    test('should have combo pricing', () => {
      expect(PRICING.FITNESS_GYM_COMBO.MONTH_1).toBe(3500)
      expect(PRICING.OPEN_GYM_COMBO.MONTH_1).toBe(3500)
    })

    test('should have open gym pricing', () => {
      expect(PRICING.OPEN_GYM.DROP_IN).toBe(450)
      expect(PRICING.OPEN_GYM.PASS_5).toBe(2000)
      expect(PRICING.OPEN_GYM.MONTH_1).toBe(3000)
    })
  })

  describe('Thai discount validation', () => {
    test('all Thai discounts should be exactly 50% of regular price', () => {
      // CrossFit discounts
      expect(PRICING.CROSSFIT.DROP_IN.THAI_DISCOUNT).toBe(PRICING.CROSSFIT.DROP_IN.REGULAR / 2)
      expect(PRICING.CROSSFIT.WEEK_1.THAI_DISCOUNT).toBe(PRICING.CROSSFIT.WEEK_1.REGULAR / 2)
      expect(PRICING.CROSSFIT.PASS_10.THAI_DISCOUNT).toBe(PRICING.CROSSFIT.PASS_10.REGULAR / 2)
      expect(PRICING.CROSSFIT.MONTH_1.THAI_DISCOUNT).toBe(PRICING.CROSSFIT.MONTH_1.REGULAR / 2)
      expect(PRICING.CROSSFIT.MONTH_3.THAI_DISCOUNT).toBe(PRICING.CROSSFIT.MONTH_3.REGULAR / 2)

      // Group Classes discounts
      expect(PRICING.GROUP_CLASSES_COMBO.MONTH_1.THAI_DISCOUNT).toBe(PRICING.GROUP_CLASSES_COMBO.MONTH_1.REGULAR / 2)
      expect(PRICING.GROUP_CLASSES_COMBO.MONTH_3.THAI_DISCOUNT).toBe(PRICING.GROUP_CLASSES_COMBO.MONTH_3.REGULAR / 2)
    })
  })

  describe('Gym pricing progression', () => {
    test('longer gym memberships should have better monthly rates', () => {
      const month1Rate = PRICING.GYM.MONTH_1 / 1
      const month3Rate = PRICING.GYM.MONTH_3 / 3
      const month6Rate = PRICING.GYM.MONTH_6 / 6
      const month12Rate = PRICING.GYM.MONTH_12 / 12

      expect(month3Rate).toBeLessThan(month1Rate)
      expect(month6Rate).toBeLessThan(month3Rate)
      expect(month12Rate).toBeLessThan(month6Rate)
    })

    test('12-month membership should save significant amount', () => {
      const month1Rate = PRICING.GYM.MONTH_1
      const month12Rate = PRICING.GYM.MONTH_12 / 12
      const savings = month1Rate - month12Rate

      expect(savings).toBeGreaterThan(500) // Should save more than 500₿ per month
    })
  })
})

describe('Currency Formatting', () => {
  test('should format currency with Thai Baht symbol', () => {
    expect(formatCurrency(300)).toBe('300₿')
    expect(formatCurrency(1250)).toBe('1,250₿')
    expect(formatCurrency(16000)).toBe('16,000₿')
  })

  test('should handle large numbers with proper comma separation', () => {
    expect(formatCurrency(1000)).toBe('1,000₿')
    expect(formatCurrency(10000)).toBe('10,000₿')
    expect(formatCurrency(100000)).toBe('100,000₿')
  })

  test('should handle zero and small numbers', () => {
    expect(formatCurrency(0)).toBe('0₿')
    expect(formatCurrency(50)).toBe('50₿')
    expect(formatCurrency(99)).toBe('99₿')
  })
})

describe('Plan Helper Functions', () => {
  test('should get correct plan duration', () => {
    expect(getPlanDuration('gym_only_1month')).toBe(1)
    expect(getPlanDuration('gym_only_3month')).toBe(3)
    expect(getPlanDuration('gym_only_6month')).toBe(6)
    expect(getPlanDuration('gym_only_12month')).toBe(12)
    expect(getPlanDuration('gym_only_dropin')).toBe(null)
  })

  test('should identify pass-based plans correctly', () => {
    expect(isPassBasedPlan('gym_5pass')).toBe(true)
    expect(isPassBasedPlan('crossfit_10pass')).toBe(true)
    expect(isPassBasedPlan('gym_only_dropin')).toBe(true)
    expect(isPassBasedPlan('crossfit_1week')).toBe(true)
    expect(isPassBasedPlan('gym_only_1month')).toBe(false)
  })

  test('should get correct visit count for pass plans', () => {
    expect(getPassVisitCount('gym_5pass')).toBe(5)
    expect(getPassVisitCount('crossfit_10pass')).toBe(10)
    expect(getPassVisitCount('gym_only_dropin')).toBe(1)
    expect(getPassVisitCount('crossfit_1week')).toBe(7)
    expect(getPassVisitCount('gym_only_1month')).toBe(null)
  })
})

describe('Plan Price Calculation', () => {
  test('should return correct prices for gym plans', () => {
    expect(getPlanPrice('gym_only_1month', false)).toBe(1900)
    expect(getPlanPrice('gym_only_3month', false)).toBe(5100)
    expect(getPlanPrice('gym_only_6month', false)).toBe(9000)
    expect(getPlanPrice('gym_only_12month', false)).toBe(16000)
  })

  test('should return correct prices for fitness plans', () => {
    expect(getPlanPrice('fitness_1month', false)).toBe(3000)
    expect(getPlanPrice('fitness_5pass', false)).toBe(1500)
    expect(getPlanPrice('fitness_dropin', false)).toBe(350)
  })

  test('should apply Thai discounts for eligible plans', () => {
    // CrossFit plans with Thai discount
    expect(getPlanPrice('crossfit_1month', true)).toBe(2100)
    expect(getPlanPrice('crossfit_3month', true)).toBe(5700)
    expect(getPlanPrice('crossfit_dropin', true)).toBe(300)

    // Group classes with Thai discount
    expect(getPlanPrice('group_classes_1month', true)).toBe(2350)
    expect(getPlanPrice('group_classes_3month', true)).toBe(6450)
  })

  test('should not apply Thai discounts for non-eligible plans', () => {
    // Gym plans (no Thai discount)
    expect(getPlanPrice('gym_only_1month', true)).toBe(1900)
    expect(getPlanPrice('gym_only_3month', true)).toBe(5100)

    // Fitness plans (no Thai discount)
    expect(getPlanPrice('fitness_1month', true)).toBe(3000)
    expect(getPlanPrice('fitness_5pass', true)).toBe(1500)
  })

  test('should return 0 for unknown plan types', () => {
    expect(getPlanPrice('unknown_plan' as any, false)).toBe(0)
    expect(getPlanPrice('invalid_plan' as any, true)).toBe(0)
  })
})

describe('Thai Discount Logic', () => {
  test('should have Thai discounts for CrossFit plans', () => {
    // CrossFit plans should have different prices for Thai vs international
    expect(getPlanPrice('crossfit_1month', false)).toBe(4200)
    expect(getPlanPrice('crossfit_1month', true)).toBe(2100)
    expect(getPlanPrice('crossfit_3month', false)).toBe(11400)
    expect(getPlanPrice('crossfit_3month', true)).toBe(5700)
  })

  test('should have Thai discounts for group classes', () => {
    expect(getPlanPrice('group_classes_1month', false)).toBe(4700)
    expect(getPlanPrice('group_classes_1month', true)).toBe(2350)
    expect(getPlanPrice('group_classes_3month', false)).toBe(12900)
    expect(getPlanPrice('group_classes_3month', true)).toBe(6450)
  })

  test('should NOT have Thai discounts for gym and fitness plans', () => {
    // Gym plans should have same price for Thai and international
    expect(getPlanPrice('gym_only_1month', false)).toBe(1900)
    expect(getPlanPrice('gym_only_1month', true)).toBe(1900)
    expect(getPlanPrice('fitness_1month', false)).toBe(3000)
    expect(getPlanPrice('fitness_1month', true)).toBe(3000)
  })
})

describe('Integration Tests', () => {
  test('should maintain pricing consistency across functions', () => {
    const planType = 'crossfit_1month'

    // Regular price should match across functions
    const regularPrice = getPlanPrice(planType, false)
    expect(regularPrice).toBe(PRICING.CROSSFIT.MONTH_1.REGULAR)

    // Thai price should match across functions
    const thaiPrice = getPlanPrice(planType, true)
    expect(thaiPrice).toBe(PRICING.CROSSFIT.MONTH_1.THAI_DISCOUNT)
  })

  test('should format all pricing correctly', () => {
    const allPlans = [
      'gym_only_1month', 'gym_only_3month', 'crossfit_1month',
      'fitness_1month', 'group_classes_1month'
    ]

    allPlans.forEach(planType => {
      const regularPrice = getPlanPrice(planType as any, false)
      const thaiPrice = getPlanPrice(planType as any, true)

      // Prices should be positive numbers
      expect(regularPrice).toBeGreaterThan(0)
      expect(thaiPrice).toBeGreaterThan(0)

      // Formatted prices should include ₿ symbol
      expect(formatCurrency(regularPrice)).toContain('₿')
      expect(formatCurrency(thaiPrice)).toContain('₿')
    })
  })

  test('should validate revenue calculation accuracy', () => {
    // Test scenario: 10 international + 10 Thai members
    const internationalRevenue = 10 * getPlanPrice('crossfit_1month', false)
    const thaiRevenue = 10 * getPlanPrice('crossfit_1month', true)
    const totalRevenue = internationalRevenue + thaiRevenue

    expect(internationalRevenue).toBe(42000) // 10 × 4200₿
    expect(thaiRevenue).toBe(21000) // 10 × 2100₿
    expect(totalRevenue).toBe(63000) // Total expected revenue
  })
})