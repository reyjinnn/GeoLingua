import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export function ProtectedRoute({ admin = false }: { admin?: boolean }) {
  const { user, loading } = useAuth()
  const location = useLocation()
  if (loading) return <div role="status" className="p-8 text-center">Memuat sesi...</div>
  if (!user) return <Navigate to={admin ? '/admin/login' : '/login'} state={{ from: location }} replace />
  if (admin && user.role !== 'admin') return <Navigate to="/dashboard" replace />
  if (!admin && user.role !== 'admin' && !user.active_course && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />
  }
  return <Outlet />
}
