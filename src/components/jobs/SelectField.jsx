import { ChevronDown } from 'lucide-react'
import { cn } from '../../utils/cn.js'

// Native <select> styled to match the app. `options` is [{ value, label }].
export default function SelectField({ label, value, onChange, options, className, selectClassName }) {
  return (
    <div className={cn('relative', className)}>
      <select
        aria-label={label}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={cn(
          'h-11 w-full cursor-pointer appearance-none rounded-lg border border-line bg-white pr-10 pl-4 text-[15px] text-navy hover:border-slate-300 focus-visible:border-primary focus-visible:outline-2 focus-visible:outline-primary/30',
          selectClassName,
        )}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown
        size={16}
        className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-muted"
        aria-hidden="true"
      />
    </div>
  )
}
