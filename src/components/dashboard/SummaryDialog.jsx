import { CircleAlert, CircleCheck, CircleDashed, MessageCircle } from 'lucide-react'
import Modal from './Modal.jsx'
import StatusBadge from './StatusBadge.jsx'
import { APPLICATION_STATUSES, DEMO_ASSESSMENTS, DEMO_PROFILE } from '../../data/dashboard.js'
import { cn } from '../../utils/cn.js'

function ApplicationsSummary({ applications, unreadByApplication, onOpenChat }) {
  const withUnread = applications.filter((app) => unreadByApplication[app.id] > 0)

  return (
    <>
      <h3 className="text-sm font-semibold text-home-ink">Applications by status</h3>
      <ul className="mt-3 space-y-2">
        {APPLICATION_STATUSES.map((status) => (
          <li key={status} className="flex items-center justify-between rounded-lg bg-home-bg px-3 py-2">
            <StatusBadge status={status} />
            <span className="text-sm font-semibold text-home-ink">
              {applications.filter((app) => app.status === status).length}
            </span>
          </li>
        ))}
      </ul>

      <h3 className="mt-6 text-sm font-semibold text-home-ink">Unread messages</h3>
      {withUnread.length === 0 ? (
        <p className="mt-2 text-sm text-home-muted">You are all caught up.</p>
      ) : (
        <ul className="mt-3 space-y-2">
          {withUnread.map((app) => (
            <li key={app.id} className="flex items-center justify-between gap-3 rounded-lg border border-home-border px-3 py-2.5">
              <span className="min-w-0 text-sm">
                <span className="block font-medium text-home-ink">{app.company}</span>
                <span className="block truncate text-home-muted">
                  {app.title} · {unreadByApplication[app.id]} new
                </span>
              </span>
              <button
                type="button"
                onClick={() => onOpenChat(app.id)}
                className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-lg bg-home-blue px-3 text-sm font-medium text-white hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-home-blue"
              >
                <MessageCircle size={16} aria-hidden="true" /> Open chat
              </button>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}

function AssessmentsSummary() {
  return (
    <ul className="space-y-2">
      {DEMO_ASSESSMENTS.map((assessment) => {
        const attention = assessment.status !== 'Completed'
        return (
          <li
            key={assessment.id}
            className={cn(
              'flex items-center justify-between gap-3 rounded-lg border px-3 py-2.5',
              attention ? 'border-amber-300 bg-amber-50/50' : 'border-home-border',
            )}
          >
            <span className="min-w-0 text-sm">
              <span className="block font-medium text-home-ink">{assessment.title}</span>
              <span className="block text-home-muted">
                {assessment.status} · {assessment.due}
              </span>
            </span>
            {attention ? (
              <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700">
                <CircleAlert size={13} aria-hidden="true" /> Needs attention
              </span>
            ) : (
              <span className="shrink-0 text-sm font-semibold text-home-ink">{assessment.score}%</span>
            )}
          </li>
        )
      })}
    </ul>
  )
}

function ProfileSummary() {
  return (
    <ul className="space-y-2">
      {DEMO_PROFILE.fields.map((field) => {
        const done = field.value.trim() !== ''
        const Icon = done ? CircleCheck : CircleDashed
        return (
          <li key={field.label} className="flex items-start gap-3 rounded-lg bg-home-bg px-3 py-2.5 text-sm">
            <Icon size={18} className={done ? 'mt-0.5 shrink-0 text-emerald-600' : 'mt-0.5 shrink-0 text-home-muted'} aria-hidden="true" />
            <span className="min-w-0">
              <span className="block font-medium text-home-ink">{field.label}</span>
              <span className={done ? 'block break-words text-body' : 'block text-home-muted italic'}>
                {done ? field.value : 'Not added yet'}
              </span>
            </span>
          </li>
        )
      })}
    </ul>
  )
}

const TITLES = {
  applications: ['Applications overview', (stats) => `${stats.applications} applications · ${stats.newMessages} unread messages`],
  assessments: ['Assessments', (stats) => `${stats.assessments} assessments · ${stats.needAttention} need attention`],
  profile: ['Profile completion', (stats) => `${stats.profileCompletion}% complete`],
}

// Read-only details for a summary card. Demo data; nothing here navigates away from the home page.
export default function SummaryDialog({ type, stats, applications, unreadByApplication, onOpenChat, onClose }) {
  const [title, subtitle] = TITLES[type]

  return (
    <Modal title={title} subtitle={subtitle(stats)} onClose={onClose} size="sm">
      {type === 'applications' && (
        <ApplicationsSummary applications={applications} unreadByApplication={unreadByApplication} onOpenChat={onOpenChat} />
      )}
      {type === 'assessments' && <AssessmentsSummary />}
      {type === 'profile' && <ProfileSummary />}
      <p className="mt-5 rounded-lg bg-home-bg px-3 py-2.5 text-xs text-home-muted">Demo data for this preview.</p>
    </Modal>
  )
}
