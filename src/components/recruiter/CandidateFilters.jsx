import { ChevronDown, Search, X } from 'lucide-react'

const controlClasses =
  'h-12 w-full rounded-xl border border-home-border bg-white text-base text-home-ink hover:border-slate-300 focus-visible:border-home-blue focus-visible:outline-2 focus-visible:outline-home-blue/30'

function Select({ label, value, onChange, options }) {
  return (
    <div className="relative">
      <select
        aria-label={label}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`${controlClasses} cursor-pointer appearance-none pr-10 pl-4`}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown size={18} className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-home-muted" aria-hidden="true" />
    </div>
  )
}

export default function CandidateFilters({ query, onQueryChange, role, onRoleChange, roleOptions, stage, onStageChange, stageOptions }) {
  return (
    <div className="grid gap-4 rounded-2xl border border-home-border bg-white p-4 sm:p-5 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)]">
      <div role="search" className="relative">
        <Search size={20} className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-home-muted" aria-hidden="true" />
        <input
          type="search"
          aria-label="Search candidates by name, role, company or skill"
          placeholder="Search jobs, companies, or skills..."
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          className={`${controlClasses} pr-11 pl-12 placeholder:text-placeholder [&::-webkit-search-cancel-button]:hidden`}
        />
        {query && (
          <button
            type="button"
            onClick={() => onQueryChange('')}
            aria-label="Clear search"
            className="absolute top-1/2 right-2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-home-muted hover:bg-slate-100 hover:text-home-ink focus-visible:outline-2 focus-visible:outline-home-blue"
          >
            <X size={16} aria-hidden="true" />
          </button>
        )}
      </div>
      <Select label="Filter by role" value={role} onChange={onRoleChange} options={roleOptions} />
      <Select label="Filter by stage" value={stage} onChange={onStageChange} options={stageOptions} />
    </div>
  )
}
