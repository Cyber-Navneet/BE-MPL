import { Sparkles } from 'lucide-react'
import { cn } from '../../utils/cn.js'

// Shows the best AI match among the visible applications and toggles AI-score sorting.
export default function ApplicationsAIBanner({ topMatch, aiSort, onToggleAiSort, onOpenStatus }) {
  return (
    <section
      aria-label="AI recommendation"
      className="flex flex-col gap-3 rounded-xl bg-linear-to-r from-[#e3eeff] to-[#e0f8ee] p-4 sm:flex-row sm:items-center sm:gap-4 sm:px-5"
    >
      <div className="flex min-w-0 flex-1 items-start gap-4 sm:items-center">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-white">
          <Sparkles size={20} aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="text-[15px] font-semibold text-navy">AI Recommendation</h2>
          <p className="mt-0.5 text-sm text-navy sm:text-[15px]">
            {topMatch ? (
              <>
                {aiSort
                  ? 'Showing jobs sorted by your AI match score.'
                  : 'Showing your most recent applications first.'}{' '}
                Top match:{' '}
                <button
                  type="button"
                  onClick={() => onOpenStatus(topMatch.id)}
                  className="rounded text-left font-semibold text-primary hover:underline focus-visible:outline-2 focus-visible:outline-primary"
                >
                  {topMatch.jobTitle} at {topMatch.company} ({topMatch.matchScore}%)
                </button>
              </>
            ) : (
              'No applications match your current search and filters, so there is no recommendation yet.'
            )}
          </p>
        </div>
      </div>

      <label className="flex shrink-0 cursor-pointer items-center gap-2.5 self-end text-sm font-medium text-navy sm:self-auto">
        AI sort
        <input type="checkbox" role="switch" checked={aiSort} onChange={onToggleAiSort} className="peer sr-only" />
        <span
          aria-hidden="true"
          className={cn(
            'relative h-6 w-11 rounded-full transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-primary',
            aiSort ? 'bg-primary' : 'bg-slate-300',
          )}
        >
          <span
            className={cn(
              'absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform',
              aiSort && 'translate-x-5',
            )}
          />
        </span>
      </label>
    </section>
  )
}
