import { auth } from '@/lib/auth'
import { DashboardStats } from '@/components/admin/dashboard-stats'
import { RecentActivity } from '@/components/admin/recent-activity'

export default async function AdminDashboard() {
  const session = await auth()
  
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {session?.user?.name}
        </h1>
        <p className="text-gray-600">Here&apos;s what&apos;s happening at your gym today.</p>
      </div>

      <DashboardStats />
      
      <div className="mt-6">
        <RecentActivity />
      </div>
    </div>
  )
}