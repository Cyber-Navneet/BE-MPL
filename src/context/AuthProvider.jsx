import { useCallback, useMemo, useState } from 'react'
import { AuthContext } from './authContext.js'
import { clearSession, loadSession, saveSession } from '../utils/mockAuth.js'

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(loadSession)
  // Role of the most recent user, so signing out returns to the matching login tab.
  const [lastRole, setLastRole] = useState(() => user?.role ?? 'student')

  const signIn = useCallback((nextUser) => {
    saveSession(nextUser)
    setUser(nextUser)
    setLastRole(nextUser.role)
  }, [])

  const signOut = useCallback(() => {
    clearSession()
    setUser(null)
  }, [])

  const value = useMemo(() => ({ user, lastRole, signIn, signOut }), [user, lastRole, signIn, signOut])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
