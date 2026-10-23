import CircularProgress from './CircularProgress.jsx'
import DemoBadge from './DemoBadge.jsx'
import { tierFor } from '../../utils/atsAnalyzer.js'
import { cn } from '../../utils/cn.js'

const TIER_STYLES = {
  'Tier-1 Ready': 'border-blue-200 bg-pale text-primary',
  'Good Match': 'border-emerald-200 bg-emerald-50 text-emerald-700',
  'Needs Improvement': 'border-amber-200 bg-amber-50 text-amber-700',
}

// `rules` (the score breakdown) is only passed for a real analysis.
export default function AtsScoreCard({ score, summary, rules, isDemo }) {
  const tier = tierFor(score)

  return (
    <section
      aria-labelledby="ats-score-title"
      className="flex flex-col rounded-2xl border border-line bg-[#fafbfd] p-5 sm:p-6"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 id="ats-score-title" className="text-base text-body">
          Overall ATS Score
        </h2>
        <div className="flex items-center gap-2">
          {isDemo && <DemoBadge />}
          <span className={cn('rounded-full border px-2.5 py-0.5 text-[13px] font-semibold', TIER_STYLES[tier])}>{tier}</span>
        </div>
      </div>

      <div className="flex justify-center py-6">
        <CircularProgress value={score} label={`${isDemo ? 'Demo ' : ''}ATS score ${score} out of 100, ${tier}`} />
      </div>

      <p className="rounded-xl border border-blue-100 bg-[#f1f6ff] px-4 py-3 text-center text-[13px] leading-relaxed text-navy">
        {summary}
      </p>

      {rules && (
        <details className="group mt-3 text-[13px]">
          <summary className="cursor-pointer list-none rounded text-center font-medium text-primary hover:underline focus-visible:outline-2 focus-visible:outline-primary">
            How this score is calculated
          </summary>
          <dl className="mt-3 space-y-1.5">
            {rules.map((rule) => (
              <div key={rule.label} className="flex justify-between gap-3">
                <dt className="text-body">{rule.label}</dt>
                <dd className="font-medium text-navy tabular-nums">
                  {rule.earned}/{rule.max}
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-3 text-xs text-muted">
            Estimated, rule-based compatibility score calculated in your browser. It is not an official score from any
            employer&apos;s ATS.
          </p>
        </details>
      )}
    </section>
  )
}
