import { PLAN_TYPES, formatCurrency, getPlanPrice } from '@/lib/constants/pricing'

export interface PlanOption {
  id: string
  name: string
  price: string
  priceThaiDiscount?: string
  duration?: number | null // in months
  planType: string // matches the plan types in pricing.ts
  visits?: number // for pass-based plans
  hasThaiDiscount?: boolean
}

// Convert PLAN_TYPES to PlanOption format for the UI
export const planOptions: PlanOption[] = PLAN_TYPES.map(plan => {
  const regularPrice = getPlanPrice(plan.value, false)
  const thaiPrice = getPlanPrice(plan.value, true)
  const hasDiscount = regularPrice !== thaiPrice

  return {
    id: plan.value,
    name: plan.label,
    price: formatCurrency(regularPrice),
    priceThaiDiscount: hasDiscount ? formatCurrency(thaiPrice) : undefined,
    duration: plan.duration,
    planType: plan.value,
    visits: plan.value.includes('5pass') ? 5 :
             plan.value.includes('10pass') ? 10 :
             plan.value.includes('dropin') ? 1 :
             plan.value === 'crossfit_1week' ? 7 : undefined,
    hasThaiDiscount: hasDiscount
  }
})

export const getPlanById = (id: string): PlanOption | undefined => {
  return planOptions.find(plan => plan.id === id)
}

export const getPlansByType = (planType: string): PlanOption[] => {
  return planOptions.filter(plan => plan.planType === planType)
}

export const formatPlanDisplay = (plan: PlanOption): string => {
  return `${plan.name} - ${plan.price}`
}