export interface MembershipStatus {
  isValid: boolean
  isActive: boolean
  isPaused: boolean
  daysRemaining: number
  visitsUsed: number | null
  totalVisits: number | null
  expiryDate: Date
  reason?: string
}

export function checkMembershipValidity(member: {
  planType: string | null
  planDuration: number | null
  currentEndDate: string
  isActive: boolean
  isPaused: boolean
  usedVisits: number | null
}): MembershipStatus {
  const now = new Date()
  const expiryDate = new Date(member.currentEndDate)
  const daysRemaining = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

  // Determine total visits for pass-based plans
  let totalVisits = null
  if (member.planType?.includes('5pass')) totalVisits = 5
  else if (member.planType?.includes('10pass')) totalVisits = 10

  // Base status
  const status: MembershipStatus = {
    isValid: false,
    isActive: member.isActive,
    isPaused: member.isPaused,
    daysRemaining,
    visitsUsed: member.usedVisits,
    totalVisits,
    expiryDate,
  }

  // Check if member is inactive
  if (!member.isActive) {
    status.reason = 'Membership is inactive'
    return status
  }

  // Check if member is paused
  if (member.isPaused) {
    status.reason = 'Membership is paused'
    return status
  }

  // Check if no plan is associated
  if (!member.planType) {
    status.reason = 'No plan associated with membership'
    return status
  }

  // Check if membership has expired (for time-based plans)
  if (member.planDuration && daysRemaining <= 0) {
    status.reason = 'Membership has expired'
    return status
  }

  // Check if pass-based plan has used all visits
  if (member.planType && (member.planType.includes('5pass') || member.planType.includes('10pass'))) {
    const usedVisits = member.usedVisits || 0
    const maxVisits = totalVisits || 0

    if (usedVisits >= maxVisits) {
      status.reason = `All ${maxVisits} visits have been used`
      return status
    }
    // For pass-based plans, also check if it has expired (1 month validity)
    if (daysRemaining <= 0) {
      status.reason = 'Pass has expired by date'
      return status
    }
  }

  // Check if membership is about to expire (within 30 days)
  if (daysRemaining <= 30 && daysRemaining > 0) {
    status.reason = `Membership expires in ${daysRemaining} days`
  }

  // If we reach here, membership is valid
  status.isValid = true
  return status
}

export function getMembershipStatusBadge(status: MembershipStatus): {
  variant: 'default' | 'secondary' | 'destructive' | 'outline'
  className?: string
  text: string
} {
  if (!status.isActive) {
    return { variant: 'secondary', text: 'Inactive' }
  }

  if (status.isPaused) {
    return { variant: 'outline', className: 'bg-yellow-100 text-yellow-800', text: 'Paused' }
  }

  if (!status.isValid) {
    return { variant: 'destructive', text: 'Expired' }
  }

  if (status.daysRemaining <= 7) {
    return { variant: 'destructive', text: 'Expiring Soon' }
  }

  if (status.daysRemaining <= 30) {
    return { variant: 'outline', className: 'bg-orange-100 text-orange-800', text: 'Expiring' }
  }

  return { variant: 'default', className: 'bg-green-100 text-green-800', text: 'Active' }
}

export function canAccessFacility(
  memberStatus: MembershipStatus,
  member: { planType: string | null },
  facilityType: 'gym' | 'crossfit' | 'fitness_class'
): boolean {
  // First check if membership is valid
  if (!memberStatus.isValid) {
    return false
  }

  // Check plan type permissions
  const planType = member.planType
  if (!planType) {
    return false
  }

  switch (facilityType) {
    case 'gym':
      return planType === 'gym_only' || planType === 'gym_crossfit' || planType === 'gym_5pass'

    case 'crossfit':
      return planType === 'gym_crossfit' || planType === 'crossfit_5pass'

    case 'fitness_class':
      return planType === 'fitness_5pass' || planType === 'gym_crossfit'

    default:
      return false
  }
}

export interface PauseValidationResult {
  canPause: boolean
  canUnpause: boolean
  maxPauses: number
  currentPauses: number
  reason?: string
}

export function validatePauseAction(member: {
  planType: string | null
  planDuration: number | null
  isPaused: boolean
  pauseCount: number
}): PauseValidationResult {
  const result: PauseValidationResult = {
    canPause: false,
    canUnpause: false,
    maxPauses: 0,
    currentPauses: member.pauseCount,
  }

  // Check if this is a plan that can be paused
  if (!member.planType) {
    result.reason = 'Plan does not support pausing'
    return result
  }

  // 5-pass plans cannot be paused
  if (member.planType.includes('5pass')) {
    result.reason = '5-pass plans cannot be paused'
    return result
  }

  // Plans without duration cannot be paused
  if (!member.planDuration) {
    result.reason = 'Plan does not support pausing'
    return result
  }

  // Determine maximum pauses based on plan duration
  // 1 month: 1 pause, 3 months: 2 pauses, 6 months: 3 pauses, 12 months: 4 pauses
  switch (member.planDuration) {
    case 1:
      result.maxPauses = 1
      break
    case 3:
      result.maxPauses = 2
      break
    case 6:
      result.maxPauses = 3
      break
    case 12:
      result.maxPauses = 4
      break
    default:
      result.reason = 'Invalid plan duration'
      return result
  }

  // If currently paused, check if can unpause
  if (member.isPaused) {
    result.canUnpause = true
    result.reason = 'Membership is currently paused'
    return result
  }

  // If not paused, check if can pause
  if (member.pauseCount >= result.maxPauses) {
    result.reason = `Maximum pause limit reached (${result.maxPauses})`
    return result
  }

  result.canPause = true
  return result
}

export function shouldShowPauseButton(member: {
  planType: string | null
  planDuration: number | null
  isPaused: boolean
  pauseCount: number
}): boolean {
  const validation = validatePauseAction(member)
  return validation.canPause || validation.canUnpause
}