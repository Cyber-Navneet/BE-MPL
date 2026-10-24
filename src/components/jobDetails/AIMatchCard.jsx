import { Link } from 'react-router-dom'
import { ArrowRight, CircleCheck, ClipboardList, Sparkles } from 'lucide-react'
import MatchRing from './MatchRing.jsx'
import LifecycleBadge from '../applications/LifecycleBadge.jsx'
import { formatDate, formatDateTime } from '../../utils/formatTime.js'

const countMatched = (items) => items.filter((item) => item.matched).length

const ASSESSMENT_ACTIONS = {
  'Assessment Pending': 'Start assessment',
  'Assessment In Progress': 'Resume assessment',
}

const buttonBase =
  'flex h-11 w-full items-center justify-center gap-2 rounded-lg text-[15px] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'

export default function AIMatchCard({ analysis, application, assessment, status, onApply }) {
  const assessmentAction = ASSESSMENT_ACTIONS[status]

  return (
    <section
      aria-labelledby="ai-match-title"
      className="rounded-xl border border-line bg-white p-5 shadow-[0_1px_2px_rgba(16,25,46,0.04)] sm:p-6"
    >
      <h2 id="ai-match-title" className="flex items-center gap-2 text-base font-semibold text-navy">
        <Sparkles size={18} className="text-primary" aria-hidden="true" />
        AI Match Analysis
      </h2>

      <div className="mt-5 px-6">
        <MatchRing value={analysis.score} />
      </div>
      <p className="mt-3 text-center text-xs text-muted">
        {countMatched(analysis.required)}/{analysis.required.length} required
        {analysis.preferred.length > 0 && ` · ${countMatched(analysis.preferred)}/${analysis.preferred.length} preferred`} skills
        matched
      </p>

      <div className="mt-5" aria-live="polite">
        {application ? (
          <div className="space-y-3">
            <p className="flex items-center justify-center gap-2 rounded-lg bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-700">
              <CircleCheck size={18} aria-hidden="true" />
              Applied on {formatDate(application.appliedAt)}
            </p>
            <div className="flex justify-center">
              <LifecycleBadge status={status} />
            </div>
            {assessmentAction && (
              <>
                {status === 'Assessment Pending' && (
                  <p className="text-center text-xs text-muted">
                    Complete your {assessment.durationMinutes}-minute assessment by {formatDateTime(assessment.startBy)}.
                  </p>
                )}
                <Link
                  to={`/assessments/${assessment.id}`}
                  className={`${buttonBase} bg-primary text-white hover:bg-primary-hover`}
                >
                  <ClipboardList size={18} aria-hidden="true" />
                  {assessmentAction}
                </Link>
              </>
            )}
            <Link
              to={`/applications/${application.id}`}
              className={`${buttonBase} border border-line bg-white text-navy hover:bg-slate-50`}
            >
              View Application
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        ) : (
          <button
            type="button"
            onClick={onApply}
            aria-haspopup="dialog"
            className={`${buttonBase} bg-primary text-white hover:bg-primary-hover`}
          >
            Apply Now
          </button>
        )}
      </div>
    </section>
  )
}
