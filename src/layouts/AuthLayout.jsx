import { Navigate, Outlet, useSearchParams } from 'react-router-dom'
import BrandingPanel from '../components/BrandingPanel.jsx'
import RoleSelector from '../components/RoleSelector.jsx'
import { useAuth } from '../hooks/useAuth.js'
import { parseRole } from '../utils/mockAuth.js'

// The selected role lives in the URL (?role=) so it survives switching between
// /login and /signup, browser back/forward, and links from the landing page.
export default function AuthLayout() {
  const { user } = useAuth()
  const [params, setParams] = useSearchParams()
  const role = parseRole(params.get('role'))

  if (user) return <Navigate to="/dashboard" replace />

  const setRole = (nextRole) =>
    setParams(
      (prev) => {
        prev.set('role', nextRole)
        return prev
      },
      { replace: true },
    )

  return (
    <div className="min-h-screen bg-white md:flex">
      <BrandingPanel />
      <main className="flex flex-1 justify-center px-5 pt-10 pb-12 md:px-8 md:pt-[22vh]">
        <div className="w-full max-w-[507px]">
          <RoleSelector value={role} onChange={setRole} />
          <Outlet context={{ role }} />
        </div>
      </main>
    </div>
  )
}
