import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { members } from '@/lib/db/schema'
import { isNull, sql } from 'drizzle-orm'

export async function GET() {
  try {
    const birthdayMembers = await db
      .select({
        id: members.id,
        name: members.name,
        email: members.email,
        phone: members.phone,
        birthday: members.birthday,
      })
      .from(members)
      .where(
        sql`${isNull(members.deletedAt)} AND ${members.isActive} = true AND ${members.birthday} IS NOT NULL AND EXTRACT(MONTH FROM ${members.birthday}) = EXTRACT(MONTH FROM CURRENT_DATE) AND EXTRACT(DAY FROM ${members.birthday}) = EXTRACT(DAY FROM CURRENT_DATE)`
      )

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