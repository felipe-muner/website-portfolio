import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { payments, members, plans } from '@/lib/db/schema'
import { eq, and, gte, lte, desc } from 'drizzle-orm'
import { startOfDay, endOfDay, subDays } from 'date-fns'

export async function POST(request: NextRequest) {
  try {
    const { startDate, endDate, facilityFilter } = await request.json()

    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: 'Start date and end date are required' },
        { status: 400 }
      )
    }

    const start = startOfDay(new Date(startDate))
    const end = endOfDay(new Date(endDate))

    // Get all payments in the date range with member and plan information
    const paymentsQuery = db
      .select({
        id: payments.id,
        amount: payments.amount,
        gymShareAmount: payments.gymShareAmount,
        crossfitShareAmount: payments.crossfitShareAmount,
        paymentDate: payments.paymentDate,
        memberName: members.name,
        planType: members.planType,
        planName: plans.name,
        planCategory: plans.planCategory,
      })
      .from(payments)
      .leftJoin(members, eq(payments.memberId, members.id))
      .leftJoin(plans, eq(payments.planId, plans.id))
      .where(
        and(
          gte(payments.paymentDate, start),
          lte(payments.paymentDate, end)
        )
      )
      .orderBy(payments.paymentDate) // ASC order as requested

    const allPayments = await paymentsQuery

    // Filter by facility type if specified
    let filteredPayments = allPayments
    if (facilityFilter !== 'all') {
      filteredPayments = allPayments.filter(payment => {
        if (!payment.planCategory) return false

        if (facilityFilter === 'gym') {
          return payment.planCategory === 'gym' || payment.planCategory === 'fitness' || payment.planCategory === 'combo'
        } else if (facilityFilter === 'crossfit') {
          return payment.planCategory === 'crossfit'
        }
        return true
      })
    }

    // Calculate facility-specific revenue using actual share amounts
    const gymRevenue = filteredPayments.reduce((sum, p) => {
      const gymShare = p.gymShareAmount ? parseFloat(p.gymShareAmount) : 0
      return sum + gymShare
    }, 0)

    const crossfitRevenue = filteredPayments.reduce((sum, p) => {
      const crossfitShare = p.crossfitShareAmount ? parseFloat(p.crossfitShareAmount) : 0
      return sum + crossfitShare
    }, 0)

    const totalRevenue = filteredPayments.reduce((sum, p) => sum + parseFloat(p.amount), 0)

    // Calculate transaction counts
    const gymTransactions = filteredPayments.filter(p => p.gymShareAmount && parseFloat(p.gymShareAmount) > 0).length
    const crossfitTransactions = filteredPayments.filter(p => p.crossfitShareAmount && parseFloat(p.crossfitShareAmount) > 0).length
    const totalTransactions = filteredPayments.length

    const averageTransactionValue = totalTransactions > 0 ? totalRevenue / totalTransactions : 0

    // Get previous period for comparison (same duration before start date)
    const daysDiff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
    const previousPeriodStart = startOfDay(subDays(start, daysDiff))
    const previousPeriodEnd = endOfDay(subDays(start, 1))

    const previousPeriodPayments = await db
      .select({
        amount: payments.amount,
      })
      .from(payments)
      .leftJoin(members, eq(payments.memberId, members.id))
      .where(
        and(
          gte(payments.paymentDate, previousPeriodStart),
          lte(payments.paymentDate, previousPeriodEnd)
        )
      )

    const previousPeriodRevenue = previousPeriodPayments.reduce((sum, p) => sum + parseFloat(p.amount), 0)
    const growthPercentage = previousPeriodRevenue > 0
      ? ((totalRevenue - previousPeriodRevenue) / previousPeriodRevenue) * 100
      : totalRevenue > 0 ? 100 : 0

    // Format transactions for display with share amounts
    const transactions = filteredPayments.map(payment => ({
      id: payment.id,
      memberName: payment.memberName || 'Unknown',
      planName: payment.planName || 'Unknown Plan', // Use plan name (text label) instead of planType
      amount: parseFloat(payment.amount),
      gymShareAmount: payment.gymShareAmount ? parseFloat(payment.gymShareAmount) : 0,
      crossfitShareAmount: payment.crossfitShareAmount ? parseFloat(payment.crossfitShareAmount) : 0,
      paymentDate: payment.paymentDate.toISOString()
      // Removed facilityType as requested
    }))

    // Generate daily revenue data for charts (optional for future enhancement)
    const dailyRevenue: Array<{
      date: string
      gymRevenue: number
      crossfitRevenue: number
      totalRevenue: number
    }> = []

    const reportData = {
      totalRevenue,
      gymRevenue,
      crossfitRevenue,
      totalTransactions,
      gymTransactions,
      crossfitTransactions,
      averageTransactionValue,
      periodComparison: {
        previousPeriodRevenue,
        growthPercentage
      },
      transactions,
      dailyRevenue
    }

    return NextResponse.json({
      success: true,
      reportData
    })

  } catch (error) {
    console.error('Error generating income report:', error)
    return NextResponse.json(
      { error: 'Failed to generate income report' },
      { status: 500 }
    )
  }
}

