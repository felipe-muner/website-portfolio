import dotenvFlow from 'dotenv-flow'
dotenvFlow.config()

import { db } from '../lib/db'
import { nationalities } from '../lib/db/schema'
import { nationalitiesWithFlags } from './nationalities-with-flags'

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
    console.error('Make sure the database is running and accessible')
    process.exit(1)
  }
}

if (require.main === module) {
  seedNationalities()
}

export { seedNationalities }