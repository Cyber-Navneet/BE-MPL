import {
  CalendarClock,
  CircleX,
  Download,
  Eye,
  MessageCircleMore,
  Pencil,
  RotateCcw,
  SquareCheckBig,
  Sparkles,
  Video,
} from 'lucide-react'
import { OFFER_STATUSES } from '../../data/candidates.js'
import { formatRelative, formatShortDate, formatTime, initialsOf } from '../../utils/candidateUtils.js'
import { cn } from '../../utils/cn.js'

const focusRing = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-home-blue'
const buttonBase = `inline-flex h-10 items-center justify-center gap-1.5 rounded-lg px-3 text-sm font-medium whitespace-nowrap transition-colors ${focusRing}`
const softBlue = `${buttonBase} bg-blue-100 text-home-blue hover:bg-blue-200`
const solidBlue = `${buttonBase} bg-home-blue text-white hover:bg-primary-hover`

function Badge({ children, icon: Icon }) {
  return (
    <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold whitespace-nowrap text-emerald-700">
      {Icon && <Icon size={12} aria-hidden="true" />}
      {children}
    </span>
  )
}

// One candidate in a pipeline column. The action row depends on the candidate's stage.
export default function CandidateCard({ candidate, onAction }) {
  const { stage, name, role } = candidate
  const label = `${name}, ${role}`
  const offer = stage === 'offer' && candidate.offer ? OFFER_STATUSES[candidate.offer.status] : null

  return (
    <article className="rounded-2xl border border-home-border bg-white p-4" aria-label={label}>
      <div className="flex gap-3">
        <span
          aria-hidden="true"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-home-tint text-[15px] font-bold text-home-blue"
        >
          {initialsOf(name)}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="min-w-0 text-base leading-snug font-bold text-heading">{name}</h3>
            {stage === 'applied' && <Badge icon={Sparkles}>{candidate.matchScore}% Match</Badge>}
            {stage === 'assessment' && <Badge>{candidate.assessmentScore}% Score</Badge>}
            {stage === 'hired' && candidate.salaryLabel && (
              <span className="shrink-0 text-sm font-bold whitespace-nowrap text-heading underline decoration-2 underline-offset-4">
                <span className="sr-only">Salary: </span>
                {candidate.salaryLabel}
              </span>
            )}
          </div>
          <p className="text-[15px] text-home-muted">{role}</p>
          <p className="mt-2 text-sm text-home-muted underline underline-offset-2">
            <time dateTime={candidate.stageUpdatedAt}>{formatRelative(candidate.stageUpdatedAt)}</time>
          </p>
        </div>
      </div>

      {stage === 'interview' &&
        (candidate.interview ? (
          <div className="mt-3 flex items-start justify-between gap-2 rounded-lg bg-home-bg px-3 py-2 text-sm">
            <span className="flex min-w-0 items-start gap-2 text-home-ink">
              <CalendarClock size={16} className="mt-0.5 shrink-0 text-home-blue" aria-hidden="true" />
              <span>
                {formatShortDate(candidate.interview.date)} · {formatTime(candidate.interview.time)}
                <span className="block text-home-muted">
                  {candidate.interview.type} · {candidate.interview.interviewer}
                </span>
              </span>
            </span>
            <button
              type="button"
              onClick={() => onAction('interview', candidate)}
              aria-label={`Edit interview for ${name}`}
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-home-blue hover:bg-blue-100 ${focusRing}`}
            >
              <Pencil size={15} aria-hidden="true" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => onAction('interview', candidate)}
            className={`mt-3 inline-flex items-center gap-1.5 rounded text-sm font-medium text-home-blue hover:underline ${focusRing}`}
          >
            <CalendarClock size={15} aria-hidden="true" /> Schedule interview
          </button>
        ))}

      {offer && <p className={cn('mt-4 text-[15px] font-medium', offer.className)}>{offer.text}</p>}

      {stage === 'rejected' && (
        <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          Rejected{candidate.rejection?.reason ? `: ${candidate.rejection.reason}` : ' (no reason given)'}
        </p>
      )}

      <div className="mt-4 flex flex-wrap justify-end gap-2 empty:hidden">
        {stage === 'applied' && (
          <button type="button" onClick={() => onAction('resume', candidate)} aria-label={`Resume of ${name}`} className={softBlue}>
            Resume <Download size={17} aria-hidden="true" />
          </button>
        )}
        {stage === 'assessment' && (
          <>
            <button type="button" onClick={() => onAction('result', candidate)} aria-label={`View result for ${name}`} className={softBlue}>
              View Result <Eye size={17} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => onAction('interview', candidate)}
              aria-label={`Schedule interview with ${name}`}
              className={solidBlue}
            >
              Schedule Interview <Video size={17} aria-hidden="true" />
            </button>
          </>
        )}
        {stage === 'interview' && (
          <>
            <button
              type="button"
              onClick={() => onAction('reject', candidate)}
              aria-label={`Reject ${name}`}
              className={`${buttonBase} bg-red-100 text-red-600 hover:bg-red-200`}
            >
              Reject <CircleX size={17} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => onAction('offer', candidate)}
              aria-label={`Send offer to ${name}`}
              className={`${buttonBase} bg-green-600 text-white hover:bg-green-700`}
            >
              Send Offer <SquareCheckBig size={17} aria-hidden="true" />
            </button>
          </>
        )}
        {stage === 'hired' && (
          <button
            type="button"
            onClick={() => onAction('chat', candidate)}
            aria-label={`Continue conversation with ${name}`}
            className={`${buttonBase} w-full bg-green-600 text-white hover:bg-green-700`}
          >
            Continue Conversation <MessageCircleMore size={17} aria-hidden="true" />
          </button>
        )}
        {stage === 'rejected' && (
          <button type="button" onClick={() => onAction('restore', candidate)} aria-label={`Restore ${name}`} className={softBlue}>
            Restore <RotateCcw size={16} aria-hidden="true" />
          </button>
        )}
      </div>
    </article>
  )
}
