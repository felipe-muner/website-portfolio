import { db } from '../lib/db'
import { adminUsers } from '../lib/db/schema'

async function addUser(email: string, name: string, role: 'admin' | 'staff') {
  try {
    console.log(`Adding ${email} as ${role}...`)

    const newUser = await db
      .insert(adminUsers)
      .values({
        email,
        name,
        role,
        isActive: true,
      })
      .onConflictDoUpdate({
        target: adminUsers.email,
        set: {
          name,
          role,
          isActive: true,
        },
      })
      .returning()

    console.log('✅ User added/updated:', newUser[0])
    return newUser[0]

  } catch (error) {
    console.error('❌ Error adding user:', error)
    throw error
  }
}

// Example usage
async function main() {
  const email = process.argv[2]
  const name = process.argv[3]
  const role = process.argv[4] as 'admin' | 'staff'

  if (!email || !name || !role) {
    console.log('Usage: npm run add-user <email> <name> <role>')
    console.log('Example: npm run add-user xpto@gmail.com "XPTO User" staff')
    process.exit(1)
  }

  if (role !== 'admin' && role !== 'staff') {
    console.log('Role must be either "admin" or "staff"')
    process.exit(1)
  }

  await addUser(email, name, role)
}

main()