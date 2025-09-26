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

    // Calculate facility-specific revenue using plan percentages when share amounts are not available
    const gymRevenue = filteredPayments.reduce((sum, p) => {
      const totalAmount = parseFloat(p.amount)

      if (p.gymShareAmount && parseFloat(p.gymShareAmount) > 0) {
        // Use actual share amount if available
        return sum + parseFloat(p.gymShareAmount)
      } else if (p.planCategory) {
        // Calculate from plan percentages
        const planCategory = p.planCategory
        if (planCategory === 'crossfit') {
          // CrossFit plans: 20% to gym
          return sum + (totalAmount * 0.20)
        } else {
          // All other plans: 100% to gym
          return sum + totalAmount
        }
      }
      return sum
    }, 0)

    const crossfitRevenue = filteredPayments.reduce((sum, p) => {
      const totalAmount = parseFloat(p.amount)

      if (p.crossfitShareAmount && parseFloat(p.crossfitShareAmount) > 0) {
        // Use actual share amount if available
        return sum + parseFloat(p.crossfitShareAmount)
      } else if (p.planCategory === 'crossfit') {
        // CrossFit plans: 80% to crossfit
        return sum + (totalAmount * 0.80)
      }
      return sum
    }, 0)

    const totalRevenue = filteredPayments.reduce((sum, p) => sum + parseFloat(p.amount), 0)

    // Calculate transaction counts
    const gymTransactions = filteredPayments.filter(p => {
      if (p.gymShareAmount && parseFloat(p.gymShareAmount) > 0) return true
      return p.planCategory !== 'crossfit' || p.planCategory === 'crossfit' // All transactions contribute to gym (100% for non-crossfit, 20% for crossfit)
    }).length

    const crossfitTransactions = filteredPayments.filter(p => {
      if (p.crossfitShareAmount && parseFloat(p.crossfitShareAmount) > 0) return true
      return p.planCategory === 'crossfit'
    }).length
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

    // Format transactions for display with calculated share amounts
    const transactions = filteredPayments.map(payment => {
      const totalAmount = parseFloat(payment.amount)
      let gymShareAmount = 0
      let crossfitShareAmount = 0

      if (payment.gymShareAmount && parseFloat(payment.gymShareAmount) > 0) {
        // Use actual share amounts if available
        gymShareAmount = parseFloat(payment.gymShareAmount)
        crossfitShareAmount = payment.crossfitShareAmount ? parseFloat(payment.crossfitShareAmount) : 0
      } else if (payment.planCategory) {
        // Calculate from plan category
        if (payment.planCategory === 'crossfit') {
          // CrossFit plans: 20% to gym, 80% to crossfit
          gymShareAmount = totalAmount * 0.20
          crossfitShareAmount = totalAmount * 0.80
        } else {
          // All other plans: 100% to gym, 0% to crossfit
          gymShareAmount = totalAmount
          crossfitShareAmount = 0
        }
      }

      return {
        id: payment.id,
        memberName: payment.memberName || 'Unknown',
        planName: payment.planName || 'Unknown Plan',
        amount: totalAmount,
        gymShareAmount,
        crossfitShareAmount,
        paymentDate: payment.paymentDate.toISOString()
      }
    })

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

