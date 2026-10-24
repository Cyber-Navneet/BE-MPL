import { Navigate, Outlet, useOutletContext } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'

// Recruiter-only pages; students are sent back to their dashboard. Demo check only — not real authorization.
// Forwards AppLayout's outlet context (notify) to the nested pages.
export default function RecruiterRoute() {
  const { user } = useAuth()
  const context = useOutletContext()
  return user?.role === 'recruiter' ? <Outlet context={context} /> : <Navigate to="/dashboard" replace />
}
