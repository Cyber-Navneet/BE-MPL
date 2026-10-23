import { cn } from '../../utils/cn.js'

export default function DemoBadge({ className }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[11px] font-semibold tracking-wide text-amber-700 uppercase',
        className,
      )}
    >
      Demo data
    </span>
  )
}
