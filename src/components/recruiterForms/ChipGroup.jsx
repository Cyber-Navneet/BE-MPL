import { useId } from 'react'
import { Check } from 'lucide-react'
import { cn } from '../../utils/cn.js'

// Multi-select chips (or single-select with `single`). `value` is an array, or a string when `single`.
export default function ChipGroup({ label, options, value, onChange, single = false, error }) {
  const id = useId()
  const isSelected = (option) => (single ? value === option : value.includes(option))

  const toggle = (option) => {
    if (single) onChange(option)
    else onChange(value.includes(option) ? value.filter((item) => item !== option) : [...value, option])
  }

  return (
    <div role="group" aria-labelledby={id} aria-describedby={error ? `${id}-error` : undefined}>
      <p id={id} className="text-sm font-medium text-home-ink">
        {label}
      </p>
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((option) => {
          const selected = isSelected(option)
          return (
            <button
              key={option}
              type="button"
              aria-pressed={selected}
              onClick={() => toggle(option)}
              className={cn(
                'inline-flex h-9 items-center gap-1.5 rounded-full border px-3.5 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-home-blue',
                selected ? 'border-home-blue bg-home-tint text-home-blue' : 'border-home-border bg-white text-home-ink hover:bg-slate-50',
              )}
            >
              {selected && <Check size={14} aria-hidden="true" />}
              {option}
            </button>
          )
        })}
      </div>
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  )
}
