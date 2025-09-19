import dotenvFlow from 'dotenv-flow'
dotenvFlow.config()

import { db } from '../lib/db'
import { nationalities } from '../lib/db/schema'

const testNationalities = [
  { name: 'American', code: 'US', flag: '🇺🇸' },
  { name: 'British', code: 'GB', flag: '🇬🇧' },
  { name: 'Canadian', code: 'CA', flag: '🇨🇦' },
  { name: 'Thai', code: 'TH', flag: '🇹🇭' },
  { name: 'German', code: 'DE', flag: '🇩🇪' },
]

async function testSeed() {
  try {
    console.log('🌍 Testing nationality seed...')

    await db.insert(nationalities).values(testNationalities)

    console.log(`✅ Successfully seeded ${testNationalities.length} test nationalities`)
  } catch (error) {
    console.error('❌ Error seeding test nationalities:', error)
    throw error
  }
}

testSeed()