import { ChevronDown, ChevronUp, Plus, Trash2 } from 'lucide-react'
import { listItem } from '../../utils/jobValidation.js'
import { cn } from '../../utils/cn.js'

const iconButton =
  'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-muted hover:bg-slate-100 hover:text-navy focus-visible:outline-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent'

// Repeatable list of short text items with add, remove and reorder. `items` is [{ id, text }].
// Empty items are dropped when the job is saved.
export default function ListEditor({ id, items, onChange, itemLabel, placeholder, addLabel, invalid, describedBy, max = 12 }) {
  const update = (itemId, text) => onChange(items.map((item) => (item.id === itemId ? { ...item, text } : item)))
  const remove = (itemId) => {
    const next = items.filter((item) => item.id !== itemId)
    onChange(next.length ? next : [listItem()])
  }
  const move = (index, offset) => {
    const next = [...items]
    ;[next[index], next[index + offset]] = [next[index + offset], next[index]]
    onChange(next)
  }

  return (
    <div>
      <ol className="space-y-2">
        {items.map((item, index) => (
          <li key={item.id} className="flex items-center gap-1">
            <span className="w-6 shrink-0 text-sm text-muted" aria-hidden="true">
              {index + 1}.
            </span>
            <input
              id={index === 0 ? id : undefined}
              type="text"
              value={item.text}
              aria-label={`${itemLabel} ${index + 1}`}
              aria-invalid={invalid && index === 0 ? true : undefined}
              aria-describedby={index === 0 ? describedBy : undefined}
              placeholder={placeholder}
              maxLength={200}
              onChange={(event) => update(item.id, event.target.value)}
              className={cn(
                'h-11 min-w-0 flex-1 rounded-xl border bg-white px-4 text-[15px] text-navy placeholder:text-placeholder focus:outline-none focus:ring-4',
                invalid ? 'border-danger focus:ring-danger/15' : 'border-line focus:border-primary focus:ring-primary/15',
              )}
            />
            <button type="button" className={iconButton} onClick={() => move(index, -1)} disabled={index === 0} aria-label={`Move ${itemLabel.toLowerCase()} ${index + 1} up`}>
              <ChevronUp size={18} aria-hidden="true" />
            </button>
            <button
              type="button"
              className={iconButton}
              onClick={() => move(index, 1)}
              disabled={index === items.length - 1}
              aria-label={`Move ${itemLabel.toLowerCase()} ${index + 1} down`}
            >
              <ChevronDown size={18} aria-hidden="true" />
            </button>
            <button
              type="button"
              className={cn(iconButton, 'hover:text-danger')}
              onClick={() => remove(item.id)}
              aria-label={`Remove ${itemLabel.toLowerCase()} ${index + 1}`}
            >
              <Trash2 size={17} aria-hidden="true" />
            </button>
          </li>
        ))}
      </ol>
      <button
        type="button"
        onClick={() => onChange([...items, listItem()])}
        disabled={items.length >= max}
        className="mt-3 ml-7 inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-medium text-primary hover:bg-pale focus-visible:outline-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Plus size={16} aria-hidden="true" /> {addLabel}
      </button>
    </div>
  )
}
