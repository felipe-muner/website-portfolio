import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { checkIns, members } from '@/lib/db/schema'
import { eq, desc, isNull, and } from 'drizzle-orm'
import { isBefore } from 'date-fns'

export async function GET() {
  try {
    // Fetch the 50 most recent check-ins with member information
    const recentCheckIns = await db
      .select({
        id: checkIns.id,
        memberName: members.name,
        facilityType: checkIns.facilityType,
        checkInTime: checkIns.checkInTime,
        planType: members.planType,
        email: members.email,
        isActive: members.isActive,
        isPaused: members.isPaused,
        currentEndDate: members.currentEndDate,
        usedVisits: members.usedVisits
      })
      .from(checkIns)
      .innerJoin(members, eq(checkIns.memberId, members.id))
      .where(
        and(
          isNull(checkIns.deletedAt),
          isNull(members.deletedAt)
        )
      )
      .orderBy(desc(checkIns.checkInTime))
      .limit(50)

    // Transform the data to match the expected format
    const transformedCheckIns = recentCheckIns.map(checkIn => {
      const now = new Date()
      const currentEndDate = new Date(checkIn.currentEndDate)

      let success = false
      let membershipStatus: 'active' | 'expired' | 'inactive' | 'paused'
      let message = ''

      if (!checkIn.isActive) {
        membershipStatus = 'inactive'
        message = 'Membership is inactive. Please contact reception to reactivate.'
      } else if (checkIn.isPaused) {
        membershipStatus = 'paused'
        message = 'Membership is currently paused. Please contact reception to resume.'
      } else if (isBefore(currentEndDate, now)) {
        membershipStatus = 'expired'
        message = `Membership expired on ${currentEndDate.toLocaleDateString()}. Payment required to renew access.`
      } else {
        membershipStatus = 'active'
        success = true
        message = `Welcome ${checkIn.memberName}! Membership is valid until ${currentEndDate.toLocaleDateString()}.`
      }

      // Check for 5-pass and 10-pass plans with no remaining visits
      if (success && (checkIn.planType?.includes('5pass') || checkIn.planType?.includes('10pass'))) {
        const totalVisits = checkIn.planType.includes('10pass') ? 10 : 5
        const usedVisits = checkIn.usedVisits || 0
        const remainingVisits = totalVisits - usedVisits

        if (usedVisits >= totalVisits) {
          success = false
          membershipStatus = 'expired'
          message = `All ${totalVisits} visits have been used on your ${checkIn.planType} pass. Please purchase a new pass.`
        } else {
          message = `Welcome ${checkIn.memberName}! You have ${remainingVisits} visits remaining (${usedVisits}/${totalVisits} used).`
        }
      }

      return {
        id: checkIn.id,
        memberName: checkIn.memberName,
        facilityType: checkIn.facilityType,
        checkInTime: checkIn.checkInTime.toISOString(),
        planType: checkIn.planType,
        email: checkIn.email,
        success,
        membershipStatus,
        message,
        currentEndDate: checkIn.currentEndDate.toISOString()
      }
    })

    return NextResponse.json({
      success: true,
      checkIns: transformedCheckIns
    })
  } catch (error) {
    console.error('Error fetching recent check-ins:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch recent check-ins'
      },
      { status: 500 }
    )
  }
}