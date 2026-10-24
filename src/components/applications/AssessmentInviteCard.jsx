import { Link } from 'react-router-dom'
import { CalendarCheck, CircleCheck, CircleX, Info, ListChecks, Tags, Timer } from 'lucide-react'
import { PassBadge } from '../assessment/AssessmentBadges.jsx'
import { formatClock, formatDateTime } from '../../utils/formatTime.js'
import { cn } from '../../utils/cn.js'

const HEADERS = {
  not_started: { icon: Info, className: 'bg-[#e8f0fe] text-primary', strong: 'URGENT:', text: 'Action Required' },
  in_progress: { icon: Timer, className: 'bg-amber-50 text-amber-800', strong: 'IN PROGRESS:', text: 'Timer is running' },
  submitted: { icon: CircleCheck, className: 'bg-emerald-50 text-emerald-800', strong: 'COMPLETED:', text: 'Assessment submitted' },
  expired: { icon: CircleX, className: 'bg-slate-100 text-body', strong: 'EXPIRED:', text: 'Start window closed' },
}

const buttonClasses =
  'inline-flex h-11 items-center justify-center rounded-lg px-6 text-sm font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'

export default function AssessmentInviteCard({ assessment, status, now }) {
  const header = HEADERS[status]
  const HeaderIcon = header.icon
  const path = `/assessments/${assessment.id}`

  const details = [
    { icon: Timer, text: `Duration: ${assessment.durationMinutes} minutes` },
    {
      icon: ListChecks,
      text: `${assessment.questionCount} questions · ${assessment.mcqCount} multiple-choice, ${assessment.shortAnswerCount} written`,
    },
    { icon: Tags, text: `Skills: ${assessment.skills.join(', ')}` },
    status === 'in_progress'
      ? { icon: CalendarCheck, text: `Submits automatically at: ${formatDateTime(assessment.deadline)}` }
      : { icon: CalendarCheck, text: `Start by: ${formatDateTime(assessment.startBy)}` },
  ]

  return (
    <div className="max-w-xl overflow-hidden rounded-2xl border border-line bg-white shadow-[0_12px_32px_rgba(16,25,46,0.08)]">
      <p className={cn('flex items-center gap-2 border-b border-line px-5 py-3 text-[15px] sm:px-6', header.className)}>
        <HeaderIcon size={18} aria-hidden="true" />
        <span>
          <strong className="font-bold">{header.strong}</strong> {header.text}
        </span>
      </p>

      <div className="p-5 sm:p-6">
        <h3 className="text-base font-bold text-navy">Skills Assessment</h3>

        {status === 'submitted' ? (
          <div className="mt-4 flex flex-wrap items-center gap-3 rounded-xl bg-slate-50 p-4">
            <p className="text-3xl font-bold text-navy">{assessment.result.percentage}%</p>
            <PassBadge passed={assessment.result.passed} />
            <p className="w-full text-sm text-body">
              {assessment.result.pointsEarned} of {assessment.result.pointsPossible} points · submitted{' '}
              {formatDateTime(assessment.submittedAt)}
              {assessment.submitReason === 'timeout' && ' (automatically when time ran out)'}
              {assessment.result.provisional && '. Provisional: some written answers need manual review.'}
            </p>
          </div>
        ) : (
          <ul className="mt-4 space-y-3 rounded-xl bg-slate-50 p-4 text-[15px] text-navy">
            {details.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-start gap-3">
                <Icon size={18} className="mt-0.5 shrink-0 text-body" aria-hidden="true" />
                {text}
              </li>
            ))}
          </ul>
        )}

        {status === 'not_started' && (
          <p className="mt-4 text-[13px] text-muted">
            <strong className="text-navy">Note:</strong> Not starting before the deadline closes this assessment. Once
            started, the timer keeps running even if you leave the page.
          </p>
        )}
        {status === 'expired' && (
          <p className="mt-4 text-[13px] text-muted">
            This assessment was not started before {formatDateTime(assessment.startBy)} and can no longer be attempted.
          </p>
        )}

        <div className="mt-5 flex justify-end">
          {status === 'not_started' && (
            <Link to={path} className={cn(buttonClasses, 'bg-emerald-600 hover:bg-emerald-700')}>
              Start Now
            </Link>
          )}
          {status === 'in_progress' && (
            <Link to={path} className={cn(buttonClasses, 'bg-primary hover:bg-primary-hover')}>
              Resume · {formatClock(assessment.deadline - now)} left
            </Link>
          )}
          {status === 'submitted' && (
            <Link to={path} className={cn(buttonClasses, 'bg-primary hover:bg-primary-hover')}>
              View results
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
