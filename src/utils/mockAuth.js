// Frontend-only demo authentication. NOT secure: the demo credentials ship in the
// JS bundle and nothing is verified server-side. A real app needs a backend with
// hashed passwords and proper session management.

export const ROLES = ['student', 'recruiter']

const DEMO_ACCOUNTS = [
  { role: 'student', name: 'Aarav Sharma', email: 'student@talentforge.demo', password: 'Student@123' },
  { role: 'recruiter', name: 'Preeti Singh', email: 'recruiter@talentforge.demo', password: 'Recruiter@123' },
]

// Accounts created via the sign-up form. Kept in memory only (cleared on page
// reload) so passwords are never written to browser storage.
const registeredAccounts = []

const SESSION_KEY = 'talentforge.session'

const normalizeEmail = (email) => email.trim().toLowerCase()
const allAccounts = () => [...DEMO_ACCOUNTS, ...registeredAccounts]
const toUser = ({ name, email, role }) => ({ name, email, role })

export function parseRole(value) {
  return ROLES.includes(value) ? value : 'student'
}

export function getDemoCredentials(role) {
  const { email, password } = DEMO_ACCOUNTS.find((account) => account.role === role)
  return { email, password }
}

// Returns the public user for matching credentials of the given role, else null.
export function authenticate({ email, password, role }) {
  const normalized = normalizeEmail(email)
  const account = allAccounts().find(
    (a) => a.role === role && a.email === normalized && a.password === password,
  )
  return account ? toUser(account) : null
}

export function registerAccount({ name, email, password, role }) {
  const normalized = normalizeEmail(email)
  if (allAccounts().some((a) => a.email === normalized)) {
    return { error: 'An account with this email already exists.' }
  }
  const account = { name: name.trim(), email: normalized, password, role }
  registeredAccounts.push(account)
  return { user: toUser(account) }
}

// Session storage holds only the public user (name, email, role) — never a password.
export function loadSession() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function saveSession(user) {
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(user))
  } catch {
    // Storage unavailable (e.g. private mode); the session lives in React state only.
  }
}

export function clearSession() {
  try {
    sessionStorage.removeItem(SESSION_KEY)
  } catch {
    // Nothing to clear.
  }
}
