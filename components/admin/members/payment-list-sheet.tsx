'use client'

import { useState, useEffect } from 'react'
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

interface Payment {
  id: string
  amount: string
  paymentDate: string
  paymentMethod: 'cash' | 'card'
  paymentType: 'membership' | 'day_pass' | 'shop_item'
  serviceType?: 'gym' | 'crossfit' | 'fitness_class'
  gymShare?: string
  crossfitShare?: string
}

interface PaymentListSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  memberId: string
  memberName: string
}

export function PaymentListSheet({ open, onOpenChange, memberId, memberName }: PaymentListSheetProps) {
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddPayment, setShowAddPayment] = useState(false)

  useEffect(() => {
    if (open) {
      fetchPayments()
    }
  }, [open, memberId])

  const fetchPayments = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/members/${memberId}/payments`)
      if (response.ok) {
        const data = await response.json()
        setPayments(data)
      } else {
        console.error('Failed to fetch payments')
      }
    } catch (error) {
      console.error('Error fetching payments:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  const formatCurrency = (amount: string) => {
    return `${amount} ฿`
  }

  const getPaymentMethodIcon = (method: 'cash' | 'card') => {
    return method === 'cash' ? <Banknote className="h-4 w-4" /> : <CreditCard className="h-4 w-4" />
  }

  const getPaymentTypeBadge = (type: 'membership' | 'day_pass' | 'shop_item') => {
    const variants = {
      membership: { variant: 'default' as const, text: 'Membership' },
      day_pass: { variant: 'secondary' as const, text: 'Day Pass' },
      shop_item: { variant: 'outline' as const, text: 'Shop Item' },
    }

    const config = variants[type]
    return <Badge variant={config.variant}>{config.text}</Badge>
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
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Split</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>{formatDate(payment.paymentDate)}</TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(payment.amount)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getPaymentMethodIcon(payment.paymentMethod)}
                          <span className="capitalize">{payment.paymentMethod}</span>
                        </div>
                      </TableCell>
                      <TableCell>{getPaymentTypeBadge(payment.paymentType)}</TableCell>
                      <TableCell>
                        {payment.serviceType ? (
                          <Badge variant="outline" className="capitalize">
                            {payment.serviceType}
                          </Badge>
                        ) : (
                          '-'
                        )}
                      </TableCell>
                      <TableCell>
                        {payment.gymShare && payment.crossfitShare ? (
                          <div className="text-xs space-y-1">
                            <div>Gym: {payment.gymShare}%</div>
                            <div>CrossFit: {payment.crossfitShare}%</div>
                          </div>
                        ) : (
                          '-'
                        )}
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