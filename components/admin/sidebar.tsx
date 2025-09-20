'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  BarChart3,
  Cake,
  Calendar,
  CreditCard,
  Home,
  LogOut,
  Settings,
  ShoppingBag,
  User,
  Users,
} from 'lucide-react'

const sidebarItems = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: Home,
  },
  {
    title: 'Members',
    href: '/admin/members',
    icon: Users,
  },
  {
    title: 'Birthdays',
    href: '/admin/birthdays',
    icon: Cake,
  },
  {
    title: 'Check-in',
    href: '/checkin',
    icon: Calendar,
  },
  {
    title: 'Day Passes',
    href: '/admin/day-passes',
    icon: CreditCard,
  },
  {
    title: 'Shop',
    href: '/admin/shop',
    icon: ShoppingBag,
  },
  {
    title: 'Reports',
    href: '/admin/reports',
    icon: BarChart3,
  },
  {
    title: 'Users',
    href: '/admin/users',
    icon: User,
  },
  {
    title: 'Settings',
    href: '/admin/settings',
    icon: Settings,
  },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()

  const filteredItems = sidebarItems.filter(item => {
    // Show users and settings only to owners
    if ((item.href === '/admin/users' || item.href === '/admin/settings') && session?.user?.role !== 'owner') {
      return false
    }
    // Hide shop and reports from staff
    if ((item.href === '/admin/shop' || item.href === '/admin/reports') && session?.user?.role === 'staff') {
      return false
    }
    return true
  })

  return (
    <div className="w-64 bg-white shadow-lg flex flex-col">
      <div className="p-6 border-b">
        <h1 className="text-xl font-bold text-gray-800">Summit Gym</h1>
        <p className="text-sm text-gray-600">Admin Panel</p>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {filteredItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          
          return (
            <Link key={item.href} href={item.href}>
              <div
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                )}
              >
                <Icon className="h-4 w-4" />
                {item.title}
              </div>
            </Link>
          )
        })}
      </nav>
      
      <div className="p-4 border-t">
        <div className="mb-3 px-3">
          <p className="text-sm font-medium text-gray-900">{session?.user?.name}</p>
          <p className="text-xs text-gray-600 capitalize">{session?.user?.role}</p>
        </div>
        <Button
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
          variant="outline"
          className="w-full justify-start"
          size="sm"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  )
}