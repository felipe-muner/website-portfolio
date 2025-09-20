'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PhoneDisplay } from '@/components/ui/phone-display'
import { Cake } from 'lucide-react'

interface BirthdayMember {
  id: string
  name: string
  email: string | null
  phone: string | null
  birthday: string | null
  age: number
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
    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-medium">
      {initials}
    </div>
  )
}

export default function BirthdaysPage() {
  const [birthdayMembers, setBirthdayMembers] = useState<BirthdayMember[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBirthdayMembers()
  }, [])

  const fetchBirthdayMembers = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/birthdays')
      if (response.ok) {
        const data = await response.json()
        setBirthdayMembers(data)
      } else {
        console.error('Failed to fetch birthday members')
      }
    } catch (error) {
      console.error('Error fetching birthday members:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Cake className="h-6 w-6 text-orange-500" />
          <h1 className="text-2xl font-bold text-gray-900">Today&apos;s Birthdays</h1>
        </div>

        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <div className="text-gray-500">Loading birthday members...</div>
          </CardContent>
        </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Cake className="h-6 w-6 text-orange-500" />
        <h1 className="text-2xl font-bold text-gray-900">Today&apos;s Birthdays</h1>
        <Badge variant="secondary" className="ml-2">
          {birthdayMembers.length} {birthdayMembers.length === 1 ? 'member' : 'members'}
        </Badge>
      </div>

      {birthdayMembers.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Cake className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No birthdays today</h3>
            <p className="text-gray-500">No members have birthdays today.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {birthdayMembers.map((member) => (
            <Card key={member.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <Avatar name={member.name} />
                  <div className="flex-1">
                    <CardTitle className="text-lg flex items-center gap-2">
                      {member.name}
                      <Cake className="h-4 w-4 text-orange-500" />
                    </CardTitle>
                    {member.birthday && (
                      <p className="text-sm text-gray-600">
                        Born on {formatDate(member.birthday)}
                      </p>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Age</span>
                    <Badge variant="outline">{member.age} years old</Badge>
                  </div>

                  {member.email && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Email</span>
                      <span className="text-sm font-medium truncate max-w-32" title={member.email}>
                        {member.email}
                      </span>
                    </div>
                  )}

                  {member.phone && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Phone</span>
                      <PhoneDisplay phoneNumber={member.phone} flagSize="sm" />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      </div>
    </div>
  )
}