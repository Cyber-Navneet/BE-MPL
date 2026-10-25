import { useId, useState } from 'react'
import { X } from 'lucide-react'

// List of short text tags. Type and press Enter or comma to add; duplicates are ignored.
export default function TagInput({ label, values, onChange, placeholder, max = 20, hint }) {
  const id = useId()
  const [draft, setDraft] = useState('')

  const add = () => {
    const value = draft.trim().replace(/,$/, '').trim()
    if (value && values.length < max && !values.some((item) => item.toLowerCase() === value.toLowerCase())) {
      onChange([...values, value])
    }
    setDraft('')
  }

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-home-ink">
        {label}
      </label>
      <div className="mt-1.5 flex flex-wrap items-center gap-2 rounded-lg border border-home-border bg-white p-2 focus-within:border-home-blue focus-within:outline-2 focus-within:outline-home-blue/30">
        {values.map((value) => (
          <span key={value} className="inline-flex items-center gap-1 rounded-full bg-home-tint py-1 pr-1 pl-3 text-sm text-home-ink">
            {value}
            <button
              type="button"
              onClick={() => onChange(values.filter((item) => item !== value))}
              aria-label={`Remove ${value}`}
              className="flex h-6 w-6 items-center justify-center rounded-full text-home-muted hover:bg-white hover:text-home-ink focus-visible:outline-2 focus-visible:outline-home-blue"
            >
              <X size={13} aria-hidden="true" />
            </button>
          </span>
        ))}
        <input
          id={id}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ',') {
              event.preventDefault()
              add()
            } else if (event.key === 'Backspace' && !draft && values.length > 0) {
              onChange(values.slice(0, -1))
            }
          }}
          onBlur={add}
          placeholder={values.length >= max ? `Up to ${max} items` : placeholder}
          disabled={values.length >= max}
          aria-describedby={`${id}-hint`}
          className="h-8 min-w-32 flex-1 bg-transparent px-1 text-[15px] text-home-ink placeholder:text-placeholder focus:outline-none"
        />
      </div>
      <p id={`${id}-hint`} className="mt-1.5 text-xs text-home-muted">
        {hint ?? 'Press Enter or comma to add.'}
      </p>
    </div>
  )
}
