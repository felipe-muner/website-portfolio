import { db } from '../lib/db'
import { adminUsers } from '../lib/db/schema'

async function addTestAdminUsers() {
  try {
    console.log('Adding test admin users...')

    // Add Felipe as owner
    const felipe = await db
      .insert(adminUsers)
      .values({
        email: 'felipe.muner@gmail.com',
        name: 'Felipe Muner',
        role: 'admin',
        isActive: true,
      })
      .onConflictDoUpdate({
        target: adminUsers.email,
        set: {
          name: 'Felipe Muner',
          role: 'admin',
          isActive: true,
        },
      })
      .returning()

    console.log('✅ Added/Updated Felipe as owner:', felipe[0])

    // Add Koh Phangan Guide as staff
    const staff = await db
      .insert(adminUsers)
      .values({
        email: 'kohphanganguide@gmail.com',
        name: 'Koh Phangan Guide',
        role: 'staff',
        isActive: true,
      })
      .onConflictDoUpdate({
        target: adminUsers.email,
        set: {
          name: 'Koh Phangan Guide',
          role: 'staff',
          isActive: true,
        },
      })
      .returning()

    console.log('✅ Added/Updated Koh Phangan Guide as staff:', staff[0])

    console.log('\n🎉 Test admin users added successfully!')
    console.log('You can now test login with:')
    console.log('- felipe.muner@gmail.com (Owner - full access)')
    console.log('- kohphanganguide@gmail.com (Staff - limited access)')

  } catch (error) {
    console.error('❌ Error adding test admin users:', error)
  }
}

addTestAdminUsers()