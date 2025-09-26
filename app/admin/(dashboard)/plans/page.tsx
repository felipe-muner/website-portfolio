'use client'

import { useState, useRef } from 'react'
import { PlansTable, type PlansTableRef } from '@/components/admin/plans/plans-table'
import { AddPlanSheet } from '@/components/admin/plans/add-plan-sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Search } from 'lucide-react'

export default function PlansPage() {
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [plansCount, setPlansCount] = useState(0)
  const plansTableRef = useRef<PlansTableRef>(null)

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Plans <span className="text-gray-500 font-normal">({plansCount})</span>
          </h1>
          <p className="text-gray-600">Manage gym and CrossFit membership plans</p>
        </div>
        <Button onClick={() => setIsAddSheetOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Plan
        </Button>
      </div>

      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by name, type, or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <PlansTable
        ref={plansTableRef}
        searchQuery={searchQuery}
        onPlansCountChange={setPlansCount}
      />

      <AddPlanSheet
        open={isAddSheetOpen}
        onOpenChange={setIsAddSheetOpen}
        onPlanAdded={() => plansTableRef.current?.refreshPlans()}
      />
    </div>
  )
}