import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { members, payments, checkIns } from '@/lib/db/schema'
import { eq, or, desc, isNull, and } from 'drizzle-orm'
import { isBefore } from 'date-fns'

type ValidationResult = {
  success: boolean
  message: string
  memberInfo?: {
    name: string
    email: string
    planType: string
    membershipStatus: 'active' | 'expired' | 'inactive' | 'paused'
    currentEndDate: string
    lastPayment?: {
      date: string
      amount: string
      type: string
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const { identifier } = await request.json()

    if (!identifier) {
      return NextResponse.json<ValidationResult>({
        success: false,
        message: 'Email or passport ID is required'
      }, { status: 400 })
    }

    // Find member by email or passport
    const member = await db
      .select()
      .from(members)
      .where(
        and(
          or(
            eq(members.email, identifier.toLowerCase()),
            eq(members.passportId, identifier.toUpperCase())
          ),
          isNull(members.deletedAt)
        )
      )
      .limit(1)

    if (member.length === 0) {
      return NextResponse.json<ValidationResult>({
        success: false,
        message: 'Member not found. Please check the email or passport ID.'
      }, { status: 404 })
    }

    const memberData = member[0]
    const now = new Date()

    // Get the last payment for this member
    const lastPayment = await db
      .select()
      .from(payments)
      .where(eq(payments.memberId, memberData.id))
      .orderBy(desc(payments.paymentDate))
      .limit(1)

    // Determine membership status
    const currentEndDate = new Date(memberData.currentEndDate)
    let membershipStatus: 'active' | 'expired' | 'inactive' | 'paused'
    let isValid = false
    let message = ''

    if (!memberData.isActive) {
      membershipStatus = 'inactive'
      message = 'Membership is inactive. Please contact reception to reactivate.'
    } else if (memberData.isPaused) {
      membershipStatus = 'paused'
      message = 'Membership is currently paused. Please contact reception to resume.'
    } else if (isBefore(currentEndDate, now)) {
      membershipStatus = 'expired'
      message = `Membership expired on ${currentEndDate.toLocaleDateString()}. Payment required to renew access.`
    } else {
      membershipStatus = 'active'
      isValid = true
      message = `Welcome ${memberData.name}! Membership is valid until ${currentEndDate.toLocaleDateString()}.`
    }

    // Check for 5-pass plans with no remaining visits
    if (isValid && memberData.planType?.includes('5pass')) {
      if (memberData.remainingVisits === null || memberData.remainingVisits === undefined || memberData.remainingVisits <= 0) {
        isValid = false
        membershipStatus = 'expired'
        message = `No remaining visits on your ${memberData.planType} pass. Please purchase a new pass.`
      } else {
        message = `Welcome ${memberData.name}! You have ${memberData.remainingVisits} visits remaining.`
      }
    }

    // Record check-in if validation is successful
    if (isValid) {
      await db.insert(checkIns).values({
        memberId: memberData.id,
        facilityType: 'gym', // Default to gym for admin check-ins
        checkInTime: now
      })

      // For 5-pass plans, decrease remaining visits
      if (memberData.planType?.includes('5pass') && memberData.remainingVisits && memberData.remainingVisits > 0) {
        await db
          .update(members)
          .set({
            remainingVisits: memberData.remainingVisits - 1,
            updatedAt: now
          })
          .where(eq(members.id, memberData.id))

        // Update the message to reflect the new visit count
        message = `Welcome ${memberData.name}! You have ${memberData.remainingVisits - 1} visits remaining.`
      }
    }

    const result: ValidationResult = {
      success: isValid,
      message,
      memberInfo: {
        name: memberData.name,
        email: memberData.email || 'No email on file',
        planType: memberData.planType || 'No plan assigned',
        membershipStatus,
        currentEndDate: memberData.currentEndDate.toISOString(),
        lastPayment: lastPayment.length > 0 ? {
          date: lastPayment[0].paymentDate.toISOString(),
          amount: lastPayment[0].amount,
          type: 'membership'
        } : undefined
      }
    }

    return NextResponse.json<ValidationResult>(result)

  } catch (error) {
    console.error('Error validating member:', error)
    return NextResponse.json<ValidationResult>({
      success: false,
      message: 'System error. Please try again.'
    }, { status: 500 })
  }
}