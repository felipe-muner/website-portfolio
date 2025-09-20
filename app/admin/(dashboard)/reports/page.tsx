'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2, Download, Calendar, TrendingUp, DollarSign, BarChart3, FileText } from 'lucide-react'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'

type ReportData = {
  totalRevenue: number
  gymRevenue: number
  crossfitRevenue: number
  totalTransactions: number
  gymTransactions: number
  crossfitTransactions: number
  averageTransactionValue: number
  periodComparison?: {
    previousPeriodRevenue: number
    growthPercentage: number
  }
  transactions: {
    id: string
    memberName: string
    planType: string
    amount: number
    paymentDate: string
    facilityType: 'gym' | 'crossfit' | 'combo'
  }[]
  dailyRevenue: {
    date: string
    gymRevenue: number
    crossfitRevenue: number
    totalRevenue: number
  }[]
}

export default function ReportsPage() {
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [facilityFilter, setFacilityFilter] = useState<'all' | 'gym' | 'crossfit'>('all')
  const [isLoading, setIsLoading] = useState(false)
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false)
  const [reportData, setReportData] = useState<ReportData | null>(null)

  const handleGenerateReport = async () => {
    if (!startDate || !endDate) {
      alert('Please select both start and end dates')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/admin/reports/income', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          startDate,
          endDate,
          facilityFilter
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setReportData(data.reportData)
      } else {
        throw new Error('Failed to generate report')
      }
    } catch (error) {
      console.error('Error generating report:', error)
      alert('Failed to generate report. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGeneratePdf = async () => {
    if (!reportData) return

    setIsGeneratingPdf(true)
    try {
      const response = await fetch('/api/admin/reports/pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reportData,
          startDate,
          endDate,
          facilityFilter
        }),
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.style.display = 'none'
        a.href = url
        a.download = `income-report-${startDate}-to-${endDate}.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      } else {
        throw new Error('Failed to generate PDF')
      }
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Failed to generate PDF. Please try again.')
    } finally {
      setIsGeneratingPdf(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM dd, yyyy')
  }

  const getFacilityType = (planType: string): 'gym' | 'crossfit' | 'combo' => {
    if (planType.includes('gym') && planType.includes('crossfit')) return 'combo'
    if (planType.includes('crossfit')) return 'crossfit'
    return 'gym'
  }

  const getFacilityBadgeColor = (facilityType: string) => {
    switch (facilityType) {
      case 'gym':
        return 'bg-blue-100 text-blue-800'
      case 'crossfit':
        return 'bg-orange-100 text-orange-800'
      case 'combo':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Income Reports</h1>
          <p className="text-gray-600">Track gym and CrossFit revenue performance</p>
        </div>
        {reportData && (
          <Button
            onClick={handleGeneratePdf}
            disabled={isGeneratingPdf}
            className="bg-red-600 hover:bg-red-700"
          >
            {isGeneratingPdf ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Download className="h-4 w-4 mr-2" />
            )}
            Generate PDF
          </Button>
        )}
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Report Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">
                Start Date
              </label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">
                End Date
              </label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">
                Facility Type
              </label>
              <Select value={facilityFilter} onValueChange={(value: 'all' | 'gym' | 'crossfit') => setFacilityFilter(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Facilities</SelectItem>
                  <SelectItem value="gym">Gym Only</SelectItem>
                  <SelectItem value="crossfit">CrossFit Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button
                onClick={handleGenerateReport}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <FileText className="h-4 w-4 mr-2" />
                )}
                Generate Report
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Report Data */}
      {reportData && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(reportData.totalRevenue)}</div>
                {reportData.periodComparison && (
                  <p className={cn(
                    "text-xs flex items-center gap-1",
                    reportData.periodComparison.growthPercentage >= 0 ? "text-green-600" : "text-red-600"
                  )}>
                    <TrendingUp className="h-3 w-3" />
                    {reportData.periodComparison.growthPercentage >= 0 ? '+' : ''}
                    {reportData.periodComparison.growthPercentage.toFixed(1)}% from previous period
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Gym Revenue</CardTitle>
                <div className="w-3 h-3 bg-blue-500 rounded-full" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(reportData.gymRevenue)}</div>
                <p className="text-xs text-muted-foreground">
                  {reportData.gymTransactions} transactions
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">CrossFit Revenue</CardTitle>
                <div className="w-3 h-3 bg-orange-500 rounded-full" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(reportData.crossfitRevenue)}</div>
                <p className="text-xs text-muted-foreground">
                  {reportData.crossfitTransactions} transactions
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Transaction</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(reportData.averageTransactionValue)}</div>
                <p className="text-xs text-muted-foreground">
                  {reportData.totalTransactions} total transactions
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Transactions Table */}
          <Card>
            <CardHeader>
              <CardTitle>Transaction Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3">Date</th>
                      <th className="text-left p-3">Member</th>
                      <th className="text-left p-3">Plan Type</th>
                      <th className="text-left p-3">Facility</th>
                      <th className="text-right p-3">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.transactions.map((transaction) => (
                      <tr key={transaction.id} className="border-b hover:bg-gray-50">
                        <td className="p-3">{formatDate(transaction.paymentDate)}</td>
                        <td className="p-3 font-medium">{transaction.memberName}</td>
                        <td className="p-3">{transaction.planType.replace('_', ' ').toUpperCase()}</td>
                        <td className="p-3">
                          <Badge
                            variant="secondary"
                            className={getFacilityBadgeColor(getFacilityType(transaction.planType))}
                          >
                            {getFacilityType(transaction.planType)}
                          </Badge>
                        </td>
                        <td className="p-3 text-right font-medium">{formatCurrency(transaction.amount)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Empty State */}
      {!reportData && !isLoading && (
        <Card className="text-center py-12">
          <CardContent>
            <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Report Generated</h3>
            <p className="text-gray-600 mb-4">
              Select date range and facility type, then click &quot;Generate Report&quot; to view income data.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}