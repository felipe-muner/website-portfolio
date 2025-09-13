import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

export default function AdminDashboard() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Admin Dashboard
        </h1>
        <p className="text-gray-600">Manage your gym operations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Members</CardTitle>
            <CardDescription>Manage gym members</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button asChild className="w-full">
                <Link href="/admin/members/new">Add New Member</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/admin/members">View All Members</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Check-ins</CardTitle>
            <CardDescription>Member check-in management</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button asChild className="w-full">
                <Link href="/admin/checkins">Today&apos;s Check-ins</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/admin/checkins/history">Check-in History</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payments</CardTitle>
            <CardDescription>Financial management</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button asChild className="w-full">
                <Link href="/admin/payments">View Payments</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/admin/payments/reports">Reports</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Day Passes</CardTitle>
            <CardDescription>Manage day passes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button asChild className="w-full">
                <Link href="/admin/day-passes/new">Sell Day Pass</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/admin/day-passes">View Day Passes</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Shop</CardTitle>
            <CardDescription>Shop items and sales</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button asChild className="w-full">
                <Link href="/admin/shop/items">Manage Items</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/admin/shop/sales">View Sales</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Settings</CardTitle>
            <CardDescription>System settings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button asChild className="w-full">
                <Link href="/admin/settings">General Settings</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/admin/settings/admins">Admin Users</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}