import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { checkIns, members } from '@/lib/db/schema'
import { eq, and, isNull } from 'drizzle-orm'
import { type CheckInRequest, type CheckInResponse } from '@/lib/types'

export async function POST(request: NextRequest) {
  try {
    const { memberId, facilityType }: CheckInRequest = await request.json()

    if (!memberId || !facilityType) {
      return NextResponse.json(
        { error: 'Member ID and facility type are required' },
        { status: 400 }
      )
    }

    // Verify member exists and is active
    const member = await db
      .select()
      .from(members)
      .where(and(
        eq(members.id, memberId),
        isNull(members.deletedAt)
      ))
      .limit(1)

    if (member.length === 0) {
      return NextResponse.json(
        { error: 'Member not found' },
        { status: 404 }
      )
    }

    const memberData = member[0]

    // Check if member is active
    if (!memberData.isActive) {
      return NextResponse.json(
        { error: 'Membership is inactive' },
        { status: 403 }
      )
    }

    // Check if membership is paused
    if (memberData.isPaused) {
      return NextResponse.json(
        { error: 'Membership is currently paused' },
        { status: 403 }
      )
    }

    // Check if membership is expired
    const currentDate = new Date()
    const endDate = new Date(memberData.currentEndDate)
    if (currentDate > endDate) {
      return NextResponse.json(
        { error: 'Membership has expired' },
        { status: 403 }
      )
    }

    // Check plan type permissions
    const planType = memberData.planType
    let canAccess = false

    switch (facilityType) {
      case 'gym':
        canAccess = planType.includes('gym')
        break
      case 'crossfit':
        canAccess = planType.includes('crossfit')
        break
      case 'fitness_class':
        canAccess = planType.includes('fitness')
        break
      default:
        return NextResponse.json(
          { error: 'Invalid facility type' },
          { status: 400 }
        )
    }

    if (!canAccess) {
      return NextResponse.json(
        { error: `Your plan does not include access to ${facilityType}` },
        { status: 403 }
      )
    }

    // For 5-pass plans, check remaining visits
    if (planType.includes('5pass')) {
      if (!memberData.remainingVisits || memberData.remainingVisits <= 0) {
        return NextResponse.json(
          { error: 'No remaining visits on your 5-pass plan' },
          { status: 403 }
        )
      }

      // Decrease remaining visits
      await db
        .update(members)
        .set({
          remainingVisits: (memberData.remainingVisits || 0) - 1,
          updatedAt: new Date()
        })
        .where(eq(members.id, memberId))
    }

    // Record the check-in
    const checkIn = await db
      .insert(checkIns)
      .values({
        memberId,
        facilityType,
        checkInTime: new Date(),
      })
      .returning()

    return NextResponse.json({
      success: true,
      checkIn: checkIn[0],
      remainingVisits: planType.includes('5pass') ? (memberData.remainingVisits || 0) - 1 : null
    })
  } catch (error) {
    console.error('Error during check-in:', error)
    return NextResponse.json(
      { error: 'Failed to check in' },
      { status: 500 }
    )
  }
}