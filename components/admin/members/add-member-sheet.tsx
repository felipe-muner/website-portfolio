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
import { planOptions, getPlanById } from '@/lib/config/plans'
import { getPlanPrice, getPlanDuration, formatCurrency } from '@/lib/constants/pricing'

interface AddMemberSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onMemberAdded?: () => void
}

interface Nationality {
  id: string
  name: string
  code: string
  flag: string
}


export function AddMemberSheet({ open, onOpenChange, onMemberAdded }: AddMemberSheetProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    passportId: '',
    phone: '',
    nationalityId: '',
    plan: '',
  })
  const [selectedPlanPrice, setSelectedPlanPrice] = useState<number>(0)
  const [isThaiNational, setIsThaiNational] = useState(false)
  const [nationalities, setNationalities] = useState<Nationality[]>([])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      // Get plan details from configuration
      const selectedPlan = getPlanById(formData.plan)
      if (!selectedPlan && formData.plan) {
        console.error('Invalid plan selected')
        return
      }

      // Calculate dates using the new pricing structure
      const startDate = new Date()
      const endDate = new Date(startDate)
      const planDuration = getPlanDuration(formData.plan)

      if (planDuration) {
        endDate.setMonth(endDate.getMonth() + planDuration)
      } else if (selectedPlan?.visits) {
        endDate.setMonth(endDate.getMonth() + 1) // Pass expires in 1 month
      }

      const memberData = {
        name: formData.name,
        email: formData.email || null,
        passportId: formData.passportId || null,
        phone: formData.phone || null,
        nationalityId: formData.nationalityId || null,
        planType: selectedPlan?.planType || null,
        planDuration: planDuration || null,
        startDate: startDate.toISOString(),
        originalEndDate: endDate.toISOString(),
        currentEndDate: endDate.toISOString(),
        isActive: true,
        isPaused: false,
        pauseCount: 0,
        remainingVisits: selectedPlan?.visits || null,
      }

      // Also create the payment record
      const paymentData = {
        amount: selectedPlanPrice.toString(),
        paymentDate: startDate.toISOString(),
        paymentMethod: 'cash',
        paymentType: 'membership'
      }

      const response = await fetch('/api/admin/members', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ memberData, paymentData }),
      })

      if (response.ok) {
        console.log('Member created successfully')
        onOpenChange(false)
        setFormData({
          name: '',
          email: '',
          passportId: '',
          phone: '',
          nationalityId: '',
          plan: '',
        })

        // Trigger a refresh of the members list
        onMemberAdded?.()
      } else {
        const errorData = await response.text()
        console.error('Failed to create member:', response.status, response.statusText, errorData)
        alert(`Failed to create member: ${response.status} ${response.statusText}`)
      }
    } catch (error) {
      console.error('Error creating member:', error)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))

    // Check if nationality changed to Thai
    if (field === 'nationalityId') {
      const selectedNationality = nationalities.find(n => n.id === value)
      const isThaiSelected = selectedNationality?.code === 'TH'
      setIsThaiNational(isThaiSelected)

      // Update price if plan is already selected
      if (formData.plan) {
        const newPrice = getPlanPrice(formData.plan, isThaiSelected)
        setSelectedPlanPrice(newPrice)
      }
    }

    // Update price when plan changes
    if (field === 'plan') {
      const newPrice = getPlanPrice(value, isThaiNational)
      setSelectedPlanPrice(newPrice)
    }
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
      <SheetContent side="bottom" className="max-h-[90vh] overflow-y-auto p-0" data-testid="add-member-sheet">
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
                data-testid="nationality-combobox"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="plan">Plan & Duration</Label>
            <Select value={formData.plan} onValueChange={(value) => handleInputChange('plan', value)}>
              <SelectTrigger data-testid="plan-select">
                <SelectValue placeholder="Select plan and duration (optional)" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px] overflow-y-auto" position="popper" side="bottom" align="start">
                <SelectGroup>
                  <SelectLabel>Gym & Fitness</SelectLabel>
                  {planOptions
                    .filter(p =>
                      p.planType.includes('gym_only') ||
                      p.planType.includes('fitness') ||
                      (p.planType.includes('gym_5pass') && !p.planType.includes('open_gym'))
                    )
                    .map(plan => ({
                      ...plan,
                      currentPrice: isThaiNational && plan.priceThaiDiscount ?
                        parseFloat(plan.priceThaiDiscount.replace(/[₿,]/g, '')) :
                        parseFloat(plan.price.replace(/[₿,]/g, ''))
                    }))
                    .sort((a, b) => a.currentPrice - b.currentPrice)
                    .map(plan => {
                      const price = isThaiNational && plan.priceThaiDiscount ? plan.priceThaiDiscount : plan.price
                      const discount = isThaiNational && plan.hasThaiDiscount ? ' (Thai Discount)' : ''
                      return (
                        <SelectItem key={plan.id} value={plan.id}>
                          <span className="font-mono text-right inline-block w-20">{price}</span> - {plan.name}{discount}
                        </SelectItem>
                      )
                    })}
                </SelectGroup>
                <SelectGroup>
                  <SelectLabel>CrossFit</SelectLabel>
                  {planOptions
                    .filter(p => p.planType.includes('crossfit'))
                    .map(plan => ({
                      ...plan,
                      currentPrice: isThaiNational && plan.priceThaiDiscount ?
                        parseFloat(plan.priceThaiDiscount.replace(/[₿,]/g, '')) :
                        parseFloat(plan.price.replace(/[₿,]/g, ''))
                    }))
                    .sort((a, b) => a.currentPrice - b.currentPrice)
                    .map(plan => {
                      const price = isThaiNational && plan.priceThaiDiscount ? plan.priceThaiDiscount : plan.price
                      const discount = isThaiNational && plan.hasThaiDiscount ? ' (Thai Discount)' : ''
                      return (
                        <SelectItem key={plan.id} value={plan.id}>
                          <span className="font-mono text-right inline-block w-20">{price}</span> - {plan.name}{discount}
                        </SelectItem>
                      )
                    })}
                </SelectGroup>
                <SelectGroup>
                  <SelectLabel>Group Classes & Combos</SelectLabel>
                  {planOptions
                    .filter(p =>
                      p.planType.includes('group_classes') ||
                      p.planType.includes('open_gym')
                    )
                    .map(plan => ({
                      ...plan,
                      currentPrice: isThaiNational && plan.priceThaiDiscount ?
                        parseFloat(plan.priceThaiDiscount.replace(/[₿,]/g, '')) :
                        parseFloat(plan.price.replace(/[₿,]/g, ''))
                    }))
                    .sort((a, b) => a.currentPrice - b.currentPrice)
                    .map(plan => {
                      const price = isThaiNational && plan.priceThaiDiscount ? plan.priceThaiDiscount : plan.price
                      const discount = isThaiNational && plan.hasThaiDiscount ? ' (Thai Discount)' : ''
                      return (
                        <SelectItem key={plan.id} value={plan.id}>
                          <span className="font-mono text-right inline-block w-20">{price}</span> - {plan.name}{discount}
                        </SelectItem>
                      )
                    })}
                </SelectGroup>
              </SelectContent>
            </Select>
            {selectedPlanPrice > 0 && (
              <div className="text-sm text-muted-foreground">
                Selected price: {formatCurrency(selectedPlanPrice)}
                {isThaiNational && planOptions.find(p => p.id === formData.plan)?.hasThaiDiscount &&
                  ' (50% Thai National Discount Applied)'}
              </div>
            )}
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