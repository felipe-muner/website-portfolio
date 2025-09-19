import dotenvFlow from 'dotenv-flow'
dotenvFlow.config()

import { db } from '../lib/db'
import { nationalities } from '../lib/db/schema'
import { nationalitiesWithFlags } from './nationalities-with-flags'

async function seedNationalities() {
  try {
    console.log('🌍 Seeding nationalities...')

    // Insert all nationalities
    await db.insert(nationalities).values(nationalitiesWithFlags)

    console.log(`✅ Successfully seeded ${nationalitiesWithFlags.length} nationalities`)
  } catch (error) {
    console.error('❌ Error seeding nationalities:', error)
    throw error
  }
}

if (require.main === module) {
  seedNationalities()
}

export { seedNationalities }