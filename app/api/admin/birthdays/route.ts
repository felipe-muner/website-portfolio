import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { members } from '@/lib/db/schema'
import { isNull, and, isNotNull, eq } from 'drizzle-orm'

export async function GET() {
  try {
    // Get all active members with birthdays
    const allMembers = await db
      .select({
        id: members.id,
        name: members.name,
        email: members.email,
        phone: members.phone,
        birthday: members.birthday,
      })
      .from(members)
      .where(
        and(
          isNull(members.deletedAt),
          eq(members.isActive, true),
          isNotNull(members.birthday)
        )
      )

    // Filter for today's birthdays using JavaScript (same logic as members table)
    const today = new Date()
    const birthdayMembers = allMembers.filter(member => {
      if (!member.birthday) return false

      const birthDate = new Date(member.birthday)
      return (
        today.getMonth() === birthDate.getMonth() &&
        today.getDate() === birthDate.getDate()
      )
    })

    const membersWithAge = birthdayMembers.map(member => {
      if (!member.birthday) {
        return { ...member, age: 0 }
      }

      const today = new Date()
      const birthDate = new Date(member.birthday)
      let age = today.getFullYear() - birthDate.getFullYear()
      const monthDiff = today.getMonth() - birthDate.getMonth()

      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--
      }

      return {
        ...member,
        age: age,
      }
    })

    return NextResponse.json(membersWithAge)
  } catch (error) {
    console.error('Error fetching birthday members:', error)
    return NextResponse.json(
      { error: 'Failed to fetch birthday members' },
      { status: 500 }
    )
  }
}