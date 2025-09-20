// Summit Gym Pricing Structure - Based on Official Pricing Table
// All prices in Thai Baht (₿)

export const PRICING = {
  // Gym & Fitness Classes
  GYM: {
    DROP_IN: 300,
    PASS_5: 1250,  // Valid 1 month
    MONTH_1: 1900,
    MONTH_3: 5100,
    MONTH_6: 9000,
    MONTH_12: 16000,
  },

  // Fitness Classes
  FITNESS_CLASSES: {
    DROP_IN: 350,
    PASS_5: 1500,  // Valid 1 month
    MONTH_1: 3000,
  },

  // Fitness Classes & Gym + Steam + Ice-bath
  FITNESS_GYM_COMBO: {
    MONTH_1: 3500,
  },

  // CrossFit (50% discount for Thai nationals)
  CROSSFIT: {
    DROP_IN: {
      REGULAR: 600,
      THAI_DISCOUNT: 300, // 50% discount
    },
    WEEK_1: {
      REGULAR: 2100,
      THAI_DISCOUNT: 1050,
    },
    PASS_10: {
      REGULAR: 3000, // Valid 1 month
      THAI_DISCOUNT: 1500,
    },
    MONTH_1: {
      REGULAR: 4200,
      THAI_DISCOUNT: 2100,
    },
    MONTH_3: {
      REGULAR: 11400,
      THAI_DISCOUNT: 5700,
    },
  },

  // Group Classes & Open Gym + Gym + Steam + Ice-bath
  GROUP_CLASSES_COMBO: {
    MONTH_1: {
      REGULAR: 4700,
      THAI_DISCOUNT: 2350,
    },
    MONTH_3: {
      REGULAR: 12900,
      THAI_DISCOUNT: 6450,
    },
  },

  // Open Gym Only
  OPEN_GYM: {
    DROP_IN: 450,
    PASS_5: 2000,  // Valid 1 month
    MONTH_1: 3000,
  },

  // Open Gym & Gym + Steam + Ice-bath
  OPEN_GYM_COMBO: {
    MONTH_1: 3500,
  },

  // Day Pass Types for walk-ins
  DAY_PASS: {
    GYM_DROPIN: 300,
    FITNESS_DROPIN: 350,
    CROSSFIT_DROPIN: 600,
    CROSSFIT_DROPIN_THAI: 300,
    OPEN_GYM: 450,
  }
} as const

// Plan Type Mappings to Pricing
export const PLAN_PRICING = {
  // Gym Plans
  'gym_only_dropin': PRICING.GYM.DROP_IN,
  'gym_5pass': PRICING.GYM.PASS_5,
  'gym_only_1month': PRICING.GYM.MONTH_1,
  'gym_only_3month': PRICING.GYM.MONTH_3,
  'gym_only_6month': PRICING.GYM.MONTH_6,
  'gym_only_12month': PRICING.GYM.MONTH_12,

  // Fitness Classes
  'fitness_dropin': PRICING.FITNESS_CLASSES.DROP_IN,
  'fitness_5pass': PRICING.FITNESS_CLASSES.PASS_5,
  'fitness_1month': PRICING.FITNESS_CLASSES.MONTH_1,

  // Fitness + Gym Combo
  'fitness_gym_1month': PRICING.FITNESS_GYM_COMBO.MONTH_1,

  // CrossFit (Regular pricing - discount applied based on nationality)
  'crossfit_dropin': PRICING.CROSSFIT.DROP_IN.REGULAR,
  'crossfit_1week': PRICING.CROSSFIT.WEEK_1.REGULAR,
  'crossfit_10pass': PRICING.CROSSFIT.PASS_10.REGULAR,
  'crossfit_1month': PRICING.CROSSFIT.MONTH_1.REGULAR,
  'crossfit_3month': PRICING.CROSSFIT.MONTH_3.REGULAR,

  // Group Classes + Open Gym Combo
  'group_classes_1month': PRICING.GROUP_CLASSES_COMBO.MONTH_1.REGULAR,
  'group_classes_3month': PRICING.GROUP_CLASSES_COMBO.MONTH_3.REGULAR,

  // Open Gym
  'open_gym_dropin': PRICING.OPEN_GYM.DROP_IN,
  'open_gym_5pass': PRICING.OPEN_GYM.PASS_5,
  'open_gym_1month': PRICING.OPEN_GYM.MONTH_1,

  // Open Gym + Gym Combo
  'open_gym_combo_1month': PRICING.OPEN_GYM_COMBO.MONTH_1,

  // Legacy plan types (for backward compatibility)
  'gym_only': PRICING.GYM.MONTH_1,
  'gym_crossfit': PRICING.CROSSFIT.MONTH_1.REGULAR,
} as const

// Plan Type Definitions
export const PLAN_TYPES = [
  // Gym Plans
  { value: 'gym_only_dropin', label: 'Gym Drop-in', price: PRICING.GYM.DROP_IN, duration: null },
  { value: 'gym_5pass', label: 'Gym 5-Pass', price: PRICING.GYM.PASS_5, duration: 1 },
  { value: 'gym_only_1month', label: 'Gym 1 Month', price: PRICING.GYM.MONTH_1, duration: 1 },
  { value: 'gym_only_3month', label: 'Gym 3 Months', price: PRICING.GYM.MONTH_3, duration: 3 },
  { value: 'gym_only_6month', label: 'Gym 6 Months', price: PRICING.GYM.MONTH_6, duration: 6 },
  { value: 'gym_only_12month', label: 'Gym 12 Months', price: PRICING.GYM.MONTH_12, duration: 12 },

  // Fitness Classes
  { value: 'fitness_dropin', label: 'Fitness Drop-in', price: PRICING.FITNESS_CLASSES.DROP_IN, duration: null },
  { value: 'fitness_5pass', label: 'Fitness 5-Pass', price: PRICING.FITNESS_CLASSES.PASS_5, duration: 1 },
  { value: 'fitness_1month', label: 'Fitness 1 Month', price: PRICING.FITNESS_CLASSES.MONTH_1, duration: 1 },

  // Fitness + Gym Combo
  { value: 'fitness_gym_1month', label: 'Fitness + Gym + Steam + Ice-bath 1 Month', price: PRICING.FITNESS_GYM_COMBO.MONTH_1, duration: 1 },

  // CrossFit
  { value: 'crossfit_dropin', label: 'CrossFit Drop-in', price: PRICING.CROSSFIT.DROP_IN.REGULAR, duration: null },
  { value: 'crossfit_1week', label: 'CrossFit 1 Week', price: PRICING.CROSSFIT.WEEK_1.REGULAR, duration: null },
  { value: 'crossfit_10pass', label: 'CrossFit 10-Pass', price: PRICING.CROSSFIT.PASS_10.REGULAR, duration: 1 },
  { value: 'crossfit_1month', label: 'CrossFit 1 Month', price: PRICING.CROSSFIT.MONTH_1.REGULAR, duration: 1 },
  { value: 'crossfit_3month', label: 'CrossFit 3 Months', price: PRICING.CROSSFIT.MONTH_3.REGULAR, duration: 3 },

  // Group Classes Combo
  { value: 'group_classes_1month', label: 'Group Classes + Open Gym + Gym + Steam + Ice-bath 1 Month', price: PRICING.GROUP_CLASSES_COMBO.MONTH_1.REGULAR, duration: 1 },
  { value: 'group_classes_3month', label: 'Group Classes + Open Gym + Gym + Steam + Ice-bath 3 Months', price: PRICING.GROUP_CLASSES_COMBO.MONTH_3.REGULAR, duration: 3 },

  // Open Gym
  { value: 'open_gym_dropin', label: 'Open Gym Drop-in', price: PRICING.OPEN_GYM.DROP_IN, duration: null },
  { value: 'open_gym_5pass', label: 'Open Gym 5-Pass', price: PRICING.OPEN_GYM.PASS_5, duration: 1 },
  { value: 'open_gym_1month', label: 'Open Gym 1 Month', price: PRICING.OPEN_GYM.MONTH_1, duration: 1 },

  // Open Gym Combo
  { value: 'open_gym_combo_1month', label: 'Open Gym + Gym + Steam + Ice-bath 1 Month', price: PRICING.OPEN_GYM_COMBO.MONTH_1, duration: 1 },
] as const

// Helper function to get price for a plan type
export function getPlanPrice(planType: string, isThaiNational: boolean = false): number {
  // Apply Thai discount for CrossFit plans
  if (isThaiNational) {
    switch (planType) {
      case 'crossfit_dropin':
        return PRICING.CROSSFIT.DROP_IN.THAI_DISCOUNT
      case 'crossfit_1week':
        return PRICING.CROSSFIT.WEEK_1.THAI_DISCOUNT
      case 'crossfit_10pass':
        return PRICING.CROSSFIT.PASS_10.THAI_DISCOUNT
      case 'crossfit_1month':
        return PRICING.CROSSFIT.MONTH_1.THAI_DISCOUNT
      case 'crossfit_3month':
        return PRICING.CROSSFIT.MONTH_3.THAI_DISCOUNT
      case 'group_classes_1month':
        return PRICING.GROUP_CLASSES_COMBO.MONTH_1.THAI_DISCOUNT
      case 'group_classes_3month':
        return PRICING.GROUP_CLASSES_COMBO.MONTH_3.THAI_DISCOUNT
    }
  }

  // Return regular price
  return PLAN_PRICING[planType as keyof typeof PLAN_PRICING] || 0
}

// Helper function to get plan duration in months
export function getPlanDuration(planType: string): number | null {
  const plan = PLAN_TYPES.find(p => p.value === planType)
  return plan?.duration || null
}

// Helper function to check if plan is a pass-based plan
export function isPassBasedPlan(planType: string): boolean {
  return planType.includes('pass') || planType.includes('dropin') || planType === 'crossfit_1week'
}

// Helper function to get visit count for pass-based plans
export function getPassVisitCount(planType: string): number | null {
  if (planType.includes('5pass')) return 5
  if (planType.includes('10pass')) return 10
  if (planType.includes('dropin')) return 1
  if (planType === 'crossfit_1week') return 7 // Assuming 7 visits for 1 week
  return null
}

// Currency formatter for Thai Baht
export function formatCurrency(amount: number): string {
  return `${amount.toLocaleString()}₿`
}

// Membership pause limits (from pricing table)
export const PAUSE_LIMITS = {
  MONTH_1: 1,   // 1 time
  MONTH_3: 2,   // 2 times
  MONTH_6: 3,   // 3 times
  MONTH_12: 4,  // 4 times
  MAX_DURATION_WEEKS: 3, // Maximum 3 weeks duration
} as const