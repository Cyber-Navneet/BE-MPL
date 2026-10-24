import { cn } from '../../utils/cn.js'

// Label plus a dot, so status never relies on color alone.
const STYLES = {
  Open: { label: 'Active', className: 'bg-selected text-primary', dot: 'bg-primary' },
  Draft: { label: 'Draft', className: 'bg-slate-100 text-slate-700', dot: 'bg-slate-500' },
  Paused: { label: 'Paused', className: 'bg-amber-50 text-amber-800', dot: 'bg-amber-500' },
  Closed: { label: 'Closed', className: 'bg-red-50 text-red-700', dot: 'bg-red-500' },
}

export default function JobStatusBadge({ status, className }) {
  const style = STYLES[status] ?? STYLES.Draft
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium', style.className, className)}>
      <span className={cn('h-1.5 w-1.5 rounded-full', style.dot)} aria-hidden="true" />
      {style.label}
    </span>
  )
}
