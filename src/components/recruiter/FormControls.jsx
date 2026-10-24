import { useId } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '../../utils/cn.js'

// Filled (light blue) controls as in the design; `outlined` is the white, bordered variant for textareas.
const controlClasses = (invalid, outlined = false) =>
  cn(
    'w-full rounded-xl border px-4 text-[15px] text-navy placeholder:text-placeholder transition-[border-color,box-shadow] focus:outline-none focus:ring-4 disabled:cursor-not-allowed disabled:opacity-60',
    outlined ? 'bg-white' : 'bg-selected/60',
    invalid
      ? 'border-danger focus:border-danger focus:ring-danger/15'
      : cn(outlined ? 'border-line' : 'border-transparent hover:border-field', 'focus:border-primary focus:ring-primary/15'),
  )

// Label, optional hint and error for one control. `children` receives the props to spread onto it
// (id, aria-describedby, aria-invalid). `name` marks the field so the form can focus the first error.
export function Field({ label, name, required, hint, error, className, children }) {
  const id = useId()
  const hintId = `${id}-hint`
  const errorId = `${id}-error`
  const describedBy = [hint && hintId, error && errorId].filter(Boolean).join(' ') || undefined

  return (
    <div className={className} data-field={name}>
      <label htmlFor={id} className="block text-sm font-semibold text-navy">
        {label}
        {required && (
          <>
            <span className="text-danger" aria-hidden="true">
              {' '}
              *
            </span>
            <span className="sr-only"> (required)</span>
          </>
        )}
      </label>
      <div className="mt-2">{children({ id, 'aria-describedby': describedBy, 'aria-invalid': error ? true : undefined })}</div>
      {hint && (
        <p id={hintId} className="mt-1.5 text-xs text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="mt-1.5 text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  )
}

export function TextInput({ className, ...props }) {
  return <input type="text" className={cn(controlClasses(props['aria-invalid']), 'h-12', className)} {...props} />
}

export function TextArea({ className, rows = 4, ...props }) {
  return <textarea rows={rows} className={cn(controlClasses(props['aria-invalid'], true), 'resize-y py-3 leading-relaxed', className)} {...props} />
}

// Native select; `options` is a list of strings or { value, label }.
export function SelectInput({ options, placeholder, className, ...props }) {
  return (
    <div className="relative">
      <select className={cn(controlClasses(props['aria-invalid']), 'h-12 cursor-pointer appearance-none pr-10', className)} {...props}>
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => {
          const { value, label } = typeof option === 'string' ? { value: option, label: option } : option
          return (
            <option key={value} value={value}>
              {label}
            </option>
          )
        })}
      </select>
      <ChevronDown size={16} className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-muted" aria-hidden="true" />
    </div>
  )
}
