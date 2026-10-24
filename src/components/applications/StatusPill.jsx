import { cn } from '../../utils/cn.js'

const STATUS_STYLES = {
  Applied: 'bg-slate-100 text-slate-700',
  'Design challenge': 'bg-violet-50 text-violet-700',
  Interview: 'bg-pale text-primary',
  'Final decision': 'bg-amber-50 text-amber-700',
  Offer: 'bg-emerald-50 text-emerald-700',
  Rejected: 'bg-red-50 text-red-700',
}

export default function StatusPill({ status, className }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap',
        STATUS_STYLES[status] ?? STATUS_STYLES.Applied,
        className,
      )}
    >
      <span className="sr-only">Status: </span>
      {status}
    </span>
  )
}
