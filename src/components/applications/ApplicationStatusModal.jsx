import { useRef } from 'react'
import { Check, X } from 'lucide-react'
import StatusPill from './StatusPill.jsx'
import { useDialog } from '../../hooks/useDialog.js'
import { formatShortDate, getTimeline } from '../../utils/applicationUtils.js'
import { cn } from '../../utils/cn.js'

const STEP_STYLES = {
  done: { dot: 'border-success bg-success text-white', label: 'text-navy' },
  current: { dot: 'border-primary bg-white ring-4 ring-primary/15', label: 'font-semibold text-primary' },
  upcoming: { dot: 'border-slate-300 bg-white', label: 'text-muted' },
  rejected: { dot: 'border-danger bg-danger text-white', label: 'font-semibold text-danger' },
}

const STEP_STATE_TEXT = { done: 'completed', current: 'current step', upcoming: 'upcoming', rejected: 'not selected' }

function StepMarker({ state }) {
  return (
    <span
      aria-hidden="true"
      className={cn('relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2', STEP_STYLES[state].dot)}
    >
      {state === 'done' && <Check size={14} strokeWidth={3} />}
      {state === 'rejected' && <X size={14} strokeWidth={3} />}
      {state === 'current' && <span className="h-2.5 w-2.5 rounded-full bg-primary" />}
    </span>
  )
}

export default function ApplicationStatusModal({ application, onClose }) {
  const closeRef = useRef(null)
  useDialog({ open: true, onClose, initialFocusRef: closeRef })

  const timeline = getTimeline(application.status)

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
      <div className="absolute inset-0 bg-navy/50" onClick={onClose} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="status-title"
        className="relative flex max-h-[90vh] w-full flex-col rounded-t-2xl bg-white shadow-xl sm:max-w-lg sm:rounded-2xl"
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-4 sm:px-6">
          <h2 id="status-title" className="text-lg font-semibold text-navy">
            Application Status
          </h2>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close application status"
            className="flex h-10 w-10 items-center justify-center rounded-lg text-muted hover:bg-slate-100 hover:text-navy focus-visible:outline-2 focus-visible:outline-primary"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-base font-semibold text-navy">{application.jobTitle}</p>
              <p className="mt-0.5 text-sm text-muted">
                {application.company} · {application.location} · Applied {formatShortDate(application.appliedDate)}
              </p>
            </div>
            <StatusPill status={application.status} />
          </div>

          <ol aria-live="polite" className="mt-6">
            {timeline.map((step, index) => (
              <li key={step.label} className="relative flex gap-4 pb-6 last:pb-0">
                {index < timeline.length - 1 && (
                  <span
                    aria-hidden="true"
                    className={cn(
                      'absolute top-6 bottom-0 left-[11px] w-0.5',
                      step.state === 'done' ? 'bg-success' : 'bg-line',
                    )}
                  />
                )}
                <StepMarker state={step.state} />
                <p className={cn('pt-0.5 text-[15px]', STEP_STYLES[step.state].label)}>
                  {step.label}
                  <span className="sr-only"> ({STEP_STATE_TEXT[step.state]})</span>
                </p>
              </li>
            ))}
          </ol>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-line px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
          <button
            type="button"
            onClick={onClose}
            className="h-11 rounded-lg border border-line bg-white px-4 text-sm font-medium text-navy hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
