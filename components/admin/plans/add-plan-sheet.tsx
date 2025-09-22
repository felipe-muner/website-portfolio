'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { NewPlan } from '@/lib/types/database'

interface AddPlanSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onPlanAdded: () => void
}

export function AddPlanSheet({ open, onOpenChange, onPlanAdded }: AddPlanSheetProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    planType: '',
    price: '',
    priceThaiDiscount: '',
    duration: '',
    visitLimit: '',
    planCategory: '',
    description: '',
    isActive: true,
    isDropIn: false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Validate form data
      if (!formData.name || !formData.planType || !formData.price || !formData.planCategory) {
        alert('Please fill in all required fields')
        return
      }

      // Ensure planType is unique
      if (!formData.planType.match(/^[a-z0-9_]+$/)) {
        alert('Plan type should only contain lowercase letters, numbers, and underscores')
        return
      }

      // Validate pricing logic
      if (formData.isDropIn && (formData.duration || formData.visitLimit)) {
        alert('Day passes cannot have duration or visit limits')
        return
      }

      if (!formData.isDropIn && !formData.duration && !formData.visitLimit) {
        alert('Time-based plans must have either duration or visit limit')
        return
      }

      const planData: Partial<NewPlan> = {
        name: formData.name,
        planType: formData.planType,
        price: formData.price,
        priceThaiDiscount: formData.priceThaiDiscount || null,
        duration: formData.duration ? parseInt(formData.duration) : null,
        visitLimit: formData.visitLimit ? parseInt(formData.visitLimit) : null,
        planCategory: formData.planCategory as 'gym' | 'crossfit' | 'fitness' | 'combo',
        description: formData.description || null,
        isActive: formData.isActive,
        isDropIn: formData.isDropIn,
      }

      const response = await fetch('/api/admin/plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(planData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create plan')
      }

      alert('Plan created successfully')
      onPlanAdded()
      onOpenChange(false)

      // Reset form
      setFormData({
        name: '',
        planType: '',
        price: '',
        priceThaiDiscount: '',
        duration: '',
        visitLimit: '',
        planCategory: '',
        description: '',
        isActive: true,
        isDropIn: false,
      })
    } catch (error) {
      console.error('Error creating plan:', error)
      alert(error instanceof Error ? error.message : 'Failed to create plan')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))

    // Auto-generate planType based on name if not manually set
    if (field === 'name' && typeof value === 'string') {
      const autoType = value
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, '_')
      if (!formData.planType) {
        setFormData(prev => ({ ...prev, planType: autoType }))
      }
    }

    // Clear duration/visitLimit based on plan type
    if (field === 'isDropIn' && value === true) {
      setFormData(prev => ({ ...prev, duration: '', visitLimit: '' }))
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[600px] sm:max-w-[600px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Add New Plan</SheetTitle>
          <SheetDescription>
            Create a new membership plan for gym, CrossFit, or fitness classes.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Plan Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Gym 1 Month"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="planType">Plan Type (ID) *</Label>
              <Input
                id="planType"
                placeholder="e.g., gym_1month"
                value={formData.planType}
                onChange={(e) => handleInputChange('planType', e.target.value)}
                required
              />
              <p className="text-xs text-gray-500">
                Unique identifier (lowercase, numbers, underscores only)
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="planCategory">Category *</Label>
            <Select
              value={formData.planCategory}
              onValueChange={(value) => handleInputChange('planCategory', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gym">Gym</SelectItem>
                <SelectItem value="crossfit">CrossFit</SelectItem>
                <SelectItem value="fitness">Fitness</SelectItem>
                <SelectItem value="combo">Combo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price (THB) *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                placeholder="1500.00"
                value={formData.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="priceThaiDiscount">Thai Discount Price</Label>
              <Input
                id="priceThaiDiscount"
                type="number"
                step="0.01"
                placeholder="1200.00"
                value={formData.priceThaiDiscount}
                onChange={(e) => handleInputChange('priceThaiDiscount', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="isDropIn">Plan Type</Label>
            <Select
              value={formData.isDropIn ? 'true' : 'false'}
              onValueChange={(value) => handleInputChange('isDropIn', value === 'true')}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="false">Subscription Plan</SelectItem>
                <SelectItem value="true">Day Pass (Drop-in)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {!formData.isDropIn && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (months)</Label>
                <Input
                  id="duration"
                  type="number"
                  placeholder="1"
                  value={formData.duration}
                  onChange={(e) => handleInputChange('duration', e.target.value)}
                />
                <p className="text-xs text-gray-500">
                  Leave empty for visit-based plans
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="visitLimit">Visit Limit</Label>
                <Input
                  id="visitLimit"
                  type="number"
                  placeholder="10"
                  value={formData.visitLimit}
                  onChange={(e) => handleInputChange('visitLimit', e.target.value)}
                />
                <p className="text-xs text-gray-500">
                  Leave empty for unlimited time-based plans
                </p>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              placeholder="Optional plan description..."
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="isActive">Status</Label>
            <Select
              value={formData.isActive ? 'true' : 'false'}
              onValueChange={(value) => handleInputChange('isActive', value === 'true')}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Active</SelectItem>
                <SelectItem value="false">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Plan'}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}