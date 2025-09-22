'use client'

import { Card, CardContent } from '@/components/ui/card'
import { PaymentHistoryTable } from './payment-history-table'

interface PaymentHistoryProps {
  memberId: string
  memberName: string
}

export function PaymentHistory({ memberId, memberName }: PaymentHistoryProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <PaymentHistoryTable
          memberId={memberId}
          memberName={memberName}
        />
      </CardContent>
    </Card>
  )
}