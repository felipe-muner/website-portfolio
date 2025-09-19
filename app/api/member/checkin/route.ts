import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { checkIns, members } from '@/lib/db/schema'
import { eq, and, isNull } from 'drizzle-orm'
import { type CheckInRequest } from '@/lib/types'
import { checkMembershipValidity, canAccessFacility } from '@/lib/utils/membership'

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

    // Use our enhanced membership validity checking
    const membershipStatus = checkMembershipValidity({
      planType: memberData.planType,
      planDuration: memberData.planDuration,
      currentEndDate: memberData.currentEndDate.toISOString(),
      isActive: memberData.isActive,
      isPaused: memberData.isPaused,
      remainingVisits: memberData.remainingVisits,
    })

    // Check if membership is valid
    if (!membershipStatus.isValid) {
      return NextResponse.json(
        { error: membershipStatus.reason || 'Membership is not valid for access' },
        { status: 403 }
      )
    }

    // Check facility access permissions
    const hasAccess = canAccessFacility(membershipStatus, memberData, facilityType)
    if (!hasAccess) {
      return NextResponse.json(
        { error: `Your plan does not include access to ${facilityType}` },
        { status: 403 }
      )
    }

    // For 5-pass plans, decrease remaining visits
    if (memberData.planType?.includes('5pass')) {
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
      remainingVisits: memberData.planType?.includes('5pass') ? (memberData.remainingVisits || 0) - 1 : null
    })
  } catch (error) {
    console.error('Error during check-in:', error)
    return NextResponse.json(
      { error: 'Failed to check in' },
      { status: 500 }
    )
  }
}