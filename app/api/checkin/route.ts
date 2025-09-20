import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { members, checkIns, dayPasses } from '@/lib/db/schema'
import { eq, and, gte, lt, or } from 'drizzle-orm'
import { startOfDay, endOfDay, isBefore } from 'date-fns'
import { type Member, type DayPass, type NewCheckIn } from '@/lib/types/database'

type CheckInResult = {
  success: boolean
  message: string
  memberInfo?: {
    name: string
    planType: string
    remainingVisits?: number
    expiresAt?: string
  }
}

export async function POST(request: NextRequest) {
  try {
    const { identifier, facilityType = 'gym' } = await request.json()

    if (!identifier) {
      return NextResponse.json<CheckInResult>({
        success: false,
        message: 'Email or passport ID is required'
      }, { status: 400 })
    }

    const now = new Date()
    const todayStart = startOfDay(now)
    const todayEnd = endOfDay(now)

    // First, try to find member by email or passport
    const member = await db
      .select()
      .from(members)
      .where(
        or(
          eq(members.email, identifier.toLowerCase()),
          eq(members.passportId, identifier.toUpperCase())
        )
      )
      .limit(1)

    if (member.length > 0) {
      return await handleMemberCheckIn(member[0], facilityType, now, todayStart, todayEnd)
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

    // Not found
    return NextResponse.json<CheckInResult>({
      success: false,
      message: 'No valid membership or day pass found. Please contact reception.'
    }, { status: 404 })

  } catch (error) {
    console.error('Check-in error:', error)
    return NextResponse.json<CheckInResult>({
      success: false,
      message: 'System error. Please contact reception.'
    }, { status: 500 })
  }
}

async function handleMemberCheckIn(
  member: Member,
  facilityType: 'gym' | 'crossfit' | 'fitness_class',
  now: Date,
  todayStart: Date,
  todayEnd: Date
): Promise<NextResponse<CheckInResult>> {
  // Check if member is active
  if (!member.isActive) {
    return NextResponse.json<CheckInResult>({
      success: false,
      message: `Membership is inactive. Please contact reception.`
    })
  }

  // Check if member is paused
  if (member.isPaused) {
    return NextResponse.json<CheckInResult>({
      success: false,
      message: `Membership is currently paused. Please contact reception to resume.`
    })
  }

  // Check if membership has expired
  const currentEndDate = new Date(member.currentEndDate)
  if (isBefore(currentEndDate, now)) {
    return NextResponse.json<CheckInResult>({
      success: false,
      message: `Membership expired on ${currentEndDate.toLocaleDateString()}. Please renew to continue.`
    })
  }

  // Check facility access permissions
  if (!member.planType) {
    return NextResponse.json<CheckInResult>({
      success: false,
      message: 'No membership plan found. Please contact reception.'
    })
  }

  const hasAccess = checkFacilityAccess(member.planType, facilityType)
  if (!hasAccess) {
    return NextResponse.json<CheckInResult>({
      success: false,
      message: `Your ${member.planType} plan does not include access to ${facilityType}. Please upgrade your membership.`
    })
  }

  // For pass-based plans, check remaining visits
  if (member.planType.includes('5pass')) {
    if (member.remainingVisits === null || member.remainingVisits === undefined || member.remainingVisits <= 0) {
      return NextResponse.json<CheckInResult>({
        success: false,
        message: `No remaining visits on your ${member.planType} pass. Please purchase a new pass.`
      })
    }

    // Check if already checked in today (for pass-based plans, one entry per day)
    const todayCheckIn = await db
      .select()
      .from(checkIns)
      .where(
        and(
          eq(checkIns.memberId, member.id),
          gte(checkIns.checkInTime, todayStart),
          lt(checkIns.checkInTime, todayEnd)
        )
      )
      .limit(1)

    let shouldDeductVisit = false
    if (todayCheckIn.length === 0) {
      // First check-in today, deduct a visit
      shouldDeductVisit = true
    }

    // Record check-in
    const checkInData: NewCheckIn = {
      memberId: member.id,
      facilityType: facilityType,
      checkInTime: now
    }
    await db.insert(checkIns).values(checkInData)

    // Update remaining visits if this is first check-in today
    if (shouldDeductVisit) {
      await db
        .update(members)
        .set({ remainingVisits: member.remainingVisits - 1 })
        .where(eq(members.id, member.id))

      return NextResponse.json<CheckInResult>({
        success: true,
        message: `Welcome ${member.name}! Entry granted.`,
        memberInfo: {
          name: member.name,
          planType: member.planType,
          remainingVisits: member.remainingVisits - 1,
          expiresAt: member.currentEndDate.toISOString()
        }
      })
    } else {
      return NextResponse.json<CheckInResult>({
        success: true,
        message: `Welcome back ${member.name}! (Already checked in today)`,
        memberInfo: {
          name: member.name,
          planType: member.planType,
          remainingVisits: member.remainingVisits,
          expiresAt: member.currentEndDate.toISOString()
        }
      })
    }
  }

  // For monthly memberships, just record check-in
  const checkInData: NewCheckIn = {
    memberId: member.id,
    facilityType: facilityType,
    checkInTime: now
  }
  await db.insert(checkIns).values(checkInData)

  return NextResponse.json<CheckInResult>({
    success: true,
    message: `Welcome ${member.name}! Entry granted.`,
    memberInfo: {
      name: member.name,
      planType: member.planType,
      expiresAt: member.currentEndDate.toISOString()
    }
  })
}

async function handleDayPassCheckIn(
  dayPass: DayPass,
  facilityType: 'gym' | 'crossfit' | 'fitness_class',
  now: Date
): Promise<NextResponse<CheckInResult>> {
  // Check if day pass matches facility type
  const passAccess = checkDayPassAccess(dayPass.passType, facilityType)
  if (!passAccess) {
    return NextResponse.json<CheckInResult>({
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

  return NextResponse.json<CheckInResult>({
    success: true,
    message: `Welcome ${dayPass.customerName}! Day pass activated.`,
    memberInfo: {
      name: dayPass.customerName || 'Guest',
      planType: dayPass.passType
    }
  })
}

function checkFacilityAccess(planType: string, facilityType: string): boolean {
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