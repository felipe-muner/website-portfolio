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
      <SheetContent side="bottom" className="h-[85vh] sm:max-w-none bg-white">
        <div className="flex flex-col h-full">
          <SheetHeader className="pb-6">
            <SheetTitle className="text-xl font-semibold">Add New Member</SheetTitle>
            <SheetDescription>
              Register a new member for gym or CrossFit access.
            </SheetDescription>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium text-gray-900">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter full name"
                    className="bg-white border-gray-300"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-900">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="Enter email address"
                    className="bg-white border-gray-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="passportId" className="text-sm font-medium text-gray-900">Passport ID</Label>
                  <Input
                    id="passportId"
                    value={formData.passportId}
                    onChange={(e) => handleInputChange('passportId', e.target.value)}
                    placeholder="Enter passport ID"
                    className="bg-white border-gray-300"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium text-gray-900">Phone Number</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="Enter phone number"
                    className="bg-white border-gray-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="planType" className="text-sm font-medium text-gray-900">Plan Type *</Label>
                  <Select value={formData.planType} onValueChange={(value) => handleInputChange('planType', value)}>
                    <SelectTrigger className="bg-white border-gray-300">
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
                    <Label htmlFor="planDuration" className="text-sm font-medium text-gray-900">Duration *</Label>
                    <Select value={formData.planDuration} onValueChange={(value) => handleInputChange('planDuration', value)}>
                      <SelectTrigger className="bg-white border-gray-300">
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

              <SheetFooter className="pt-6 border-t">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button type="submit">Add Member</Button>
              </SheetFooter>
            </form>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}