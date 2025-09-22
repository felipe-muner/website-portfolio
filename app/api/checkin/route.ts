import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { members, payments, checkIns, dayPasses } from '@/lib/db/schema'
import { eq, or, desc, isNull, and, gte, lt } from 'drizzle-orm'
import { isBefore, startOfDay, endOfDay } from 'date-fns'
import { type Member, type DayPass } from '@/lib/types/database'

type ValidationResult = {
  success: boolean
  message: string
  memberInfo?: {
    name: string
    email: string
    planType: string
    membershipStatus: 'active' | 'expired' | 'inactive' | 'paused'
    currentEndDate: string
    lastPayment?: {
      date: string
      amount: string
      type: string
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const { identifier, facilityType = 'gym' } = await request.json()

    if (!identifier) {
      return NextResponse.json<ValidationResult>({
        success: false,
        message: 'Email or passport ID is required'
      }, { status: 400 })
    }

    const now = new Date()

    // First, try to find member by email or passport
    const member = await db
      .select()
      .from(members)
      .where(
        and(
          or(
            eq(members.email, identifier.toLowerCase()),
            eq(members.passportId, identifier.toUpperCase())
          ),
          isNull(members.deletedAt)
        )
      )
      .limit(1)

    if (member.length > 0) {
      return await handleMemberCheckIn(member[0], facilityType, now)
    }

    // If not found as member, check day passes by passport or email
    const dayPass = await db
      .select()
      .from(dayPasses)
      .where(
        and(
          eq(dayPasses.isUsed, false),
          or(
            eq(dayPasses.email, identifier.toLowerCase()),
            eq(dayPasses.passportId, identifier.toUpperCase())
          )
        )
      )
      .limit(1)

    if (dayPass.length > 0) {
      return await handleDayPassCheckIn(dayPass[0], facilityType, now)
    }

    return NextResponse.json<ValidationResult>({
      success: false,
      message: 'No valid membership or day pass found. Please contact reception.'
    }, { status: 404 })

  } catch (error) {
    console.error('Check-in error:', error)
    return NextResponse.json<ValidationResult>({
      success: false,
      message: 'System error. Please contact reception.'
    }, { status: 500 })
  }
}

async function handleMemberCheckIn(
  memberData: Member,
  facilityType: string,
  now: Date
): Promise<NextResponse<ValidationResult>> {
  // Get the last payment for this member
  const lastPayment = await db
    .select()
    .from(payments)
    .where(eq(payments.memberId, memberData.id))
    .orderBy(desc(payments.paymentDate))
    .limit(1)

  // Determine membership status
  const currentEndDate = new Date(memberData.currentEndDate)
  let membershipStatus: 'active' | 'expired' | 'inactive' | 'paused'
  let isValid = false
  let message = ''

  if (!memberData.isActive) {
    membershipStatus = 'inactive'
    message = 'Membership is inactive. Please contact reception to reactivate.'
  } else if (memberData.isPaused) {
    membershipStatus = 'paused'
    message = 'Membership is currently paused. Please contact reception to resume.'
  } else if (isBefore(currentEndDate, now)) {
    membershipStatus = 'expired'
    message = `Membership expired on ${currentEndDate.toLocaleDateString()}. Payment required to renew access.`
  } else {
    membershipStatus = 'active'
    isValid = true
    message = `Welcome ${memberData.name}! Membership is valid until ${currentEndDate.toLocaleDateString()}.`
  }

  // Check for 5-pass and 10-pass plans with no remaining visits
  if (isValid && (memberData.planType?.includes('5pass') || memberData.planType?.includes('10pass'))) {
    const totalVisits = memberData.planType.includes('10pass') ? 10 : 5
    const usedVisits = memberData.usedVisits || 0
    const remainingVisits = totalVisits - usedVisits

    if (usedVisits >= totalVisits) {
      isValid = false
      membershipStatus = 'expired'
      message = `All ${totalVisits} visits have been used on your ${memberData.planType} pass. Please purchase a new pass.`
    } else {
      message = `Welcome ${memberData.name}! You have ${remainingVisits} visits remaining (${usedVisits}/${totalVisits} used).`
    }
  }

  // Record check-in if validation is successful
  if (isValid) {
    const todayStart = startOfDay(now)
    const todayEnd = endOfDay(now)

    // Check if already checked in today (for pass-based plans, one entry per day)
    let shouldDeductVisit = false
    if (memberData.planType?.includes('5pass') || memberData.planType?.includes('10pass')) {
      const todayCheckIn = await db
        .select()
        .from(checkIns)
        .where(
          and(
            eq(checkIns.memberId, memberData.id),
            gte(checkIns.checkInTime, todayStart),
            lt(checkIns.checkInTime, todayEnd)
          )
        )
        .limit(1)

      shouldDeductVisit = todayCheckIn.length === 0
    }

    await db.insert(checkIns).values({
      memberId: memberData.id,
      facilityType: facilityType as 'gym' | 'crossfit' | 'fitness_class',
      checkInTime: now
    })

    // For pass plans, increase used visits only on first check-in of the day
    if ((memberData.planType?.includes('5pass') || memberData.planType?.includes('10pass')) && shouldDeductVisit) {
      const totalVisits = memberData.planType.includes('10pass') ? 10 : 5
      const currentUsedVisits = memberData.usedVisits || 0
      const newUsedVisits = currentUsedVisits + 1
      const remainingVisits = totalVisits - newUsedVisits

      await db
        .update(members)
        .set({
          usedVisits: newUsedVisits,
          updatedAt: now
        })
        .where(eq(members.id, memberData.id))

      // Update the message to reflect the new visit count
      message = `Welcome ${memberData.name}! You have ${remainingVisits} visits remaining (${newUsedVisits}/${totalVisits} used).`
    } else if ((memberData.planType?.includes('5pass') || memberData.planType?.includes('10pass')) && !shouldDeductVisit) {
      const totalVisits = memberData.planType.includes('10pass') ? 10 : 5
      const usedVisits = memberData.usedVisits || 0
      const remainingVisits = totalVisits - usedVisits
      message = `Welcome back ${memberData.name}! (Already checked in today - ${remainingVisits} visits remaining)`
    }
  }

  const result: ValidationResult = {
    success: isValid,
    message,
    memberInfo: {
      name: memberData.name,
      email: memberData.email || 'No email on file',
      planType: memberData.planType || 'No plan assigned',
      membershipStatus,
      currentEndDate: memberData.currentEndDate.toISOString(),
      lastPayment: lastPayment.length > 0 ? {
        date: lastPayment[0].paymentDate.toISOString(),
        amount: lastPayment[0].amount,
        type: 'membership'
      } : undefined
    }
  }

  return NextResponse.json<ValidationResult>(result)
}

async function handleDayPassCheckIn(
  dayPass: DayPass,
  facilityType: string,
  now: Date
): Promise<NextResponse<ValidationResult>> {
  // Check if day pass matches facility type
  const passAccess = checkDayPassAccess(dayPass.passType, facilityType)
  if (!passAccess) {
    return NextResponse.json<ValidationResult>({
      success: false,
      message: `Your ${dayPass.passType} does not include access to ${facilityType}.`
    })
  }

  // Mark day pass as used
  await db
    .update(dayPasses)
    .set({
      isUsed: true,
      usedAt: now
    })
    .where(eq(dayPasses.id, dayPass.id))

  return NextResponse.json<ValidationResult>({
    success: true,
    message: `Welcome ${dayPass.customerName}! Day pass activated.`,
    memberInfo: {
      name: dayPass.customerName || 'Guest',
      email: dayPass.email || 'No email on file',
      planType: dayPass.passType,
      membershipStatus: 'active',
      currentEndDate: now.toISOString()
    }
  })
}

function checkDayPassAccess(passType: string, facilityType: string): boolean {
  switch (facilityType) {
    case 'gym':
      return passType === 'gym_dropin' || passType === 'open_gym'
    case 'crossfit':
      return passType === 'crossfit_dropin'
    case 'fitness_class':
      return passType === 'fitness_class'
    default:
      return false
  }
}