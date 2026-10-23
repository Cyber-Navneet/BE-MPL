import { SearchX } from 'lucide-react'

export default function EmptyState({ onClear }) {
  return (
    <div className="flex flex-col items-center rounded-xl border border-dashed border-line bg-white px-6 py-14 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-pale text-primary">
        <SearchX size={24} aria-hidden="true" />
      </span>
      <h3 className="mt-4 text-lg font-semibold text-navy">No jobs found</h3>
      <p className="mt-1 max-w-sm text-sm text-muted">
        No jobs match your current search or filters. Try different keywords or clear the filters to see all jobs.
      </p>
      <button
        type="button"
        onClick={onClear}
        className="mt-5 inline-flex h-10 items-center rounded-lg bg-primary px-4 text-sm font-medium text-white hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        Clear Filters
      </button>
    </div>
  )
}
