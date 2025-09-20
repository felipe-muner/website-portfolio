import dotenvFlow from 'dotenv-flow'
dotenvFlow.config()

import { db } from '../lib/db'
import { members, payments, membershipPauses } from '../lib/db/schema'
import { eq } from 'drizzle-orm'

async function seedTestMembers() {
  try {
    console.log('👥 Seeding test members...')

    // Check if test members already exist
    const existingMembers = await db.select().from(members).where(eq(members.email, 'test1@example.com')).limit(1)

    if (existingMembers.length > 0) {
      console.log('📝 Test members already seeded, skipping...')
      return
    }

    const now = new Date()
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    const sixMonthsAgo = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000)
    const oneMonthFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
    const sixMonthsFromNow = new Date(now.getTime() + 180 * 24 * 60 * 60 * 1000)
    const oneDayFromNow = new Date(now.getTime() + 24 * 60 * 60 * 1000)
    const fiveDaysFromNow = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000)

    // Member 1: 1 month membership WITH payment
    const member1 = await db.insert(members).values({
      name: 'Alice Johnson',
      email: 'test1@example.com',
      phone: '+1234567001',
      planType: 'gym_only',
      planDuration: 1,
      startDate: oneMonthAgo,
      originalEndDate: oneMonthFromNow,
      currentEndDate: oneMonthFromNow,
      isActive: true,
      isPaused: false,
    }).returning()

    // Payment for Member 1
    await db.insert(payments).values({
      memberId: member1[0].id,
      amount: '50.00',
      paymentDate: oneMonthAgo,
      paymentMethod: 'card',
      paymentType: 'membership'
    })

    // Member 2: 6 months membership WITH payment (paused once)
    const member2 = await db.insert(members).values({
      name: 'Bob Smith',
      email: 'test2@example.com',
      phone: '+1234567002',
      planType: 'gym_only',
      planDuration: 6,
      startDate: sixMonthsAgo,
      originalEndDate: sixMonthsFromNow,
      currentEndDate: new Date(sixMonthsFromNow.getTime() + 7 * 24 * 60 * 60 * 1000), // Extended due to pause
      isActive: true,
      isPaused: false,
    }).returning()

    // Payment for Member 2
    await db.insert(payments).values({
      memberId: member2[0].id,
      amount: '250.00',
      paymentDate: sixMonthsAgo,
      paymentMethod: 'cash',
      paymentType: 'membership'
    })

    // Pause record for Member 2 (paused for 7 days)
    const pauseStart = new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000)
    const pauseEnd = new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000)
    await db.insert(membershipPauses).values({
      memberId: member2[0].id,
      pauseStartDate: pauseStart,
      pauseEndDate: pauseEnd,
      pauseReason: 'vacation'
    })

    // Member 3: 1 day pass WITHOUT payment (unpaid)
    await db.insert(members).values({
      name: 'Charlie Brown',
      email: 'test3@example.com',
      phone: '+1234567003',
      planType: 'day_pass',
      planDuration: null,
      startDate: now,
      originalEndDate: oneDayFromNow,
      currentEndDate: oneDayFromNow,
      isActive: true,
      isPaused: false,
    })

    // Member 4: 5 day pass WITHOUT payment (used 3 times)
    const member4 = await db.insert(members).values({
      name: 'Diana Prince',
      email: 'test4@example.com',
      phone: '+1234567004',
      planType: 'gym_5pass',
      planDuration: null,
      startDate: now,
      originalEndDate: fiveDaysFromNow,
      currentEndDate: fiveDaysFromNow,
      isActive: true,
      isPaused: false,
      remainingVisits: 2, // Started with 5, used 3, remaining 2
    }).returning()

    console.log('✅ Successfully seeded 4 test members:')
    console.log('   📋 Alice Johnson - 1 month membership (PAID)')
    console.log('   📋 Bob Smith - 6 months membership (PAID, was paused)')
    console.log('   📋 Charlie Brown - 1 day pass (UNPAID)')
    console.log('   📋 Diana Prince - 5 day pass (UNPAID, 3/5 visits used)')

  } catch (error) {
    console.error('❌ Error seeding test members:', error)
    console.error('Make sure the database is running and accessible')
    process.exit(1)
  }
}

if (require.main === module) {
  seedTestMembers()
}

export { seedTestMembers }