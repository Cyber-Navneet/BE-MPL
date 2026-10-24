import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { CircleAlert, CircleCheck, LoaderCircle, MapPin, TriangleAlert, X } from 'lucide-react'
import { CompanyLogo } from '../jobs/JobBadges.jsx'
import { useDialog } from '../../hooks/useDialog.js'

// Mounted only while open. While submitting, every way of closing is disabled so the
// request can't be abandoned halfway.
export default function ConfirmApplicationModal({
  job,
  resumeFileName,
  matchScore,
  assessmentMinutes,
  submitting,
  error,
  onConfirm,
  onClose,
}) {
  const closeRef = useRef(null)
  const close = submitting ? () => {} : onClose
  useDialog({ open: true, onClose: close, initialFocusRef: closeRef })

  const checklist = [
    { key: 'profile', ok: true, text: 'Your profile information' },
    resumeFileName
      ? { key: 'resume', ok: true, text: `Resume (${resumeFileName})` }
      : { key: 'resume', ok: false, text: 'No resume on your profile yet' },
    { key: 'match', ok: true, text: `AI match score (${matchScore}%) & skill assessment` },
  ]

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40" onClick={close} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-application-title"
        aria-describedby="confirm-application-summary"
        className="relative flex max-h-[calc(100vh-2rem)] w-full max-w-[610px] flex-col rounded-2xl bg-white shadow-xl"
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-4 sm:px-6">
          <h2 id="confirm-application-title" className="text-lg font-semibold text-navy">
            Confirm Application
          </h2>
          <button
            ref={closeRef}
            type="button"
            onClick={close}
            disabled={submitting}
            aria-label="Close"
            className="flex h-10 w-10 items-center justify-center rounded-lg text-muted hover:bg-slate-100 hover:text-navy focus-visible:outline-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6">
          <div id="confirm-application-summary" className="flex items-center gap-4 rounded-xl bg-pale p-4">
            <CompanyLogo initials={job.companyInitials} className="h-12 w-12 bg-white text-base" />
            <div className="min-w-0">
              <p className="font-semibold text-navy">{job.title}</p>
              <p className="text-sm text-muted">{job.company}</p>
              <p className="mt-0.5 flex items-center gap-1 text-sm text-muted">
                <MapPin size={14} aria-hidden="true" />
                {job.location}
              </p>
            </div>
          </div>

          <p className="mt-5 text-[15px] font-medium text-navy">Your application will include:</p>
          <ul className="mt-3 space-y-2.5">
            {checklist.map(({ key, ok, text }) => (
              <li key={key} className="flex items-start gap-3 text-[15px] text-body">
                {ok ? (
                  <CircleCheck size={18} className="mt-0.5 shrink-0 text-success" aria-hidden="true" />
                ) : (
                  <CircleAlert size={18} className="mt-0.5 shrink-0 text-danger" aria-hidden="true" />
                )}
                <span>
                  {text}
                  {!ok && (
                    <>
                      {' — '}
                      <Link to="/profile" className="font-medium text-primary hover:underline">
                        add it on My Profile
                      </Link>{' '}
                      to apply.
                    </>
                  )}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-5 flex gap-3 rounded-xl border border-[#F2DE91] bg-[#FFFBEB] p-4 text-sm text-amber-900">
            <TriangleAlert size={18} className="mt-0.5 shrink-0 text-amber-600" aria-hidden="true" />
            <p>
              After applying, you’ll need to complete a {assessmentMinutes}-minute AI-generated assessment.
              <span className="mt-1 block text-xs text-amber-800/80">
                Demo: questions come from a built-in question bank, and nothing is sent to the company.
              </span>
            </p>
          </div>

          {error && (
            <p role="alert" className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-danger">
              {error}
            </p>
          )}
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-line px-5 py-4 sm:flex-row sm:px-6">
          <button
            type="button"
            onClick={close}
            disabled={submitting}
            className="h-11 flex-1 rounded-lg border border-line bg-white text-sm font-medium text-navy hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={submitting || !resumeFileName}
            className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-lg bg-primary text-sm font-medium text-white hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting && <LoaderCircle size={17} className="animate-spin" aria-hidden="true" />}
            {submitting ? 'Submitting...' : 'Confirm & Apply'}
          </button>
        </div>
      </div>
    </div>
  )
}
