import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { members, payments } from '@/lib/db/schema'
import { desc, isNull } from 'drizzle-orm'

export async function POST(request: NextRequest) {
  try {
    const { memberData, paymentData } = await request.json()

    // Create member first
    const newMember = await db
      .insert(members)
      .values({
        name: memberData.name,
        email: memberData.email || null,
        phone: memberData.phone || null,
        passportId: memberData.passportId || null,
        nationalityId: memberData.nationalityId || null,
        planType: memberData.planType || null,
        planDuration: memberData.planDuration || null,
        startDate: new Date(memberData.startDate || new Date()),
        originalEndDate: new Date(memberData.originalEndDate || new Date()),
        currentEndDate: new Date(memberData.currentEndDate || new Date()),
        isActive: memberData.isActive ?? true,
        isPaused: memberData.isPaused ?? false,
        pauseCount: memberData.pauseCount ?? 0,
        remainingVisits: memberData.remainingVisits || null,
      })
      .returning()

    // Create payment record if payment data is provided
    if (paymentData && paymentData.amount && paymentData.planId) {
      await db
        .insert(payments)
        .values({
          memberId: newMember[0].id,
          planId: paymentData.planId,
          amount: paymentData.amount,
          paymentDate: new Date(paymentData.paymentDate || new Date()),
          paymentMethod: paymentData.paymentMethod || 'cash',
        })
    }

    return NextResponse.json(newMember[0], { status: 201 })
  } catch (error) {
    console.error('Error creating member:', error)
    return NextResponse.json(
      { error: 'Failed to create member' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const allMembers = await db
      .select()
      .from(members)
      .where(isNull(members.deletedAt))
      .orderBy(desc(members.createdAt))

    return NextResponse.json(allMembers)
  } catch (error) {
    console.error('Error fetching members:', error)
    return NextResponse.json(
      { error: 'Failed to fetch members' },
      { status: 500 }
    )
  }
}