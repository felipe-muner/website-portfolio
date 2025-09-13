'use client'

import { useState } from 'react'
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
import { Edit, Pause, Play } from 'lucide-react'

// Mock data - will be replaced with real API calls
const mockMembers = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    passportId: 'A123456789',
    phone: '+66 81 234 5678',
    planType: 'gym_crossfit',
    planDuration: 3,
    startDate: '2024-01-15',
    currentEndDate: '2024-04-15',
    isActive: true,
    isPaused: false,
    remainingVisits: null,
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    passportId: 'B987654321',
    phone: '+66 89 876 5432',
    planType: 'gym_5pass',
    planDuration: null,
    startDate: '2024-03-01',
    currentEndDate: '2024-04-01',
    isActive: true,
    isPaused: false,
    remainingVisits: 3,
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike@example.com',
    passportId: 'C456789123',
    phone: '+66 82 345 6789',
    planType: 'gym_only',
    planDuration: 12,
    startDate: '2024-01-01',
    currentEndDate: '2024-12-31',
    isActive: true,
    isPaused: true,
    remainingVisits: null,
  },
]

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

export function MembersTable({ searchQuery }: MembersTableProps) {
  const [members] = useState(mockMembers)

  const filteredMembers = members.filter((member) => {
    const query = searchQuery.toLowerCase()
    return (
      member.name.toLowerCase().includes(query) ||
      member.email.toLowerCase().includes(query) ||
      member.passportId.toLowerCase().includes(query)
    )
  })

  const getStatusBadge = (member: typeof mockMembers[0]) => {
    if (!member.isActive) {
      return <Badge variant="secondary">Inactive</Badge>
    }
    if (member.isPaused) {
      return <Badge className="bg-yellow-100 text-yellow-800">Paused</Badge>
    }
    return <Badge className="bg-green-100 text-green-800">Active</Badge>
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB')
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
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMembers.map((member) => (
              <TableRow key={member.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{member.name}</div>
                    <div className="text-sm text-gray-500">{member.passportId}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="text-sm">{member.email}</div>
                    <div className="text-sm text-gray-500">{member.phone}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {planTypeLabels[member.planType as keyof typeof planTypeLabels]}
                  </Badge>
                </TableCell>
                <TableCell>
                  {member.planDuration ? `${member.planDuration} months` : '5-Pass'}
                </TableCell>
                <TableCell>{formatDate(member.currentEndDate)}</TableCell>
                <TableCell>
                  {member.remainingVisits !== null ? member.remainingVisits : '-'}
                </TableCell>
                <TableCell>{getStatusBadge(member)}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      {member.isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}