import { useId, useRef, useState } from 'react'
import { Check, X } from 'lucide-react'
import SelectField from './SelectField.jsx'
import { useDialog } from '../../hooks/useDialog.js'
import { DEFAULT_FILTERS, EMPLOYMENT_TYPES, EXPERIENCE_LEVELS, WORK_MODES } from '../../utils/jobUtils.js'
import { cn } from '../../utils/cn.js'

const toggleValue = (list, value) => (list.includes(value) ? list.filter((item) => item !== value) : [...list, value])

function FilterSection({ title, children }) {
  const id = useId()
  return (
    <div role="group" aria-labelledby={id} className="border-b border-line py-5 last:border-b-0">
      <h3 id={id} className="mb-3 text-sm font-semibold text-navy">
        {title}
      </h3>
      {children}
    </div>
  )
}

function CheckboxGroup({ options, selected, onChange }) {
  return (
    <div className="flex flex-wrap gap-x-5 gap-y-2.5">
      {options.map((option) => (
        <label key={option} className="flex cursor-pointer items-center gap-2 text-sm text-navy">
          <input
            type="checkbox"
            checked={selected.includes(option)}
            onChange={() => onChange(toggleValue(selected, option))}
            className="h-4 w-4 cursor-pointer rounded border-line accent-primary"
          />
          {option}
        </label>
      ))}
    </div>
  )
}

const inputClasses =
  'h-11 w-full rounded-lg border border-line bg-white px-3 text-[15px] text-navy placeholder:text-placeholder focus-visible:border-primary focus-visible:outline-2 focus-visible:outline-primary/30'

// Edits a draft copy of the filters; nothing changes on the page until "Apply Filters".
// Mounted only while open, so each opening starts from the currently applied filters.
export default function JobFiltersPanel({ filters, locations, skills, onApply, onClose }) {
  const [draft, setDraft] = useState(filters)
  const closeRef = useRef(null)
  useDialog({ open: true, onClose, initialFocusRef: closeRef })

  const update = (field) => (value) => setDraft((prev) => ({ ...prev, [field]: value }))
  const salaryError =
    draft.minSalary !== '' && draft.maxSalary !== '' && Number(draft.minSalary) > Number(draft.maxSalary)
      ? 'Minimum salary cannot be more than maximum salary.'
      : ''

  const handleSubmit = (event) => {
    event.preventDefault()
    if (salaryError) return
    onApply(draft)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-navy/40" onClick={onClose} aria-hidden="true" />
      <form
        role="dialog"
        aria-modal="true"
        aria-labelledby="filters-title"
        onSubmit={handleSubmit}
        className="relative flex h-full w-full max-w-md flex-col bg-white shadow-xl"
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 id="filters-title" className="text-lg font-semibold text-navy">
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
          <FilterSection title="Location">
            <SelectField
              label="Location"
              value={draft.location}
              onChange={update('location')}
              options={[{ value: '', label: 'Any location' }, ...locations.map((value) => ({ value, label: value }))]}
            />
          </FilterSection>

          <FilterSection title="Work arrangement">
            <CheckboxGroup options={WORK_MODES} selected={draft.workModes} onChange={update('workModes')} />
          </FilterSection>

          <FilterSection title="Employment type">
            <CheckboxGroup options={EMPLOYMENT_TYPES} selected={draft.employmentTypes} onChange={update('employmentTypes')} />
          </FilterSection>

          <FilterSection title="Experience level">
            <CheckboxGroup options={EXPERIENCE_LEVELS} selected={draft.experienceLevels} onChange={update('experienceLevels')} />
          </FilterSection>

          <FilterSection title="Salary (LPA)">
            <div className="grid grid-cols-2 gap-3">
              <label className="text-xs text-muted">
                Minimum
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  inputMode="decimal"
                  placeholder="e.g. 6"
                  value={draft.minSalary}
                  onChange={(event) => update('minSalary')(event.target.value)}
                  aria-invalid={Boolean(salaryError)}
                  className={cn(inputClasses, 'mt-1')}
                />
              </label>
              <label className="text-xs text-muted">
                Maximum
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  inputMode="decimal"
                  placeholder="e.g. 15"
                  value={draft.maxSalary}
                  onChange={(event) => update('maxSalary')(event.target.value)}
                  aria-invalid={Boolean(salaryError)}
                  className={cn(inputClasses, 'mt-1')}
                />
              </label>
            </div>
            <p className="mt-2 text-xs text-muted">Monthly pay is converted to an annual figure (×12) for comparison.</p>
            {salaryError && (
              <p role="alert" className="mt-2 text-xs text-danger">
                {salaryError}
              </p>
            )}
          </FilterSection>

          <FilterSection title="Minimum AI match">
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={draft.minMatch}
                onChange={(event) => update('minMatch')(Number(event.target.value))}
                aria-label="Minimum AI match percentage"
                aria-valuetext={`${draft.minMatch}%`}
                className="flex-1 cursor-pointer accent-primary"
              />
              <span className="w-12 text-right text-sm font-semibold text-navy">{draft.minMatch}%</span>
            </div>
          </FilterSection>

          <FilterSection title="Required skills">
            <p className="-mt-1 mb-3 text-xs text-muted">Jobs must list every selected skill.</p>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => {
                const selected = draft.skills.includes(skill)
                return (
                  <button
                    key={skill}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => update('skills')(toggleValue(draft.skills, skill))}
                    className={cn(
                      'inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-[13px] transition-colors focus-visible:outline-2 focus-visible:outline-primary',
                      selected ? 'border-primary bg-pale text-primary' : 'border-line bg-white text-navy hover:bg-slate-50',
                    )}
                  >
                    {selected && <Check size={13} aria-hidden="true" />}
                    {skill}
                  </button>
                )
              })}
            </div>
          </FilterSection>
        </div>

        <div className="flex gap-3 border-t border-line px-5 py-4">
          <button
            type="button"
            onClick={() => {
              setDraft(DEFAULT_FILTERS)
              onApply(DEFAULT_FILTERS)
            }}
            className="h-11 flex-1 rounded-lg border border-line bg-white text-sm font-medium text-navy hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            Clear All
          </button>
          <button
            type="submit"
            disabled={Boolean(salaryError)}
            className="h-11 flex-1 rounded-lg bg-primary text-sm font-medium text-white hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50"
          >
            Apply Filters
          </button>
        </div>
      </form>
    </div>
  )
}
