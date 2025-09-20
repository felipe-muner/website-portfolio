import dotenvFlow from 'dotenv-flow'
dotenvFlow.config()

import { db } from '../lib/db'
import { adminUsers, nationalities, members, payments, dayPasses } from '../lib/db/schema'
import { eq } from 'drizzle-orm'
import { type InferInsertModel } from 'drizzle-orm'
import { addDays, subDays, addMonths, subMonths, subYears } from 'date-fns'
import { nationalitiesWithFlags } from './nationalities-with-flags'
import { getPlanPrice, formatCurrency, PLAN_TYPES, PRICING } from '../lib/constants/pricing'

type NewMember = InferInsertModel<typeof members>
type NewPayment = InferInsertModel<typeof payments>
type NewDayPass = InferInsertModel<typeof dayPasses>

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

    const now = new Date()

    // Create diverse members with new plan types and exact pricing
    const memberData = [
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
        planType: 'gym_5pass', duration: 1, isThaiNational: false, remainingVisits: 4
      },

      // Fitness Classes
      {
        name: 'David Wilson', email: 'member06@test.com', phone: '+66812345006',
        planType: 'fitness_1month', duration: 1, isThaiNational: false
      },
      {
        name: 'Niran Pothong', email: 'member07@test.com', phone: '+66812345007',
        planType: 'fitness_5pass', duration: 1, isThaiNational: true, remainingVisits: 3
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
        planType: 'crossfit_10pass', duration: 1, isThaiNational: false, remainingVisits: 8
      },

      // Open Gym Plans
      {
        name: 'Henry Taylor', email: 'member13@test.com', phone: '+66812345013',
        planType: 'open_gym_1month', duration: 1, isThaiNational: false
      },
      {
        name: 'Ivy Chen', email: 'member14@test.com', phone: '+66812345014',
        planType: 'open_gym_5pass', duration: 1, isThaiNational: false, remainingVisits: 5
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
        planType: member.planType as any,
        planDuration: member.duration,
        startDate,
        originalEndDate: endDate,
        currentEndDate: endDate,
        isActive: !isExpired,
        isPaused: false,
        remainingVisits: member.remainingVisits || null
      }

      memberInserts.push(memberInsert)

      // Create payment record with exact pricing
      const paymentAmount = getPlanPrice(member.planType, member.isThaiNational)
      const paymentInsert: NewPayment = {
        memberId: '', // Will be filled after insert
        amount: paymentAmount.toString(),
        paymentDate: startDate,
        paymentMethod: Math.random() > 0.5 ? 'card' : 'cash',
        paymentType: 'membership'
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

    await Promise.all([
      createInitialAdmin(),
      seedNationalities(),
      seedMembersWithNewPricing()
    ])

    console.log('✅ All seeding operations completed successfully!')
    console.log('💡 All prices now match the official pricing table!')
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