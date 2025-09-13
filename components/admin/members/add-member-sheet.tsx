'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface AddMemberSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddMemberSheet({ open, onOpenChange }: AddMemberSheetProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    passportId: '',
    phone: '',
    planType: '',
    planDuration: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement member creation
    console.log('Creating member:', formData)
    onOpenChange(false)
    setFormData({
      name: '',
      email: '',
      passportId: '',
      phone: '',
      planType: '',
      planDuration: '',
    })
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="max-h-[90vh] overflow-y-auto p-0">
        <div className="p-6">
          <SheetHeader className="pb-4">
            <SheetTitle>Add New Member</SheetTitle>
            <SheetDescription>
              Register a new member for gym or CrossFit access.
            </SheetDescription>
          </SheetHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="passportId">Passport ID</Label>
              <Input
                id="passportId"
                value={formData.passportId}
                onChange={(e) => handleInputChange('passportId', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="planType">Plan Type *</Label>
              <Select value={formData.planType} onValueChange={(value) => handleInputChange('planType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select plan type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gym_only">Gym Only</SelectItem>
                  <SelectItem value="gym_crossfit">Gym + CrossFit</SelectItem>
                  <SelectItem value="gym_5pass">Gym 5-Pass</SelectItem>
                  <SelectItem value="fitness_5pass">Fitness 5-Pass</SelectItem>
                  <SelectItem value="crossfit_5pass">CrossFit 5-Pass</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {!formData.planType.includes('5pass') && (
              <div className="space-y-2">
                <Label htmlFor="planDuration">Duration *</Label>
                <Select value={formData.planDuration} onValueChange={(value) => handleInputChange('planDuration', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Month</SelectItem>
                    <SelectItem value="3">3 Months</SelectItem>
                    <SelectItem value="6">6 Months</SelectItem>
                    <SelectItem value="12">12 Months</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

            <SheetFooter className="pt-6 mt-8 border-t">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">Add Member</Button>
            </SheetFooter>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  )
}