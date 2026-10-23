import { ArrowRight, Briefcase, GraduationCap } from 'lucide-react'
import Button from '../components/Button.jsx'
import { useAuth } from '../hooks/useAuth.js'

const roleContent = {
  student: {
    icon: GraduationCap,
    label: 'Student',
    message: 'Resume scoring, AI job matches and your assessments will appear here.',
  },
  recruiter: {
    icon: Briefcase,
    label: 'Recruiter',
    message: 'Your job postings, candidate rankings and hiring analytics will appear here.',
  },
}

// Rendered inside AppLayout, which provides the navbar (with sign out) and sidebar.
export default function Dashboard() {
  const { user } = useAuth()
  const { icon: RoleIcon, label, message } = roleContent[user.role]

  return (
    <div className="mx-auto max-w-[1180px]">
      <h1 className="text-3xl font-bold tracking-tight text-navy">Welcome, {user.name}</h1>
      <p className="mt-2 text-muted">{message}</p>

      <section
        aria-label="Account details"
        className="mt-8 max-w-xl rounded-xl border border-line bg-white p-6 shadow-[0_1px_3px_rgba(16,25,46,0.06)]"
      >
        <dl className="grid gap-4 sm:grid-cols-[8rem_1fr]">
          <dt className="text-sm text-muted">Name</dt>
          <dd className="font-medium text-navy">{user.name}</dd>
          <dt className="text-sm text-muted">Email</dt>
          <dd className="font-medium break-all text-navy">{user.email}</dd>
          <dt className="text-sm text-muted">Role</dt>
          <dd>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-pale px-3 py-1 text-sm font-medium text-primary">
              <RoleIcon size={14} aria-hidden="true" />
              {label}
            </span>
          </dd>
        </dl>
      </section>

      <Button to="/jobs" size="sm" className="mt-6">
        Explore Job Discovery <ArrowRight size={16} aria-hidden="true" />
      </Button>
    </div>
  )
}
