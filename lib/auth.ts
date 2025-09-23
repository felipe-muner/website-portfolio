import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { DrizzleAdapter } from '@auth/drizzle-adapter'
import { db } from './db'
import { adminUsers } from './db/schema'
import { eq, isNull, and } from 'drizzle-orm'

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(db),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false
      
      // Check if user is authorized admin (active and not soft-deleted)
      const adminUser = await db
        .select()
        .from(adminUsers)
        .where(and(
          eq(adminUsers.email, user.email),
          isNull(adminUsers.deletedAt) // Exclude soft-deleted users
        ))
        .limit(1)

      if (adminUser.length === 0) {
        return false
      }

      if (!adminUser[0].isActive) {
        return false
      }
      
      // Update last login
      await db
        .update(adminUsers)
        .set({ lastLogin: new Date() })
        .where(eq(adminUsers.email, user.email))
      
      return true
    },
    async session({ session }) {
      if (session.user?.email) {
        const adminUser = await db
          .select()
          .from(adminUsers)
          .where(and(
            eq(adminUsers.email, session.user.email),
            isNull(adminUsers.deletedAt) // Exclude soft-deleted users
          ))
          .limit(1)

        if (adminUser.length > 0 && adminUser[0].isActive) {
          session.user.role = adminUser[0].role
          session.user.id = adminUser[0].id
        }
      }
      return session
    },
  },
  pages: {
    signIn: '/admin/login',
  },
})