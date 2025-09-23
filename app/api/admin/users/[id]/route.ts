import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { adminUsers } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    const session = await auth()

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin
    const currentUser = await db
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.email, session.user.email))
      .limit(1)

    if (currentUser.length === 0 || currentUser[0].role !== 'admin') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    const body = await request.json()
    const { role, isActive } = body

    const updateData: { role?: 'admin' | 'staff'; isActive?: boolean } = {}
    if (role !== undefined) updateData.role = role as 'admin' | 'staff'
    if (isActive !== undefined) updateData.isActive = isActive

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: 'No valid fields to update' },
        { status: 400 }
      )
    }

    const updatedUser = await db
      .update(adminUsers)
      .set(updateData)
      .where(eq(adminUsers.id, params.id))
      .returning()

    if (updatedUser.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json(updatedUser[0])
  } catch (error) {
    console.error('Error updating admin user:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    const session = await auth()

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin
    const currentUser = await db
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.email, session.user.email))
      .limit(1)

    if (currentUser.length === 0 || currentUser[0].role !== 'admin') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Prevent deleting yourself
    if (currentUser[0].id === params.id) {
      return NextResponse.json(
        { error: 'Cannot delete your own account' },
        { status: 400 }
      )
    }

    // Soft delete - set deletedAt timestamp instead of actually deleting
    const deletedUser = await db
      .update(adminUsers)
      .set({
        deletedAt: new Date(),
        isActive: false // Also deactivate when soft deleting
      })
      .where(eq(adminUsers.id, params.id))
      .returning()

    if (deletedUser.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'User deleted successfully (soft delete)' })
  } catch (error) {
    console.error('Error deleting admin user:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}