export interface MembershipStatus {
  isValid: boolean
  isActive: boolean
  isPaused: boolean
  daysRemaining: number
  visitsRemaining: number | null
  expiryDate: Date
  reason?: string
}

export function checkMembershipValidity(member: {
  planType: string | null
  planDuration: number | null
  currentEndDate: string
  isActive: boolean
  isPaused: boolean
  remainingVisits: number | null
}): MembershipStatus {
  const now = new Date()
  const expiryDate = new Date(member.currentEndDate)
  const daysRemaining = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

  // Base status
  const status: MembershipStatus = {
    isValid: false,
    isActive: member.isActive,
    isPaused: member.isPaused,
    daysRemaining,
    visitsRemaining: member.remainingVisits,
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

  // Check if 5-pass has remaining visits
  if (member.planType.includes('5pass')) {
    if (!member.remainingVisits || member.remainingVisits <= 0) {
      status.reason = '5-pass has no remaining visits'
      return status
    }
    // For 5-pass, also check if it has expired (1 month validity)
    if (daysRemaining <= 0) {
      status.reason = '5-pass has expired'
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