import { useId } from 'react'
import { ChevronDown } from 'lucide-react'

// Labelled native select. `options` is [{ value, label }] or plain strings.
export default function SelectInput({ label, value, onChange, options, className }) {
  const id = useId()

  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm font-medium text-home-ink">
        {label}
      </label>
      <div className="relative mt-1.5">
        <select
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-11 w-full cursor-pointer appearance-none rounded-lg border border-home-border bg-white pr-10 pl-3 text-[15px] text-home-ink hover:border-slate-300 focus-visible:border-home-blue focus-visible:outline-2 focus-visible:outline-home-blue/30"
        >
          {options.map((option) => {
            const { value: optionValue, label: optionLabel } = typeof option === 'string' ? { value: option, label: option } : option
            return (
              <option key={optionValue} value={optionValue}>
                {optionLabel}
              </option>
            )
          })}
        </select>
        <ChevronDown size={16} className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-home-muted" aria-hidden="true" />
      </div>
    </div>
  )
}
