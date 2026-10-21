import { useId } from 'react'
import { cn } from '../utils/cn.js'

export default function FormInput({ label, icon: Icon, error, className, ...inputProps }) {
  const id = useId()
  const errorId = `${id}-error`

  return (
    <div className={className}>
      <label htmlFor={id} className="block text-base text-heading">
        {label}
      </label>
      <div className="relative mt-2">
        <Icon
          size={18}
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-5 -translate-y-1/2 text-secondary"
        />
        <input
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={cn(
            'h-12 w-full rounded-[10px] border bg-white pr-4 pl-12 text-base text-heading outline-none transition-[border-color,box-shadow] placeholder:text-placeholder focus:ring-4',
            error
              ? 'border-danger focus:border-danger focus:ring-danger/15'
              : 'border-field focus:border-primary focus:ring-primary/15',
          )}
          {...inputProps}
        />
      </div>
      {error && (
        <p id={errorId} className="mt-1.5 text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  )
}
