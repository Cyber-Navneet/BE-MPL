import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from './useAuth.js'

const SUCCESS_DELAY_MS = 900

// Lets a form show its success message briefly before signing the user in
// and moving to the dashboard. Call `complete(user)` on success.
export function useCompleteAuth() {
  const [pendingUser, setPendingUser] = useState(null)
  const { signIn } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!pendingUser) return
    const timer = setTimeout(() => {
      signIn(pendingUser)
      navigate('/dashboard', { replace: true })
    }, SUCCESS_DELAY_MS)
    return () => clearTimeout(timer)
  }, [pendingUser, signIn, navigate])

  return { isCompleting: pendingUser !== null, complete: setPendingUser }
}
