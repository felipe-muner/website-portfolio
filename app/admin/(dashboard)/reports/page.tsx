import { format, startOfMonth, endOfMonth } from 'date-fns'
import { getIncomeReportData } from '@/lib/reports'
import ReportsClient from './reports-client'

export default async function ReportsPage() {
  // Set default dates to current month's first and last day
  const currentDate = new Date()
  const firstDayOfMonth = startOfMonth(currentDate)
  const lastDayOfMonth = endOfMonth(currentDate)

  const defaultStartDate = format(firstDayOfMonth, 'yyyy-MM-dd')
  const defaultEndDate = format(lastDayOfMonth, 'yyyy-MM-dd')

  // Pre-load current month's data on the server
  const initialData = await getIncomeReportData(defaultStartDate, defaultEndDate, 'all')

  return (
    <ReportsClient
      initialData={initialData}
      defaultStartDate={defaultStartDate}
      defaultEndDate={defaultEndDate}
    />
  )
}