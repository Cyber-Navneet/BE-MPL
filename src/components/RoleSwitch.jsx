import { useAuth } from '../hooks/useAuth.js'

// Renders a different page for the same route depending on the signed-in user's role.
export default function RoleSwitch({ student, recruiter }) {
  const { user } = useAuth()
  return user.role === 'recruiter' ? recruiter : student
}
