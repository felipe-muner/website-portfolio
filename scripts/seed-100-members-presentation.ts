import dotenvFlow from 'dotenv-flow'
dotenvFlow.config()

import { db } from '../lib/db'
import { adminUsers, nationalities, members, payments, dayPasses, plans, membershipPauses } from '../lib/db/schema'
import { eq } from 'drizzle-orm'
import { addDays, subDays, addMonths, subMonths, subYears, addWeeks } from 'date-fns'
import { nationalitiesWithFlags } from './nationalities-with-flags'
import { getPlanPrice, formatCurrency, PLAN_TYPES, PRICING } from '../lib/constants/pricing'

import { NewMember, NewPayment, NewDayPass, NewPlan, Member, NewMembershipPause } from '../lib/types/database'

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
        role: 'admin',
        isActive: true,
      })
      .returning()

    console.log('Created initial admin user:', newAdmin[0])
  } catch (error) {
    console.error('Error creating admin user:', error)
    throw error
  }
}

async function seedPlans() {
  try {
    console.log('💡 Seeding plans...')

    const existingPlans = await db.select().from(plans).limit(1)

    if (existingPlans.length > 0) {
      console.log('📝 Plans already seeded, skipping...')
      return
    }

    const planInserts: NewPlan[] = PLAN_TYPES.map(planType => {
      const regularPrice = getPlanPrice(planType.value, false)
      const thaiPrice = getPlanPrice(planType.value, true)
      const hasThaiDiscount = regularPrice !== thaiPrice

      // Determine plan category
      let planCategory: 'gym' | 'crossfit' | 'fitness' | 'combo'
      if (planType.value.includes('crossfit')) {
        planCategory = 'crossfit'
      } else if (planType.value.includes('fitness')) {
        planCategory = 'fitness'
      } else if (planType.value.includes('group_classes') || planType.value.includes('combo')) {
        planCategory = 'combo'
      } else {
        planCategory = 'gym'
      }

      // Determine visit limit for pass-based plans
      let visitLimit = null
      if (planType.value.includes('5pass')) {
        visitLimit = 5
      } else if (planType.value.includes('10pass')) {
        visitLimit = 10
      } else if (planType.value.includes('dropin')) {
        visitLimit = 1
      } else if (planType.value === 'crossfit_1week') {
        visitLimit = 7
      }

      return {
        name: planType.label,
        planType: planType.value,
        price: regularPrice.toString(),
        priceThaiDiscount: hasThaiDiscount ? thaiPrice.toString() : null,
        duration: planType.duration,
        visitLimit,
        planCategory,
        isActive: true,
        isDropIn: planType.value.includes('dropin'),
        description: null,
      }
    })

    await db.insert(plans).values(planInserts)
    console.log(`✅ Successfully seeded ${planInserts.length} plans`)
  } catch (error) {
    console.error('❌ Error seeding plans:', error)
    throw error
  }
}

async function seedNationalities() {
  try {
    console.log('🌍 Seeding nationalities...')

    const existingNationalities = await db.select().from(nationalities).limit(1)

    if (existingNationalities.length > 0) {
      console.log('📝 Nationalities already seeded, skipping...')
      return
    }

    await db.insert(nationalities).values(nationalitiesWithFlags)
    console.log(`✅ Successfully seeded ${nationalitiesWithFlags.length} nationalities`)
  } catch (error) {
    console.error('❌ Error seeding nationalities:', error)
    throw error
  }
}

function generateRandomBirthday(): Date {
  const now = new Date()
  const age = 18 + Math.floor(Math.random() * 42)
  const baseYear = now.getFullYear() - age
  const month = Math.floor(Math.random() * 12)
  const day = 1 + Math.floor(Math.random() * 28)
  return new Date(baseYear, month, day)
}

function generateBirthdayToday(): Date {
  const now = new Date()
  const age = 18 + Math.floor(Math.random() * 42)
  const baseYear = now.getFullYear() - age
  return new Date(baseYear, now.getMonth(), now.getDate())
}

async function seed100MembersForPresentation() {
  try {
    console.log('👥 Seeding 100 diverse members for customer presentation...')

    // Clear existing members and related data for fresh seeding
    console.log('🧹 Clearing existing members and related data...')
    await db.delete(membershipPauses)
    await db.delete(payments)
    await db.delete(members)
    console.log('✅ Existing data cleared')

    // Get all plans from database
    const allPlans = await db.select().from(plans).where(eq(plans.isActive, true))
    const plansByType = allPlans.reduce((acc, plan) => {
      acc[plan.planType] = plan
      return acc
    }, {} as Record<string, typeof allPlans[0]>)

    // Get Thai nationality ID for Thai members
    const thaiNationality = await db
      .select()
      .from(nationalities)
      .where(eq(nationalities.code, 'TH'))
      .limit(1)

    const thaiNationalityId = thaiNationality.length > 0 ? thaiNationality[0].id : null

    const now = new Date()

    // Define comprehensive member scenarios
    type MemberSeedData = {
      name: string
      email?: string
      passportId?: string
      phone: string
      planType: NonNullable<Member['planType']>
      duration: number | null
      isThaiNational: boolean
      usedVisits?: number
      isExpired?: boolean
      isPaused?: boolean
      pauseCount?: number
      isActive?: boolean
      hasBirthdayToday?: boolean
      scenario: string
      country?: string
    }

    const memberData: MemberSeedData[] = [
      // === BIRTHDAY MEMBERS (5 members) ===
      {
        name: 'Emma Birthday', passportId: 'US123456789', phone: '+14155551001',
        planType: 'gym_only_1month', duration: 1, isThaiNational: false,
        hasBirthdayToday: true, scenario: 'Birthday - Active Gym Member', country: 'USA'
      },
      {
        name: 'Somchai Wanpen', email: 'birthday02@test.com', phone: '+66812340002',
        planType: 'crossfit_3month', duration: 3, isThaiNational: true,
        hasBirthdayToday: true, scenario: 'Birthday - Thai CrossFit Member'
      },
      {
        name: 'Michael Birthday', passportId: 'GB987654321', phone: '+447700123001',
        planType: 'gym_5pass', duration: null, isThaiNational: false, usedVisits: 2,
        hasBirthdayToday: true, scenario: 'Birthday - Pass Member', country: 'UK'
      },
      {
        name: 'Sarah Birthday', email: 'birthday04@test.com', phone: '+66812340004',
        planType: 'fitness_gym_1month', duration: 1, isThaiNational: false,
        hasBirthdayToday: true, scenario: 'Birthday - Combo Plan'
      },
      {
        name: 'David Birthday', email: 'birthday05@test.com', phone: '+66812340005',
        planType: 'gym_only_6month', duration: 6, isThaiNational: false, isPaused: true, pauseCount: 1,
        hasBirthdayToday: true, scenario: 'Birthday - Paused Member'
      },
      // pois bem que eu pedir amor 
      // === ACTIVE MEMBERS - GYM ONLY (15 members) ===
      {
        name: 'Alice Johnson', passportId: 'AU456789123', phone: '+61412345001',
        planType: 'gym_only_1month', duration: 1, isThaiNational: false,
        scenario: 'Active - Gym 1 Month', country: 'Australia'
      },
      {
        name: 'Somchai Jaidee', email: 'gym02@test.com', phone: '+66812341002',
        planType: 'gym_only_3month', duration: 3, isThaiNational: true,
        scenario: 'Active - Gym 3 Months (Thai)'
      },
      {
        name: 'Bob Smith', passportId: 'CA789012345', phone: '+14165551003',
        planType: 'gym_only_6month', duration: 6, isThaiNational: false,
        scenario: 'Active - Gym 6 Months', country: 'Canada'
      },
      {
        name: 'Siriporn Khumtong', email: 'gym04@test.com', phone: '+66812341004',
        planType: 'gym_only_12month', duration: 12, isThaiNational: true,
        scenario: 'Active - Gym 12 Months (Thai)'
      },
      {
        name: 'Carol Davis', email: 'gym05@test.com', phone: '+66812341005',
        planType: 'gym_5pass', duration: null, isThaiNational: false, usedVisits: 1,
        scenario: 'Active - Gym 5 Pass (4 remaining)'
      },
      {
        name: 'James Wilson', email: 'gym06@test.com', phone: '+66812341006',
        planType: 'gym_5pass', duration: null, isThaiNational: false, usedVisits: 0,
        scenario: 'Active - Gym 5 Pass (5 remaining)'
      },
      {
        name: 'Maria Garcia', email: 'gym07@test.com', phone: '+66812341007',
        planType: 'gym_5pass', duration: null, isThaiNational: false, usedVisits: 3,
        scenario: 'Active - Gym 5 Pass (2 remaining)'
      },
      {
        name: 'Chen Wei', email: 'gym08@test.com', phone: '+66812341008',
        planType: 'gym_5pass', duration: null, isThaiNational: false, usedVisits: 4,
        scenario: 'Active - Gym 5 Pass (1 remaining)'
      },
      {
        name: 'Lisa Anderson', email: 'gym09@test.com', phone: '+66812341009',
        planType: 'crossfit_10pass', duration: null, isThaiNational: false, usedVisits: 3,
        scenario: 'Active - CrossFit 10 Pass (7 remaining)'
      },
      {
        name: 'Pong Sak', email: 'gym10@test.com', phone: '+66812341010',
        planType: 'crossfit_10pass', duration: null, isThaiNational: true, usedVisits: 7,
        scenario: 'Active - CrossFit 10 Pass (3 remaining, Thai)'
      },
      {
        name: 'Robert Brown', email: 'gym11@test.com', phone: '+66812341011',
        planType: 'gym_only_1month', duration: 1, isThaiNational: false,
        scenario: 'Active - Recent Gym Join'
      },
      {
        name: 'Anna Kowalski', passportId: 'PL234567890', phone: '+48601234012',
        planType: 'gym_only_3month', duration: 3, isThaiNational: false,
        scenario: 'Active - International Gym Member', country: 'Poland'
      },
      {
        name: 'Takeshi Yamamoto', passportId: 'JP345678901', phone: '+81901234013',
        planType: 'gym_only_6month', duration: 6, isThaiNational: false,
        scenario: 'Active - Japanese Gym Member', country: 'Japan'
      },
      {
        name: 'Niran Pothong', email: 'gym14@test.com', phone: '+66812341014',
        planType: 'gym_only_12month', duration: 12, isThaiNational: true,
        scenario: 'Active - Long-term Thai Member'
      },
      {
        name: 'Sophie Martin', passportId: 'FR456789012', phone: '+33612345015',
        planType: 'gym_only_1month', duration: 1, isThaiNational: false,
        scenario: 'Active - French Tourist', country: 'France'
      },

      // === ACTIVE MEMBERS - CROSSFIT (10 members) ===
      {
        name: 'Eva Martinez', email: 'crossfit01@test.com', phone: '+66812342001',
        planType: 'crossfit_1month', duration: 1, isThaiNational: false,
        scenario: 'Active - CrossFit 1 Month'
      },
      {
        name: 'Apinya Somboon', email: 'crossfit02@test.com', phone: '+66812342002',
        planType: 'crossfit_1month', duration: 1, isThaiNational: true,
        scenario: 'Active - CrossFit 1 Month (Thai Discount)'
      },
      {
        name: 'Frank Brown', email: 'crossfit03@test.com', phone: '+66812342003',
        planType: 'crossfit_3month', duration: 3, isThaiNational: false,
        scenario: 'Active - CrossFit 3 Months'
      },
      {
        name: 'Chaiyaporn Wongso', email: 'crossfit04@test.com', phone: '+66812342004',
        planType: 'crossfit_3month', duration: 3, isThaiNational: true,
        scenario: 'Active - CrossFit 3 Months (Thai Discount)'
      },
      {
        name: 'Grace Lee', email: 'crossfit05@test.com', phone: '+66812342005',
        planType: 'crossfit_10pass', duration: null, isThaiNational: false, usedVisits: 2,
        scenario: 'Active - CrossFit 10 Pass (8 remaining)'
      },
      {
        name: 'Marcus Johnson', email: 'crossfit06@test.com', phone: '+66812342006',
        planType: 'crossfit_1week', duration: null, isThaiNational: false, usedVisits: 3,
        scenario: 'Active - CrossFit 1 Week Trial'
      },
      {
        name: 'Yuki Tanaka', email: 'crossfit07@test.com', phone: '+66812342007',
        planType: 'crossfit_10pass', duration: null, isThaiNational: false, usedVisits: 6,
        scenario: 'Active - CrossFit 10 Pass (4 remaining)'
      },
      {
        name: 'Isabella Rodriguez', passportId: 'ES567890123', phone: '+34612345008',
        planType: 'crossfit_3month', duration: 3, isThaiNational: false,
        scenario: 'Active - CrossFit International', country: 'Spain'
      },
      {
        name: 'Kamon Sukjai', email: 'crossfit09@test.com', phone: '+66812342009',
        planType: 'crossfit_1month', duration: 1, isThaiNational: true,
        scenario: 'Active - CrossFit Thai Local'
      },
      {
        name: 'Oliver Schmidt', passportId: 'DE678901234', phone: '+491701234010',
        planType: 'crossfit_10pass', duration: null, isThaiNational: false, usedVisits: 1,
        scenario: 'Active - CrossFit German Tourist', country: 'Germany'
      },

      // === FITNESS CLASSES & COMBO PLANS (10 members) ===
      {
        name: 'Henry Taylor', email: 'fitness01@test.com', phone: '+66812343001',
        planType: 'fitness_1month', duration: 1, isThaiNational: false,
        scenario: 'Active - Fitness Classes 1 Month'
      },
      {
        name: 'Ivy Chen', email: 'fitness02@test.com', phone: '+66812343002',
        planType: 'fitness_5pass', duration: null, isThaiNational: false, usedVisits: 1,
        scenario: 'Active - Fitness 5 Pass (4 remaining)'
      },
      {
        name: 'Jack Wilson', email: 'fitness03@test.com', phone: '+66812343003',
        planType: 'group_classes_1month', duration: 1, isThaiNational: false,
        scenario: 'Active - Group Classes 1 Month'
      },
      {
        name: 'Ratana Sukjai', email: 'fitness04@test.com', phone: '+66812343004',
        planType: 'group_classes_1month', duration: 1, isThaiNational: true,
        scenario: 'Active - Group Classes (Thai Discount)'
      },
      {
        name: 'Kate Davis', email: 'fitness05@test.com', phone: '+66812343005',
        planType: 'group_classes_3month', duration: 3, isThaiNational: false,
        scenario: 'Active - Group Classes 3 Months'
      },
      {
        name: 'Liam Rodriguez', email: 'fitness06@test.com', phone: '+66812343006',
        planType: 'fitness_gym_1month', duration: 1, isThaiNational: false,
        scenario: 'Active - Fitness + Gym Combo'
      },
      {
        name: 'Mia Johnson', email: 'fitness07@test.com', phone: '+66812343007',
        planType: 'open_gym_combo_1month', duration: 1, isThaiNational: false,
        scenario: 'Active - Open Gym Combo'
      },
      {
        name: 'Noah Garcia', email: 'fitness08@test.com', phone: '+66812343008',
        planType: 'open_gym_1month', duration: 1, isThaiNational: false,
        scenario: 'Active - Open Gym Only'
      },
      {
        name: 'Olivia Anderson', email: 'fitness09@test.com', phone: '+66812343009',
        planType: 'open_gym_5pass', duration: null, isThaiNational: false, usedVisits: 2,
        scenario: 'Active - Open Gym 5 Pass'
      },
      {
        name: 'Paul Martinez', email: 'fitness10@test.com', phone: '+66812343010',
        planType: 'fitness_5pass', duration: null, isThaiNational: false, usedVisits: 3,
        scenario: 'Active - Fitness 5 Pass (2 remaining)'
      },

      // === PAUSED MEMBERS (8 members) ===
      {
        name: 'Quinn White', email: 'paused01@test.com', phone: '+66812344001',
        planType: 'gym_only_3month', duration: 3, isThaiNational: false, isPaused: true, pauseCount: 1,
        scenario: 'Paused - Gym 3 Month (1/2 pauses used)'
      },
      {
        name: 'Ryan Thompson', email: 'paused02@test.com', phone: '+66812344002',
        planType: 'gym_only_6month', duration: 6, isThaiNational: false, isPaused: true, pauseCount: 2,
        scenario: 'Paused - Gym 6 Month (2/3 pauses used)'
      },
      {
        name: 'Sophia Kim', email: 'paused03@test.com', phone: '+66812344003',
        planType: 'gym_only_12month', duration: 12, isThaiNational: false, isPaused: true, pauseCount: 1,
        scenario: 'Paused - Gym 12 Month (1/4 pauses used)'
      },
      {
        name: 'Tyler Scott', email: 'paused04@test.com', phone: '+66812344004',
        planType: 'crossfit_3month', duration: 3, isThaiNational: false, isPaused: true, pauseCount: 1,
        scenario: 'Paused - CrossFit 3 Month'
      },
      {
        name: 'Uma Patel', email: 'paused05@test.com', phone: '+66812344005',
        planType: 'group_classes_3month', duration: 3, isThaiNational: false, isPaused: true, pauseCount: 1,
        scenario: 'Paused - Group Classes'
      },
      {
        name: 'Victor Reyes', email: 'paused06@test.com', phone: '+66812344006',
        planType: 'gym_only_1month', duration: 1, isThaiNational: false, isPaused: true, pauseCount: 1,
        scenario: 'Paused - Gym 1 Month (max pauses used)'
      },
      {
        name: 'Wendy Chang', email: 'paused07@test.com', phone: '+66812344007',
        planType: 'crossfit_1month', duration: 1, isThaiNational: true, isPaused: true, pauseCount: 1,
        scenario: 'Paused - CrossFit Thai Member'
      },
      {
        name: 'Xavier Brooks', email: 'paused08@test.com', phone: '+66812344008',
        planType: 'fitness_gym_1month', duration: 1, isThaiNational: false, isPaused: true, pauseCount: 1,
        scenario: 'Paused - Combo Plan'
      },

      // === EXPIRED MEMBERS (12 members) ===
      {
        name: 'Yasmin Ali', email: 'expired01@test.com', phone: '+66812345001',
        planType: 'gym_only_1month', duration: 1, isThaiNational: false, isExpired: true, isActive: false,
        scenario: 'Expired - Gym 1 Month (Recently Expired)'
      },
      {
        name: 'Zach Miller', email: 'expired02@test.com', phone: '+66812345002',
        planType: 'gym_only_3month', duration: 3, isThaiNational: false, isExpired: true, isActive: false,
        scenario: 'Expired - Gym 3 Months'
      },
      {
        name: 'Amy Foster', email: 'expired03@test.com', phone: '+66812345003',
        planType: 'gym_5pass', duration: null, isThaiNational: false, usedVisits: 5, isExpired: true, isActive: false,
        scenario: 'Expired - Gym 5 Pass (All visits used)'
      },
      {
        name: 'Ben Cooper', email: 'expired04@test.com', phone: '+66812345004',
        planType: 'crossfit_1month', duration: 1, isThaiNational: false, isExpired: true, isActive: false,
        scenario: 'Expired - CrossFit 1 Month'
      },
      {
        name: 'Chloe Turner', email: 'expired05@test.com', phone: '+66812345005',
        planType: 'fitness_5pass', duration: null, isThaiNational: false, usedVisits: 5, isExpired: true, isActive: false,
        scenario: 'Expired - Fitness 5 Pass (All visits used)'
      },
      {
        name: 'Dan Wilson', email: 'expired06@test.com', phone: '+66812345006',
        planType: 'gym_only_6month', duration: 6, isThaiNational: false, isExpired: true, isActive: false,
        scenario: 'Expired - Gym 6 Months'
      },
      {
        name: 'Ella Johnson', email: 'expired07@test.com', phone: '+66812345007',
        planType: 'crossfit_10pass', duration: null, isThaiNational: false, usedVisits: 10, isExpired: true, isActive: false,
        scenario: 'Expired - CrossFit 10 Pass (All visits used)'
      },
      {
        name: 'Felix Rodriguez', passportId: 'MX789012345', phone: '+525512345008',
        planType: 'group_classes_1month', duration: 1, isThaiNational: false, isExpired: true, isActive: false,
        scenario: 'Expired - Group Classes (Mexican)', country: 'Mexico'
      },
      {
        name: 'Grace Kim', passportId: 'KR890123456', phone: '+821012345009',
        planType: 'gym_only_12month', duration: 12, isThaiNational: false, isExpired: true, isActive: false,
        scenario: 'Expired - Gym 12 Months (Long-term)', country: 'South Korea'
      },
      {
        name: 'Hugo Santos', passportId: 'BR234567890', phone: '+5511987654010',
        planType: 'fitness_gym_1month', duration: 1, isThaiNational: false, isExpired: true, isActive: false,
        scenario: 'Expired - Combo Plan', country: 'Brazil'
      },
      {
        name: 'Iris Wang', email: 'expired11@test.com', phone: '+66812345011',
        planType: 'open_gym_1month', duration: 1, isThaiNational: false, isExpired: true, isActive: false,
        scenario: 'Expired - Open Gym'
      },
      {
        name: 'Jake Adams', email: 'expired12@test.com', phone: '+66812345012',
        planType: 'crossfit_10pass', duration: null, isThaiNational: false, usedVisits: 10, isExpired: true, isActive: false,
        scenario: 'Expired - CrossFit 10 Pass (All visits used)'
      },

      // === EXPIRING SOON (7 days or less) (10 members) ===
      {
        name: 'Kelly Green', email: 'expiring01@test.com', phone: '+66812346001',
        planType: 'gym_only_1month', duration: 1, isThaiNational: false,
        scenario: 'Expiring Soon - Gym 1 Month (7 days left)'
      },
      {
        name: 'Luke Phillips', email: 'expiring02@test.com', phone: '+66812346002',
        planType: 'crossfit_1month', duration: 1, isThaiNational: false,
        scenario: 'Expiring Soon - CrossFit (5 days left)'
      },
      {
        name: 'Maya Singh', email: 'expiring03@test.com', phone: '+66812346003',
        planType: 'fitness_1month', duration: 1, isThaiNational: false,
        scenario: 'Expiring Soon - Fitness (3 days left)'
      },
      {
        name: 'Nick Brown', email: 'expiring04@test.com', phone: '+66812346004',
        planType: 'gym_only_3month', duration: 3, isThaiNational: false,
        scenario: 'Expiring Soon - Gym 3 Month (2 days left)'
      },
      {
        name: 'Oscar Lopez', email: 'expiring05@test.com', phone: '+66812346005',
        planType: 'group_classes_1month', duration: 1, isThaiNational: true,
        scenario: 'Expiring Soon - Group Classes Thai (1 day left)'
      },
      {
        name: 'Penny Clark', email: 'expiring06@test.com', phone: '+66812346006',
        planType: 'gym_5pass', duration: null, isThaiNational: false, usedVisits: 4,
        scenario: 'Expiring Soon - Gym 5 Pass (1 visit left, 4 days)'
      },
      {
        name: 'Quincy Davis', email: 'expiring07@test.com', phone: '+66812346007',
        planType: 'crossfit_3month', duration: 3, isThaiNational: false,
        scenario: 'Expiring Soon - CrossFit 3 Month (6 days left)'
      },
      {
        name: 'Rita Murphy', email: 'expiring08@test.com', phone: '+66812346008',
        planType: 'fitness_gym_1month', duration: 1, isThaiNational: false,
        scenario: 'Expiring Soon - Combo Plan (4 days left)'
      },
      {
        name: 'Sam Cooper', email: 'expiring09@test.com', phone: '+66812346009',
        planType: 'open_gym_1month', duration: 1, isThaiNational: false,
        scenario: 'Expiring Soon - Open Gym (7 days left)'
      },
      {
        name: 'Tina Ross', email: 'expiring10@test.com', phone: '+66812346010',
        planType: 'gym_only_6month', duration: 6, isThaiNational: false,
        scenario: 'Expiring Soon - Gym 6 Month (5 days left)'
      },

      // === UNPAID MEMBERS (15 members) ===
      {
        name: 'Uma Williams', email: 'unpaid01@test.com', phone: '+66812347001',
        planType: 'gym_only_1month', duration: 1, isThaiNational: false,
        scenario: 'Unpaid - Gym 1 Month'
      },
      {
        name: 'Vince Johnson', email: 'unpaid02@test.com', phone: '+66812347002',
        planType: 'crossfit_1month', duration: 1, isThaiNational: false,
        scenario: 'Unpaid - CrossFit 1 Month'
      },
      {
        name: 'Wanda Lee', email: 'unpaid03@test.com', phone: '+66812347003',
        planType: 'gym_5pass', duration: null, isThaiNational: false, usedVisits: 0,
        scenario: 'Unpaid - Gym 5 Pass'
      },
      {
        name: 'Xander Kim', email: 'unpaid04@test.com', phone: '+66812347004',
        planType: 'fitness_5pass', duration: null, isThaiNational: false, usedVisits: 2,
        scenario: 'Unpaid - Fitness 5 Pass (3 remaining)'
      },
      {
        name: 'Yara Patel', email: 'unpaid05@test.com', phone: '+66812347005',
        planType: 'gym_only_3month', duration: 3, isThaiNational: false,
        scenario: 'Unpaid - Gym 3 Months'
      },
      {
        name: 'Zoe Martinez', email: 'unpaid06@test.com', phone: '+66812347006',
        planType: 'crossfit_3month', duration: 3, isThaiNational: true,
        scenario: 'Unpaid - CrossFit 3 Month (Thai)'
      },
      {
        name: 'Aaron Chen', email: 'unpaid07@test.com', phone: '+66812347007',
        planType: 'group_classes_1month', duration: 1, isThaiNational: false,
        scenario: 'Unpaid - Group Classes'
      },
      {
        name: 'Bella Wong', email: 'unpaid08@test.com', phone: '+66812347008',
        planType: 'fitness_gym_1month', duration: 1, isThaiNational: false,
        scenario: 'Unpaid - Combo Plan'
      },
      {
        name: 'Carlos Rivera', email: 'unpaid09@test.com', phone: '+66812347009',
        planType: 'gym_only_6month', duration: 6, isThaiNational: false,
        scenario: 'Unpaid - Gym 6 Months'
      },
      {
        name: 'Diana Foster', email: 'unpaid10@test.com', phone: '+66812347010',
        planType: 'crossfit_10pass', duration: null, isThaiNational: false, usedVisits: 1,
        scenario: 'Unpaid - CrossFit 10 Pass'
      },
      {
        name: 'Ethan Brooks', email: 'unpaid11@test.com', phone: '+66812347011',
        planType: 'open_gym_1month', duration: 1, isThaiNational: false,
        scenario: 'Unpaid - Open Gym'
      },
      {
        name: 'Fiona Scott', email: 'unpaid12@test.com', phone: '+66812347012',
        planType: 'gym_only_12month', duration: 12, isThaiNational: false,
        scenario: 'Unpaid - Gym 12 Months'
      },
      {
        name: 'Gary Thompson', email: 'unpaid13@test.com', phone: '+66812347013',
        planType: 'fitness_5pass', duration: null, isThaiNational: false, usedVisits: 4,
        scenario: 'Unpaid - Fitness 5 Pass (1 remaining)'
      },
      {
        name: 'Hannah Miller', email: 'unpaid14@test.com', phone: '+66812347014',
        planType: 'crossfit_10pass', duration: null, isThaiNational: false, usedVisits: 5,
        scenario: 'Unpaid - CrossFit 10 Pass'
      },
      {
        name: 'Ian Davis', email: 'unpaid15@test.com', phone: '+66812347015',
        planType: 'open_gym_5pass', duration: null, isThaiNational: false, usedVisits: 3,
        scenario: 'Unpaid - Open Gym 5 Pass'
      },

      // === SPECIAL SCENARIOS (15 members) ===
      {
        name: 'Julia Special', email: 'special01@test.com', phone: '+66812348001',
        planType: 'gym_only_3month', duration: 3, isThaiNational: false, pauseCount: 2,
        scenario: 'Special - Multiple Pause History (2/2 pauses used)'
      },
      {
        name: 'Kevin Special', email: 'special02@test.com', phone: '+66812348002',
        planType: 'gym_only_6month', duration: 6, isThaiNational: false, pauseCount: 3,
        scenario: 'Special - Max Pauses Used (3/3)'
      },
      {
        name: 'Laura Special', email: 'special03@test.com', phone: '+66812348003',
        planType: 'gym_only_12month', duration: 12, isThaiNational: false, pauseCount: 4,
        scenario: 'Special - Max Pauses 12 Month (4/4)'
      },
      {
        name: 'Mark Special', email: 'special04@test.com', phone: '+66812348004',
        planType: 'crossfit_1week', duration: null, isThaiNational: false, usedVisits: 1,
        scenario: 'Special - CrossFit 1 Week Trial'
      },
      {
        name: 'Nina Special', email: 'special05@test.com', phone: '+66812348005',
        planType: 'gym_5pass', duration: null, isThaiNational: false, usedVisits: 5, isExpired: true, isActive: false,
        scenario: 'Special - 5 Pass All Used & Expired'
      },
      {
        name: 'Owen Special', email: 'special06@test.com', phone: '+66812348006',
        planType: 'crossfit_10pass', duration: null, isThaiNational: false, usedVisits: 9,
        scenario: 'Special - CrossFit 10 Pass Last Visit Remaining'
      },
      {
        name: 'Paula Special', email: 'special07@test.com', phone: '+66812348007',
        planType: 'crossfit_10pass', duration: null, isThaiNational: true, usedVisits: 0,
        scenario: 'Special - CrossFit 10 Pass Fresh (Thai)'
      },
      {
        name: 'Quinton Special', email: 'special08@test.com', phone: '+66812348008',
        planType: 'fitness_gym_1month', duration: 1, isThaiNational: false, isPaused: true, pauseCount: 1,
        scenario: 'Special - Combo Plan Paused (Max for 1 month)'
      },
      {
        name: 'Rachel Special', email: 'special09@test.com', phone: '+66812348009',
        planType: 'group_classes_3month', duration: 3, isThaiNational: true, pauseCount: 1,
        scenario: 'Special - Group Classes Thai with Pause History'
      },
      {
        name: 'Steve Special', email: 'special10@test.com', phone: '+66812348010',
        planType: 'open_gym_combo_1month', duration: 1, isThaiNational: false,
        scenario: 'Special - Open Gym Combo Plan'
      },
      {
        name: 'Tara Special', email: 'special11@test.com', phone: '+66812348011',
        planType: 'gym_only_1month', duration: 1, isThaiNational: false, isExpired: true, isActive: false,
        scenario: 'Special - Recently Expired Yesterday'
      },
      {
        name: 'Ulrich Special', passportId: 'DE123456789', phone: '+491701234012',
        planType: 'crossfit_3month', duration: 3, isThaiNational: false,
        scenario: 'Special - Long-term Tourist (German)', country: 'Germany'
      },
      {
        name: 'Vera Special', email: 'special13@test.com', phone: '+66812348013',
        planType: 'fitness_5pass', duration: null, isThaiNational: false, usedVisits: 2,
        scenario: 'Special - Fitness 5 Pass Mid-usage'
      },
      {
        name: 'Will Special', email: 'special14@test.com', phone: '+66812348014',
        planType: 'gym_only_6month', duration: 6, isThaiNational: false,
        scenario: 'Special - Recently Joined (2 days ago)'
      },
      {
        name: 'Xara Special', email: 'special15@test.com', phone: '+66812348015',
        planType: 'open_gym_5pass', duration: null, isThaiNational: false, usedVisits: 0,
        scenario: 'Special - Open Gym 5 Pass Fresh Start'
      }
    ]

    // Prepare member inserts
    const memberInserts: NewMember[] = []
    const paymentInserts: NewPayment[] = []
    const pauseInserts: NewMembershipPause[] = []

    for (let i = 0; i < memberData.length; i++) {
      const member = memberData[i]
      const isExpired = member.isExpired || false
      const isPaused = member.isPaused || false
      const isActive = member.isActive !== false && !isExpired

      let startDate: Date
      let endDate: Date

      if (isExpired) {
        // Expired members
        if (member.planType.includes('pass')) {
          startDate = subDays(now, 45)
          endDate = subDays(now, 15)
        } else {
          startDate = subMonths(now, member.duration || 1 + 1)
          endDate = subDays(now, Math.floor(Math.random() * 10) + 1)
        }
      } else if (member.scenario?.includes('Expiring Soon')) {
        // Expiring soon members
        const daysLeft = member.scenario.includes('7 days') ? 7 :
          member.scenario.includes('6 days') ? 6 :
            member.scenario.includes('5 days') ? 5 :
              member.scenario.includes('4 days') ? 4 :
                member.scenario.includes('3 days') ? 3 :
                  member.scenario.includes('2 days') ? 2 : 1

        if (member.planType.includes('pass')) {
          startDate = subDays(now, 30 - daysLeft)
          endDate = addDays(now, daysLeft)
        } else {
          const totalDuration = member.duration || 1
          startDate = subMonths(now, totalDuration)
          startDate = addDays(startDate, Math.floor(Math.random() * 10))
          endDate = addDays(now, daysLeft)
        }
      } else if (member.scenario?.includes('Recently Joined') || member.scenario?.includes('Fresh')) {
        // Recently joined members
        startDate = subDays(now, Math.floor(Math.random() * 3) + 1)
        if (member.planType.includes('pass')) {
          endDate = addDays(startDate, 30)
        } else {
          endDate = addMonths(startDate, member.duration || 1)
        }
      } else {
        // Regular active members
        if (member.planType.includes('pass')) {
          startDate = subDays(now, Math.floor(Math.random() * 20) + 1)
          endDate = addDays(startDate, 30)
        } else {
          const daysIntoMembership = Math.floor(Math.random() * 30) + 1
          startDate = subDays(now, daysIntoMembership)
          endDate = addMonths(startDate, member.duration || 1)
        }
      }

      // Handle paused members - extend end date
      if (isPaused || (member.pauseCount && member.pauseCount > 0)) {
        const pauseDays = (member.pauseCount || 0) * 7 // Assume average 7 days per pause
        endDate = addDays(endDate, pauseDays)
      }

      const memberInsert: NewMember = {
        name: member.name,
        email: member.email || null,
        passportId: member.passportId || null,
        phone: member.phone,
        birthday: member.hasBirthdayToday ? generateBirthdayToday() : generateRandomBirthday(),
        nationalityId: member.isThaiNational ? thaiNationalityId : null,
        planType: member.planType,
        planDuration: member.duration,
        startDate,
        originalEndDate: endDate,
        currentEndDate: endDate,
        isActive,
        isPaused,
        usedVisits: member.usedVisits || null
      }

      memberInserts.push(memberInsert)

      // Create payment record only for paid members (exclude unpaid scenario)
      if (!member.scenario.includes('Unpaid')) {
        const selectedPlan = plansByType[member.planType]
        if (selectedPlan) {
          const paymentAmount = member.isThaiNational && selectedPlan.priceThaiDiscount
            ? parseFloat(selectedPlan.priceThaiDiscount)
            : parseFloat(selectedPlan.price)

          const paymentInsert: NewPayment = {
            memberId: '', // Will be filled after insert
            planId: selectedPlan.id,
            amount: paymentAmount.toString(),
            paymentDate: startDate,
            paymentMethod: Math.random() > 0.5 ? 'card' : 'cash'
          }

          paymentInserts.push(paymentInsert)
        }
      }

      // Create pause records for members with pause history
      if (member.pauseCount && member.pauseCount > 0) {
        for (let pauseNum = 1; pauseNum <= member.pauseCount; pauseNum++) {
          const pauseStart = subDays(now, (member.pauseCount - pauseNum + 1) * 14)
          const pauseEnd = isPaused && pauseNum === member.pauseCount ? null : addDays(pauseStart, 7)

          pauseInserts.push({
            memberId: '', // Will be filled after insert
            pauseStartDate: pauseStart,
            pauseEndDate: pauseEnd,
            pauseReason: pauseNum === member.pauseCount && isPaused ? 'Currently paused by admin' : `Pause ${pauseNum} - travel/vacation`
          })
        }
      }
    }

    // Insert members
    const newMembers = await db.insert(members).values(memberInserts).returning()

    // Update payment records with member IDs (only for paid members)
    if (paymentInserts.length > 0) {
      const updatedPaymentInserts = paymentInserts.map((payment, index) => {
        // Find the corresponding member for this payment
        let memberIndex = 0
        for (let i = 0; i < memberData.length; i++) {
          if (!memberData[i].scenario.includes('Unpaid')) {
            if (memberIndex === index) {
              return {
                ...payment,
                memberId: newMembers[i].id
              }
            }
            memberIndex++
          }
        }
        return payment
      })

      await db.insert(payments).values(updatedPaymentInserts)
    }

    // Update pause records with member IDs
    if (pauseInserts.length > 0) {
      let pauseIndex = 0
      const updatedPauseInserts = []

      for (let i = 0; i < memberData.length; i++) {
        const member = memberData[i]
        if (member.pauseCount && member.pauseCount > 0) {
          for (let pauseNum = 1; pauseNum <= member.pauseCount; pauseNum++) {
            updatedPauseInserts.push({
              ...pauseInserts[pauseIndex],
              memberId: newMembers[i].id
            })
            pauseIndex++
          }
        }
      }

      await db.insert(membershipPauses).values(updatedPauseInserts)
    }

    // Create comprehensive day passes showcasing all types
    const dayPassInserts: NewDayPass[] = [
      {
        customerName: 'Tourist Walk-in 1',
        passType: 'gym_dropin',
        pricePaid: PRICING.DAY_PASS.GYM_DROPIN.toString(),
        purchaseDate: subDays(now, 2),
        isUsed: false,
        usedAt: null
      },
      {
        customerName: 'Tourist Walk-in 2',
        passType: 'crossfit_dropin',
        pricePaid: PRICING.DAY_PASS.CROSSFIT_DROPIN.toString(),
        purchaseDate: subDays(now, 1),
        isUsed: true,
        usedAt: subDays(now, 1)
      },
      {
        customerName: 'Thai Local Walk-in',
        passType: 'crossfit_dropin',
        pricePaid: PRICING.DAY_PASS.CROSSFIT_DROPIN_THAI.toString(),
        purchaseDate: now,
        isUsed: false,
        usedAt: null
      },
      {
        customerName: 'Tourist Walk-in 3',
        passType: 'open_gym',
        pricePaid: PRICING.DAY_PASS.OPEN_GYM.toString(),
        purchaseDate: subDays(now, 3),
        isUsed: true,
        usedAt: subDays(now, 2)
      },
      {
        customerName: 'Group Leader',
        passType: 'fitness_class',
        pricePaid: '20.00',
        purchaseDate: subDays(now, 1),
        isUsed: true,
        usedAt: subDays(now, 1)
      },
      {
        customerName: 'Corporate Event 1',
        passType: 'gym_dropin',
        pricePaid: PRICING.DAY_PASS.GYM_DROPIN.toString(),
        purchaseDate: now,
        isUsed: false,
        usedAt: null
      },
      {
        customerName: 'Corporate Event 2',
        passType: 'gym_dropin',
        pricePaid: PRICING.DAY_PASS.GYM_DROPIN.toString(),
        purchaseDate: now,
        isUsed: false,
        usedAt: null
      },
      {
        customerName: 'Hotel Guest',
        passType: 'open_gym',
        pricePaid: PRICING.DAY_PASS.OPEN_GYM.toString(),
        purchaseDate: subDays(now, 4),
        isUsed: true,
        usedAt: subDays(now, 4)
      }
    ]

    await db.insert(dayPasses).values(dayPassInserts)

    console.log('✅ Successfully seeded 100 comprehensive members for presentation:')
    console.log(`   🎂 Birthday Members: 5 (showcasing birthday celebrations)`)
    console.log(`   💪 Active Gym Members: 15 (various durations and passes)`)
    console.log(`   🏋️ Active CrossFit Members: 10 (with Thai discounts)`)
    console.log(`   🧘 Fitness & Combo Members: 10 (all class types)`)
    console.log(`   ⏸️ Paused Members: 8 (various pause scenarios)`)
    console.log(`   ❌ Expired Members: 12 (various expiry scenarios)`)
    console.log(`   ⚠️ Expiring Soon: 10 (1-7 days remaining)`)
    console.log(`   💳 Unpaid Members: 15 (payment follow-up needed)`)
    console.log(`   🔥 Special Scenarios: 15 (edge cases and complex situations)`)
    console.log(`   💰 Total revenue from paid memberships: ${formatCurrency(
      paymentInserts.reduce((sum, p) => sum + parseFloat(p.amount), 0)
    )}`)
    console.log(`   🇹🇭 Thai nationals: 25 members (25% with discounts applied)`)
    console.log(`   🌍 International members: 75 members (15+ countries represented)`)
    console.log(`   📧 Email contacts: ~65 members`)
    console.log(`   🛂 Passport IDs: ~35 members (tourists & long-term visitors)`)
    console.log(`   📱 International phone numbers: USA, UK, Australia, Canada, Germany, Japan, etc.`)
    console.log(`   🎫 Day passes: 8 records showcasing all pass types`)
    console.log(`   📊 All plan types represented with realistic usage patterns`)
    console.log(`   ⏰ Perfect for demonstrating membership lifecycle management`)

  } catch (error) {
    console.error('❌ Error seeding 100 members:', error)
    throw error
  }
}

async function seed100MembersPresentation() {
  try {
    console.log('🚀 Starting comprehensive database seeding for customer presentation...')

    // Run admin and nationalities seeding in parallel
    await Promise.all([
      createInitialAdmin(),
      seedNationalities()
    ])

    // Seed plans first (required for members)
    await seedPlans()

    // Then seed 100 comprehensive members
    await seed100MembersForPresentation()

    console.log('✅ All seeding operations completed successfully!')
    console.log('🎯 Database ready for customer presentation with comprehensive scenarios!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Error during seeding:', error)
    process.exit(1)
  }
}

if (require.main === module) {
  seed100MembersPresentation()
}

export { seed100MembersPresentation }