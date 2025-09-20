import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { members, membershipPauses } from '@/lib/db/schema'
import { eq, and, isNull } from 'drizzle-orm'
import { validatePauseAction } from '@/lib/utils/membership'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: memberId } = await params
    const body = await request.json()
    const { action, reason } = body

    if (!action || (action !== 'pause' && action !== 'unpause')) {
      return NextResponse.json(
        { error: 'Invalid action. Must be "pause" or "unpause"' },
        { status: 400 }
      )
    }

    // Get current member data
    const member = await db
      .select()
      .from(members)
      .where(eq(members.id, memberId))
      .limit(1)

    if (member.length === 0) {
      return NextResponse.json(
        { error: 'Member not found' },
        { status: 404 }
      )
    }

    const currentMember = member[0]

    // Validate pause action
    const validation = validatePauseAction({
      planType: currentMember.planType,
      planDuration: currentMember.planDuration,
      isPaused: currentMember.isPaused,
      pauseCount: currentMember.pauseCount,
    })

    if (action === 'pause' && !validation.canPause) {
      return NextResponse.json(
        { error: validation.reason || 'Cannot pause membership' },
        { status: 400 }
      )
    }

    if (action === 'unpause' && !validation.canUnpause) {
      return NextResponse.json(
        { error: validation.reason || 'Cannot unpause membership' },
        { status: 400 }
      )
    }

    const now = new Date()

    if (action === 'pause') {
      // Start transaction for pause
      await db.transaction(async (tx) => {
        // Update member status
        await tx
          .update(members)
          .set({
            isPaused: true,
            pauseCount: currentMember.pauseCount + 1,
            updatedAt: now,
          })
          .where(eq(members.id, memberId))

        // Create pause record
        await tx.insert(membershipPauses).values({
          memberId,
          pauseStartDate: now,
          pauseReason: reason || 'Paused by admin',
          createdAt: now,
          updatedAt: now,
        })
      })

      return NextResponse.json({
        success: true,
        message: 'Membership paused successfully',
        pauseCount: currentMember.pauseCount + 1,
        maxPauses: validation.maxPauses,
      })
    } else {
      // Unpause - end the current active pause
      await db.transaction(async (tx) => {
        // Update member status
        await tx
          .update(members)
          .set({
            isPaused: false,
            updatedAt: now,
          })
          .where(eq(members.id, memberId))

        // End the current pause record
        await tx
          .update(membershipPauses)
          .set({
            pauseEndDate: now,
            updatedAt: now,
          })
          .where(
            and(
              eq(membershipPauses.memberId, memberId),
              isNull(membershipPauses.pauseEndDate)
            )
          )
      })

      return NextResponse.json({
        success: true,
        message: 'Membership resumed successfully',
        pauseCount: currentMember.pauseCount,
        maxPauses: validation.maxPauses,
      })
    }
  } catch (error) {
    console.error('Error in pause/unpause API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}