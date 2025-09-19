export interface PlanOption {
  id: string
  name: string
  price: string
  duration?: number // in months
  type: 'gym_only' | 'gym_crossfit' | 'gym_5pass' | 'fitness_5pass' | 'crossfit_5pass'
  visits?: number // for pass-based plans
}

export const planOptions: PlanOption[] = [
  // Drop-in Plans
  {
    id: 'gym_dropin',
    name: 'Gym Drop-in',
    price: '300 ฿',
    type: 'gym_only'
  },
  {
    id: 'fitness_dropin',
    name: 'Fitness Classes Drop-in',
    price: '300 ฿',
    type: 'fitness_5pass'
  },
  {
    id: 'crossfit_group_dropin',
    name: 'CrossFit Group Training Drop-in',
    price: '600 ฿',
    type: 'crossfit_5pass'
  },
  {
    id: 'crossfit_opengym_dropin',
    name: 'CrossFit Open-Gym Drop-in',
    price: '450 ฿',
    type: 'crossfit_5pass'
  },

  // 5-Pass Plans
  {
    id: 'gym_5pass',
    name: 'Gym / Steam / Ice-bath 5-Pass',
    price: '1,250 ฿',
    type: 'gym_5pass',
    visits: 5
  },
  {
    id: 'fitness_5pass',
    name: 'Fitness Classes 5-Pass',
    price: '1,250 ฿',
    type: 'fitness_5pass',
    visits: 5
  },
  {
    id: 'crossfit_5pass',
    name: 'CrossFit Group Training 5-Pass',
    price: '2,250 ฿',
    type: 'crossfit_5pass',
    visits: 5
  },

  // Monthly Plans - Gym
  {
    id: 'gym_only_1',
    name: 'Gym / Steam / Ice-bath - 1 Month',
    price: '1,900 ฿',
    duration: 1,
    type: 'gym_only'
  },
  {
    id: 'gym_only_3',
    name: 'Gym / Steam / Ice-bath - 3 Months',
    price: '5,100 ฿',
    duration: 3,
    type: 'gym_only'
  },
  {
    id: 'gym_only_6',
    name: 'Gym / Steam / Ice-bath - 6 Months',
    price: '9,000 ฿',
    duration: 6,
    type: 'gym_only'
  },
  {
    id: 'gym_only_12',
    name: 'Gym / Steam / Ice-bath - 12 Months',
    price: '16,000 ฿',
    duration: 12,
    type: 'gym_only'
  },

  // Monthly Plans - Fitness Classes
  {
    id: 'fitness_1',
    name: 'Fitness Classes - 1 Month',
    price: '2,800 ฿',
    duration: 1,
    type: 'fitness_5pass'
  },

  // Monthly Plans - CrossFit Group Training
  {
    id: 'crossfit_group_1',
    name: 'CrossFit Group Training - 1 Month',
    price: '4,200 ฿',
    duration: 1,
    type: 'crossfit_5pass'
  },
  {
    id: 'crossfit_group_3',
    name: 'CrossFit Group Training - 3 Months',
    price: '11,400 ฿',
    duration: 3,
    type: 'crossfit_5pass'
  },
  {
    id: 'crossfit_group_6',
    name: 'CrossFit Group Training - 6 Months',
    price: '21,600 ฿',
    duration: 6,
    type: 'crossfit_5pass'
  },

  // Monthly Plans - CrossFit Open-Gym
  {
    id: 'crossfit_opengym_1',
    name: 'CrossFit Open-Gym - 1 Month',
    price: '3,000 ฿',
    duration: 1,
    type: 'crossfit_5pass'
  },

  // Monthly Plans - CrossFit Group Training + Open-Gym
  {
    id: 'crossfit_combo_1',
    name: 'CrossFit Group Training + Open-Gym - 1 Month',
    price: '5,000 ฿',
    duration: 1,
    type: 'gym_crossfit'
  },
  {
    id: 'crossfit_combo_3',
    name: 'CrossFit Group Training + Open-Gym - 3 Months',
    price: '13,500 ฿',
    duration: 3,
    type: 'gym_crossfit'
  },
  {
    id: 'crossfit_combo_6',
    name: 'CrossFit Group Training + Open-Gym - 6 Months',
    price: '25,800 ฿',
    duration: 6,
    type: 'gym_crossfit'
  },
]

export const getPlanById = (id: string): PlanOption | undefined => {
  return planOptions.find(plan => plan.id === id)
}

export const getPlansByType = (type: string): PlanOption[] => {
  return planOptions.filter(plan => plan.type === type)
}

export const formatPlanDisplay = (plan: PlanOption): string => {
  return `${plan.name} - ${plan.price}`
}