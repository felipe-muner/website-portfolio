import dotenvFlow from 'dotenv-flow'
dotenvFlow.config()

import { db } from '../lib/db'
import { adminUsers, nationalities, members, payments, dayPasses, plans } from '../lib/db/schema'
import { eq } from 'drizzle-orm'
import { addDays, subDays, addMonths, subMonths, subYears } from 'date-fns'
import { nationalitiesWithFlags } from './nationalities-with-flags'
import { getPlanPrice, formatCurrency, PLAN_TYPES, PRICING } from '../lib/constants/pricing'

import { NewMember, NewPayment, NewDayPass, NewPlan, Member } from '../lib/types/database'

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

async function seedMembersWithNewPricing() {
  try {
    console.log('👥 Seeding members with new pricing structure...')

    // Check if members already exist
    const existingMembers = await db.select().from(members).limit(1)
    if (existingMembers.length > 0) {
      console.log('📝 Members already seeded, skipping...')
      return
    }

    // Get all plans from database
    const allPlans = await db.select().from(plans).where(eq(plans.isActive, true))
    const plansByType = allPlans.reduce((acc, plan) => {
      acc[plan.planType] = plan
      return acc
    }, {} as Record<string, typeof allPlans[0]>)

    const now = new Date()

    // Create diverse members with new plan types and exact pricing
    type MemberSeedData = {
      name: string
      email: string
      phone: string
      planType: NonNullable<Member['planType']>
      duration: number
      isThaiNational: boolean
      usedVisits?: number
      isExpired?: boolean
    }

    const memberData: MemberSeedData[] = [
      // Gym Only Plans
      {
        name: 'Alice Johnson', email: 'member01@test.com', phone: '+66812345001',
        planType: 'gym_only_1month', duration: 1, isThaiNational: false
      },
      {
        name: 'Somchai Jaidee', email: 'member02@test.com', phone: '+66812345002',
        planType: 'gym_only_3month', duration: 3, isThaiNational: true
      },
      {
        name: 'Bob Smith', email: 'member03@test.com', phone: '+66812345003',
        planType: 'gym_only_6month', duration: 6, isThaiNational: false
      },
      {
        name: 'Siriporn Khumtong', email: 'member04@test.com', phone: '+66812345004',
        planType: 'gym_only_12month', duration: 12, isThaiNational: true
      },
      {
        name: 'Carol Davis', email: 'member05@test.com', phone: '+66812345005',
        planType: 'gym_5pass', duration: 1, isThaiNational: false, usedVisits: 1
      },

      // Fitness Classes
      {
        name: 'David Wilson', email: 'member06@test.com', phone: '+66812345006',
        planType: 'fitness_1month', duration: 1, isThaiNational: false
      },
      {
        name: 'Niran Pothong', email: 'member07@test.com', phone: '+66812345007',
        planType: 'fitness_5pass', duration: 1, isThaiNational: true, usedVisits: 2
      },

      // CrossFit Plans (with Thai discounts)
      {
        name: 'Eva Martinez', email: 'member08@test.com', phone: '+66812345008',
        planType: 'crossfit_1month', duration: 1, isThaiNational: false
      },
      {
        name: 'Apinya Somboon', email: 'member09@test.com', phone: '+66812345009',
        planType: 'crossfit_1month', duration: 1, isThaiNational: true // 50% discount
      },
      {
        name: 'Frank Brown', email: 'member10@test.com', phone: '+66812345010',
        planType: 'crossfit_3month', duration: 3, isThaiNational: false
      },
      {
        name: 'Chaiyaporn Wongso', email: 'member11@test.com', phone: '+66812345011',
        planType: 'crossfit_3month', duration: 3, isThaiNational: true // 50% discount
      },
      {
        name: 'Grace Lee', email: 'member12@test.com', phone: '+66812345012',
        planType: 'crossfit_10pass', duration: 1, isThaiNational: false, usedVisits: 2
      },

      // Open Gym Plans
      {
        name: 'Henry Taylor', email: 'member13@test.com', phone: '+66812345013',
        planType: 'open_gym_1month', duration: 1, isThaiNational: false
      },
      {
        name: 'Ivy Chen', email: 'member14@test.com', phone: '+66812345014',
        planType: 'open_gym_5pass', duration: 1, isThaiNational: false, usedVisits: 0
      },

      // Group Classes Combo (with Thai discounts)
      {
        name: 'Jack Wilson', email: 'member15@test.com', phone: '+66812345015',
        planType: 'group_classes_1month', duration: 1, isThaiNational: false
      },
      {
        name: 'Ratana Sukjai', email: 'member16@test.com', phone: '+66812345016',
        planType: 'group_classes_1month', duration: 1, isThaiNational: true // 50% discount
      },
      {
        name: 'Kate Davis', email: 'member17@test.com', phone: '+66812345017',
        planType: 'group_classes_3month', duration: 3, isThaiNational: false
      },

      // Fitness + Gym Combo
      {
        name: 'Liam Rodriguez', email: 'member18@test.com', phone: '+66812345018',
        planType: 'fitness_gym_1month', duration: 1, isThaiNational: false
      },

      // Open Gym Combo
      {
        name: 'Mia Johnson', email: 'member19@test.com', phone: '+66812345019',
        planType: 'open_gym_combo_1month', duration: 1, isThaiNational: false
      },

      // Expired member for testing
      {
        name: 'Noah Garcia', email: 'member20@test.com', phone: '+66812345020',
        planType: 'gym_only_1month', duration: 1, isThaiNational: false, isExpired: true
      }
    ]

    // Get Thai nationality ID for Thai members
    const thaiNationality = await db
      .select()
      .from(nationalities)
      .where(eq(nationalities.code, 'TH'))
      .limit(1)

    const thaiNationalityId = thaiNationality.length > 0 ? thaiNationality[0].id : null

    // Prepare member inserts
    const memberInserts: NewMember[] = []
    const paymentInserts: NewPayment[] = []

    for (const member of memberData) {
      const isExpired = member.isExpired || false
      const startDate = isExpired ? subMonths(now, 2) : subDays(now, Math.floor(Math.random() * 15))
      const endDate = isExpired
        ? subDays(now, 5) // Expired 5 days ago
        : addMonths(startDate, member.duration || 1)

      const memberInsert: NewMember = {
        name: member.name,
        email: member.email,
        phone: member.phone,
        birthday: generateRandomBirthday(),
        nationalityId: member.isThaiNational ? thaiNationalityId : null,
        planType: member.planType,
        planDuration: member.duration,
        startDate,
        originalEndDate: endDate,
        currentEndDate: endDate,
        isActive: !isExpired,
        isPaused: false,
        usedVisits: member.usedVisits || null
      }

      memberInserts.push(memberInsert)

      // Create payment record with exact pricing
      const selectedPlan = plansByType[member.planType]
      if (!selectedPlan) {
        console.warn(`Plan not found for type: ${member.planType}`)
        continue
      }

      const paymentAmount = member.isThaiNational && selectedPlan.priceThaiDiscount
        ? parseFloat(selectedPlan.priceThaiDiscount)
        : parseFloat(selectedPlan.price)

      const paymentInsert: NewPayment = {
        memberId: '', // Will be filled after insert
        planId: selectedPlan.id, // Store the database plan ID
        amount: paymentAmount.toString(),
        paymentDate: startDate,
        paymentMethod: Math.random() > 0.5 ? 'card' : 'cash'
      }

      paymentInserts.push(paymentInsert)
    }

    // Insert members
    const newMembers = await db.insert(members).values(memberInserts).returning()

    // Update payment records with member IDs
    const updatedPaymentInserts = paymentInserts.map((payment, index) => ({
      ...payment,
      memberId: newMembers[index].id
    }))

    // Insert payments
    await db.insert(payments).values(updatedPaymentInserts)

    // Create day passes with new pricing
    const dayPassInserts: NewDayPass[] = [
      {
        customerName: 'Walk-in Customer 1',
        passType: 'gym_dropin',
        pricePaid: PRICING.DAY_PASS.GYM_DROPIN.toString(),
        purchaseDate: subDays(now, 2),
        isUsed: false,
        usedAt: null
      },
      {
        customerName: 'Walk-in Customer 2',
        passType: 'crossfit_dropin',
        pricePaid: PRICING.DAY_PASS.CROSSFIT_DROPIN.toString(),
        purchaseDate: subDays(now, 1),
        isUsed: true,
        usedAt: subDays(now, 1)
      },
      {
        customerName: 'Thai Customer 1',
        passType: 'crossfit_dropin',
        pricePaid: PRICING.DAY_PASS.CROSSFIT_DROPIN_THAI.toString(),
        purchaseDate: now,
        isUsed: false,
        usedAt: null
      },
      {
        customerName: 'Walk-in Customer 3',
        passType: 'open_gym',
        pricePaid: PRICING.DAY_PASS.OPEN_GYM.toString(),
        purchaseDate: subDays(now, 3),
        isUsed: true,
        usedAt: subDays(now, 2)
      }
    ]

    await db.insert(dayPasses).values(dayPassInserts)

    console.log('✅ Successfully seeded members with new pricing:')
    console.log(`   💰 Total revenue from memberships: ${formatCurrency(
      updatedPaymentInserts.reduce((sum, p) => sum + parseFloat(p.amount), 0)
    )}`)
    console.log('   🇹🇭 Thai nationals: 6 members (with 50% discounts applied)')
    console.log('   🌍 International members: 14 members (regular pricing)')
    console.log('   📊 Plan types: gym_only, fitness, crossfit, open_gym, combo plans')
    console.log('   🎫 Day passes: 4 records with exact pricing')
  } catch (error) {
    console.error('❌ Error seeding members:', error)
    throw error
  }
}

async function seedWithNewPricing() {
  try {
    console.log('🚀 Starting database seeding with new pricing structure...')

    // Run admin and nationalities seeding in parallel
    await Promise.all([
      createInitialAdmin(),
      seedNationalities()
    ])

    // Seed plans first (required for members)
    await seedPlans()

    // Then seed members (which depends on plans)
    await seedMembersWithNewPricing()

    console.log('✅ All seeding operations completed successfully!')
    console.log('💡 All plans are now stored in database with flexible pricing!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Error during seeding:', error)
    process.exit(1)
  }
}

if (require.main === module) {
  seedWithNewPricing()
}

export { seedWithNewPricing }