'use client'

import { useState, useEffect } from 'react'
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
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Combobox } from '@/components/ui/combobox'
import { PhoneInput } from '@/components/ui/phone-input'

interface AddMemberSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface Nationality {
  id: string
  name: string
  code: string
  flag: string
}

export function AddMemberSheet({ open, onOpenChange }: AddMemberSheetProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    passportId: '',
    phone: '',
    nationalityId: '',
    plan: '',
  })
  const [nationalities, setNationalities] = useState<Nationality[]>([])

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
      nationalityId: '',
      plan: '',
    })
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  useEffect(() => {
    const fetchNationalities = async () => {
      try {
        const response = await fetch('/api/nationalities')
        if (response.ok) {
          const data = await response.json()
          setNationalities(data)
        }
      } catch (error) {
        console.error('Error fetching nationalities:', error)
      }
    }

    if (open) {
      fetchNationalities()
    }
  }, [open])

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

          <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">
          <div className="space-y-4">
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

          <div className="space-y-4">
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
              <PhoneInput
                value={formData.phone}
                onChange={(value) => handleInputChange('phone', value)}
                placeholder="Enter phone number"
                defaultCountry="US"
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nationality">Nationality</Label>
              <Combobox
                options={nationalities.map(nationality => ({
                  value: nationality.id,
                  label: nationality.name,
                  flag: nationality.flag
                }))}
                value={formData.nationalityId}
                onValueChange={(value) => handleInputChange('nationalityId', value)}
                placeholder="Select nationality..."
                searchPlaceholder="Search nationalities..."
                emptyText="No nationality found."
                className="w-full"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="plan">Plan & Duration *</Label>
            <Select value={formData.plan} onValueChange={(value) => handleInputChange('plan', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select plan and duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Gym Only</SelectLabel>
                  <SelectItem value="gym_only_1">1 Month</SelectItem>
                  <SelectItem value="gym_only_3">3 Months</SelectItem>
                  <SelectItem value="gym_only_6">6 Months</SelectItem>
                  <SelectItem value="gym_only_12">12 Months</SelectItem>
                </SelectGroup>
                <SelectGroup>
                  <SelectLabel>Gym + CrossFit</SelectLabel>
                  <SelectItem value="gym_crossfit_1">1 Month</SelectItem>
                  <SelectItem value="gym_crossfit_3">3 Months</SelectItem>
                  <SelectItem value="gym_crossfit_6">6 Months</SelectItem>
                  <SelectItem value="gym_crossfit_12">12 Months</SelectItem>
                </SelectGroup>
                <SelectGroup>
                  <SelectLabel>5-Pass Options</SelectLabel>
                  <SelectItem value="gym_5pass">Gym 5-Pass</SelectItem>
                  <SelectItem value="fitness_5pass">Fitness 5-Pass</SelectItem>
                  <SelectItem value="crossfit_5pass">CrossFit 5-Pass</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

            <SheetFooter className="pt-6 mt-8 border-t">
              <Button type="submit">Add Member</Button>
            </SheetFooter>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  )
}