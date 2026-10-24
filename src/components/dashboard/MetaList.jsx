import { cn } from '../../utils/cn.js'

// Icon + text facts in a row, separated by vertical dividers from `sm` up. `items` is [{ icon, label, srLabel }].
export default function MetaList({ items, className }) {
  return (
    <ul className={cn('flex flex-wrap items-center gap-x-4 gap-y-2 text-[15px] text-home-muted', className)}>
      {items.map(({ icon: Icon, label, srLabel }, index) => (
        <li key={srLabel} className={cn('flex items-center gap-1.5', index > 0 && 'sm:border-l sm:border-slate-300 sm:pl-4')}>
          <Icon size={16} className="shrink-0" aria-hidden="true" />
          <span className="sr-only">{srLabel}: </span>
          {label}
        </li>
      ))}
    </ul>
  )
}
