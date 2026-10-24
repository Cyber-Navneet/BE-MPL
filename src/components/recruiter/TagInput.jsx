import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { cn } from '../../utils/cn.js'

// Free-text tags (skills). Enter or comma adds a tag; duplicates are ignored regardless of case.
export default function TagInput({ id, values, onChange, placeholder, suggestions = [], max = 15, ...aria }) {
  const [draft, setDraft] = useState('')
  const listId = `${id}-suggestions`
  const full = values.length >= max

  const add = (raw) => {
    const tag = raw.trim().replace(/,$/, '').trim()
    if (!tag || full) return
    if (!values.some((value) => value.toLowerCase() === tag.toLowerCase())) onChange([...values, tag])
    setDraft('')
  }

  const remove = (tag) => onChange(values.filter((value) => value !== tag))

  return (
    <div>
      <div className="flex gap-2">
        <input
          id={id}
          type="text"
          value={draft}
          list={suggestions.length ? listId : undefined}
          disabled={full}
          placeholder={full ? `Up to ${max} tags` : placeholder}
          onChange={(event) => {
            const value = event.target.value
            if (value.endsWith(',')) add(value)
            else setDraft(value)
          }}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault()
              add(draft)
            } else if (event.key === 'Backspace' && !draft && values.length) {
              remove(values[values.length - 1])
            }
          }}
          className={cn(
            'h-12 min-w-0 flex-1 rounded-xl border bg-selected/60 px-4 text-[15px] text-navy placeholder:text-placeholder focus:outline-none focus:ring-4',
            aria['aria-invalid'] ? 'border-danger focus:ring-danger/15' : 'border-transparent focus:border-primary focus:ring-primary/15',
          )}
          {...aria}
        />
        <button
          type="button"
          onClick={() => add(draft)}
          disabled={!draft.trim() || full}
          aria-label="Add tag"
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-line bg-white text-primary hover:bg-pale focus-visible:outline-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus size={18} aria-hidden="true" />
        </button>
        {suggestions.length > 0 && (
          <datalist id={listId}>
            {suggestions.map((suggestion) => (
              <option key={suggestion} value={suggestion} />
            ))}
          </datalist>
        )}
      </div>
      {values.length > 0 && (
        <ul className="mt-2.5 flex flex-wrap gap-2" aria-label="Added tags">
          {values.map((tag) => (
            <li key={tag} className="flex items-center gap-1 rounded-lg border border-line bg-white py-1 pr-1 pl-3 text-sm text-navy">
              {tag}
              <button
                type="button"
                onClick={() => remove(tag)}
                aria-label={`Remove ${tag}`}
                className="flex h-6 w-6 items-center justify-center rounded-md text-muted hover:bg-slate-100 hover:text-danger focus-visible:outline-2 focus-visible:outline-primary"
              >
                <X size={14} aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
