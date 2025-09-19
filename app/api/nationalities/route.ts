import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { nationalities } from '@/lib/db/schema'
import { asc } from 'drizzle-orm'

export async function GET() {
  try {
    const allNationalities = await db
      .select({
        id: nationalities.id,
        name: nationalities.name,
        code: nationalities.code,
        flag: nationalities.flag,
      })
      .from(nationalities)
      .orderBy(asc(nationalities.name))

    return NextResponse.json(allNationalities)
  } catch (error) {
    console.error('Error fetching nationalities:', error)
    return NextResponse.json(
      { error: 'Failed to fetch nationalities' },
      { status: 500 }
    )
  }
}