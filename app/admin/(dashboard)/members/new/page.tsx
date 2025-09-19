'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import Link from 'next/link'
import { planOptions, getPlanById } from '@/lib/config/plans'

export default function NewMember() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    passportId: '',
    planType: '',
    planDuration: '',
    startDate: new Date().toISOString().split('T')[0],
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Get plan details from configuration if plan is selected
      const selectedPlan = formData.planType ? getPlanById(formData.planType) : null

      const endDate = new Date(formData.startDate)
      if (selectedPlan?.duration) {
        endDate.setMonth(endDate.getMonth() + selectedPlan.duration)
      } else if (selectedPlan?.visits) {
        endDate.setMonth(endDate.getMonth() + 1) // 5-pass expires in 1 month
      } else if (formData.planDuration) {
        endDate.setMonth(endDate.getMonth() + parseInt(formData.planDuration))
      }

      const memberData = {
        name: formData.name,
        email: formData.email || null,
        phone: formData.phone || null,
        passportId: formData.passportId || null,
        planType: selectedPlan?.type || formData.planType || null,
        planDuration: selectedPlan?.duration || (formData.planDuration ? parseInt(formData.planDuration) : null),
        startDate: formData.startDate,
        originalEndDate: endDate.toISOString(),
        currentEndDate: endDate.toISOString(),
        isActive: true,
        isPaused: false,
        pauseCount: 0,
        remainingVisits: selectedPlan?.visits || (formData.planType.includes('5pass') ? 5 : null),
      }

      const response = await fetch('/api/admin/members', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(memberData),
      })

      if (response.ok) {
        alert('Member created successfully!')
        setFormData({
          name: '',
          email: '',
          phone: '',
          passportId: '',
          planType: '',
          planDuration: '',
          startDate: new Date().toISOString().split('T')[0],
        })
      } else {
        alert('Error creating member')
      }
    } catch (error) {
      alert('Error creating member')
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Add New Member</h1>
            <p className="text-gray-600">Create a new gym membership</p>
          </div>
          <Button asChild variant="outline">
            <Link href="/admin/dashboard">Back to Dashboard</Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Member Information</CardTitle>
          <CardDescription>Fill in the member details below</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="Enter full name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter email address"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Enter phone number"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="passportId">Passport/ID</Label>
                <Input
                  id="passportId"
                  value={formData.passportId}
                  onChange={(e) => setFormData({ ...formData, passportId: e.target.value })}
                  placeholder="Enter passport or ID number"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="planType">Plan Type</Label>
                <Select
                  value={formData.planType}
                  onValueChange={(value) => setFormData({ ...formData, planType: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select plan type (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <optgroup label="Drop-in">
                      {planOptions.filter(p => p.id.includes('dropin')).map(plan => (
                        <SelectItem key={plan.id} value={plan.id}>
                          {plan.name} - {plan.price}
                        </SelectItem>
                      ))}
                    </optgroup>
                    <optgroup label="5-Pass Options">
                      {planOptions.filter(p => p.visits && !p.id.includes('dropin')).map(plan => (
                        <SelectItem key={plan.id} value={plan.id}>
                          {plan.name} - {plan.price}
                        </SelectItem>
                      ))}
                    </optgroup>
                    <optgroup label="Monthly Plans">
                      {planOptions.filter(p => p.duration).map(plan => (
                        <SelectItem key={plan.id} value={plan.id}>
                          {plan.name} - {plan.price}
                        </SelectItem>
                      ))}
                    </optgroup>
                  </SelectContent>
                </Select>
              </div>


              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="startDate">Start Date *</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create Member'}
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link href="/admin/dashboard">Cancel</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}