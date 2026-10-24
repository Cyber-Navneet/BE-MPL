import { useId } from 'react'
import { cn } from '../../utils/cn.js'

export const inputClasses =
  'mt-1.5 w-full rounded-lg border bg-white px-3 text-[15px] text-home-ink placeholder:text-placeholder focus-visible:outline-2'

// Labelled input/textarea with an optional error. Pass `multiline` for a textarea.
export default function Field({ label, error, optional = false, multiline = false, className, ...inputProps }) {
  const id = useId()
  const errorId = `${id}-error`
  const Control = multiline ? 'textarea' : 'input'

  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm font-medium text-home-ink">
        {label}
        {optional && <span className="font-normal text-home-muted"> (optional)</span>}
      </label>
      <Control
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={cn(
          inputClasses,
          multiline ? 'min-h-20 py-2.5' : 'h-11',
          error
            ? 'border-danger focus-visible:outline-danger/30'
            : 'border-home-border hover:border-slate-300 focus-visible:border-home-blue focus-visible:outline-home-blue/30',
        )}
        {...inputProps}
      />
      {error && (
        <p id={errorId} className="mt-1.5 text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  )
}
