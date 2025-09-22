'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { PaymentHistory } from '@/components/admin/members/payment-history'
import { checkMembershipValidity, getMembershipStatusBadge, shouldShowPauseButton, validatePauseAction } from '@/lib/utils/membership'
import { ArrowLeft, Edit, Pause, Play, Calendar, CreditCard, Phone, Mail, User } from 'lucide-react'
import Link from 'next/link'

interface Member {
  id: string
  name: string
  email: string | null
  passportId: string | null
  phone: string | null
  nationalityId: string | null
  planType: string | null
  planDuration: number | null
  startDate: string
  originalEndDate: string
  currentEndDate: string
  isActive: boolean
  isPaused: boolean
  pauseCount: number
  usedVisits: number | null
  createdAt: string
  updatedAt: string
}

export default function MemberDetailsPage() {
  const params = useParams()
  const memberId = params.id as string

  const [member, setMember] = useState<Member | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMember()
  }, [memberId]) // eslint-disable-line react-hooks/exhaustive-deps

  const fetchMember = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/members/${memberId}`)
      if (response.ok) {
        const data = await response.json()
        setMember(data)
      } else {
        console.error('Failed to fetch member')
      }
    } catch (error) {
      console.error('Error fetching member:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  const handlePauseToggle = async () => {
    if (!member) return

    const validation = validatePauseAction({
      planType: member.planType,
      planDuration: member.planDuration,
      isPaused: member.isPaused,
      pauseCount: member.pauseCount,
    })

    const action = member.isPaused ? 'unpause' : 'pause'

    if (action === 'pause' && !validation.canPause) {
      alert(validation.reason || 'Cannot pause membership')
      return
    }

    if (action === 'unpause' && !validation.canUnpause) {
      alert(validation.reason || 'Cannot unpause membership')
      return
    }

    try {
      const response = await fetch(`/api/admin/members/${member.id}/pause`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action,
          reason: action === 'pause' ? 'Paused by admin' : 'Resumed by admin',
        }),
      })

      const data = await response.json()

      if (response.ok) {
        fetchMember() // Refresh the member data
      } else {
        alert(data.error || 'Failed to update membership status')
      }
    } catch (error) {
      console.error('Error updating membership status:', error)
      alert('Failed to update membership status')
    }
  }

  if (loading) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="text-center py-8">Loading member details...</div>
      </div>
    )
  }

  if (!member) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="text-center py-8">Member not found</div>
      </div>
    )
  }

  const membershipStatus = checkMembershipValidity({
    planType: member.planType,
    planDuration: member.planDuration,
    currentEndDate: member.currentEndDate,
    isActive: member.isActive,
    isPaused: member.isPaused,
    usedVisits: member.usedVisits,
  })

  const statusBadgeConfig = getMembershipStatusBadge(membershipStatus)

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/dashboard">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{member.name}</h1>
            <p className="text-gray-600">Member Details & Payment History</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4 mr-2" />
            Edit Member
          </Button>
          {shouldShowPauseButton({
            planType: member.planType,
            planDuration: member.planDuration,
            isPaused: member.isPaused,
            pauseCount: member.pauseCount,
          }) && (
            <Button variant="outline" size="sm" onClick={handlePauseToggle}>
              {member.isPaused ? <Play className="h-4 w-4 mr-2" /> : <Pause className="h-4 w-4 mr-2" />}
              {member.isPaused ? 'Resume' : 'Pause'} Membership
            </Button>
          )}
        </div>
      </div>

      {/* Member Information Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Full Name</label>
              <p className="font-medium">{member.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Passport/ID</label>
              <p>{member.passportId || 'Not provided'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Email</label>
              <p className="flex items-center gap-2">
                {member.email ? (
                  <>
                    <Mail className="h-4 w-4" />
                    {member.email}
                  </>
                ) : (
                  'Not provided'
                )}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Phone</label>
              <p className="flex items-center gap-2">
                {member.phone ? (
                  <>
                    <Phone className="h-4 w-4" />
                    {member.phone}
                  </>
                ) : (
                  'Not provided'
                )}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Membership Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Membership Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Current Status</label>
              <div className="mt-1">
                <Badge
                  variant={statusBadgeConfig.variant}
                  className={statusBadgeConfig.className}
                >
                  {statusBadgeConfig.text}
                </Badge>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Plan Type</label>
              <div>{member.planType ? (
                <Badge variant="outline">{member.planType.replace('_', ' ').toUpperCase()}</Badge>
              ) : (
                'No plan assigned'
              )}</div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Validity</label>
              <div className="flex items-center gap-2">
                {membershipStatus.isValid ? (
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    Valid
                  </Badge>
                ) : (
                  <Badge variant="destructive">
                    Invalid
                  </Badge>
                )}
                {membershipStatus.reason && (
                  <span className="text-sm text-gray-500">{membershipStatus.reason}</span>
                )}
              </div>
            </div>
            {member.usedVisits !== null && (
              <div>
                <label className="text-sm font-medium text-gray-500">Used Visits</label>
                <p className="font-medium">{member.usedVisits}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Membership Timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Membership Timeline
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Start Date</label>
              <p>{formatDate(member.startDate)}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">End Date</label>
              <p>{formatDate(member.currentEndDate)}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Duration</label>
              <p>{member.planDuration ? `${member.planDuration} months` : 'Pass-based'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Days Remaining</label>
              <p className={membershipStatus.daysRemaining <= 7 ? 'text-red-600 font-medium' : ''}>
                {membershipStatus.daysRemaining > 0 ? `${membershipStatus.daysRemaining} days` : 'Expired'}
              </p>
            </div>
            {member.pauseCount > 0 && (
              <div>
                <label className="text-sm font-medium text-gray-500">Pause Count</label>
                <p>{member.pauseCount}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <hr className="my-6" />

      {/* Payment History */}
      <PaymentHistory memberId={member.id} memberName={member.name} />
    </div>
  )
}