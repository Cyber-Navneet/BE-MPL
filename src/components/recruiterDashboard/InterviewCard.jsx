import { Banknote, BriefcaseBusiness, Building2, FileText, Laptop, UserRound, Video } from 'lucide-react'
import { formatSalary } from '../../utils/jobMetrics.js'
import { formatClock } from '../../utils/recruiterDashboardMetrics.js'
import { cn } from '../../utils/cn.js'

const ACCENTS = {
  Scheduled: 'bg-primary',
  'In progress': 'bg-primary',
  'Awaiting update': 'bg-amber-500',
  Completed: 'bg-emerald-600',
  Cancelled: 'bg-slate-300',
}

const STATE_PILLS = {
  'In progress': 'bg-blue-50 text-primary',
  'Awaiting update': 'bg-amber-50 text-amber-700',
  Completed: 'bg-emerald-50 text-emerald-700',
  Cancelled: 'bg-slate-100 text-slate-600',
}

// Completed interviews offer "Details"; the rest offer "Meet", which turns blue once the meeting time arrives.
const MEET = { label: 'Meet', icon: Video }
const DETAILS = { label: 'Details', icon: FileText }

export default function InterviewCard({ interview, state, onAction }) {
  const { job } = interview
  const salary = formatSalary(job)
  const action = state === 'Completed' ? DETAILS : MEET
  const ActionIcon = action.icon
  const meta = [
    { icon: Building2, text: job.location },
    { icon: BriefcaseBusiness, text: job.employmentType },
    { icon: Laptop, text: job.workMode },
  ]

  return (
    <article
      aria-label={`Interview with ${interview.candidateName}`}
      className={cn('relative rounded-xl border border-line bg-[#f8fafd] py-4 pr-4 pl-6 sm:pr-5 sm:pl-8', state === 'Cancelled' && 'opacity-75')}
    >
      <span className={cn('absolute top-4 bottom-4 left-3 w-1 rounded-full sm:left-4', ACCENTS[state])} aria-hidden="true" />

      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <h3 className={cn('text-base font-medium text-heading sm:text-lg', state === 'Cancelled' && 'line-through decoration-slate-400')}>
            Meet with {interview.candidateName}
          </h3>
          {STATE_PILLS[state] && (
            <span className={cn('mt-1 inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold', STATE_PILLS[state])}>{state}</span>
          )}
        </div>
        <button
          type="button"
          onClick={() => onAction(interview)}
          aria-label={`${action.label}: interview with ${interview.candidateName}`}
          className={cn(
            'inline-flex h-10 shrink-0 items-center gap-2 rounded-lg px-3.5 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
            // Once the meeting time arrives the button turns blue with white text.
            state === 'In progress'
              ? 'bg-primary text-white hover:bg-primary-hover'
              : 'bg-slate-200/70 text-body hover:bg-slate-200 hover:text-navy',
          )}
        >
          {action.label}
          <ActionIcon size={16} aria-hidden="true" />
        </button>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="max-w-full truncate rounded-full border border-primary/60 bg-white px-3 py-1 text-xs font-medium text-primary sm:text-sm">
          {job.title}
        </span>
        {salary && (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-600/60 bg-white px-3 py-1 text-xs font-medium text-emerald-700 sm:text-sm">
            <Banknote size={16} aria-hidden="true" />
            {salary}
          </span>
        )}
        <span className="w-full text-sm whitespace-nowrap text-secondary sm:ml-auto sm:w-auto">
          <time dateTime={new Date(interview.start).toISOString()}>{formatClock(interview.start)}</time> to{' '}
          <time dateTime={new Date(interview.end).toISOString()}>{formatClock(interview.end)}</time>
        </span>
      </div>

      <ul className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-sm text-body">
        {meta.map(({ icon: Icon, text }, index) => (
          <li key={text} className="flex items-center gap-1.5">
            {index > 0 && <span className="mr-1.5 hidden text-slate-400 sm:inline" aria-hidden="true">•</span>}
            <Icon size={16} className="shrink-0 text-slate-500" aria-hidden="true" />
            {text}
          </li>
        ))}
      </ul>
      <p className="mt-2 flex items-center gap-1.5 text-sm text-secondary">
        <UserRound size={16} className="shrink-0 text-slate-500" aria-hidden="true" />
        Interviewer: {interview.interviewerName} · {interview.type} interview
      </p>
    </article>
  )
}
