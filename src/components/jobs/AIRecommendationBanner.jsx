import { Sparkles, TrendingUp } from 'lucide-react'

const SORT_DESCRIPTIONS = {
  match: 'Showing jobs sorted by your AI match score.',
  recent: 'Showing the most recently posted jobs first.',
  'salary-desc': 'Showing jobs sorted by salary, highest first.',
  'salary-asc': 'Showing jobs sorted by salary, lowest first.',
}

export default function AIRecommendationBanner({ topMatch, sort, onOpenJob }) {
  return (
    <section
      aria-label="AI recommendation"
      className="flex items-center gap-4 rounded-xl bg-linear-to-r from-[#e3eeff] to-[#e0f8ee] p-4 sm:px-5"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-white">
        <Sparkles size={20} aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1">
        <h2 className="text-[15px] font-semibold text-navy">AI Recommendation</h2>
        <p className="mt-0.5 text-[15px] text-navy">
          {topMatch ? (
            <>
              {SORT_DESCRIPTIONS[sort]} Top match:{' '}
              <button
                type="button"
                onClick={() => onOpenJob(topMatch.id)}
                className="rounded text-left font-semibold text-primary hover:underline focus-visible:outline-2 focus-visible:outline-primary"
              >
                {topMatch.title} at {topMatch.company} ({topMatch.matchScore}%)
              </button>
            </>
          ) : (
            'No jobs match your current search and filters, so there is no recommendation yet.'
          )}
        </p>
      </div>
      <TrendingUp size={22} className="hidden shrink-0 text-primary sm:block" aria-hidden="true" />
    </section>
  )
}
