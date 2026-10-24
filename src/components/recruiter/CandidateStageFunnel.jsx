import { CheckCheck } from 'lucide-react'
import { cn } from '../../utils/cn.js'
import { formatRelative, lastScreenedAt, stageCounts } from '../../utils/jobMetrics.js'

// Five pipeline stages with the number of candidates currently in each. Scrolls sideways on small screens.
export default function CandidateStageFunnel({ applicants, now }) {
  const { counts, assessmentsCompleted, rejected } = stageCounts(applicants)
  const lastScreened = lastScreenedAt(applicants)
  const stages = [
    { stage: 'Applied', note: null, marker: <span className="h-2 w-2 rounded-full bg-primary" aria-hidden="true" /> },
    { stage: 'Assessment', note: `${assessmentsCompleted} completed test` },
    { stage: 'Technical Interview', note: 'in progress' },
    { stage: 'Offer', note: 'sent' },
    { stage: 'Hired', note: 'joined', marker: <CheckCheck size={16} className="text-primary" aria-hidden="true" /> },
  ]

  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h4 className="text-xs font-semibold tracking-wider text-navy uppercase">Candidate stage funnel</h4>
        <p className="text-sm text-muted">
          {lastScreened ? `Last applicant screened ${formatRelative(lastScreened, now)}` : 'No applicants screened yet'}
          {rejected > 0 && ` · ${rejected} rejected`}
        </p>
      </div>
      <ol className="mt-3 flex gap-3 overflow-x-auto pb-1 lg:grid lg:grid-cols-5 lg:overflow-visible">
        {stages.map(({ stage, note, marker }) => (
          <li
            key={stage}
            className="flex min-w-36 flex-1 flex-col rounded-xl border border-line bg-white px-4 py-3 lg:min-w-0"
          >
            <span className="flex items-center justify-between gap-2 text-sm text-navy">
              {stage}
              {marker}
            </span>
            <span className="mt-1 flex items-end justify-between gap-2">
              <span className={cn('text-3xl font-bold', stage === 'Hired' ? 'text-primary' : 'text-navy')}>{counts[stage]}</span>
              {note && <span className="pb-1 text-right text-xs text-body sm:text-sm">{note}</span>}
            </span>
          </li>
        ))}
      </ol>
    </div>
  )
}
