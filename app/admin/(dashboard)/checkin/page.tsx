'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loader2, CheckCircle, XCircle, User, Calendar, CreditCard, AlertTriangle, RefreshCw, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'

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

type CheckInRecord = {
  id: string
  memberName: string
  facilityType: 'gym' | 'crossfit' | 'fitness_class'
  checkInTime: string
  planType?: string
  email?: string
}

export default function AdminCheckInPage() {
  const [identifier, setIdentifier] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<ValidationResult | null>(null)
  const [checkIns, setCheckIns] = useState<CheckInRecord[]>([])
  const [isLoadingCheckIns, setIsLoadingCheckIns] = useState(false)

  const fetchRecentCheckIns = async () => {
    setIsLoadingCheckIns(true)
    try {
      const response = await fetch('/api/admin/recent-checkins')
      if (response.ok) {
        const data = await response.json()
        setCheckIns(data.checkIns || [])
      }
    } catch (error) {
      console.error('Failed to fetch recent check-ins:', error)
    } finally {
      setIsLoadingCheckIns(false)
    }
  }

  useEffect(() => {
    fetchRecentCheckIns()
  }, [])

  const handleValidation = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!identifier.trim()) {
      setResult({
        success: false,
        message: 'Please enter email or passport ID'
      })
      return
    }

    setIsLoading(true)
    setResult(null)

    try {
      const response = await fetch('/api/admin/validate-member', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          identifier: identifier.trim()
        }),
      })

      const data: ValidationResult = await response.json()
      setResult(data)

      // Clear input on successful validation and refresh check-ins table
      if (data.success) {
        setIdentifier('')
        // Refresh the check-ins list to show the new entry
        await fetchRecentCheckIns()
      }
    } catch {
      setResult({
        success: false,
        message: 'Network error. Please try again.'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const formatPlanType = (planType: string) => {
    return planType
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM dd, yyyy')
  }

  const formatTime = (dateString: string) => {
    return format(new Date(dateString), 'HH:mm:ss')
  }

  const getFacilityBadgeColor = (facility: string) => {
    switch (facility) {
      case 'gym':
        return 'bg-blue-100 text-blue-800'
      case 'crossfit':
        return 'bg-orange-100 text-orange-800'
      case 'fitness_class':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>
      case 'expired':
        return <Badge className="bg-red-100 text-red-800">Expired</Badge>
      case 'inactive':
        return <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>
      case 'paused':
        return <Badge className="bg-yellow-100 text-yellow-800">Paused</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Member Check-In</h1>
          <p className="text-gray-600">Validate member access by checking payment status</p>
        </div>
        <Button
          onClick={fetchRecentCheckIns}
          variant="outline"
          disabled={isLoadingCheckIns}
        >
          {isLoadingCheckIns ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <RefreshCw className="h-4 w-4 mr-2" />
          )}
          Refresh
        </Button>
      </div>

      <div className="space-y-6">
        {/* Validation Form */}
        <Card className="shadow-lg w-1/2">
          <CardContent className='p-6'>
            <form onSubmit={handleValidation} className="space-y-4">
              {/* Input and Button on same line */}
              <div className="flex gap-4">
                <div className="flex-1">
                  <label htmlFor="identifier" className="text-sm font-medium text-gray-700 block mb-2">
                    Email or Passport ID
                  </label>
                  <Input
                    id="identifier"
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="Enter email or passport ID"
                    disabled={isLoading}
                    className="text-center text-lg"
                  />
                </div>
                <div className="flex items-end">
                  <Button
                    type="submit"
                    size="lg"
                    disabled={isLoading}
                    className="px-8"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Validating...
                      </>
                    ) : (
                      'Validate Member'
                    )}
                  </Button>
                </div>
              </div>
            </form>

            {/* Result Display */}
            {result && (
              <div className={cn(
                "mt-6 p-6 rounded-lg border-2",
                result.success
                  ? "border-green-200 bg-green-50"
                  : "border-red-200 bg-red-50"
              )}>
                <div className="text-center space-y-4">
                  {/* Status Icon */}
                  <div className="flex justify-center">
                    {result.success ? (
                      <CheckCircle className="h-12 w-12 text-green-500" />
                    ) : (
                      <XCircle className="h-12 w-12 text-red-500" />
                    )}
                  </div>

                  {/* Status Message */}
                  <div>
                    <h3 className={cn(
                      "text-xl font-semibold mb-2",
                      result.success ? "text-green-700" : "text-red-700"
                    )}>
                      {result.success ? "Access Granted" : "Access Denied"}
                    </h3>
                    <p className={cn(
                      "text-base",
                      result.success ? "text-green-600" : "text-red-600"
                    )}>
                      {result.message}
                    </p>
                  </div>

                  {/* Member Information */}
                  {result.memberInfo && (
                    <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200 space-y-4">
                      {/* Basic Info */}
                      <div className="flex items-center justify-center gap-2">
                        <User className="h-4 w-4 text-gray-500" />
                        <span className="font-medium text-lg">{result.memberInfo.name}</span>
                      </div>

                      <div className="text-sm text-gray-600">{result.memberInfo.email}</div>

                      {/* Status and Plan */}
                      <div className="flex justify-center items-center gap-4">
                        {getStatusBadge(result.memberInfo.membershipStatus)}
                        <Badge variant="outline">
                          {formatPlanType(result.memberInfo.planType)}
                        </Badge>
                      </div>

                      {/* Membership End Date */}
                      <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span>Membership until: {formatDate(result.memberInfo.currentEndDate)}</span>
                      </div>

                      {/* Last Payment Info */}
                      {result.memberInfo.lastPayment && (
                        <div className="mt-4 p-3 bg-gray-50 rounded border">
                          <div className="flex items-center justify-center gap-2 text-sm font-medium text-gray-700 mb-2">
                            <CreditCard className="h-4 w-4" />
                            Last Payment
                          </div>
                          <div className="text-center space-y-1 text-sm text-gray-600">
                            <div>Date: {formatDate(result.memberInfo.lastPayment.date)}</div>
                            <div>Amount: ${result.memberInfo.lastPayment.amount}</div>
                            <div>Type: {result.memberInfo.lastPayment.type}</div>
                          </div>
                        </div>
                      )}

                      {/* Warning for expired/inactive */}
                      {!result.success && (
                        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
                          <div className="flex items-center justify-center gap-2 text-yellow-800">
                            <AlertTriangle className="h-4 w-4" />
                            <span className="text-sm font-medium">Payment Required</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Check-ins */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Recent Check-ins</span>
              <Badge variant="outline">{checkIns.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingCheckIns ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                Loading check-ins...
              </div>
            ) : checkIns.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No check-ins recorded yet
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {checkIns.map((checkIn) => (
                  <div key={checkIn.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{checkIn.memberName}</div>
                      <div className="text-sm text-gray-600">{checkIn.email}</div>
                      {checkIn.planType && (
                        <div className="text-xs text-gray-500">{formatPlanType(checkIn.planType)}</div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="secondary"
                        className={getFacilityBadgeColor(checkIn.facilityType)}
                      >
                        {checkIn.facilityType}
                      </Badge>
                      <div className="text-sm text-gray-500 font-mono flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatTime(checkIn.checkInTime)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}