'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { type MemberLookupResult } from '@/lib/types'

export default function MemberPortal() {
  const [lookupData, setLookupData] = useState({ email: '', passportId: '' })
  const [member, setMember] = useState<MemberLookupResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleLookup = async () => {
    if (!lookupData.email && !lookupData.passportId) {
      alert('Please enter either email or passport ID')
      return
    }

    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (lookupData.email) params.set('email', lookupData.email)
      if (lookupData.passportId) params.set('passportId', lookupData.passportId)

      const response = await fetch(`/api/member/lookup?${params}`)
      const data = await response.json()

      if (response.ok) {
        setMember(data)
      } else {
        alert(data.error || 'Member not found')
        setMember(null)
      }
    } catch (error) {
      alert('Error looking up member')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCheckIn = async (facilityType: string) => {
    if (!member) return

    try {
      const response = await fetch('/api/member/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          memberId: member.id,
          facilityType
        })
      })

      const data = await response.json()

      if (response.ok) {
        alert(`Successfully checked in to ${facilityType}!`)
        // Refresh member data
        handleLookup()
      } else {
        alert(data.error || 'Check-in failed')
      }
    } catch (error) {
      alert('Error during check-in')
      console.error(error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Summit Gym Member Portal
          </h1>
          <p className="text-gray-600">
            Check-in, view your membership, and update your information
          </p>
        </div>

        {!member ? (
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Find Your Membership</CardTitle>
              <CardDescription>
                Enter your email address or passport ID to access your membership
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={lookupData.email}
                  onChange={(e) => setLookupData({ ...lookupData, email: e.target.value })}
                />
              </div>

              <div className="text-center text-sm text-gray-500">OR</div>

              <div className="space-y-2">
                <Label htmlFor="passport">Passport/ID Number</Label>
                <Input
                  id="passport"
                  placeholder="Your passport or ID number"
                  value={lookupData.passportId}
                  onChange={(e) => setLookupData({ ...lookupData, passportId: e.target.value })}
                />
              </div>

              <Button onClick={handleLookup} disabled={isLoading} className="w-full">
                {isLoading ? 'Looking up...' : 'Find Membership'}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Member Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  Welcome back, {member.name}!
                  <Button
                    variant="outline"
                    onClick={() => setMember(null)}
                  >
                    Logout
                  </Button>
                </CardTitle>
                <CardDescription>
                  {member.isActive ? (
                    <span className="text-green-600 font-medium">✓ Active Membership</span>
                  ) : (
                    <span className="text-red-600 font-medium">✗ Inactive Membership</span>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="font-medium text-gray-500">Plan Type</p>
                    <p className="capitalize">{member.planType ? member.planType.replace('_', ' ') : 'No Plan'}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-500">End Date</p>
                    <p>{new Date(member.currentEndDate).toLocaleDateString()}</p>
                  </div>
                  {member.remainingVisits && (
                    <div>
                      <p className="font-medium text-gray-500">Remaining Visits</p>
                      <p>{member.remainingVisits}</p>
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-gray-500">Status</p>
                    <p>{member.isPaused ? 'Paused' : 'Active'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="checkin" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="checkin">Check-in</TabsTrigger>
                <TabsTrigger value="profile">My Profile</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
              </TabsList>

              <TabsContent value="checkin" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Check-in to Facility</CardTitle>
                    <CardDescription>
                      Select which facility you want to access today
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {member.isActive && !member.isPaused ? (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {member.planType?.includes('gym') && (
                          <Button
                            onClick={() => handleCheckIn('gym')}
                            className="h-20"
                          >
                            <div className="text-center">
                              <div className="text-lg font-bold">Gym</div>
                              <div className="text-sm opacity-90">Weight Training</div>
                            </div>
                          </Button>
                        )}

                        {member.planType?.includes('crossfit') && (
                          <Button
                            onClick={() => handleCheckIn('crossfit')}
                            className="h-20"
                            variant="outline"
                          >
                            <div className="text-center">
                              <div className="text-lg font-bold">CrossFit</div>
                              <div className="text-sm opacity-90">CrossFit Training</div>
                            </div>
                          </Button>
                        )}

                        {member.planType?.includes('fitness') && (
                          <Button
                            onClick={() => handleCheckIn('fitness_class')}
                            className="h-20"
                            variant="outline"
                          >
                            <div className="text-center">
                              <div className="text-lg font-bold">Fitness Class</div>
                              <div className="text-sm opacity-90">Group Classes</div>
                            </div>
                          </Button>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-red-600 font-medium">
                          Your membership is currently {member.isPaused ? 'paused' : 'inactive'}
                        </p>
                        <p className="text-sm text-gray-600 mt-2">
                          Please contact the gym staff to reactivate your membership
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="profile">
                <Card>
                  <CardHeader>
                    <CardTitle>My Profile</CardTitle>
                    <CardDescription>View and update your information</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Name</Label>
                          <Input value={member.name} readOnly />
                        </div>
                        <div>
                          <Label>Email</Label>
                          <Input value={member.email || 'Not provided'} readOnly />
                        </div>
                        <div>
                          <Label>Phone</Label>
                          <Input value={member.phone || 'Not provided'} readOnly />
                        </div>
                        <div>
                          <Label>Passport/ID</Label>
                          <Input value={member.passportId || 'Not provided'} readOnly />
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">
                        To update your information, please contact the gym staff
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="history">
                <Card>
                  <CardHeader>
                    <CardTitle>Check-in History</CardTitle>
                    <CardDescription>Your recent gym visits</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">Check-in history will be displayed here</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  )
}