import { db } from '../lib/db'
import { adminUsers } from '../lib/db/schema'
import { eq } from 'drizzle-orm'

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
    process.exit(1)
  }
}

createInitialAdmin()