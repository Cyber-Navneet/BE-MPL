import { cn } from '../../utils/cn.js'

// Colours for the statuses returned by `applicationStatus` in utils/applicationStore.js.
const STYLES = {
  Applied: 'bg-slate-100 text-slate-700',
  'Assessment Pending': 'bg-amber-50 text-amber-700',
  'Assessment In Progress': 'bg-pale text-primary',
  'Assessment Completed': 'bg-violet-50 text-violet-700',
  'Assessment Expired': 'bg-slate-100 text-slate-500',
  'Under Review': 'bg-indigo-50 text-indigo-700',
  Shortlisted: 'bg-teal-50 text-teal-700',
  Rejected: 'bg-red-50 text-red-700',
  'Offer Received': 'bg-emerald-50 text-emerald-700',
}

export default function LifecycleBadge({ status, className }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap',
        STYLES[status] ?? STYLES.Applied,
        className,
      )}
    >
      <span className="sr-only">Application status: </span>
      {status}
    </span>
  )
}
