'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loader2, CheckCircle, XCircle, User, Calendar, RefreshCw, Clock } from 'lucide-react'
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
  success?: boolean
  membershipStatus?: 'active' | 'expired' | 'inactive' | 'paused'
  message?: string
  currentEndDate?: string
}

export default function AdminCheckInPage() {
  const [identifier, setIdentifier] = useState('')
  const [isLoading, setIsLoading] = useState(false)
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
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/checkin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          identifier: identifier.trim()
        }),
      })

      const data: ValidationResult = await response.json()

      // Add new check-in record to the top of the list
      const newCheckIn: CheckInRecord = {
        id: `temp-${Date.now()}`, // temporary ID
        memberName: data.memberInfo?.name || 'Unknown Member',
        email: data.memberInfo?.email || identifier.trim(),
        planType: data.memberInfo?.planType,
        facilityType: 'gym',
        checkInTime: new Date().toISOString(),
        success: data.success,
        membershipStatus: data.memberInfo?.membershipStatus,
        message: data.message,
        currentEndDate: data.memberInfo?.currentEndDate
      }

      // Add to the beginning of the list
      setCheckIns(prev => [newCheckIn, ...prev])

      // Clear input on successful validation
      if (data.success) {
        setIdentifier('')
      }
    } catch {
      // Add error check-in record to the top of the list
      const errorCheckIn: CheckInRecord = {
        id: `error-${Date.now()}`,
        memberName: 'Unknown Member',
        email: identifier.trim(),
        facilityType: 'gym',
        checkInTime: new Date().toISOString(),
        success: false,
        message: 'Network error. Please try again.'
      }
      setCheckIns(prev => [errorCheckIn, ...prev])
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

      <div className="max-w-3xl">
        <Card className="shadow-lg">
          <CardContent className='p-6 h-full overflow-y-auto'>
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

            {/* Recent Check-ins */}
            <div className="border-t pt-6 mt-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Recent Check-ins</h2>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{checkIns.length}</Badge>
                  <Button
                    onClick={fetchRecentCheckIns}
                    variant="outline"
                    size="sm"
                    disabled={isLoadingCheckIns}
                  >
                    {isLoadingCheckIns ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <RefreshCw className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>


              {/* Check-ins List */}
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
                <div className="space-y-3">
                  {checkIns.map((checkIn) => (
                    <div key={checkIn.id} className={cn(
                      "p-4 rounded-lg border-l-4",
                      checkIn.success === false
                        ? "bg-red-50 border-l-red-500"
                        : "bg-green-50 border-l-green-500"
                    )}>
                      {/* Header with status and time */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="text-xs text-gray-500 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatTime(checkIn.checkInTime)}
                          </div>
                          {checkIn.success ? (
                            <CheckCircle className="h-5 w-5 text-green-700" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-700" />
                          )}
                          <span className={cn(
                            "font-semibold",
                            checkIn.success ? "text-green-900" : "text-red-900"
                          )}>
                            {checkIn.success ? "Access Granted" : "Access Denied"}
                          </span>
                        </div>
                      </div>

                      {/* Message */}
                      {checkIn.message && (
                        <div className={cn(
                          "text-sm mb-3",
                          checkIn.success ? "text-green-800" : "text-red-800"
                        )}>
                          {checkIn.message}
                        </div>
                      )}

                      {/* Member Information */}
                      <div className="bg-white rounded border p-3">
                        <div className="mb-2">
                          <div className="flex items-center gap-2 mb-1">
                            <User className="h-4 w-4 text-gray-500" />
                            <span className="font-medium text-sm">{checkIn.memberName}</span>
                          </div>
                          <div className="text-xs text-gray-600 ml-6">{checkIn.email}</div>
                        </div>

                        {checkIn.membershipStatus && checkIn.planType && (
                          <div className="flex items-center gap-3 mb-2">
                            {getStatusBadge(checkIn.membershipStatus)}
                            <Badge variant="outline" className="text-xs">
                              {formatPlanType(checkIn.planType)}
                            </Badge>
                          </div>
                        )}

                        {checkIn.currentEndDate && (
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <Calendar className="h-3 w-3" />
                            <span>Until: {formatDate(checkIn.currentEndDate)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}