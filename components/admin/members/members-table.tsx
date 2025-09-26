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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { PhoneDisplay } from '@/components/ui/phone-display'
import { Edit, Pause, Play, Receipt, Cake, User } from 'lucide-react'
import { checkMembershipValidity, validatePauseAction } from '@/lib/utils/membership'
import { PaymentListSheet } from './payment-list-sheet'
import { MemberStatusHelpButton } from './member-status-help-dialog'
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
  planName?: string
  startDate: string
  originalEndDate: string
  currentEndDate: string
  isActive: boolean
  isPaused: boolean
  pauseCount: number
  usedVisits: number | null
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}


function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('')
}

function Avatar({ name, index, hasBirthday }: { name: string; index: number; hasBirthday?: boolean }) {
  const initials = getInitials(name)

  // Create subtle gradient variations based on index
  const gradients = [
    'bg-gradient-to-br from-blue-400 to-blue-600 text-white',
    'bg-gradient-to-br from-purple-400 to-purple-600 text-white',
    'bg-gradient-to-br from-green-400 to-green-600 text-white',
    'bg-gradient-to-br from-orange-400 to-orange-600 text-white',
    'bg-gradient-to-br from-pink-400 to-pink-600 text-white',
    'bg-gradient-to-br from-indigo-400 to-indigo-600 text-white',
    'bg-gradient-to-br from-teal-400 to-teal-600 text-white',
    'bg-gradient-to-br from-red-400 to-red-600 text-white',
  ]

  const gradientClass = gradients[index % gradients.length]

  return (
    <div className="relative">
      <div className={`w-20 h-20 text-2xl rounded-full ${gradientClass} flex items-center justify-center text-base font-semibold shadow-md hover:shadow-lg transition-all duration-300`}>
        <span className='text-4xl'>{initials}</span>
      </div>
      {hasBirthday && (
        <div className="absolute -top-3 -right-1 bg-orange-100 rounded-full p-1">
          <Cake className="h-6 w-6 text-orange-600" />
        </div>
      )}
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
  const [pausingMemberId, setPausingMemberId] = useState<string | null>(null)

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
      setPausingMemberId(member.id)

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
        // Update the specific member in the state without reordering
        setMembers(prevMembers =>
          prevMembers.map(m =>
            m.id === member.id
              ? { ...m, isPaused: !m.isPaused, pauseCount: action === 'pause' ? m.pauseCount + 1 : m.pauseCount }
              : m
          )
        )
      } else {
        alert(data.error || 'Failed to update membership status')
      }
    } catch (error) {
      console.error('Error updating membership status:', error)
      alert('Failed to update membership status')
    } finally {
      setPausingMemberId(null)
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
        <div className="flex items-center">
          <CardTitle>All Members ({filteredMembers.length})</CardTitle>
          <MemberStatusHelpButton />
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Member</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMembers.map((member, index) => {
              const membershipStatus = checkMembershipValidity({
                planType: member.planType,
                planDuration: member.planDuration,
                currentEndDate: member.currentEndDate,
                isActive: member.isActive,
                isPaused: member.isPaused,
                usedVisits: member.usedVisits,
              })

              return (
                <TableRow key={member.id}>
                  <TableCell>
                    <div className="flex items-center gap-4">
                      <Avatar name={member.name} index={index} hasBirthday={isBirthdayToday(member.birthday)} />
                      <div className="flex-1">
                        <div className="text-base font-semibold text-gray-900 mb-1">{member.name}</div>
                        <div className="space-y-0.5">
                          <div className="text-sm text-gray-600">{member.email || 'No email'}</div>
                          <div className="text-sm text-gray-500">
                            {member.phone ? (
                              <PhoneDisplay phoneNumber={member.phone} flagSize="sm" />
                            ) : (
                              'No phone'
                            )}
                          </div>
                          {member.passportId && (
                            <div className="text-xs text-gray-400">{member.passportId}</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {member.planName ? (
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1">
                          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">
                            {member.planName}
                          </Badge>
                          {member.planType && (member.planType.includes('5pass') || member.planType.includes('10pass')) && member.usedVisits !== null && (
                            <span
                              className="text-xs text-gray-500 cursor-help"
                              title={
                                (() => {
                                  const totalVisits = member.planType.includes('10pass') ? 10 : 5
                                  const usedVisits = member.usedVisits || 0
                                  const remainingVisits = totalVisits - usedVisits
                                  return remainingVisits > 0
                                    ? `${usedVisits} visits used, ${remainingVisits} remaining out of ${totalVisits} total visits`
                                    : `All ${totalVisits} visits have been used. Pass will expire soon.`
                                })()
                              }
                            >
                              ({member.usedVisits || 0}/{member.planType.includes('10pass') ? '10' : '5'} visits)
                            </span>
                          )}
                          {(() => {
                            const pauseValidation = validatePauseAction({
                              planType: member.planType,
                              planDuration: member.planDuration,
                              isPaused: member.isPaused,
                              pauseCount: member.pauseCount,
                            })
                            const usedPauses = pauseValidation.currentPauses
                            const totalPauses = pauseValidation.maxPauses
                            const remainingPauses = totalPauses - usedPauses

                            if (totalPauses > 0 && (membershipStatus.isValid || member.isPaused)) {
                              const pauseValidation = validatePauseAction({
                                planType: member.planType,
                                planDuration: member.planDuration,
                                isPaused: member.isPaused,
                                pauseCount: member.pauseCount,
                              })

                              let canInteract = false
                              let actionTitle = ''

                              if (member.isPaused) {
                                canInteract = pauseValidation.canUnpause
                                actionTitle = canInteract ? 'Click to resume membership' : (pauseValidation.reason || 'Cannot resume membership')
                              } else {
                                canInteract = pauseValidation.canPause
                                actionTitle = canInteract ? 'Click to pause membership' : (pauseValidation.reason || 'Cannot pause membership')
                              }

                              return (
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Badge
                                        variant="outline"
                                        className={`text-xs transition-all duration-500 ease-in-out transform flex items-center gap-1 ${
                                          member.isPaused
                                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                                            : canInteract
                                              ? 'bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100 hover:scale-105'
                                              : 'bg-gray-50 text-gray-500 border-gray-200'
                                        } ${canInteract ? 'cursor-pointer' : 'cursor-not-allowed opacity-75'}`}
                                        onClick={canInteract && pausingMemberId !== member.id ? () => handlePauseToggle(member) : undefined}
                                        title={actionTitle}
                                      >
                                        {pausingMemberId === member.id ? (
                                          <div className="animate-spin">
                                            <div className="h-3 w-3 border-2 border-current border-t-transparent rounded-full"></div>
                                          </div>
                                        ) : member.isPaused ? (
                                          <Play className="h-3 w-3 text-green-600" />
                                        ) : (
                                          <Pause className={`h-3 w-3 ${canInteract ? 'text-orange-600' : 'text-gray-400'}`} />
                                        )}
                                        {member.isPaused ? (
                                          membershipStatus.daysRemaining <= 7 && membershipStatus.daysRemaining > 0 ?
                                            `Paused (${usedPauses}/${totalPauses}) • ${membershipStatus.daysRemaining}d left` :
                                            `Paused (${usedPauses}/${totalPauses})`
                                        ) : (
                                          `(${usedPauses}/${totalPauses} pauses)`
                                        )}
                                      </Badge>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      {member.isPaused
                                        ? <p>Membership is currently paused. {usedPauses} out of {totalPauses} pauses used. {actionTitle}</p>
                                        : <p>{usedPauses} pauses used, {remainingPauses} remaining out of {totalPauses} total pauses allowed for this plan. {actionTitle}</p>
                                      }
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              )
                            }
                            return null
                          })()}
                        </div>
                        <div className="flex items-center gap-1">
                          {membershipStatus.daysRemaining <= 7 && membershipStatus.daysRemaining > 0 && membershipStatus.isValid && !member.isPaused && (
                            <Badge
                              variant="outline"
                              className="bg-orange-100 text-orange-800 text-xs transition-all duration-500 ease-in-out transform hover:scale-105"
                              title={`Expires in ${membershipStatus.daysRemaining} days`}
                            >
                              Expiring ({membershipStatus.daysRemaining}d)
                            </Badge>
                          )}
                          {!membershipStatus.isValid && !membershipStatus.isPaused && (
                            <Badge
                              variant="outline"
                              className="bg-red-50 text-red-600 border-red-200 hover:bg-red-100 text-xs transition-all duration-500 ease-in-out transform hover:scale-105"
                              title={membershipStatus.reason}
                            >
                              Expired
                            </Badge>
                          )}
                        </div>
                      </div>
                    ) : (
                      <Badge variant="secondary">No Plan</Badge>
                    )}
                  </TableCell>
                  <TableCell>{formatDate(member.currentEndDate)}</TableCell>
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