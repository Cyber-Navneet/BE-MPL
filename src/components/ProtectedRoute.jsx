import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'

// Also handles logout: once the user is cleared, this redirects to the login tab for their role.
export default function ProtectedRoute() {
  const { user, lastRole } = useAuth()
  return user ? <Outlet /> : <Navigate to={`/login?role=${lastRole}`} replace />
}
