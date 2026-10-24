import CandidateCard from './CandidateCard.jsx'
import ColumnMenu from './ColumnMenu.jsx'
import { cn } from '../../utils/cn.js'

const SCORE_LABELS = { applied: 'Highest match', assessment: 'Highest score', interview: 'Highest score' }

// One pipeline column: header (dot, title, count, menu) and a vertically scrolling card list.
export default function StageColumn({ stage, candidates, sort, onSort, onReset, onAction }) {
  const headingId = `stage-${stage.id}-heading`

  return (
    <section aria-labelledby={headingId} className="flex w-[320px] shrink-0 flex-col rounded-2xl bg-white sm:w-[380px]">
      <div className="mx-4 flex items-center gap-3 border-b border-home-border py-5">
        <span className={cn('h-2.5 w-2.5 shrink-0 rounded-full', stage.dot)} aria-hidden="true" />
        <h2 id={headingId} className="text-xl font-bold text-heading">
          {stage.label}
        </h2>
        <span className="flex h-9 min-w-9 items-center justify-center rounded-full bg-slate-100 px-2 text-sm font-semibold text-home-ink">
          {candidates.length}
          <span className="sr-only"> candidates</span>
        </span>
        <div className="ml-auto">
          <ColumnMenu stageLabel={stage.label} sort={sort} scoreLabel={SCORE_LABELS[stage.id]} onSort={onSort} onReset={onReset} />
        </div>
      </div>

      <div className="max-h-[calc(100vh-17rem)] min-h-40 overflow-y-auto p-3 [scrollbar-width:thin]">
        {candidates.length === 0 ? (
          <p className="rounded-xl border border-dashed border-home-border px-4 py-8 text-center text-sm text-home-muted">
            No candidates in this stage.
          </p>
        ) : (
          <ul className="space-y-3">
            {candidates.map((candidate) => (
              <li key={candidate.id}>
                <CandidateCard candidate={candidate} onAction={onAction} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
