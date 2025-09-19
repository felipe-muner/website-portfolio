import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { members } from '@/lib/db/schema'
import { desc, isNull } from 'drizzle-orm'

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
        nationalityId: data.nationalityId || null,
        planType: data.planType || null,
        planDuration: data.planDuration || null,
        startDate: new Date(data.startDate || new Date()),
        originalEndDate: new Date(data.originalEndDate || new Date()),
        currentEndDate: new Date(data.currentEndDate || new Date()),
        isActive: data.isActive ?? true,
        isPaused: data.isPaused ?? false,
        pauseCount: data.pauseCount ?? 0,
        remainingVisits: data.remainingVisits || null,
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