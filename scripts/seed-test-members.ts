import dotenvFlow from 'dotenv-flow'
dotenvFlow.config()

import { db } from '../lib/db'
import { members, payments, membershipPauses, dayPasses } from '../lib/db/schema'
import { eq } from 'drizzle-orm'

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

    // Helper function to create dates
    const daysFromNow = (days: number) => new Date(now.getTime() + days * 24 * 60 * 60 * 1000)
    const daysAgo = (days: number) => new Date(now.getTime() - days * 24 * 60 * 60 * 1000)

    const testMembers = [
      // 1. Active gym-only 1 month (PAID)
      {
        name: 'Alice Johnson', email: 'member01@test.com', phone: '+1234567001',
        planType: 'gym_only', planDuration: 1, startDate: daysAgo(15),
        originalEndDate: daysFromNow(15), currentEndDate: daysFromNow(15),
        isActive: true, isPaused: false, payment: { amount: '50.00', method: 'card' }
      },

      // 2. Active gym-only 3 months (PAID)
      {
        name: 'Bob Smith', email: 'member02@test.com', phone: '+1234567002',
        planType: 'gym_only', planDuration: 3, startDate: daysAgo(30),
        originalEndDate: daysFromNow(60), currentEndDate: daysFromNow(60),
        isActive: true, isPaused: false, payment: { amount: '130.00', method: 'card' }
      },

      // 3. Active gym-only 6 months with pause history (PAID)
      {
        name: 'Carol Davis', email: 'member03@test.com', phone: '+1234567003',
        planType: 'gym_only', planDuration: 6, startDate: daysAgo(60),
        originalEndDate: daysFromNow(120), currentEndDate: daysFromNow(127), // Extended due to pause
        isActive: true, isPaused: false, payment: { amount: '240.00', method: 'cash' },
        pauseHistory: { start: daysAgo(20), end: daysAgo(13), reason: 'vacation' }
      },

      // 4. Active gym-only 12 months (PAID)
      {
        name: 'David Wilson', email: 'member04@test.com', phone: '+1234567004',
        planType: 'gym_only', planDuration: 12, startDate: daysAgo(90),
        originalEndDate: daysFromNow(275), currentEndDate: daysFromNow(275),
        isActive: true, isPaused: false, payment: { amount: '480.00', method: 'card' }
      },

      // 5. Currently PAUSED gym-only member (PAID)
      {
        name: 'Eva Martinez', email: 'member05@test.com', phone: '+1234567005',
        planType: 'gym_only', planDuration: 6, startDate: daysAgo(45),
        originalEndDate: daysFromNow(135), currentEndDate: daysFromNow(135),
        isActive: true, isPaused: true, payment: { amount: '240.00', method: 'card' },
        activePause: { start: daysAgo(5), reason: 'medical' }
      },

      // 6. Expired gym-only member (PAID)
      {
        name: 'Frank Brown', email: 'member06@test.com', phone: '+1234567006',
        planType: 'gym_only', planDuration: 1, startDate: daysAgo(45),
        originalEndDate: daysAgo(15), currentEndDate: daysAgo(15),
        isActive: false, isPaused: false, payment: { amount: '50.00', method: 'card' }
      },

      // 7. Active gym_crossfit 1 month (PAID)
      {
        name: 'Grace Lee', email: 'member07@test.com', phone: '+1234567007',
        planType: 'gym_crossfit', planDuration: 1, startDate: daysAgo(10),
        originalEndDate: daysFromNow(20), currentEndDate: daysFromNow(20),
        isActive: true, isPaused: false, payment: { amount: '90.00', method: 'card' }
      },

      // 8. Active gym_crossfit 6 months (PAID)
      {
        name: 'Henry Taylor', email: 'member08@test.com', phone: '+1234567008',
        planType: 'gym_crossfit', planDuration: 6, startDate: daysAgo(30),
        originalEndDate: daysFromNow(150), currentEndDate: daysFromNow(150),
        isActive: true, isPaused: false, payment: { amount: '480.00', method: 'card' }
      },

      // 9. Active gym_5pass with 5 visits remaining (PAID)
      {
        name: 'Ivy Chen', email: 'member09@test.com', phone: '+1234567009',
        planType: 'gym_5pass', planDuration: null, startDate: daysAgo(2),
        originalEndDate: daysFromNow(28), currentEndDate: daysFromNow(28),
        isActive: true, isPaused: false, remainingVisits: 5,
        payment: { amount: '75.00', method: 'card' }
      },

      // 10. Active gym_5pass with 2 visits remaining (PAID)
      {
        name: 'Jack Wilson', email: 'member10@test.com', phone: '+1234567010',
        planType: 'gym_5pass', planDuration: null, startDate: daysAgo(10),
        originalEndDate: daysFromNow(20), currentEndDate: daysFromNow(20),
        isActive: true, isPaused: false, remainingVisits: 2,
        payment: { amount: '75.00', method: 'card' }
      },

      // 11. Expired gym_5pass with 0 visits (PAID)
      {
        name: 'Kate Davis', email: 'member11@test.com', phone: '+1234567011',
        planType: 'gym_5pass', planDuration: null, startDate: daysAgo(35),
        originalEndDate: daysAgo(5), currentEndDate: daysAgo(5),
        isActive: false, isPaused: false, remainingVisits: 0,
        payment: { amount: '75.00', method: 'cash' }
      },

      // 12. Active fitness_5pass with 4 visits remaining (PAID)
      {
        name: 'Liam Rodriguez', email: 'member12@test.com', phone: '+1234567012',
        planType: 'fitness_5pass', planDuration: null, startDate: daysAgo(3),
        originalEndDate: daysFromNow(27), currentEndDate: daysFromNow(27),
        isActive: true, isPaused: false, remainingVisits: 4,
        payment: { amount: '60.00', method: 'cash' }
      },

      // 13. Active crossfit_5pass with 3 visits remaining (PAID)
      {
        name: 'Mia Johnson', email: 'member13@test.com', phone: '+1234567013',
        planType: 'crossfit_5pass', planDuration: null, startDate: daysAgo(7),
        originalEndDate: daysFromNow(23), currentEndDate: daysFromNow(23),
        isActive: true, isPaused: false, remainingVisits: 3,
        payment: { amount: '85.00', method: 'card' }
      },

      // 14. UNPAID gym-only 1 month
      {
        name: 'Noah Garcia', email: 'member14@test.com', phone: '+1234567014',
        planType: 'gym_only', planDuration: 1, startDate: daysAgo(5),
        originalEndDate: daysFromNow(25), currentEndDate: daysFromNow(25),
        isActive: true, isPaused: false
      },

      // 15. UNPAID gym_crossfit 3 months
      {
        name: 'Olivia Anderson', email: 'member15@test.com', phone: '+1234567015',
        planType: 'gym_crossfit', planDuration: 3, startDate: daysAgo(10),
        originalEndDate: daysFromNow(80), currentEndDate: daysFromNow(80),
        isActive: true, isPaused: false
      },

      // 16. UNPAID gym_5pass with 5 visits
      {
        name: 'Paul Martinez', email: 'member16@test.com', phone: '+1234567016',
        planType: 'gym_5pass', planDuration: null, startDate: daysAgo(1),
        originalEndDate: daysFromNow(29), currentEndDate: daysFromNow(29),
        isActive: true, isPaused: false, remainingVisits: 5
      },

      // 17. UNPAID fitness_5pass with 3 visits remaining
      {
        name: 'Quinn White', email: 'member17@test.com', phone: '+1234567017',
        planType: 'fitness_5pass', planDuration: null, startDate: daysAgo(8),
        originalEndDate: daysFromNow(22), currentEndDate: daysFromNow(22),
        isActive: true, isPaused: false, remainingVisits: 3
      },

      // 18. Member with multiple pause history (PAID)
      {
        name: 'Ryan Thompson', email: 'member18@test.com', phone: '+1234567018',
        planType: 'gym_only', planDuration: 6, startDate: daysAgo(100),
        originalEndDate: daysFromNow(65), currentEndDate: daysFromNow(79), // Extended due to pauses
        isActive: true, isPaused: false, payment: { amount: '240.00', method: 'card' },
        pauseHistory: { start: daysAgo(50), end: daysAgo(36), reason: 'travel' }
      },

      // 19. Recently joined gym_crossfit (PAID)
      {
        name: 'Sophia Kim', email: 'member19@test.com', phone: '+1234567019',
        planType: 'gym_crossfit', planDuration: 12, startDate: daysAgo(3),
        originalEndDate: daysFromNow(362), currentEndDate: daysFromNow(362),
        isActive: true, isPaused: false, payment: { amount: '960.00', method: 'card' }
      },

      // 20. About to expire gym-only member (PAID)
      {
        name: 'Tyler Scott', email: 'member20@test.com', phone: '+1234567020',
        planType: 'gym_only', planDuration: 1, startDate: daysAgo(28),
        originalEndDate: daysFromNow(2), currentEndDate: daysFromNow(2),
        isActive: true, isPaused: false, payment: { amount: '50.00', method: 'card' }
      }
    ]

    // Create members and their related data
    for (const memberData of testMembers) {
      // Create member
      const [newMember] = await db.insert(members).values({
        name: memberData.name,
        email: memberData.email,
        phone: memberData.phone,
        planType: memberData.planType as 'gym_only' | 'gym_crossfit' | 'gym_5pass' | 'fitness_5pass' | 'crossfit_5pass',
        planDuration: memberData.planDuration,
        startDate: memberData.startDate,
        originalEndDate: memberData.originalEndDate,
        currentEndDate: memberData.currentEndDate,
        isActive: memberData.isActive,
        isPaused: memberData.isPaused,
        remainingVisits: memberData.remainingVisits || null
      }).returning()

      // Create payment if exists
      if (memberData.payment) {
        await db.insert(payments).values({
          memberId: newMember.id,
          amount: memberData.payment.amount,
          paymentDate: memberData.startDate,
          paymentMethod: memberData.payment.method as 'cash' | 'card',
          paymentType: 'membership'
        })
      }

      // Create pause history if exists
      if (memberData.pauseHistory) {
        await db.insert(membershipPauses).values({
          memberId: newMember.id,
          pauseStartDate: memberData.pauseHistory.start,
          pauseEndDate: memberData.pauseHistory.end,
          pauseReason: memberData.pauseHistory.reason
        })
      }

      // Create active pause if exists
      if (memberData.activePause) {
        await db.insert(membershipPauses).values({
          memberId: newMember.id,
          pauseStartDate: memberData.activePause.start,
          pauseEndDate: null, // Still active
          pauseReason: memberData.activePause.reason
        })
      }
    }

    // Create some day passes (not tied to members)
    const dayPassData = [
      { name: 'Walk-in Customer 1', passType: 'gym_dropin', price: '15.00', used: false },
      { name: 'Walk-in Customer 2', passType: 'crossfit_dropin', price: '25.00', used: true },
      { name: 'Walk-in Customer 3', passType: 'fitness_class', price: '20.00', used: false },
      { name: 'Walk-in Customer 4', passType: 'open_gym', price: '12.00', used: true }
    ]

    for (const dayPass of dayPassData) {
      await db.insert(dayPasses).values({
        customerName: dayPass.name,
        passType: dayPass.passType as 'gym_dropin' | 'fitness_class' | 'crossfit_dropin' | 'open_gym',
        pricePaid: dayPass.price,
        purchaseDate: daysAgo(Math.floor(Math.random() * 7)),
        isUsed: dayPass.used,
        usedAt: dayPass.used ? daysAgo(Math.floor(Math.random() * 5)) : null
      })
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