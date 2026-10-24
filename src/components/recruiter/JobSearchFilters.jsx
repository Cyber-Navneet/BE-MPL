import { RotateCcw, Search, X } from 'lucide-react'
import SelectField from '../jobs/SelectField.jsx'
import { cn } from '../../utils/cn.js'

const STATUS_FILTER_OPTIONS = [
  { value: 'all', label: 'All Jobs' },
  { value: 'Open', label: 'Published Jobs' },
  { value: 'Draft', label: 'Draft Jobs' },
  { value: 'Paused', label: 'Paused Jobs' },
  { value: 'Closed', label: 'Closed Jobs' },
]

const TABS = [
  { value: 'Open', label: 'Open' },
  { value: 'Draft', label: 'Drafts' },
  { value: 'Paused', label: 'Paused' },
  { value: 'Closed', label: 'Closed' },
]

// Search box, status dropdown and status tabs. The dropdown and tabs share one `status` value,
// so they always agree; "All Jobs" clears the tab selection. Tab counts respect the search.
export default function JobSearchFilters({ query, onQueryChange, status, onStatusChange, counts, resultCount, canReset, onReset }) {
  return (
    <section aria-label="Search and filter jobs" className="rounded-2xl border border-line bg-white p-4 sm:p-6">
      <div className="flex flex-col gap-3 md:flex-row md:gap-6">
        <div role="search" className="relative min-w-0 flex-1">
          <Search size={20} className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-muted" aria-hidden="true" />
          <input
            type="search"
            aria-label="Search jobs"
            placeholder="Search jobs, companies, or skills..."
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            className="h-12 w-full rounded-lg border border-line bg-white pr-11 pl-12 text-[15px] text-navy placeholder:text-placeholder hover:border-slate-300 focus-visible:border-primary focus-visible:outline-2 focus-visible:outline-primary/30 [&::-webkit-search-cancel-button]:hidden"
          />
          {query && (
            <button
              type="button"
              onClick={() => onQueryChange('')}
              aria-label="Clear search"
              className="absolute top-1/2 right-2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-muted hover:bg-slate-100 hover:text-navy focus-visible:outline-2 focus-visible:outline-primary"
            >
              <X size={16} aria-hidden="true" />
            </button>
          )}
        </div>
        <SelectField
          label="Job publication status"
          value={status}
          onChange={onStatusChange}
          options={STATUS_FILTER_OPTIONS}
          className="md:w-72"
          selectClassName="h-12 font-medium"
        />
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1" role="group" aria-label="Filter by status">
          {TABS.map((tab) => {
            const active = status === tab.value
            return (
              <button
                key={tab.value}
                type="button"
                aria-pressed={active}
                onClick={() => onStatusChange(tab.value)}
                className={cn(
                  'flex h-11 shrink-0 items-center gap-2.5 rounded-xl px-4 text-[15px] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-primary',
                  active ? 'bg-selected text-navy' : 'text-body hover:bg-slate-50',
                )}
              >
                {tab.label}
                <span
                  className={cn(
                    'flex h-6 min-w-6 items-center justify-center rounded-full px-1.5 text-xs font-semibold',
                    active ? 'bg-primary text-white' : 'bg-segment text-body',
                  )}
                >
                  {counts[tab.value] ?? 0}
                </span>
              </button>
            )
          })}
        </div>
        <div className="flex items-center gap-3 text-sm text-muted">
          <p aria-live="polite">
            {resultCount} {resultCount === 1 ? 'job' : 'jobs'} shown
          </p>
          {canReset && (
            <button
              type="button"
              onClick={onReset}
              className="flex items-center gap-1.5 rounded-md px-2 py-1 font-medium text-primary hover:bg-pale focus-visible:outline-2 focus-visible:outline-primary"
            >
              <RotateCcw size={14} aria-hidden="true" /> Reset filters
            </button>
          )}
        </div>
      </div>
    </section>
  )
}
