'use client'

import { useState, useEffect, forwardRef, useImperativeHandle } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PhoneDisplay } from '@/components/ui/phone-display'
import { Edit, Pause, Play, AlertTriangle, Receipt, Cake } from 'lucide-react'
import { checkMembershipValidity, getMembershipStatusBadge, shouldShowPauseButton, validatePauseAction } from '@/lib/utils/membership'
import { PaymentListSheet } from './payment-list-sheet'
import Link from 'next/link'

interface Member {
  id: string
  name: string
  email: string | null
  passportId: string | null
  phone: string | null
  birthday: string | null
  nationalityId: string | null
  planType: string
  planDuration: number | null
  startDate: string
  originalEndDate: string
  currentEndDate: string
  isActive: boolean
  isPaused: boolean
  pauseCount: number
  remainingVisits: number | null
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

const planTypeLabels = {
  gym_only: 'Gym Only',
  gym_crossfit: 'Gym + CrossFit',
  gym_5pass: 'Gym 5-Pass',
  fitness_5pass: 'Fitness 5-Pass',
  crossfit_5pass: 'CrossFit 5-Pass',
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('')
}

function Avatar({ name }: { name: string }) {
  const initials = getInitials(name)

  return (
    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-medium">
      {initials}
    </div>
  )
}

function isBirthdayToday(birthday: string | null): boolean {
  if (!birthday) return false

  const today = new Date()
  const birthDate = new Date(birthday)

  return (
    today.getMonth() === birthDate.getMonth() &&
    today.getDate() === birthDate.getDate()
  )
}

interface MembersTableProps {
  searchQuery: string
}

export interface MembersTableRef {
  refreshMembers: () => void
}

export const MembersTable = forwardRef<MembersTableRef, MembersTableProps>(
  function MembersTable({ searchQuery }, ref) {
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedMemberForPayments, setSelectedMemberForPayments] = useState<{ id: string; name: string } | null>(null)

  useEffect(() => {
    fetchMembers()
  }, [])

  useImperativeHandle(ref, () => ({
    refreshMembers: fetchMembers
  }))

  const fetchMembers = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/members')
      if (response.ok) {
        const data = await response.json()
        setMembers(data)
      } else {
        console.error('Failed to fetch members')
      }
    } catch (error) {
      console.error('Error fetching members:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredMembers = members.filter((member) => {
    const query = searchQuery.toLowerCase()
    return (
      member.name.toLowerCase().includes(query) ||
      (member.email && member.email.toLowerCase().includes(query)) ||
      (member.passportId && member.passportId.toLowerCase().includes(query))
    )
  })

  const getStatusBadge = (member: Member) => {
    const membershipStatus = checkMembershipValidity({
      planType: member.planType,
      planDuration: member.planDuration,
      currentEndDate: member.currentEndDate,
      isActive: member.isActive,
      isPaused: member.isPaused,
      remainingVisits: member.remainingVisits,
    })

    const badgeConfig = getMembershipStatusBadge(membershipStatus)

    return (
      <div className="flex items-center gap-2">
        <Badge
          variant={badgeConfig.variant}
          className={badgeConfig.className}
        >
          {badgeConfig.text}
        </Badge>
        {membershipStatus.reason && membershipStatus.daysRemaining <= 7 && membershipStatus.daysRemaining > 0 && (
          <div title={membershipStatus.reason}>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </div>
        )}
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB')
  }

  const handlePauseToggle = async (member: Member) => {
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
        fetchMembers() // Refresh the members list
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
      <Card>
        <CardHeader>
          <CardTitle>All Members</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="text-gray-500">Loading members...</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Members ({filteredMembers.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Valid</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMembers.map((member) => {
              const membershipStatus = checkMembershipValidity({
                planType: member.planType,
                planDuration: member.planDuration,
                currentEndDate: member.currentEndDate,
                isActive: member.isActive,
                isPaused: member.isPaused,
                remainingVisits: member.remainingVisits,
              })

              return (
                <TableRow key={member.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar name={member.name} />
                      <div className="flex items-center gap-2">
                        {isBirthdayToday(member.birthday) && (
                          <div title="Birthday today!">
                            <Cake className="h-4 w-4 text-orange-500" />
                          </div>
                        )}
                        <div>
                          <div className="font-medium">{member.name}</div>
                          <div className="text-sm text-gray-500">{member.passportId}</div>
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="text-sm">{member.email || 'No email'}</div>
                      <div className="text-sm text-gray-500">
                        {member.phone ? (
                          <PhoneDisplay phoneNumber={member.phone} flagSize="sm" />
                        ) : (
                          'No phone'
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {member.planType ? (
                      <div className="flex items-center gap-1">
                        <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">
                          {planTypeLabels[member.planType as keyof typeof planTypeLabels] ||
                           member.planType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </Badge>
                        {member.planType.includes('5pass') && member.remainingVisits !== null && (
                          <span className="text-xs text-gray-500">({member.remainingVisits} visits)</span>
                        )}
                      </div>
                    ) : (
                      <Badge variant="secondary">No Plan</Badge>
                    )}
                  </TableCell>
                  <TableCell>{formatDate(member.currentEndDate)}</TableCell>
                  <TableCell>{getStatusBadge(member)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {membershipStatus.isValid ? (
                        <Badge variant="default" className="bg-green-100 text-green-800 text-xs">
                          ✓
                        </Badge>
                      ) : (
                        <Badge variant="destructive" className="text-xs" title={membershipStatus.reason}>
                          ✗
                        </Badge>
                      )}
                      {membershipStatus.daysRemaining <= 30 && membershipStatus.daysRemaining > 0 && (
                        <span className="text-xs text-gray-500">{membershipStatus.daysRemaining}d</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedMemberForPayments({ id: member.id, name: member.name })}
                        title="View payments"
                      >
                        <Receipt className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/members/${member.id}`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      {shouldShowPauseButton({
                        planType: member.planType,
                        planDuration: member.planDuration,
                        isPaused: member.isPaused,
                        pauseCount: member.pauseCount,
                      }) && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handlePauseToggle(member)}
                          title={member.isPaused ? 'Resume membership' : 'Pause membership'}
                        >
                          {member.isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </CardContent>

      {selectedMemberForPayments && (
        <PaymentListSheet
          open={!!selectedMemberForPayments}
          onOpenChange={(open) => !open && setSelectedMemberForPayments(null)}
          memberId={selectedMemberForPayments.id}
          memberName={selectedMemberForPayments.name}
        />
      )}
    </Card>
  )
})