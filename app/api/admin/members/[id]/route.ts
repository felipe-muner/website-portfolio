import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { members } from '@/lib/db/schema'
import { eq, and, isNull } from 'drizzle-orm'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: memberId } = await params

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

    return NextResponse.json(member[0])
  } catch (error) {
    console.error('Error fetching member:', error)
    return NextResponse.json(
      { error: 'Failed to fetch member' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: memberId } = await params
    const data = await request.json()

    const updatedMember = await db
      .update(members)
      .set({
        name: data.name,
        email: data.email || null,
        phone: data.phone || null,
        passportId: data.passportId || null,
        nationalityId: data.nationalityId || null,
        planType: data.planType,
        planDuration: data.planDuration,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        originalEndDate: data.originalEndDate ? new Date(data.originalEndDate) : undefined,
        currentEndDate: data.currentEndDate ? new Date(data.currentEndDate) : undefined,
        isActive: data.isActive,
        isPaused: data.isPaused,
        pauseCount: data.pauseCount,
        usedVisits: data.usedVisits,
        updatedAt: new Date(),
      })
      .where(and(eq(members.id, memberId), isNull(members.deletedAt)))
      .returning()

    if (updatedMember.length === 0) {
      return NextResponse.json(
        { error: 'Member not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(updatedMember[0])
  } catch (error) {
    console.error('Error updating member:', error)
    return NextResponse.json(
      { error: 'Failed to update member' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: memberId } = await params

    const deletedMember = await db
      .update(members)
      .set({
        deletedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(and(eq(members.id, memberId), isNull(members.deletedAt)))
      .returning()

    if (deletedMember.length === 0) {
      return NextResponse.json(
        { error: 'Member not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ message: 'Member deleted successfully' })
  } catch (error) {
    console.error('Error deleting member:', error)
    return NextResponse.json(
      { error: 'Failed to delete member' },
      { status: 500 }
    )
  }
}