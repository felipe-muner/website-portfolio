import dotenvFlow from 'dotenv-flow'
dotenvFlow.config()

import { db } from '../lib/db'
import { members, payments, membershipPauses, dayPasses } from '../lib/db/schema'
import { eq } from 'drizzle-orm'
import { type InferInsertModel } from 'drizzle-orm'
import { addDays, subDays, addMonths, subMonths, subYears } from 'date-fns'

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

    const testMembers: TestMemberData[] = [
      // 1. Active gym-only 1 month (PAID) - HAS BIRTHDAY TODAY!
      {
        name: 'Alice Johnson', email: 'member01@test.com', phone: '+1234567001',
        birthday: subYears(now, 20), // 20 years old, birthday today!
        planType: 'gym_only' as const, planDuration: 1, startDate: subDays(now, 15),
        originalEndDate: addDays(now, 15), currentEndDate: addDays(now, 15),
        isActive: true, isPaused: false, payment: { amount: '50.00', method: 'card' as const }
      },

      // 2. Active gym-only 3 months (PAID)
      {
        name: 'Bob Smith', email: 'member02@test.com', phone: '+1234567002',
        birthday: subYears(now, 28),
        planType: 'gym_only' as const, planDuration: 3, startDate: subMonths(now, 1),
        originalEndDate: addMonths(now, 2), currentEndDate: addMonths(now, 2),
        isActive: true, isPaused: false, payment: { amount: '130.00', method: 'card' as const }
      },

      // 3. Active gym-only 6 months with pause history (PAID)
      {
        name: 'Carol Davis', email: 'member03@test.com', phone: '+1234567003',
        birthday: subYears(now, 35),
        planType: 'gym_only' as const, planDuration: 6, startDate: subMonths(now, 2),
        originalEndDate: addMonths(now, 4), currentEndDate: addDays(addMonths(now, 4), 7), // Extended due to pause
        isActive: true, isPaused: false, payment: { amount: '240.00', method: 'cash' as const },
        pauseHistory: { start: subDays(now, 20), end: subDays(now, 13), reason: 'vacation' }
      },

      // 4. Active gym-only 12 months (PAID)
      {
        name: 'David Wilson', email: 'member04@test.com', phone: '+1234567004',
        birthday: subYears(now, 42),
        planType: 'gym_only' as const, planDuration: 12, startDate: subMonths(now, 3),
        originalEndDate: addMonths(now, 9), currentEndDate: addMonths(now, 9),
        isActive: true, isPaused: false, payment: { amount: '480.00', method: 'card' as const }
      },

      // 5. Currently PAUSED gym-only member (PAID)
      {
        name: 'Eva Martinez', email: 'member05@test.com', phone: '+1234567005',
        birthday: subYears(now, 31),
        planType: 'gym_only' as const, planDuration: 6, startDate: subDays(now, 45),
        originalEndDate: addMonths(now, 4), currentEndDate: addMonths(now, 4),
        isActive: true, isPaused: true, payment: { amount: '240.00', method: 'card' as const },
        activePause: { start: subDays(now, 5), reason: 'medical' }
      },

      // 6. Expired gym-only member (PAID)
      {
        name: 'Frank Brown', email: 'member06@test.com', phone: '+1234567006',
        planType: 'gym_only' as const, planDuration: 1, startDate: subDays(now, 45),
        originalEndDate: subDays(now, 15), currentEndDate: subDays(now, 15),
        isActive: false, isPaused: false, payment: { amount: '50.00', method: 'card' as const }
      },

      // 7. Active gym_crossfit 1 month (PAID)
      {
        name: 'Grace Lee', email: 'member07@test.com', phone: '+1234567007',
        birthday: subYears(now, 26),
        planType: 'gym_crossfit' as const, planDuration: 1, startDate: subDays(now, 10),
        originalEndDate: addDays(now, 20), currentEndDate: addDays(now, 20),
        isActive: true, isPaused: false, payment: { amount: '90.00', method: 'card' as const }
      },

      // 8. Active gym_crossfit 6 months (PAID)
      {
        name: 'Henry Taylor', email: 'member08@test.com', phone: '+1234567008',
        birthday: subYears(now, 38),
        planType: 'gym_crossfit' as const, planDuration: 6, startDate: subMonths(now, 1),
        originalEndDate: addMonths(now, 5), currentEndDate: addMonths(now, 5),
        isActive: true, isPaused: false, payment: { amount: '480.00', method: 'card' as const }
      },

      // 9. Active gym_5pass with 5 visits remaining (PAID)
      {
        name: 'Ivy Chen', email: 'member09@test.com', phone: '+1234567009',
        birthday: subYears(now, 24),
        planType: 'gym_5pass' as const, planDuration: null, startDate: subDays(now, 2),
        originalEndDate: addDays(now, 28), currentEndDate: addDays(now, 28),
        isActive: true, isPaused: false, remainingVisits: 5,
        payment: { amount: '75.00', method: 'card' as const }
      },

      // 10. Active gym_5pass with 2 visits remaining (PAID)
      {
        name: 'Jack Wilson', email: 'member10@test.com', phone: '+1234567010',
        birthday: subYears(now, 29),
        planType: 'gym_5pass' as const, planDuration: null, startDate: subDays(now, 10),
        originalEndDate: addDays(now, 20), currentEndDate: addDays(now, 20),
        isActive: true, isPaused: false, remainingVisits: 2,
        payment: { amount: '75.00', method: 'card' as const }
      },

      // 11. Expired gym_5pass with 0 visits (PAID)
      {
        name: 'Kate Davis', email: 'member11@test.com', phone: '+1234567011',
        birthday: subYears(now, 33),
        planType: 'gym_5pass' as const, planDuration: null, startDate: subDays(now, 35),
        originalEndDate: subDays(now, 5), currentEndDate: subDays(now, 5),
        isActive: false, isPaused: false, remainingVisits: 0,
        payment: { amount: '75.00', method: 'cash' as const }
      },

      // 12. Active fitness_5pass with 4 visits remaining (PAID)
      {
        name: 'Liam Rodriguez', email: 'member12@test.com', phone: '+1234567012',
        birthday: subYears(now, 27),
        planType: 'fitness_5pass' as const, planDuration: null, startDate: subDays(now, 3),
        originalEndDate: addDays(now, 27), currentEndDate: addDays(now, 27),
        isActive: true, isPaused: false, remainingVisits: 4,
        payment: { amount: '60.00', method: 'cash' as const }
      },

      // 13. Active crossfit_5pass with 3 visits remaining (PAID)
      {
        name: 'Mia Johnson', email: 'member13@test.com', phone: '+1234567013',
        birthday: subYears(now, 22),
        planType: 'crossfit_5pass' as const, planDuration: null, startDate: subDays(now, 7),
        originalEndDate: addDays(now, 23), currentEndDate: addDays(now, 23),
        isActive: true, isPaused: false, remainingVisits: 3,
        payment: { amount: '85.00', method: 'card' as const }
      },

      // 14. UNPAID gym-only 1 month
      {
        name: 'Noah Garcia', email: 'member14@test.com', phone: '+1234567014',
        birthday: subYears(now, 30),
        planType: 'gym_only' as const, planDuration: 1, startDate: subDays(now, 5),
        originalEndDate: addDays(now, 25), currentEndDate: addDays(now, 25),
        isActive: true, isPaused: false
      },

      // 15. UNPAID gym_crossfit 3 months
      {
        name: 'Olivia Anderson', email: 'member15@test.com', phone: '+1234567015',
        birthday: subYears(now, 25),
        planType: 'gym_crossfit' as const, planDuration: 3, startDate: subDays(now, 10),
        originalEndDate: addMonths(now, 2.5), currentEndDate: addMonths(now, 2.5),
        isActive: true, isPaused: false
      },

      // 16. UNPAID gym_5pass with 5 visits
      {
        name: 'Paul Martinez', email: 'member16@test.com', phone: '+1234567016',
        planType: 'gym_5pass' as const, planDuration: null, startDate: subDays(now, 1),
        originalEndDate: addDays(now, 29), currentEndDate: addDays(now, 29),
        isActive: true, isPaused: false, remainingVisits: 5
      },

      // 17. UNPAID fitness_5pass with 3 visits remaining
      {
        name: 'Quinn White', email: 'member17@test.com', phone: '+1234567017',
        planType: 'fitness_5pass' as const, planDuration: null, startDate: subDays(now, 8),
        originalEndDate: addDays(now, 22), currentEndDate: addDays(now, 22),
        isActive: true, isPaused: false, remainingVisits: 3
      },

      // 18. Member with multiple pause history (PAID)
      {
        name: 'Ryan Thompson', email: 'member18@test.com', phone: '+1234567018',
        birthday: subYears(now, 36),
        planType: 'gym_only' as const, planDuration: 6, startDate: subDays(now, 100),
        originalEndDate: addDays(now, 65), currentEndDate: addDays(now, 79), // Extended due to pauses
        isActive: true, isPaused: false, payment: { amount: '240.00', method: 'card' as const },
        pauseHistory: { start: subDays(now, 50), end: subDays(now, 36), reason: 'travel' }
      },

      // 19. Recently joined gym_crossfit (PAID)
      {
        name: 'Sophia Kim', email: 'member19@test.com', phone: '+1234567019',
        birthday: subYears(now, 23),
        planType: 'gym_crossfit' as const, planDuration: 12, startDate: subDays(now, 3),
        originalEndDate: addMonths(now, 12), currentEndDate: addMonths(now, 12),
        isActive: true, isPaused: false, payment: { amount: '960.00', method: 'card' as const }
      },

      // 20. About to expire gym-only member (PAID)
      {
        name: 'Tyler Scott', email: 'member20@test.com', phone: '+1234567020',
        planType: 'gym_only' as const, planDuration: 1, startDate: subDays(now, 28),
        originalEndDate: addDays(now, 2), currentEndDate: addDays(now, 2),
        isActive: true, isPaused: false, payment: { amount: '50.00', method: 'card' as const }
      }
    ]

    // Create members and their related data
    for (const memberData of testMembers) {
      // Create member
      const memberInsert: NewMember = {
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
      }

      const [newMember] = await db.insert(members).values(memberInsert).returning()

      // Create payment if exists
      if (memberData.payment) {
        const paymentInsert: NewPayment = {
          memberId: newMember.id,
          amount: memberData.payment.amount,
          paymentDate: memberData.startDate,
          paymentMethod: memberData.payment.method,
          paymentType: 'membership'
        }
        await db.insert(payments).values(paymentInsert)
      }

      // Create pause history if exists
      if (memberData.pauseHistory) {
        const pauseInsert: NewMembershipPause = {
          memberId: newMember.id,
          pauseStartDate: memberData.pauseHistory.start,
          pauseEndDate: memberData.pauseHistory.end,
          pauseReason: memberData.pauseHistory.reason
        }
        await db.insert(membershipPauses).values(pauseInsert)
      }

      // Create active pause if exists
      if (memberData.activePause) {
        const activePauseInsert: NewMembershipPause = {
          memberId: newMember.id,
          pauseStartDate: memberData.activePause.start,
          pauseEndDate: null, // Still active
          pauseReason: memberData.activePause.reason
        }
        await db.insert(membershipPauses).values(activePauseInsert)
      }
    }

    // Create some day passes (not tied to members)
    const dayPassData = [
      { name: 'Walk-in Customer 1', passType: 'gym_dropin' as const, price: '15.00', used: false },
      { name: 'Walk-in Customer 2', passType: 'crossfit_dropin' as const, price: '25.00', used: true },
      { name: 'Walk-in Customer 3', passType: 'fitness_class' as const, price: '20.00', used: false },
      { name: 'Walk-in Customer 4', passType: 'open_gym' as const, price: '12.00', used: true }
    ]

    for (const dayPass of dayPassData) {
      const randomPurchaseDays = Math.floor(Math.random() * 7)
      const randomUsedDays = Math.floor(Math.random() * 5)

      const dayPassInsert: NewDayPass = {
        customerName: dayPass.name,
        passType: dayPass.passType,
        pricePaid: dayPass.price,
        purchaseDate: subDays(now, randomPurchaseDays),
        isUsed: dayPass.used,
        usedAt: dayPass.used ? subDays(now, randomUsedDays) : null
      }

      await db.insert(dayPasses).values(dayPassInsert)
    }

    console.log('✅ Successfully seeded 20 diverse test members:')
    console.log('   📊 Plan types: gym_only, gym_crossfit, gym_5pass, fitness_5pass, crossfit_5pass')
    console.log('   💰 Payment status: 16 paid, 4 unpaid')
    console.log('   ⏸️  Membership status: 1 currently paused, 3 with pause history')
    console.log('   📅 Membership status: active, expired, about to expire')
    console.log('   🎫 Plus 4 day pass records for walk-in customers')

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