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
import { Edit, Pause, Play, AlertTriangle, Eye } from 'lucide-react'
import { checkMembershipValidity, getMembershipStatusBadge } from '@/lib/utils/membership'
import Link from 'next/link'

interface Member {
  id: string
  name: string
  email: string | null
  passportId: string | null
  phone: string | null
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
              <TableHead>Duration</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Visits</TableHead>
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
                    <div>
                      <div className="font-medium">{member.name}</div>
                      <div className="text-sm text-gray-500">{member.passportId}</div>
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
                      <Badge variant="outline">
                        {planTypeLabels[member.planType as keyof typeof planTypeLabels] || member.planType}
                      </Badge>
                    ) : (
                      <Badge variant="secondary">No Plan</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {member.planDuration ? `${member.planDuration} months` : member.planType?.includes('5pass') ? '5-Pass' : '-'}
                  </TableCell>
                  <TableCell>{formatDate(member.currentEndDate)}</TableCell>
                  <TableCell>
                    {member.remainingVisits !== null ? member.remainingVisits : '-'}
                  </TableCell>
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
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/members/${member.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        {member.isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
})