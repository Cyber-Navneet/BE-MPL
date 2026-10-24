import { useCallback, useRef, useState } from 'react'
import { Link, useOutletContext, useParams } from 'react-router-dom'
import { ArrowLeft, ClipboardList, Ellipsis, Eye, SendHorizontal } from 'lucide-react'
import { CompanyLogo } from '../components/jobs/JobBadges.jsx'
import JobDetailsDrawer from '../components/jobs/JobDetailsDrawer.jsx'
import AssessmentInviteCard from '../components/applications/AssessmentInviteCard.jsx'
import LifecycleBadge from '../components/applications/LifecycleBadge.jsx'
import { useAssessmentSync } from '../hooks/useAssessmentSync.js'
import { useDismiss } from '../hooks/useDismiss.js'
import { useJobActions } from '../hooks/useJobActions.js'
import {
  NEXT_STAGES,
  REVIEW_STAGES,
  addApplicationNote,
  applicationStatus,
  applicationsStore,
  assessmentStatus,
  assessmentsStore,
  findJob,
  setApplicationStage,
} from '../utils/applicationStore.js'
import { formatDate, formatDateTime } from '../utils/formatTime.js'

const NOTE_LIMIT = 500

// Simulates the recruiter's side, one explicit click at a time. Demo only.
function DemoControls({ status, onChange }) {
  const next = NEXT_STAGES[status] ?? []
  const finished = status === 'Rejected' || status === 'Offer Received'

  return (
    <div className="rounded-xl border border-dashed border-line bg-slate-50 p-4">
      <p className="text-sm font-semibold text-navy">Demo controls</p>
      <p className="mt-0.5 text-xs text-muted">Simulate the recruiter’s next step. Nothing is sent anywhere.</p>
      {next.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {next.map((stage) => (
            <button
              key={stage}
              type="button"
              onClick={() => onChange(stage)}
              className="h-9 rounded-lg border border-line bg-white px-3 text-sm font-medium text-navy hover:bg-pale hover:text-primary focus-visible:outline-2 focus-visible:outline-primary"
            >
              Mark as {REVIEW_STAGES[stage]}
            </button>
          ))}
        </div>
      ) : (
        <p className="mt-3 text-sm text-body">
          {finished ? 'This application has reached a final outcome.' : 'Recruiter steps unlock once the assessment is completed.'}
        </p>
      )}
    </div>
  )
}

function ActionsMenu({ assessmentPath, onViewJob }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const close = useCallback(() => setOpen(false), [])
  useDismiss(ref, open, close)
  const itemClasses =
    'flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-navy hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-primary'

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label="Application actions"
        aria-expanded={open}
        className="flex h-10 w-10 items-center justify-center rounded-lg text-body hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-primary"
      >
        <Ellipsis size={22} aria-hidden="true" />
      </button>
      {open && (
        <div className="absolute right-0 z-30 mt-1 w-52 rounded-xl border border-line bg-white p-1.5 shadow-lg">
          <button
            type="button"
            className={itemClasses}
            onClick={() => {
              close()
              onViewJob()
            }}
          >
            <Eye size={16} aria-hidden="true" /> View job details
          </button>
          <Link to={assessmentPath} className={itemClasses} onClick={close}>
            <ClipboardList size={16} aria-hidden="true" /> Open assessment
          </Link>
        </div>
      )}
    </div>
  )
}

export default function ApplicationDetail() {
  const { applicationId } = useParams()
  const { notify } = useOutletContext()
  const now = useAssessmentSync()
  const applications = applicationsStore.useStore()
  const assessments = assessmentsStore.useStore()
  const jobActions = useJobActions(notify)
  const [note, setNote] = useState('')
  const [jobOpen, setJobOpen] = useState(false)
  const closeJob = useCallback(() => setJobOpen(false), [])

  const application = applications.find((app) => app.id === applicationId)
  const job = application && findJob(application.jobId)
  const assessment = application && assessments[`asm-${application.id}`]

  const backLink = (
    <Link
      to="/applications"
      className="mt-4 inline-flex items-center gap-2 rounded-md py-1 text-[15px] text-navy hover:text-primary focus-visible:outline-2 focus-visible:outline-primary"
    >
      <ArrowLeft size={18} aria-hidden="true" /> Back to applications
    </Link>
  )

  if (!application || !job) {
    return (
      <div className="mx-auto max-w-[1180px]">
        <h1 className="text-2xl font-bold tracking-tight text-navy sm:text-[28px]">Application not found</h1>
        <p className="mt-1.5 text-[15px] text-muted">This application doesn’t exist on this device.</p>
        {backLink}
      </div>
    )
  }

  const status = applicationStatus(application, assessment, now)

  const changeStage = (stage) => {
    setApplicationStage(application.id, stage)
    notify(`Status updated to ${REVIEW_STAGES[stage]} (demo).`, 'success')
  }

  const sendNote = () => {
    const text = note.trim()
    if (!text) return
    addApplicationNote(application.id, text)
    setNote('')
  }

  return (
    <div className="mx-auto max-w-[1180px]">
      <h1 className="text-2xl font-bold tracking-tight text-navy sm:text-[28px]">Applications</h1>
      <p className="mt-1.5 text-[15px] text-muted">Track your submitted applications and take the next step.</p>
      {backLink}

      <section
        aria-label={`Application for ${job.title} at ${job.company}`}
        className="mt-4 flex flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-[0_1px_2px_rgba(16,25,46,0.04)]"
      >
        <div className="flex items-center gap-4 border-b border-line px-4 py-4 sm:px-6">
          <CompanyLogo initials={job.companyInitials} className="h-12 w-12 rounded-xl text-base sm:h-14 sm:w-14 sm:text-lg" />
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-lg font-bold text-navy sm:text-2xl">{job.company}</h2>
            <p className="truncate text-[15px] text-muted">{job.title}</p>
          </div>
          <LifecycleBadge status={status} className="hidden sm:inline-flex" />
          {assessment && <ActionsMenu assessmentPath={`/assessments/${assessment.id}`} onViewJob={() => setJobOpen(true)} />}
        </div>

        <div className="space-y-6 px-4 py-6 sm:px-6">
          <p className="text-center text-sm text-muted">{formatDate(application.appliedAt)}</p>
          <div className="flex justify-center sm:hidden">
            <LifecycleBadge status={status} />
          </div>
          <p className="max-w-xl rounded-2xl rounded-tl-sm bg-slate-100 px-4 py-3 text-[15px] text-navy">
            You applied for <strong>{job.title}</strong> at {job.company}. This is a demo: the application is recorded on
            this device only.
          </p>
          {assessment && (
            <AssessmentInviteCard assessment={assessment} status={assessmentStatus(assessment, now)} now={now} />
          )}
          <DemoControls status={status} onChange={changeStage} />
          {(application.notes ?? []).map((item) => (
            <div key={item.id} className="ml-auto max-w-xl text-right">
              <p className="inline-block rounded-2xl rounded-tr-sm bg-primary px-4 py-3 text-left text-[15px] whitespace-pre-wrap text-white">
                {item.text}
              </p>
              <p className="mt-1 text-xs text-muted">{formatDateTime(item.sentAt)} · Saved on this device only</p>
            </div>
          ))}
        </div>

        <form
          onSubmit={(event) => {
            event.preventDefault()
            sendNote()
          }}
          className="border-t border-line p-3 sm:p-4"
        >
          <div className="flex items-end gap-2 rounded-xl border border-line bg-white px-3 py-2 focus-within:border-primary">
            <label htmlFor="application-note" className="sr-only">
              Add a private note
            </label>
            <textarea
              id="application-note"
              rows={1}
              maxLength={NOTE_LIMIT}
              value={note}
              onChange={(event) => setNote(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                  event.preventDefault()
                  sendNote()
                }
              }}
              placeholder="Start typing a private note…"
              className="max-h-32 min-h-10 flex-1 resize-none bg-transparent py-2 text-[15px] text-navy placeholder:text-placeholder focus:outline-none"
            />
            <button
              type="submit"
              disabled={!note.trim()}
              aria-label="Save note"
              className="flex h-10 w-10 items-center justify-center rounded-lg text-primary hover:bg-pale focus-visible:outline-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:text-slate-300"
            >
              <SendHorizontal size={20} aria-hidden="true" />
            </button>
          </div>
          <p className="mt-1.5 px-1 text-xs text-muted">
            Notes are private and stay on this device; recruiters can’t see them in this demo.
          </p>
        </form>
      </section>

      {jobOpen && (
        <JobDetailsDrawer
          job={job}
          isSaved={jobActions.isSaved(job.id)}
          isApplied
          confirmOpen={false}
          onToggleSave={() => jobActions.toggleSave(job)}
          onApply={() => {}}
          onClose={closeJob}
        />
      )}
    </div>
  )
}
