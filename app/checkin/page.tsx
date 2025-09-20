'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loader2, CheckCircle, XCircle, User, Clock, Calendar } from 'lucide-react'
import { cn } from '@/lib/utils'

type CheckInResult = {
  success: boolean
  message: string
  memberInfo?: {
    name: string
    planType: string
    remainingVisits?: number
    expiresAt?: string
  }
}

export default function CheckInPage() {
  const [identifier, setIdentifier] = useState('')
  const [facilityType, setFacilityType] = useState<'gym' | 'crossfit' | 'fitness_class'>('gym')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<CheckInResult | null>(null)

  const handleCheckIn = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!identifier.trim()) {
      setResult({
        success: false,
        message: 'Please enter your email or passport ID'
      })
      return
    }

    setIsLoading(true)
    setResult(null)

    try {
      const response = await fetch('/api/checkin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          identifier: identifier.trim(),
          facilityType
        }),
      })

      const data: CheckInResult = await response.json()
      setResult(data)

      // Clear input on successful check-in
      if (data.success) {
        setIdentifier('')
      }
    } catch {
      setResult({
        success: false,
        message: 'Network error. Please try again or contact reception.'
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
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gym Check-In</h1>
          <p className="text-gray-600">Enter your email or passport to access the facility</p>
        </div>

        {/* Check-in Form */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-center">Member Access</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCheckIn} className="space-y-4">
              {/* Facility Type Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Facility Access
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: 'gym', label: 'Gym' },
                    { value: 'crossfit', label: 'CrossFit' },
                    { value: 'fitness_class', label: 'Fitness Class' }
                  ].map((facility) => (
                    <button
                      key={facility.value}
                      type="button"
                      onClick={() => setFacilityType(facility.value as 'gym' | 'crossfit' | 'fitness_class')}
                      className={cn(
                        "px-3 py-2 text-sm rounded-md border transition-colors",
                        facilityType === facility.value
                          ? "bg-blue-500 text-white border-blue-500"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                      )}
                    >
                      {facility.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Identifier Input */}
              <div className="space-y-2">
                <label htmlFor="identifier" className="text-sm font-medium text-gray-700">
                  Email or Passport ID
                </label>
                <Input
                  id="identifier"
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Enter your email or passport ID"
                  disabled={isLoading}
                  className="text-center text-lg"
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Checking...
                  </>
                ) : (
                  'Check In'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Result Display */}
        {result && (
          <Card className={cn(
            "shadow-lg border-2",
            result.success
              ? "border-green-200 bg-green-50"
              : "border-red-200 bg-red-50"
          )}>
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                {/* Status Icon */}
                <div className="flex justify-center">
                  {result.success ? (
                    <CheckCircle className="h-16 w-16 text-green-500" />
                  ) : (
                    <XCircle className="h-16 w-16 text-red-500" />
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
                {result.success && result.memberInfo && (
                  <div className="mt-4 p-4 bg-white rounded-lg border border-green-200 space-y-2">
                    <div className="flex items-center justify-center gap-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">{result.memberInfo.name}</span>
                    </div>

                    <div className="flex justify-center">
                      <Badge variant="secondary">
                        {formatPlanType(result.memberInfo.planType)}
                      </Badge>
                    </div>

                    {result.memberInfo.remainingVisits !== undefined && (
                      <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                        <Clock className="h-4 w-4" />
                        <span>{result.memberInfo.remainingVisits} visits remaining</span>
                      </div>
                    )}

                    {result.memberInfo.expiresAt && (
                      <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span>Expires: {formatDate(result.memberInfo.expiresAt)}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        <Card className="bg-gray-50 border-gray-200">
          <CardContent className="pt-4">
            <div className="text-center text-sm text-gray-600 space-y-2">
              <p><strong>Instructions:</strong></p>
              <ul className="text-left space-y-1 max-w-xs mx-auto">
                <li>• Enter your registered email or passport ID</li>
                <li>• Select the facility you want to access</li>
                <li>• For day passes: one visit per day allowed</li>
                <li>• For monthly plans: unlimited daily access</li>
              </ul>
              <p className="text-xs text-gray-500 mt-3">
                Need help? Contact reception for assistance.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}