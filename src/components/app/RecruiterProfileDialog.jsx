import { Briefcase } from 'lucide-react'
import Modal from '../dashboard/Modal.jsx'
import { RECRUITER } from '../../data/recruiterDashboardData.js'
import { RECRUITER_COMPANY } from '../../data/recruiterJobs.js'

// The signed-in recruiter's own profile, opened from the navbar's "View profile". Fictional demo details.
export default function RecruiterProfileDialog({ user, onClose }) {
  const name = user.name || RECRUITER.name
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('')
  const rows = [
    ['Email', user.email || RECRUITER.email],
    ['Phone', RECRUITER.phone],
    ['Company', RECRUITER.company],
    ['Department', RECRUITER.department],
    ['Location', RECRUITER.location],
    ['Industry', RECRUITER_COMPANY.industry],
    ['Hiring for', RECRUITER.hiringFocus.join(', ')],
  ]

  return (
    <Modal title="Recruiter profile" subtitle="Your account details" onClose={onClose}>
      <div className="flex items-center gap-4">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-navy text-lg font-semibold text-white">
          {initials}
        </span>
        <div className="min-w-0">
          <p className="text-lg font-semibold text-navy">{name}</p>
          <p className="text-sm text-muted">{RECRUITER.role}</p>
          <span className="mt-1.5 inline-flex items-center gap-1.5 rounded-full bg-pale px-3 py-0.5 text-xs font-medium text-primary">
            <Briefcase size={13} aria-hidden="true" />
            Recruiter
          </span>
        </div>
      </div>
      <dl className="mt-6 grid gap-x-6 gap-y-3 sm:grid-cols-[8rem_1fr]">
        {rows.map(([label, value]) => (
          <div key={label} className="contents">
            <dt className="text-sm text-muted">{label}</dt>
            <dd className="text-sm font-medium break-words text-navy">{value}</dd>
          </div>
        ))}
      </dl>
    </Modal>
  )
}
