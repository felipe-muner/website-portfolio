'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { HelpCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MemberStatusHelpDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function MemberStatusHelpDialog({ open, onOpenChange }: MemberStatusHelpDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn("w-[95vw] max-w-none max-h-[80vh] overflow-y-auto")} style={{ maxWidth: '50vw', width: '80vw' }}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            Member Status Guide - Plan Column Badges
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Active Memberships */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-green-700">✅ Active Memberships</h3>
            <div className="space-y-3 bg-green-50 p-4 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="flex flex-col gap-1 min-w-[200px]">
                  <div className="flex items-center gap-1">
                    <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">Gym 3 Month</Badge>
                  </div>
                </div>
                <span className="text-sm text-gray-600">→ Active membership with more than 7 days remaining</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex flex-col gap-1 min-w-[200px]">
                  <div className="flex items-center gap-1">
                    <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">Gym 5-Pass</Badge>
                    <span className="text-xs text-gray-500">(2/5 visits)</span>
                    <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200 text-xs">
                      2 pauses
                    </Badge>
                  </div>
                </div>
                <span className="text-sm text-gray-600">→ Pass with 2 visits used, 3 remaining out of 5 total</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex flex-col gap-1 min-w-[200px]">
                  <div className="flex items-center gap-1">
                    <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">CrossFit 10-Pass</Badge>
                    <span className="text-xs text-gray-500">(2/10 visits)</span>
                  </div>
                </div>
                <span className="text-sm text-gray-600">→ Pass with 2 visits used, 8 remaining out of 10 total</span>
              </div>
            </div>
          </div>

          {/* Expiring Soon */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-orange-700">⚠️ Expiring Soon (≤7 days)</h3>
            <div className="space-y-3 bg-orange-50 p-4 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="flex flex-col gap-1 min-w-[200px]">
                  <div className="flex items-center gap-1">
                    <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">Gym 1 Month</Badge>
                  </div>
                  <div className="flex items-center gap-1">
                    <Badge variant="outline" className="bg-orange-100 text-orange-800 text-xs">
                      Expiring (3d)
                    </Badge>
                  </div>
                </div>
                <span className="text-sm text-gray-600">→ Valid membership expiring in 3 days - renewal needed</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex flex-col gap-1 min-w-[200px]">
                  <div className="flex items-center gap-1">
                    <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">Fitness 5-Pass</Badge>
                    <span className="text-xs text-gray-500">(3/5 visits)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Badge variant="outline" className="bg-orange-100 text-orange-800 text-xs">
                      Expiring (1d)
                    </Badge>
                  </div>
                </div>
                <span className="text-sm text-gray-600">→ Pass expires tomorrow, 2 remaining visits will be lost</span>
              </div>
            </div>
          </div>

          {/* Expired/Invalid */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-red-700">❌ Expired/Invalid</h3>
            <div className="space-y-3 bg-red-50 p-4 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="flex flex-col gap-1 min-w-[200px]">
                  <div className="flex items-center gap-1">
                    <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">Gym 6 Month</Badge>
                  </div>
                  <div className="flex items-center gap-1">
                    <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200 text-xs">
                      Expired
                    </Badge>
                  </div>
                </div>
                <span className="text-sm text-gray-600">→ Membership past end date - no facility access</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex flex-col gap-1 min-w-[200px]">
                  <div className="flex items-center gap-1">
                    <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">CrossFit 5-Pass</Badge>
                    <span className="text-xs text-gray-500">(5/5 visits)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200 text-xs">
                      Expired
                    </Badge>
                  </div>
                </div>
                <span className="text-sm text-gray-600">→ All 5 visits used - pass exhausted</span>
              </div>
            </div>
          </div>

          {/* Paused */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-amber-700">⏸️ Paused Memberships</h3>
            <div className="space-y-3 bg-amber-50 p-4 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="flex flex-col gap-1 min-w-[200px]">
                  <div className="flex items-center gap-1">
                    <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">Gym + CrossFit 3 Month</Badge>
                  </div>
                  <div className="flex items-center gap-1">
                    <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 text-xs">
                      Paused
                    </Badge>
                  </div>
                </div>
                <span className="text-sm text-gray-600">→ Temporarily suspended - can be resumed by staff</span>
              </div>
            </div>
          </div>

          {/* Visit Counter Guide */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-blue-700">🎫 Day-Pass System Guide</h3>
            <div className="bg-blue-50 p-4 rounded-lg space-y-3">
              <div>
                <p className="text-sm font-semibold">📅 <strong>Incremental Day Tracking:</strong></p>
                <p className="text-sm">• Each &quot;visit&quot; = unlimited access for 1 full day</p>
                <p className="text-sm">• Members can leave and return on the same day without extra charge</p>
                <p className="text-sm">• Counter increases by 1 on FIRST check-in of each day</p>
                <p className="text-sm">• Format shows: (used/total visits)</p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-semibold">Visit Counter Examples:</p>
                  <p><span className="font-mono bg-gray-100 px-1 rounded">(0/5 visits)</span> = Fresh pass, no days used</p>
                  <p><span className="font-mono bg-gray-100 px-1 rounded">(3/5 visits)</span> = 3 days used, 2 remaining</p>
                  <p><span className="font-mono bg-gray-100 px-1 rounded">(5/5 visits)</span> = All days used, expired</p>
                </div>
                <div>
                  <p className="font-semibold">Pass Types:</p>
                  <p>• 5-Pass plans: 5 full days total</p>
                  <p>• 10-Pass plans: 10 full days total</p>
                  <p>• Monthly plans: Unlimited days</p>
                </div>
              </div>
              <p className="text-xs text-blue-600 mt-2">💡 <strong>Tip:</strong> Hover over any visit counter for detailed information</p>
            </div>
          </div>

          {/* Pause Counter Guide */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-blue-700">⏸️ Pause Allowances</h3>
            <div className="bg-blue-50 p-4 rounded-lg space-y-2">
              <p className="text-sm"><strong>Pause Rules by Plan Duration:</strong></p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p>• 1 Month plans: <strong>1 pause</strong> allowed</p>
                  <p>• 3 Month plans: <strong>2 pauses</strong> allowed</p>
                </div>
                <div>
                  <p>• 6 Month plans: <strong>3 pauses</strong> allowed</p>
                  <p>• 12 Month plans: <strong>4 pauses</strong> allowed</p>
                </div>
              </div>
              <div className="mt-2 p-2 bg-yellow-50 rounded text-xs">
                <p><strong>Note:</strong> Pass-based plans (5-pass, 10-pass) cannot be paused</p>
              </div>
              <p className="text-xs text-blue-600 mt-2">💡 <strong>Badge shows:</strong> Remaining pauses available for the member</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-700">🚀 Quick Actions</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong>When you see &quot;Expiring&quot;:</strong></p>
                  <p>• Contact member for renewal</p>
                  <p>• Offer renewal discounts</p>
                </div>
                <div>
                  <p><strong>When you see &quot;Expired&quot;:</strong></p>
                  <p>• Member needs new membership</p>
                  <p>• No facility access until renewed</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button onClick={() => onOpenChange(false)}>
            Got it!
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function MemberStatusHelpButton() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setOpen(true)}
        className="text-gray-500 hover:text-gray-700"
        title="View member status guide"
      >
        <HelpCircle className="h-4 w-4" />
      </Button>
      <MemberStatusHelpDialog open={open} onOpenChange={setOpen} />
    </>
  )
}