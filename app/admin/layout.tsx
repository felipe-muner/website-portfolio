import { AuthProvider } from '@/components/providers/auth-provider'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  )
}