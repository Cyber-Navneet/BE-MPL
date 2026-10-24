import { useId, useRef, useState } from 'react'
import { Check, X } from 'lucide-react'
import { useDialog } from '../../hooks/useDialog.js'
import { DEFAULT_FILTERS, EXPERIENCE_LEVELS, STATUSES, WORK_MODES } from '../../utils/applicationUtils.js'
import { cn } from '../../utils/cn.js'

const toggleValue = (list, value) => (list.includes(value) ? list.filter((item) => item !== value) : [...list, value])

function ChipGroup({ title, options, selected, onChange }) {
  const id = useId()
  return (
    <div role="group" aria-labelledby={id} className="border-b border-line py-5 last:border-b-0">
      <h3 id={id} className="mb-3 text-sm font-semibold text-navy">
        {title}
      </h3>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isSelected = selected.includes(option)
          return (
            <button
              key={option}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onChange(toggleValue(selected, option))}
              className={cn(
                'inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-[13px] transition-colors focus-visible:outline-2 focus-visible:outline-primary',
                isSelected ? 'border-primary bg-pale text-primary' : 'border-line bg-white text-navy hover:bg-slate-50',
              )}
            >
              {isSelected && <Check size={13} aria-hidden="true" />}
              {option}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// Edits a draft copy of the filters; the list only changes on "Apply Filters" or "Clear Filters".
// Mounted only while open, so each opening starts from the currently applied filters.
export default function ApplicationFiltersPanel({ filters, onApply, onClose }) {
  const [draft, setDraft] = useState(filters)
  const closeRef = useRef(null)
  useDialog({ open: true, onClose, initialFocusRef: closeRef })

  const update = (field) => (value) => setDraft((prev) => ({ ...prev, [field]: value }))

  const handleSubmit = (event) => {
    event.preventDefault()
    onApply(draft)
    onClose()
  }

  const handleClear = () => {
    onApply(DEFAULT_FILTERS)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-navy/40" onClick={onClose} aria-hidden="true" />
      <form
        role="dialog"
        aria-modal="true"
        aria-labelledby="application-filters-title"
        onSubmit={handleSubmit}
        className="relative flex h-full w-full max-w-md flex-col bg-white shadow-xl"
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 id="application-filters-title" className="text-lg font-semibold text-navy">
            Filters
          </h2>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close filters"
            className="flex h-10 w-10 items-center justify-center rounded-lg text-muted hover:bg-slate-100 hover:text-navy focus-visible:outline-2 focus-visible:outline-primary"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5">
          <ChipGroup title="Location" options={WORK_MODES} selected={draft.workModes} onChange={update('workModes')} />
          <ChipGroup title="Experience" options={EXPERIENCE_LEVELS} selected={draft.experience} onChange={update('experience')} />
          <ChipGroup title="Status" options={STATUSES} selected={draft.statuses} onChange={update('statuses')} />
        </div>

        <div className="flex gap-3 border-t border-line px-5 py-4">
          <button
            type="button"
            onClick={handleClear}
            className="h-11 flex-1 rounded-lg border border-line bg-white text-sm font-medium text-navy hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            Clear Filters
          </button>
          <button
            type="submit"
            className="h-11 flex-1 rounded-lg bg-primary text-sm font-medium text-white hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            Apply Filters
          </button>
        </div>
      </form>
    </div>
  )
}
