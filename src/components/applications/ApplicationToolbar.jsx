import { Funnel, Search, X } from 'lucide-react'
import SelectField from '../jobs/SelectField.jsx'
import { APPLICATION_TYPES } from '../../utils/applicationUtils.js'
import { cn } from '../../utils/cn.js'

const TYPE_OPTIONS = [
  { value: 'all', label: 'All Types' },
  ...APPLICATION_TYPES.map((type) => ({ value: type, label: type })),
]

export default function ApplicationToolbar({ query, onQueryChange, type, onTypeChange, activeFilterCount, onOpenFilters }) {
  return (
    <div
      role="search"
      className="flex flex-col gap-3 rounded-xl border border-line bg-white p-4 shadow-[0_1px_2px_rgba(16,25,46,0.04)] sm:flex-row"
    >
      <div className="relative flex-1">
        <Search size={18} className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-muted" aria-hidden="true" />
        <input
          type="search"
          aria-label="Search jobs, companies, or skills"
          placeholder="Search jobs, companies, or skills..."
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          className="h-11 w-full rounded-lg border border-line bg-white pr-11 pl-11 text-[15px] text-navy placeholder:text-placeholder hover:border-slate-300 focus-visible:border-primary focus-visible:outline-2 focus-visible:outline-primary/30 [&::-webkit-search-cancel-button]:hidden"
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

      <div className="flex gap-3">
        <SelectField
          label="Application type"
          value={type}
          onChange={onTypeChange}
          options={TYPE_OPTIONS}
          className="min-w-0 flex-1 sm:w-48 sm:flex-none"
        />
        <button
          type="button"
          onClick={onOpenFilters}
          aria-haspopup="dialog"
          className={cn(
            'inline-flex h-11 shrink-0 items-center gap-2 rounded-lg border px-4 text-[15px] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
            activeFilterCount > 0
              ? 'border-primary/40 bg-pale text-primary'
              : 'border-line bg-white text-navy hover:bg-slate-50',
          )}
        >
          <Funnel size={17} aria-hidden="true" />
          Filters
          {activeFilterCount > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-semibold text-white">
              {activeFilterCount}
              <span className="sr-only"> active</span>
            </span>
          )}
        </button>
      </div>
    </div>
  )
}
