import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { plans } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const plan = await db
      .select()
      .from(plans)
      .where(eq(plans.id, id))
      .limit(1)

    if (plan.length === 0) {
      return NextResponse.json(
        { error: 'Plan not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(plan[0])
  } catch (error) {
    console.error('Error fetching plan:', error)
    return NextResponse.json(
      { error: 'Failed to fetch plan' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const data = await request.json()

    const updatedPlan = await db
      .update(plans)
      .set({
        name: data.name,
        planType: data.planType,
        price: data.price,
        priceThaiDiscount: data.priceThaiDiscount || null,
        duration: data.duration || null,
        visitLimit: data.visitLimit || null,
        planCategory: data.planCategory,
        isActive: data.isActive,
        isDropIn: data.isDropIn,
        description: data.description || null,
        updatedAt: new Date(),
      })
      .where(eq(plans.id, id))
      .returning()

    if (updatedPlan.length === 0) {
      return NextResponse.json(
        { error: 'Plan not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(updatedPlan[0])
  } catch (error) {
    console.error('Error updating plan:', error)
    return NextResponse.json(
      { error: 'Failed to update plan' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Soft delete by setting isActive to false
    const deletedPlan = await db
      .update(plans)
      .set({
        isActive: false,
        updatedAt: new Date(),
      })
      .where(eq(plans.id, id))
      .returning()

    if (deletedPlan.length === 0) {
      return NextResponse.json(
        { error: 'Plan not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ message: 'Plan deactivated successfully' })
  } catch (error) {
    console.error('Error deleting plan:', error)
    return NextResponse.json(
      { error: 'Failed to delete plan' },
      { status: 500 }
    )
  }
}