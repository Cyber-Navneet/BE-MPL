export default function ResultsLine({ children, showClear, onClear }) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
      <p aria-live="polite" className="text-sm text-home-muted">
        {children}
      </p>
      {showClear && (
        <button
          type="button"
          onClick={onClear}
          className="rounded text-sm font-medium text-home-blue hover:underline focus-visible:outline-2 focus-visible:outline-home-blue"
        >
          Clear filters
        </button>
      )}
    </div>
  )
}
