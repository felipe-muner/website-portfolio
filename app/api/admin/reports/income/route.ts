import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { payments, members } from '@/lib/db/schema'
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

    // Get all payments in the date range with member information
    const paymentsQuery = db
      .select({
        id: payments.id,
        amount: payments.amount,
        paymentDate: payments.paymentDate,
        memberName: members.name,
        planType: members.planType,
      })
      .from(payments)
      .leftJoin(members, eq(payments.memberId, members.id))
      .where(
        and(
          gte(payments.paymentDate, start),
          lte(payments.paymentDate, end)
        )
      )
      .orderBy(desc(payments.paymentDate))

    const allPayments = await paymentsQuery

    // Filter by facility type if specified
    let filteredPayments = allPayments
    if (facilityFilter !== 'all') {
      filteredPayments = allPayments.filter(payment => {
        if (!payment.planType) return false

        if (facilityFilter === 'gym') {
          return payment.planType.includes('gym') && !payment.planType.includes('crossfit')
        } else if (facilityFilter === 'crossfit') {
          return payment.planType.includes('crossfit')
        }
        return true
      })
    }

    // Calculate facility-specific revenue
    const gymRevenue = filteredPayments
      .filter(p => p.planType && (p.planType.includes('gym')))
      .reduce((sum, p) => sum + parseFloat(p.amount), 0)

    const crossfitRevenue = filteredPayments
      .filter(p => p.planType && p.planType.includes('crossfit'))
      .reduce((sum, p) => sum + parseFloat(p.amount), 0)

    const totalRevenue = filteredPayments.reduce((sum, p) => sum + parseFloat(p.amount), 0)

    // Calculate transaction counts
    const gymTransactions = filteredPayments.filter(p => p.planType && p.planType.includes('gym')).length
    const crossfitTransactions = filteredPayments.filter(p => p.planType && p.planType.includes('crossfit')).length
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

    // Format transactions for display
    const transactions = filteredPayments.map(payment => ({
      id: payment.id,
      memberName: payment.memberName || 'Unknown',
      planType: payment.planType || 'Unknown',
      amount: parseFloat(payment.amount),
      paymentDate: payment.paymentDate.toISOString(),
      facilityType: getFacilityType(payment.planType || '')
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

function getFacilityType(planType: string): 'gym' | 'crossfit' | 'combo' {
  if (planType.includes('gym') && planType.includes('crossfit')) {
    return 'combo'
  } else if (planType.includes('crossfit')) {
    return 'crossfit'
  } else {
    return 'gym'
  }
}