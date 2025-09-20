import { NextRequest, NextResponse } from 'next/server'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import { format } from 'date-fns'

export async function POST(request: NextRequest) {
  try {
    const { reportData, startDate, endDate, facilityFilter } = await request.json()

    if (!reportData) {
      return NextResponse.json(
        { error: 'Report data is required' },
        { status: 400 }
      )
    }

    // Create new PDF document
    const doc = new jsPDF()

    // Add title and header info
    doc.setFontSize(20)
    doc.text('Income Report', 20, 30)

    doc.setFontSize(12)
    doc.text(`Period: ${format(new Date(startDate), 'MMM dd, yyyy')} - ${format(new Date(endDate), 'MMM dd, yyyy')}`, 20, 45)
    doc.text(`Facility Filter: ${facilityFilter === 'all' ? 'All Facilities' : facilityFilter.charAt(0).toUpperCase() + facilityFilter.slice(1)}`, 20, 55)
    doc.text(`Generated: ${format(new Date(), 'MMM dd, yyyy HH:mm')}`, 20, 65)

    // Add summary section
    doc.setFontSize(16)
    doc.text('Summary', 20, 85)

    doc.setFontSize(12)
    const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`

    doc.text(`Total Revenue: ${formatCurrency(reportData.totalRevenue)}`, 20, 100)
    doc.text(`Gym Revenue: ${formatCurrency(reportData.gymRevenue)}`, 20, 110)
    doc.text(`CrossFit Revenue: ${formatCurrency(reportData.crossfitRevenue)}`, 20, 120)
    doc.text(`Total Transactions: ${reportData.totalTransactions}`, 20, 130)
    doc.text(`Average Transaction: ${formatCurrency(reportData.averageTransactionValue)}`, 20, 140)

    if (reportData.periodComparison) {
      const growth = reportData.periodComparison.growthPercentage
      doc.text(`Growth vs Previous Period: ${growth >= 0 ? '+' : ''}${growth.toFixed(1)}%`, 20, 150)
    }

    // Add transactions table
    doc.setFontSize(16)
    doc.text('Transaction Details', 20, 170)

    const tableData = reportData.transactions.map((transaction: {
      paymentDate: string
      memberName: string
      planType: string
      facilityType: string
      amount: number
    }) => [
      format(new Date(transaction.paymentDate), 'MMM dd, yyyy'),
      transaction.memberName,
      transaction.planType.replace('_', ' ').toUpperCase(),
      transaction.facilityType.charAt(0).toUpperCase() + transaction.facilityType.slice(1),
      formatCurrency(transaction.amount)
    ])

    autoTable(doc, {
      head: [['Date', 'Member', 'Plan Type', 'Facility', 'Amount']],
      body: tableData,
      startY: 180,
      styles: {
        fontSize: 10,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [59, 130, 246], // Blue
        textColor: 255,
        fontStyle: 'bold'
      },
      columnStyles: {
        4: { halign: 'right' } // Right-align amount column
      },
      margin: { left: 20, right: 20 },
    })

    // Add footer
    const pageCount = doc.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i)
      doc.setFontSize(10)
      doc.text(
        `Page ${i} of ${pageCount} - Summit Gym CrossFit`,
        20,
        doc.internal.pageSize.height - 10
      )
    }

    // Generate PDF buffer
    const pdfBuffer = doc.output('arraybuffer')

    // Return PDF as response
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="income-report-${startDate}-to-${endDate}.pdf"`
      }
    })

  } catch (error) {
    console.error('Error generating PDF:', error)
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    )
  }
}