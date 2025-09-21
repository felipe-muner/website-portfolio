import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { payments, members, plans } from '@/lib/db/schema'
import { eq, desc, and, isNull } from 'drizzle-orm'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: memberId } = await params

    // Verify member exists
    const member = await db
      .select()
      .from(members)
      .where(and(eq(members.id, memberId), isNull(members.deletedAt)))
      .limit(1)

    if (member.length === 0) {
      return NextResponse.json(
        { error: 'Member not found' },
        { status: 404 }
      )
    }

    // Fetch payments for the member with plan information
    const memberPayments = await db
      .select({
        id: payments.id,
        amount: payments.amount,
        paymentDate: payments.paymentDate,
        paymentMethod: payments.paymentMethod,
        planId: payments.planId,
        gymShare: payments.gymShare,
        crossfitShare: payments.crossfitShare,
        // Plan information
        planName: plans.name,
        planType: plans.planType,
        planCategory: plans.planCategory,
        isDropIn: plans.isDropIn,
      })
      .from(payments)
      .leftJoin(plans, eq(payments.planId, plans.id))
      .where(eq(payments.memberId, memberId))
      .orderBy(desc(payments.paymentDate))

    return NextResponse.json({
      payments: memberPayments
    })
  } catch (error) {
    console.error('Error fetching member payments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch payments' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: memberId } = await params
    const data = await request.json()

    // Verify member exists
    const member = await db
      .select()
      .from(members)
      .where(and(eq(members.id, memberId), isNull(members.deletedAt)))
      .limit(1)

    if (member.length === 0) {
      return NextResponse.json(
        { error: 'Member not found' },
        { status: 404 }
      )
    }

    // Create new payment record
    const newPayment = await db
      .insert(payments)
      .values({
        memberId,
        planId: data.planId || null,
        amount: data.amount,
        paymentDate: data.paymentDate ? new Date(data.paymentDate) : new Date(),
        paymentMethod: data.paymentMethod,
        gymShare: data.gymShare || null,
        crossfitShare: data.crossfitShare || null,
      })
      .returning()

    return NextResponse.json(newPayment[0], { status: 201 })
  } catch (error) {
    console.error('Error creating payment:', error)
    return NextResponse.json(
      { error: 'Failed to create payment' },
      { status: 500 }
    )
  }
}