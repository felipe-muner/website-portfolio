'use client'

import { useState, useEffect, forwardRef, useImperativeHandle } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Trash2 } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface AdminUser {
  id: string
  email: string
  name: string
  role: 'admin' | 'staff'
  isActive: boolean
  createdAt: string
  lastLogin: string | null
}

export interface AdminUsersTableRef {
  refreshUsers: () => void
}

interface AdminUsersTableProps {
  searchQuery?: string
}

export const AdminUsersTable = forwardRef<AdminUsersTableRef, AdminUsersTableProps>(
  function AdminUsersTable({ searchQuery = '' }, ref) {
    const [users, setUsers] = useState<AdminUser[]>([])
    const [isLoading, setIsLoading] = useState(true)

    const fetchUsers = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/admin/users')
        if (response.ok) {
          const data = await response.json()
          setUsers(data)
        }
      } catch (error) {
        console.error('Failed to fetch admin users:', error)
      } finally {
        setIsLoading(false)
      }
    }

    useImperativeHandle(ref, () => ({
      refreshUsers: fetchUsers,
    }))

    useEffect(() => {
      fetchUsers()
    }, [])

    const handleRoleChange = async (userId: string, newRole: string) => {
      try {
        const response = await fetch(`/api/admin/users/${userId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ role: newRole }),
        })

        if (response.ok) {
          await fetchUsers()
        } else {
          alert('Failed to update user role')
        }
      } catch (error) {
        console.error('Failed to update role:', error)
        alert('Failed to update user role')
      }
    }

    const handleToggleActive = async (userId: string, isActive: boolean) => {
      try {
        const response = await fetch(`/api/admin/users/${userId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ isActive: !isActive }),
        })

        if (response.ok) {
          await fetchUsers()
        } else {
          alert('Failed to update user status')
        }
      } catch (error) {
        console.error('Failed to toggle active status:', error)
        alert('Failed to update user status')
      }
    }

    const handleDeleteUser = async (userId: string) => {
      if (!confirm('Are you sure you want to delete this user?')) return

      try {
        const response = await fetch(`/api/admin/users/${userId}`, {
          method: 'DELETE',
        })

        if (response.ok) {
          await fetchUsers()
        } else {
          alert('Failed to delete user')
        }
      } catch (error) {
        console.error('Failed to delete user:', error)
        alert('Failed to delete user')
      }
    }

    const filteredUsers = users.filter(user =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const getRoleBadgeColor = (role: string) => {
      switch (role) {
        case 'admin': return 'bg-blue-100 text-blue-800'
        case 'staff': return 'bg-orange-100 text-orange-800'
        default: return 'bg-gray-100 text-gray-800'
      }
    }

    if (isLoading) {
      return <div className="p-8 text-center">Loading admin users...</div>
    }

    return (
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Login</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  {searchQuery ? 'No admin users found matching your search.' : 'No admin users found.'}
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Select
                      value={user.role}
                      onValueChange={(value) => handleRoleChange(user.id, value)}
                    >
                      <SelectTrigger className="w-[110px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="staff">Staff</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={user.isActive ? 'default' : 'secondary'}
                      className={user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                    >
                      {user.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {user.lastLogin
                      ? new Date(user.lastLogin).toLocaleDateString()
                      : 'Never'
                    }
                  </TableCell>
                  <TableCell>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleActive(user.id, user.isActive)}
                      >
                        {user.isActive ? 'Deactivate' : 'Activate'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    )
  }
)