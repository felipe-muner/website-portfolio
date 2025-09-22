'use client'

import { useState, useEffect } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
  planName?: string
}

interface PaymentHistoryProps {
  memberId: string
  memberName: string
}

export function PaymentHistory({ memberId, memberName }: PaymentHistoryProps) {
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddPayment, setShowAddPayment] = useState(false)

  useEffect(() => {
    fetchPayments()
  }, [memberId]) // eslint-disable-line react-hooks/exhaustive-deps

  const fetchPayments = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/members/${memberId}/payments`)
      if (response.ok) {
        const data = await response.json()
        setPayments(Array.isArray(data) ? data : (data.payments || []))
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
    if (!Array.isArray(payments)) return 0
    return payments.reduce((total, payment) => total + parseFloat(payment.amount), 0)
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="text-gray-500">Loading payment history...</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Payment History - {memberName}</CardTitle>
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
      </CardHeader>
      <CardContent>
        {payments.length === 0 ? (
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
      </CardContent>

      <AddPaymentSheet
        open={showAddPayment}
        onOpenChange={setShowAddPayment}
        memberId={memberId}
        memberName={memberName}
        onPaymentAdded={fetchPayments}
      />
    </Card>
  )
}