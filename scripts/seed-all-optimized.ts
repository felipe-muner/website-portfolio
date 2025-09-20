import dotenvFlow from 'dotenv-flow'
dotenvFlow.config()

import { db } from '../lib/db'
import { adminUsers, nationalities, members, payments, membershipPauses, dayPasses } from '../lib/db/schema'
import { eq } from 'drizzle-orm'
import { type InferInsertModel } from 'drizzle-orm'
import { addDays, subDays, addMonths, subMonths, subYears, setMonth, setDate } from 'date-fns'
import { nationalitiesWithFlags } from './nationalities-with-flags'

type NewMember = InferInsertModel<typeof members>
type NewPayment = InferInsertModel<typeof payments>
type NewMembershipPause = InferInsertModel<typeof membershipPauses>
type NewDayPass = InferInsertModel<typeof dayPasses>

type PlanType = 'gym_only' | 'gym_crossfit' | 'gym_5pass' | 'fitness_5pass' | 'crossfit_5pass'
type PaymentMethod = 'cash' | 'card'

type TestMemberData = {
  name: string
  email: string
  phone: string
  birthday?: Date
  planType: PlanType
  planDuration: number | null
  startDate: Date
  originalEndDate: Date
  currentEndDate: Date
  isActive: boolean
  isPaused: boolean
  remainingVisits?: number
  payment?: {
    amount: string
    method: PaymentMethod
  }
  pauseHistory?: {
    start: Date
    end: Date
    reason: string
  }
  activePause?: {
    start: Date
    reason: string
  }
}

async function createInitialAdmin() {
  const email = process.env.INITIAL_ADMIN_EMAIL

  if (!email) {
    console.error('Please set INITIAL_ADMIN_EMAIL environment variable')
    process.exit(1)
  }

  try {
    const existingAdmin = await db
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.email, email))
      .limit(1)

    if (existingAdmin.length > 0) {
      console.log('Admin user already exists')
      return
    }

    const newAdmin = await db
      .insert(adminUsers)
      .values({
        email: email,
        name: 'Initial Admin',
        role: 'owner',
        isActive: true,
      })
      .returning()

    console.log('Created initial admin user:', newAdmin[0])
  } catch (error) {
    console.error('Error creating admin user:', error)
    throw error
  }
}

async function seedNationalities() {
  try {
    console.log('🌍 Seeding nationalities...')

    // Check if nationalities already exist
    const existingNationalities = await db.select().from(nationalities).limit(1)

    if (existingNationalities.length > 0) {
      console.log('📝 Nationalities already seeded, skipping...')
      return
    }

    // Insert all nationalities
    await db.insert(nationalities).values(nationalitiesWithFlags)

    console.log(`✅ Successfully seeded ${nationalitiesWithFlags.length} nationalities`)
  } catch (error) {
    console.error('❌ Error seeding nationalities:', error)
    throw error
  }
}

function generateRandomBirthday(): Date {
  const now = new Date()
  const age = 18 + Math.floor(Math.random() * 42) // Random age between 18-60
  const baseYear = now.getFullYear() - age

  // Random month (0-11) and day (1-28 to avoid leap year issues)
  const month = Math.floor(Math.random() * 12)
  const day = 1 + Math.floor(Math.random() * 28)

  return new Date(baseYear, month, day)
}

async function seedTestMembers() {
  try {
    console.log('👥 Seeding 20 diverse test members...')

    // Check if test members already exist
    const existingMembers = await db.select().from(members).where(eq(members.email, 'member01@test.com')).limit(1)

    if (existingMembers.length > 0) {
      console.log('📝 Test members already seeded, skipping...')
      return
    }

    const now = new Date()

    // Create a shared birthday for exactly 2 members (today's date but different years)
    const sharedBirthday1 = subYears(now, 25) // 25 years old
    const sharedBirthday2 = subYears(now, 32) // 32 years old

    const testMembers: TestMemberData[] = [
      // 1. Active gym-only 1 month (PAID) - HAS BIRTHDAY TODAY!
      {
        name: 'Alice Johnson', email: 'member01@test.com', phone: '+1234567001',
        birthday: sharedBirthday1, // Shared birthday - 25 years old
        planType: 'gym_only' as const, planDuration: 1, startDate: subDays(now, 15),
        originalEndDate: addDays(now, 15), currentEndDate: addDays(now, 15),
        isActive: true, isPaused: false, payment: { amount: '50.00', method: 'card' as const }
      },

      // 2. Active gym-only 3 months (PAID) - ALSO HAS BIRTHDAY TODAY!
      {
        name: 'Bob Smith', email: 'member02@test.com', phone: '+1234567002',
        birthday: sharedBirthday2, // Shared birthday - 32 years old
        planType: 'gym_only' as const, planDuration: 3, startDate: subMonths(now, 1),
        originalEndDate: addMonths(now, 2), currentEndDate: addMonths(now, 2),
        isActive: true, isPaused: false, payment: { amount: '130.00', method: 'card' as const }
      },

      // 3-20: All other members get random birthdays
      {
        name: 'Carol Davis', email: 'member03@test.com', phone: '+1234567003',
        birthday: generateRandomBirthday(),
        planType: 'gym_only' as const, planDuration: 6, startDate: subMonths(now, 2),
        originalEndDate: addMonths(now, 4), currentEndDate: addDays(addMonths(now, 4), 7),
        isActive: true, isPaused: false, payment: { amount: '240.00', method: 'cash' as const },
        pauseHistory: { start: subDays(now, 20), end: subDays(now, 13), reason: 'vacation' }
      },

      {
        name: 'David Wilson', email: 'member04@test.com', phone: '+1234567004',
        birthday: generateRandomBirthday(),
        planType: 'gym_only' as const, planDuration: 12, startDate: subMonths(now, 3),
        originalEndDate: addMonths(now, 9), currentEndDate: addMonths(now, 9),
        isActive: true, isPaused: false, payment: { amount: '480.00', method: 'card' as const }
      },

      {
        name: 'Eva Martinez', email: 'member05@test.com', phone: '+1234567005',
        birthday: generateRandomBirthday(),
        planType: 'gym_only' as const, planDuration: 6, startDate: subDays(now, 45),
        originalEndDate: addMonths(now, 4), currentEndDate: addMonths(now, 4),
        isActive: true, isPaused: true, payment: { amount: '240.00', method: 'card' as const },
        activePause: { start: subDays(now, 5), reason: 'medical' }
      },

      {
        name: 'Frank Brown', email: 'member06@test.com', phone: '+1234567006',
        birthday: generateRandomBirthday(),
        planType: 'gym_only' as const, planDuration: 1, startDate: subDays(now, 45),
        originalEndDate: subDays(now, 15), currentEndDate: subDays(now, 15),
        isActive: false, isPaused: false, payment: { amount: '50.00', method: 'card' as const }
      },

      {
        name: 'Grace Lee', email: 'member07@test.com', phone: '+1234567007',
        birthday: generateRandomBirthday(),
        planType: 'gym_crossfit' as const, planDuration: 1, startDate: subDays(now, 10),
        originalEndDate: addDays(now, 20), currentEndDate: addDays(now, 20),
        isActive: true, isPaused: false, payment: { amount: '90.00', method: 'card' as const }
      },

      {
        name: 'Henry Taylor', email: 'member08@test.com', phone: '+1234567008',
        birthday: generateRandomBirthday(),
        planType: 'gym_crossfit' as const, planDuration: 6, startDate: subMonths(now, 1),
        originalEndDate: addMonths(now, 5), currentEndDate: addMonths(now, 5),
        isActive: true, isPaused: false, payment: { amount: '480.00', method: 'card' as const }
      },

      {
        name: 'Ivy Chen', email: 'member09@test.com', phone: '+1234567009',
        birthday: generateRandomBirthday(),
        planType: 'gym_5pass' as const, planDuration: null, startDate: subDays(now, 2),
        originalEndDate: addDays(now, 28), currentEndDate: addDays(now, 28),
        isActive: true, isPaused: false, remainingVisits: 5,
        payment: { amount: '75.00', method: 'card' as const }
      },

      {
        name: 'Jack Wilson', email: 'member10@test.com', phone: '+1234567010',
        birthday: generateRandomBirthday(),
        planType: 'gym_5pass' as const, planDuration: null, startDate: subDays(now, 10),
        originalEndDate: addDays(now, 20), currentEndDate: addDays(now, 20),
        isActive: true, isPaused: false, remainingVisits: 2,
        payment: { amount: '75.00', method: 'card' as const }
      },

      {
        name: 'Kate Davis', email: 'member11@test.com', phone: '+1234567011',
        birthday: generateRandomBirthday(),
        planType: 'gym_5pass' as const, planDuration: null, startDate: subDays(now, 35),
        originalEndDate: subDays(now, 5), currentEndDate: subDays(now, 5),
        isActive: false, isPaused: false, remainingVisits: 0,
        payment: { amount: '75.00', method: 'cash' as const }
      },

      {
        name: 'Liam Rodriguez', email: 'member12@test.com', phone: '+1234567012',
        birthday: generateRandomBirthday(),
        planType: 'fitness_5pass' as const, planDuration: null, startDate: subDays(now, 3),
        originalEndDate: addDays(now, 27), currentEndDate: addDays(now, 27),
        isActive: true, isPaused: false, remainingVisits: 4,
        payment: { amount: '60.00', method: 'cash' as const }
      },

      {
        name: 'Mia Johnson', email: 'member13@test.com', phone: '+1234567013',
        birthday: generateRandomBirthday(),
        planType: 'crossfit_5pass' as const, planDuration: null, startDate: subDays(now, 7),
        originalEndDate: addDays(now, 23), currentEndDate: addDays(now, 23),
        isActive: true, isPaused: false, remainingVisits: 3,
        payment: { amount: '85.00', method: 'card' as const }
      },

      {
        name: 'Noah Garcia', email: 'member14@test.com', phone: '+1234567014',
        birthday: generateRandomBirthday(),
        planType: 'gym_only' as const, planDuration: 1, startDate: subDays(now, 5),
        originalEndDate: addDays(now, 25), currentEndDate: addDays(now, 25),
        isActive: true, isPaused: false
      },

      {
        name: 'Olivia Anderson', email: 'member15@test.com', phone: '+1234567015',
        birthday: generateRandomBirthday(),
        planType: 'gym_crossfit' as const, planDuration: 3, startDate: subDays(now, 10),
        originalEndDate: addMonths(now, 2.5), currentEndDate: addMonths(now, 2.5),
        isActive: true, isPaused: false
      },

      {
        name: 'Paul Martinez', email: 'member16@test.com', phone: '+1234567016',
        birthday: generateRandomBirthday(),
        planType: 'gym_5pass' as const, planDuration: null, startDate: subDays(now, 1),
        originalEndDate: addDays(now, 29), currentEndDate: addDays(now, 29),
        isActive: true, isPaused: false, remainingVisits: 5
      },

      {
        name: 'Quinn White', email: 'member17@test.com', phone: '+1234567017',
        birthday: generateRandomBirthday(),
        planType: 'fitness_5pass' as const, planDuration: null, startDate: subDays(now, 8),
        originalEndDate: addDays(now, 22), currentEndDate: addDays(now, 22),
        isActive: true, isPaused: false, remainingVisits: 3
      },

      {
        name: 'Ryan Thompson', email: 'member18@test.com', phone: '+1234567018',
        birthday: generateRandomBirthday(),
        planType: 'gym_only' as const, planDuration: 6, startDate: subDays(now, 100),
        originalEndDate: addDays(now, 65), currentEndDate: addDays(now, 79),
        isActive: true, isPaused: false, payment: { amount: '240.00', method: 'card' as const },
        pauseHistory: { start: subDays(now, 50), end: subDays(now, 36), reason: 'travel' }
      },

      {
        name: 'Sophia Kim', email: 'member19@test.com', phone: '+1234567019',
        birthday: generateRandomBirthday(),
        planType: 'gym_crossfit' as const, planDuration: 12, startDate: subDays(now, 3),
        originalEndDate: addMonths(now, 12), currentEndDate: addMonths(now, 12),
        isActive: true, isPaused: false, payment: { amount: '960.00', method: 'card' as const }
      },

      {
        name: 'Tyler Scott', email: 'member20@test.com', phone: '+1234567020',
        birthday: generateRandomBirthday(),
        planType: 'gym_only' as const, planDuration: 1, startDate: subDays(now, 28),
        originalEndDate: addDays(now, 2), currentEndDate: addDays(now, 2),
        isActive: true, isPaused: false, payment: { amount: '50.00', method: 'card' as const }
      }
    ]

    // Prepare all member inserts
    const memberInserts: NewMember[] = testMembers.map(memberData => ({
      name: memberData.name,
      email: memberData.email,
      phone: memberData.phone,
      birthday: memberData.birthday || null,
      planType: memberData.planType,
      planDuration: memberData.planDuration,
      startDate: memberData.startDate,
      originalEndDate: memberData.originalEndDate,
      currentEndDate: memberData.currentEndDate,
      isActive: memberData.isActive,
      isPaused: memberData.isPaused,
      remainingVisits: memberData.remainingVisits || null
    }))

    // Insert all members at once
    const newMembers = await db.insert(members).values(memberInserts).returning()

    // Prepare related data arrays
    const paymentInserts: NewPayment[] = []
    const pauseInserts: NewMembershipPause[] = []

    testMembers.forEach((memberData, index) => {
      const memberId = newMembers[index].id

      // Add payment if exists
      if (memberData.payment) {
        paymentInserts.push({
          memberId,
          amount: memberData.payment.amount,
          paymentDate: memberData.startDate,
          paymentMethod: memberData.payment.method,
          paymentType: 'membership'
        })
      }

      // Add pause history if exists
      if (memberData.pauseHistory) {
        pauseInserts.push({
          memberId,
          pauseStartDate: memberData.pauseHistory.start,
          pauseEndDate: memberData.pauseHistory.end,
          pauseReason: memberData.pauseHistory.reason
        })
      }

      // Add active pause if exists
      if (memberData.activePause) {
        pauseInserts.push({
          memberId,
          pauseStartDate: memberData.activePause.start,
          pauseEndDate: null,
          pauseReason: memberData.activePause.reason
        })
      }
    })

    // Insert all related data in parallel
    const relatedDataPromises = []

    if (paymentInserts.length > 0) {
      relatedDataPromises.push(db.insert(payments).values(paymentInserts))
    }

    if (pauseInserts.length > 0) {
      relatedDataPromises.push(db.insert(membershipPauses).values(pauseInserts))
    }

    await Promise.all(relatedDataPromises)

    // Create day passes
    const dayPassData = [
      { name: 'Walk-in Customer 1', passType: 'gym_dropin' as const, price: '15.00', used: false },
      { name: 'Walk-in Customer 2', passType: 'crossfit_dropin' as const, price: '25.00', used: true },
      { name: 'Walk-in Customer 3', passType: 'fitness_class' as const, price: '20.00', used: false },
      { name: 'Walk-in Customer 4', passType: 'open_gym' as const, price: '12.00', used: true }
    ]

    const dayPassInserts: NewDayPass[] = dayPassData.map(dayPass => {
      const randomPurchaseDays = Math.floor(Math.random() * 7)
      const randomUsedDays = Math.floor(Math.random() * 5)

      return {
        customerName: dayPass.name,
        passType: dayPass.passType,
        pricePaid: dayPass.price,
        purchaseDate: subDays(now, randomPurchaseDays),
        isUsed: dayPass.used,
        usedAt: dayPass.used ? subDays(now, randomUsedDays) : null
      }
    })

    await db.insert(dayPasses).values(dayPassInserts)

    console.log('✅ Successfully seeded 20 diverse test members:')
    console.log('   📊 Plan types: gym_only, gym_crossfit, gym_5pass, fitness_5pass, crossfit_5pass')
    console.log('   💰 Payment status: 16 paid, 4 unpaid')
    console.log('   ⏸️  Membership status: 1 currently paused, 3 with pause history')
    console.log('   📅 Membership status: active, expired, about to expire')
    console.log('   🎂 Birthdays: 2 people share today&apos;s birthday, 18 have random birthdays')
    console.log('   🎫 Plus 4 day pass records for walk-in customers')

  } catch (error) {
    console.error('❌ Error seeding test members:', error)
    throw error
  }
}

async function seedAllOptimized() {
  try {
    console.log('🚀 Starting optimized database seeding...')

    // Run all seeding operations in parallel for maximum speed
    await Promise.all([
      createInitialAdmin(),
      seedNationalities(),
      seedTestMembers()
    ])

    console.log('✅ All seeding operations completed successfully!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Error during seeding:', error)
    console.error('Make sure the database is running and accessible')
    process.exit(1)
  }
}

if (require.main === module) {
  seedAllOptimized()
}

export { seedAllOptimized }