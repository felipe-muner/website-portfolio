import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { plans } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const activeOnly = searchParams.get('active') === 'true'

    const baseQuery = db
      .select({
        id: plans.id,
        name: plans.name,
        planType: plans.planType,
        price: plans.price,
        priceThaiDiscount: plans.priceThaiDiscount,
        duration: plans.duration,
        visitLimit: plans.visitLimit,
        planCategory: plans.planCategory,
        isActive: plans.isActive,
        isDropIn: plans.isDropIn,
        description: plans.description,
        createdAt: plans.createdAt,
        updatedAt: plans.updatedAt,
      })
      .from(plans)

    const allPlans = activeOnly
      ? await baseQuery.where(eq(plans.isActive, true)).orderBy(plans.planCategory, plans.name)
      : await baseQuery.orderBy(plans.planCategory, plans.name)

    return NextResponse.json(allPlans)
  } catch (error) {
    console.error('Error fetching plans:', error)
    return NextResponse.json(
      { error: 'Failed to fetch plans' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    const newPlan = await db
      .insert(plans)
      .values({
        name: data.name,
        planType: data.planType,
        price: data.price,
        priceThaiDiscount: data.priceThaiDiscount || null,
        duration: data.duration || null,
        visitLimit: data.visitLimit || null,
        planCategory: data.planCategory,
        isActive: data.isActive ?? true,
        isDropIn: data.isDropIn ?? false,
        description: data.description || null,
      })
      .returning()

    return NextResponse.json(newPlan[0], { status: 201 })
  } catch (error) {
    console.error('Error creating plan:', error)
    return NextResponse.json(
      { error: 'Failed to create plan' },
      { status: 500 }
    )
  }
}