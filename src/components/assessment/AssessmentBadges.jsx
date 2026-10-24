import { Award, CircleAlert, CircleCheck, CircleX, Timer } from 'lucide-react'
import { cn } from '../../utils/cn.js'

const STATUS = {
  not_started: { label: 'Assessment pending', icon: CircleAlert, className: 'border-amber-200 bg-amber-50 text-amber-700' },
  in_progress: { label: 'In progress', icon: Timer, className: 'border-blue-200 bg-pale text-primary' },
  submitted: { label: 'Completed', icon: CircleCheck, className: 'border-emerald-200 bg-emerald-50 text-emerald-700' },
  expired: { label: 'Expired', icon: CircleX, className: 'border-slate-200 bg-slate-100 text-body' },
}

const badgeClasses = 'inline-flex h-9 items-center gap-2 rounded-lg border px-3 text-sm font-semibold whitespace-nowrap'

export function StatusBadge({ status }) {
  const { label, icon: Icon, className } = STATUS[status]
  return (
    <span className={cn(badgeClasses, className)}>
      <Icon size={16} aria-hidden="true" />
      {label}
    </span>
  )
}

// `provisional` marks scores that include answers awaiting manual review.
export function ScoreBadge({ percentage, provisional }) {
  return (
    <span
      className={cn(badgeClasses, 'border-blue-200 bg-pale text-primary')}
      title={provisional ? 'Provisional: some written answers need manual review' : undefined}
    >
      <Award size={16} aria-hidden="true" />
      Score {percentage}%{provisional && <span aria-label=" (provisional)">*</span>}
    </span>
  )
}

export function PassBadge({ passed }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold tracking-wide uppercase',
        passed ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700',
      )}
    >
      {passed ? 'Passed' : 'Not passed'}
    </span>
  )
}
