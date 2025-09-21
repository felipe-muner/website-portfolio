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
import { planOptions } from '@/lib/config/plans'
import { getPlanPrice, formatCurrency } from '@/lib/constants/pricing'

interface AddPaymentSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  memberId: string
  memberName: string
  onPaymentAdded?: () => void
}

export function AddPaymentSheet({ open, onOpenChange, memberId, memberName, onPaymentAdded }: AddPaymentSheetProps) {
  const [formData, setFormData] = useState({
    planId: '',
  })
  const [selectedPlanPrice, setSelectedPlanPrice] = useState<number>(0)
  const [isThaiNational, setIsThaiNational] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Fetch member nationality to determine pricing
  useEffect(() => {
    if (open && memberId) {
      fetchMemberNationality()
    }
  }, [open, memberId])

  const fetchMemberNationality = async () => {
    try {
      const response = await fetch(`/api/admin/members/${memberId}`)
      if (response.ok) {
        const member = await response.json()
        // Check if member is Thai national (you might need to adjust this logic)
        setIsThaiNational(member.nationalityId === 'thai-nationality-id') // Replace with actual Thai nationality ID
      }
    } catch (error) {
      console.error('Error fetching member nationality:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.planId) {
      alert('Please select a plan')
      return
    }

    try {
      setIsSubmitting(true)

      const paymentData = {
        amount: selectedPlanPrice.toString(),
        paymentMethod: 'cash',
        paymentType: 'membership',
        serviceType: null,
        gymShare: null,
        crossfitShare: null,
        paymentDate: new Date().toISOString(),
      }

      const response = await fetch(`/api/admin/members/${memberId}/payments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      })

      if (response.ok) {
        console.log('Payment created successfully')
        onOpenChange(false)

        // Reset form
        setFormData({
          planId: '',
        })
        setSelectedPlanPrice(0)

        // Trigger refresh of payment list
        onPaymentAdded?.()
      } else {
        const errorData = await response.json()
        console.error('Failed to create payment:', errorData)
        alert(`Failed to create payment: ${errorData.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error creating payment:', error)
      alert('Failed to create payment')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePlanChange = (planId: string) => {
    setFormData(prev => ({ ...prev, planId }))
    const price = getPlanPrice(planId, isThaiNational)
    setSelectedPlanPrice(price)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="max-h-[90vh] overflow-y-auto p-0">
        <div className="p-6">
          <SheetHeader className="pb-4">
            <SheetTitle>Add Payment - {memberName}</SheetTitle>
            <SheetDescription>
              Record a new payment for this member.
            </SheetDescription>
          </SheetHeader>

          <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="plan">Plan *</Label>
                <Select value={formData.planId} onValueChange={handlePlanChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a plan" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px] overflow-y-auto">
                    <SelectGroup>
                      <SelectLabel>Gym & Fitness</SelectLabel>
                      {planOptions
                        .filter(p =>
                          p.planType.includes('gym_only') ||
                          p.planType.includes('fitness') ||
                          (p.planType.includes('gym_5pass') && !p.planType.includes('open_gym'))
                        )
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
              </div>

              {selectedPlanPrice > 0 && (
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-lg font-semibold">
                    Amount: {formatCurrency(selectedPlanPrice)}
                  </div>
                  {isThaiNational && planOptions.find(p => p.id === formData.planId)?.hasThaiDiscount && (
                    <div className="text-sm text-green-600">50% Thai National Discount Applied</div>
                  )}
                </div>
              )}


            </div>

            <SheetFooter className="pt-6 mt-8 border-t">
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? 'Adding...' : 'Add Payment'}
              </Button>
            </SheetFooter>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  )
}