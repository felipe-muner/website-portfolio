import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { members } from '@/lib/db/schema'
import { eq, desc, isNull } from 'drizzle-orm'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    const newMember = await db
      .insert(members)
      .values({
        name: data.name,
        email: data.email || null,
        phone: data.phone || null,
        passportId: data.passportId || null,
        planType: data.planType,
        planDuration: data.planDuration,
        startDate: new Date(data.startDate),
        originalEndDate: new Date(data.originalEndDate),
        currentEndDate: new Date(data.currentEndDate),
        isActive: data.isActive ?? true,
        isPaused: data.isPaused ?? false,
        pauseCount: data.pauseCount ?? 0,
        remainingVisits: data.remainingVisits,
      })
      .returning()

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