import { cn } from '../../utils/cn.js'

const STATUS_STYLES = {
  Applied: 'bg-slate-100 text-slate-700',
  'Under Review': 'bg-amber-50 text-amber-700',
  Shortlisted: 'bg-sky-50 text-sky-700',
  'Interview Scheduled': 'bg-violet-50 text-violet-700',
  'Offer Received': 'bg-emerald-50 text-emerald-700',
  Rejected: 'bg-red-50 text-red-700',
}

export default function StatusBadge({ status, className }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap',
        STATUS_STYLES[status] ?? STATUS_STYLES.Applied,
        className,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
      {status}
    </span>
  )
}
