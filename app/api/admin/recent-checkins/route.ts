import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { checkIns, members } from '@/lib/db/schema'
import { eq, desc, isNull, and } from 'drizzle-orm'

export async function GET() {
  try {
    // Fetch the 20 most recent check-ins with member information
    const recentCheckIns = await db
      .select({
        id: checkIns.id,
        memberName: members.name,
        facilityType: checkIns.facilityType,
        checkInTime: checkIns.checkInTime,
        planType: members.planType,
        email: members.email
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
      .limit(20)

    return NextResponse.json({
      success: true,
      checkIns: recentCheckIns
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