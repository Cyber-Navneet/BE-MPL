import { cn } from '../../utils/cn.js'

// Labelled on/off switch row.
export default function ToggleRow({ label, description, checked, onChange }) {
  return (
    <label className="flex cursor-pointer items-start justify-between gap-4 py-4">
      <span>
        <span className="block text-[15px] font-medium text-home-ink">{label}</span>
        {description && <span className="mt-0.5 block text-sm text-secondary">{description}</span>}
      </span>
      <input type="checkbox" role="switch" checked={checked} onChange={(event) => onChange(event.target.checked)} className="peer sr-only" />
      <span
        aria-hidden="true"
        className={cn(
          'relative mt-0.5 h-6 w-11 shrink-0 rounded-full transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-home-blue',
          checked ? 'bg-home-blue' : 'bg-slate-300',
        )}
      >
        <span className={cn('absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform', checked && 'translate-x-5')} />
      </span>
    </label>
  )
}
