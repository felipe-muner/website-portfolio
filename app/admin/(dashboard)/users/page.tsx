'use client'

import { useState, useRef } from 'react'
import { AdminUsersTable, type AdminUsersTableRef } from '@/components/admin/users/admin-users-table'
import { AddAdminUserSheet } from '@/components/admin/users/add-admin-user-sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Search, Shield } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function AdminUsersPage() {
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const adminUsersTableRef = useRef<AdminUsersTableRef>(null)

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Shield className="h-8 w-8 text-blue-600" />
            Admin Users
          </h1>
          <p className="text-gray-600">Manage admin and staff user accounts and permissions</p>
        </div>
        <Button onClick={() => setIsAddSheetOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Admin User
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Admin</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-blue-600">Full Access</p>
            <p className="text-xs text-gray-500">All features + user management</p>
          </CardContent>
        </Card>


        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Staff</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-orange-600">Basic Access</p>
            <p className="text-xs text-gray-500">Dashboard, Members, Check-in, Birthdays</p>
          </CardContent>
        </Card>
      </div>

      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <AdminUsersTable
        ref={adminUsersTableRef}
        searchQuery={searchQuery}
      />

      <AddAdminUserSheet
        open={isAddSheetOpen}
        onOpenChange={setIsAddSheetOpen}
        onUserAdded={() => adminUsersTableRef.current?.refreshUsers()}
      />
    </div>
  )
}