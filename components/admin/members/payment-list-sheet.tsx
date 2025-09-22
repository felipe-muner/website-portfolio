'use client'

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { PaymentHistoryTable } from './payment-history-table'

interface PaymentListSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  memberId: string
  memberName: string
}

export function PaymentListSheet({ open, onOpenChange, memberId, memberName }: PaymentListSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="max-h-[80vh] overflow-y-auto p-0">
        <SheetHeader className="sr-only">
          <SheetTitle>Payment History for {memberName}</SheetTitle>
        </SheetHeader>
        <div className="p-8 bg-white w-1/2 mx-auto">
          <PaymentHistoryTable
            memberId={memberId}
            memberName={memberName}
            showAddButton={true}
          />
        </div>
      </SheetContent>
    </Sheet>
  )
}