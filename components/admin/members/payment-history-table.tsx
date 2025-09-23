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
import { Button } from '@/components/ui/button'
import { Plus, Receipt } from 'lucide-react'
import { AddPaymentSheet } from './add-payment-sheet'

interface Payment {
  id: string
  amount: string
  paymentDate: string
  paymentMethod: 'cash' | 'card'
  paymentType?: 'membership' | 'day_pass' | 'shop_item'
  serviceType?: 'gym' | 'crossfit' | 'fitness_class'
  gymShareAmount?: string
  crossfitShareAmount?: string
  planName?: string
}

interface PaymentHistoryTableProps {
  memberId: string
  memberName: string
  showAddButton?: boolean
  containerClassName?: string
}

export function PaymentHistoryTable({
  memberId,
  memberName,
  showAddButton = true,
  containerClassName = ""
}: PaymentHistoryTableProps) {
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddPayment, setShowAddPayment] = useState(false)

  useEffect(() => {
    fetchPayments()
  }, [memberId])

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

  const getTotalRevenue = () => {
    if (!Array.isArray(payments)) return 0
    return payments.reduce((total, payment) => total + parseFloat(payment.amount), 0)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-gray-500">Loading payment history...</div>
      </div>
    )
  }

  return (
    <div className={containerClassName}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">Payment History - {memberName}</h3>
          <p className="text-sm text-gray-600 mt-1">
            Total Revenue: <span className="font-semibold">{formatCurrency(getTotalRevenue().toFixed(2))}</span>
            {' • '}
            {payments.length} payment{payments.length !== 1 ? 's' : ''}
          </p>
        </div>
        {showAddButton && (
          <Button onClick={() => setShowAddPayment(true)} className="bg-gray-900 hover:bg-gray-800 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Add Payment
          </Button>
        )}
      </div>

      {/* Table */}
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
              <TableHead>Total Paid</TableHead>
              <TableHead>Gym Share</TableHead>
              <TableHead>CrossFit Share</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell>{formatDate(payment.paymentDate)}</TableCell>
                <TableCell>
                  {payment.planName || 'Plan not specified'}
                </TableCell>
                <TableCell className="font-medium">
                  {formatCurrency(payment.amount)}
                </TableCell>
                <TableCell className="font-medium text-green-600">
                  {payment.gymShareAmount ? formatCurrency(payment.gymShareAmount) : '-'}
                </TableCell>
                <TableCell className="font-medium text-blue-600">
                  {payment.crossfitShareAmount ? formatCurrency(payment.crossfitShareAmount) : '-'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Add Payment Sheet */}
      <AddPaymentSheet
        open={showAddPayment}
        onOpenChange={setShowAddPayment}
        memberId={memberId}
        memberName={memberName}
        onPaymentAdded={fetchPayments}
      />
    </div>
  )
}