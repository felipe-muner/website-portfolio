import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { members } from '@/lib/db/schema'
import { eq, and, isNull, or } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')
    const passportId = searchParams.get('passportId')

    if (!email && !passportId) {
      return NextResponse.json(
        { error: 'Email or passport ID is required' },
        { status: 400 }
      )
    }

    let whereCondition
    if (email && passportId) {
      whereCondition = and(
        or(
          eq(members.email, email),
          eq(members.passportId, passportId)
        ),
        isNull(members.deletedAt)
      )
    } else if (email) {
      whereCondition = and(
        eq(members.email, email),
        isNull(members.deletedAt)
      )
    } else if (passportId) {
      whereCondition = and(
        eq(members.passportId, passportId),
        isNull(members.deletedAt)
      )
    }

    const member = await db
      .select()
      .from(members)
      .where(whereCondition)
      .limit(1)

    if (member.length === 0) {
      return NextResponse.json(
        { error: 'Member not found' },
        { status: 404 }
      )
    }

    // Check if membership is expired
    const currentDate = new Date()
    const endDate = new Date(member[0].currentEndDate)
    const isExpired = currentDate > endDate

    return NextResponse.json({
      ...member[0],
      isExpired,
      daysRemaining: Math.ceil((endDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24))
    })
  } catch (error) {
    console.error('Error looking up member:', error)
    return NextResponse.json(
      { error: 'Failed to lookup member' },
      { status: 500 }
    )
  }
}