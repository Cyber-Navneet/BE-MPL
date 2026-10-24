import { Search, X } from 'lucide-react'
import { cn } from '../../utils/cn.js'

export default function SearchInput({ label, placeholder, value, onChange, className }) {
  return (
    <div role="search" className={cn('relative', className)}>
      <Search size={17} className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-home-muted" aria-hidden="true" />
      <input
        type="search"
        aria-label={label}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 w-full rounded-lg border border-home-border bg-white pr-10 pl-10 text-sm text-home-ink placeholder:text-placeholder hover:border-slate-300 focus-visible:border-home-blue focus-visible:outline-2 focus-visible:outline-home-blue/30 [&::-webkit-search-cancel-button]:hidden"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label="Clear search"
          className="absolute top-1/2 right-1.5 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-home-muted hover:bg-slate-100 hover:text-home-ink focus-visible:outline-2 focus-visible:outline-home-blue"
        >
          <X size={16} aria-hidden="true" />
        </button>
      )}
    </div>
  )
}
