'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Plus, Receipt, CreditCard, Banknote } from 'lucide-react'
import { AddPaymentSheet } from './add-payment-sheet'
import { Payment } from '@/lib/types/database'
import { format } from 'date-fns'

// Extended payment type with plan information from JOIN
interface PaymentWithPlan extends Payment {
  // Plan information from join
  planName?: string
  planType?: string
  planCategory?: string
  isDropIn?: boolean
}


interface PaymentListSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  memberId: string
  memberName: string
}

export function PaymentListSheet({ open, onOpenChange, memberId, memberName }: PaymentListSheetProps) {
  const [payments, setPayments] = useState<PaymentWithPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddPayment, setShowAddPayment] = useState(false)

  const fetchPayments = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/members/${memberId}/payments`)
      if (response.ok) {
        const data = await response.json()
        setPayments(data.payments)
      } else {
        console.error('Failed to fetch payments')
      }
    } catch (error) {
      console.error('Error fetching payments:', error)
    } finally {
      setLoading(false)
    }
  }, [memberId])

  useEffect(() => {
    if (open) {
      fetchPayments()
    }
  }, [open, memberId, fetchPayments])

  const formatDate = (date: Date) => {
    return format(date, 'dd/MM/yyyy')
  }

  const formatCurrency = (amount: string) => {
    return `${amount} ฿`
  }

  const getTotalRevenue = () => {
    return payments.reduce((total, payment) => total + parseFloat(payment.amount), 0)
  }


  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="right" className="w-[800px] max-w-[90vw] overflow-y-auto">
          <SheetHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <SheetTitle>Payment History - {memberName}</SheetTitle>
                <p className="text-sm text-gray-600 mt-1">
                  Total Revenue: <span className="font-semibold">{formatCurrency(getTotalRevenue().toFixed(2))}</span>
                  {' • '}
                  {payments.length} payment{payments.length !== 1 ? 's' : ''}
                </p>
              </div>
              <Button onClick={() => setShowAddPayment(true)} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Payment
              </Button>
            </div>
          </SheetHeader>

          <div className="mt-6">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-gray-500">Loading payment history...</div>
              </div>
            ) : payments.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Receipt className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No payment history found</p>
                <p className="text-sm">Payments will appear here once recorded</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Payment Date</TableHead>
                    <TableHead>Plan</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>{formatDate(payment.paymentDate)}</TableCell>
                      <TableCell>
                        {payment.planName || 'Plan not specified'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </SheetContent>
      </Sheet>

      <AddPaymentSheet
        open={showAddPayment}
        onOpenChange={setShowAddPayment}
        memberId={memberId}
        memberName={memberName}
        onPaymentAdded={fetchPayments}
      />
    </>
  )
}