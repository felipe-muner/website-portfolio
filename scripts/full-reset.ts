import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

async function fullReset() {
  try {
    console.log('🔄 Starting full database reset...')

    // Step 1: Push schema with auto-confirmation
    console.log('📊 Pushing database schema...')
    await execAsync('echo "Yes" | npm run db:push')
    console.log('✅ Schema pushed successfully')

    // Step 2: Seed admin
    console.log('👤 Creating admin user...')
    await execAsync('bun scripts/create-admin.ts')
    console.log('✅ Admin user created')

    // Step 3: Seed nationalities
    console.log('🌍 Seeding nationalities...')
    await execAsync('bun scripts/seed-nationalities.ts')
    console.log('✅ Nationalities seeded')

    // Step 4: Seed test members
    console.log('👥 Seeding test members...')
    await execAsync('bun scripts/seed-test-members.ts')
    console.log('✅ Test members seeded')

    console.log('🎉 Full database reset completed successfully!')

  } catch (error) {
    console.error('❌ Error during reset:', error)
    process.exit(1)
  }
}

fullReset()