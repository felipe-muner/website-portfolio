'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plan } from '@/lib/types/database'

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
  const [plans, setPlans] = useState<Plan[]>([])
  const [loadingPlans, setLoadingPlans] = useState(false)

  const fetchMemberNationality = useCallback(async () => {
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
  }, [memberId])

  // Fetch member nationality and plans when sheet opens
  useEffect(() => {
    if (open && memberId) {
      fetchMemberNationality()
      fetchPlans()
    }
  }, [open, memberId, fetchMemberNationality])

  const fetchPlans = async () => {
    try {
      setLoadingPlans(true)
      const response = await fetch('/api/admin/plans?active=true')
      if (response.ok) {
        const data = await response.json()
        setPlans(data)
      } else {
        console.error('Failed to fetch plans')
      }
    } catch (error) {
      console.error('Error fetching plans:', error)
    } finally {
      setLoadingPlans(false)
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
        planId: formData.planId,
        amount: selectedPlanPrice.toString(),
        paymentMethod: 'cash',
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
    const selectedPlan = plans.find(p => p.id === planId)
    if (selectedPlan) {
      const price = isThaiNational && selectedPlan.priceThaiDiscount
        ? parseFloat(selectedPlan.priceThaiDiscount)
        : parseFloat(selectedPlan.price)
      setSelectedPlanPrice(price)
    }
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
                    {loadingPlans ? (
                      <div className="p-4 text-center text-gray-500">Loading plans...</div>
                    ) : (
                      <>
                        <SelectGroup>
                          <SelectLabel>Gym & Fitness</SelectLabel>
                          {plans
                            .filter(p => p.planCategory === 'gym')
                            .map(plan => {
                              const price = isThaiNational && plan.priceThaiDiscount
                                ? parseFloat(plan.priceThaiDiscount)
                                : parseFloat(plan.price)
                              const discount = isThaiNational && plan.priceThaiDiscount ? ' (Thai Discount)' : ''
                              return (
                                <SelectItem key={plan.id} value={plan.id}>
                                  <span className="font-mono text-right inline-block w-20">{price}฿</span> - {plan.name}{discount}
                                </SelectItem>
                              )
                            })}
                        </SelectGroup>
                        <SelectGroup>
                          <SelectLabel>CrossFit</SelectLabel>
                          {plans
                            .filter(p => p.planCategory === 'crossfit')
                            .map(plan => {
                              const price = isThaiNational && plan.priceThaiDiscount
                                ? parseFloat(plan.priceThaiDiscount)
                                : parseFloat(plan.price)
                              const discount = isThaiNational && plan.priceThaiDiscount ? ' (Thai Discount)' : ''
                              return (
                                <SelectItem key={plan.id} value={plan.id}>
                                  <span className="font-mono text-right inline-block w-20">{price}฿</span> - {plan.name}{discount}
                                </SelectItem>
                              )
                            })}
                        </SelectGroup>
                        <SelectGroup>
                          <SelectLabel>Fitness Classes</SelectLabel>
                          {plans
                            .filter(p => p.planCategory === 'fitness')
                            .map(plan => {
                              const price = isThaiNational && plan.priceThaiDiscount
                                ? parseFloat(plan.priceThaiDiscount)
                                : parseFloat(plan.price)
                              const discount = isThaiNational && plan.priceThaiDiscount ? ' (Thai Discount)' : ''
                              return (
                                <SelectItem key={plan.id} value={plan.id}>
                                  <span className="font-mono text-right inline-block w-20">{price}฿</span> - {plan.name}{discount}
                                </SelectItem>
                              )
                            })}
                        </SelectGroup>
                        <SelectGroup>
                          <SelectLabel>Combo Plans</SelectLabel>
                          {plans
                            .filter(p => p.planCategory === 'combo')
                            .map(plan => {
                              const price = isThaiNational && plan.priceThaiDiscount
                                ? parseFloat(plan.priceThaiDiscount)
                                : parseFloat(plan.price)
                              const discount = isThaiNational && plan.priceThaiDiscount ? ' (Thai Discount)' : ''
                              return (
                                <SelectItem key={plan.id} value={plan.id}>
                                  <span className="font-mono text-right inline-block w-20">{price}฿</span> - {plan.name}{discount}
                                </SelectItem>
                              )
                            })}
                        </SelectGroup>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>

              {selectedPlanPrice > 0 && (
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-lg font-semibold">
                    Amount: {selectedPlanPrice.toLocaleString()}฿
                  </div>
                  {isThaiNational && plans.find(p => p.id === formData.planId)?.priceThaiDiscount && (
                    <div className="text-sm text-green-600">Thai National Discount Applied</div>
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