'use client'

import { useState, useEffect, forwardRef, useImperativeHandle } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card } from '@/components/ui/card'
import { Edit, Clock, Calendar } from 'lucide-react'
import { Plan } from '@/lib/types/database'

interface PlansTableProps {
  searchQuery?: string
  onPlansCountChange?: (count: number) => void
}

export interface PlansTableRef {
  refreshPlans: () => void
}

export const PlansTable = forwardRef<PlansTableRef, PlansTableProps>(
  ({ searchQuery = '', onPlansCountChange }, ref) => {
    const [plans, setPlans] = useState<Plan[]>([])
    const [loading, setLoading] = useState(true)

    const fetchPlans = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/admin/plans')
        if (!response.ok) throw new Error('Failed to fetch plans')
        const data = await response.json()
        setPlans(data)
        onPlansCountChange?.(data.length)
      } catch (error) {
        console.error('Error fetching plans:', error)
        alert('Failed to load plans')
      } finally {
        setLoading(false)
      }
    }

    useEffect(() => {
      fetchPlans()
    }, [])

    useImperativeHandle(ref, () => ({
      refreshPlans: fetchPlans,
    }))

    const handleToggleActive = async (planId: string, currentActive: boolean) => {
      try {
        const response = await fetch(`/api/admin/plans/${planId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ isActive: !currentActive }),
        })

        if (!response.ok) throw new Error('Failed to update plan')

        alert(`Plan ${!currentActive ? 'activated' : 'deactivated'} successfully`)
        fetchPlans()
      } catch (error) {
        console.error('Error updating plan:', error)
        alert('Failed to update plan')
      }
    }

    const filteredPlans = plans.filter((plan) => {
      if (!searchQuery) return true
      const query = searchQuery.toLowerCase()
      return (
        plan.name.toLowerCase().includes(query) ||
        plan.planType.toLowerCase().includes(query) ||
        plan.planCategory.toLowerCase().includes(query)
      )
    })

    const formatPrice = (price: string, thaiDiscount?: string | null) => {
      const basePrice = parseFloat(price)
      if (thaiDiscount) {
        const discountPrice = parseFloat(thaiDiscount)
        return `฿${basePrice.toLocaleString()} / ฿${discountPrice.toLocaleString()} (Thai)`
      }
      return `฿${basePrice.toLocaleString()}`
    }

    const getPlanTypeDisplay = (plan: Plan) => {
      if (plan.isDropIn) {
        return (
          <div className="flex items-center gap-2">
            <Clock className="h-3 w-3" />
            <span>Day Pass</span>
          </div>
        )
      } else if (plan.duration) {
        return (
          <div className="flex items-center gap-2">
            <Calendar className="h-3 w-3" />
            <span>{plan.duration} month{plan.duration > 1 ? 's' : ''}</span>
          </div>
        )
      } else if (plan.visitLimit) {
        return (
          <div className="flex items-center gap-2">
            <Clock className="h-3 w-3" />
            <span>{plan.visitLimit} visits</span>
          </div>
        )
      }
      return 'Custom'
    }

    const getCategoryColor = (category: string) => {
      switch (category) {
        case 'gym':
          return 'bg-blue-100 text-blue-800'
        case 'crossfit':
          return 'bg-red-100 text-red-800'
        case 'fitness':
          return 'bg-green-100 text-green-800'
        case 'combo':
          return 'bg-purple-100 text-purple-800'
        default:
          return 'bg-gray-100 text-gray-800'
      }
    }

    if (loading) {
      return <div className="text-center py-8">Loading plans...</div>
    }

    return (
      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Gym Share</TableHead>
                <TableHead>CrossFit Share</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPlans.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                    {searchQuery ? 'No plans found matching your search' : 'No plans available'}
                  </TableCell>
                </TableRow>
              ) : (
                filteredPlans.map((plan) => (
                  <TableRow key={plan.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{plan.name}</div>
                        {plan.description && (
                          <div className="text-sm text-gray-500">{plan.description}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getCategoryColor(plan.planCategory)}>
                        {plan.planCategory.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {getPlanTypeDisplay(plan)}
                    </TableCell>
                    <TableCell>
                      {formatPrice(plan.price, plan.priceThaiDiscount)}
                    </TableCell>
                    <TableCell>
                      <span className="font-medium text-green-600">
                        {parseFloat(plan.gymSharePercentage || '0').toFixed(0)}%
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium text-blue-600">
                        {parseFloat(plan.crossfitSharePercentage || '0').toFixed(0)}%
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={plan.isActive ? 'default' : 'secondary'}>
                        {plan.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleActive(plan.id, plan.isActive)}
                        >
                          {plan.isActive ? 'Deactivate' : 'Activate'}
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    )
  }
)

PlansTable.displayName = 'PlansTable'