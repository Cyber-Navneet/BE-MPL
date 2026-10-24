import { useCallback, useMemo, useState } from 'react'
import { Link, useOutletContext, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import JobSummaryCard from '../components/jobDetails/JobSummaryCard.jsx'
import JobDescriptionCard from '../components/jobDetails/JobDescriptionCard.jsx'
import CompanyCard from '../components/jobDetails/CompanyCard.jsx'
import AIMatchCard from '../components/jobDetails/AIMatchCard.jsx'
import MatchReasonsCard from '../components/jobDetails/MatchReasonsCard.jsx'
import ConfirmApplicationModal from '../components/jobDetails/ConfirmApplicationModal.jsx'
import { useAssessmentSync } from '../hooks/useAssessmentSync.js'
import { useJobActions } from '../hooks/useJobActions.js'
import {
  applicationStatus,
  applicationsStore,
  assessmentsStore,
  findJob,
  previewAssessmentMinutes,
  submitApplication,
} from '../utils/applicationStore.js'
import { analyzeMatch } from '../utils/matchScore.js'
import { hasResume, profileStore } from '../utils/profileStore.js'

const backLink = (
  <Link
    to="/jobs"
    className="inline-flex items-center gap-2 rounded-md py-1 text-[15px] text-navy hover:text-primary focus-visible:outline-2 focus-visible:outline-primary"
  >
    <ArrowLeft size={18} aria-hidden="true" /> Back to jobs
  </Link>
)

export default function JobDetails() {
  const { jobId } = useParams()
  const { notify } = useOutletContext()
  const now = useAssessmentSync()
  const profile = profileStore.useStore()
  const applications = applicationsStore.useStore()
  const assessments = assessmentsStore.useStore()
  const jobActions = useJobActions(notify)

  const [confirmOpen, setConfirmOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const job = findJob(Number(jobId))
  const analysis = useMemo(() => (job ? analyzeMatch(profile, job) : null), [profile, job])
  const closeConfirm = useCallback(() => setConfirmOpen(false), [])

  if (!job) {
    return (
      <div className="mx-auto max-w-[1180px]">
        {backLink}
        <h1 className="mt-4 text-2xl font-bold tracking-tight text-navy">Job not found</h1>
        <p className="mt-1.5 text-[15px] text-muted">This job listing doesn’t exist or is no longer available.</p>
      </div>
    )
  }

  const application = applications.find((app) => app.jobId === job.id) ?? null
  const assessment = application ? assessments[`asm-${application.id}`] : null
  const status = application ? applicationStatus(application, assessment, now) : null

  const openConfirm = () => {
    setError('')
    setConfirmOpen(true)
  }

  const confirmApply = async () => {
    setSubmitting(true)
    setError('')
    try {
      await submitApplication(job)
      setConfirmOpen(false)
      notify(`Applied to ${job.title} at ${job.company} — your assessment is ready.`, 'success')
    } catch (submitError) {
      setError(submitError.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-[1180px]">
      {backLink}

      <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_317px] lg:items-start">
        <div className="min-w-0 space-y-6">
          <JobSummaryCard
            job={job}
            // The student's own application counts once it exists, and only once.
            applicants={job.applicants + (application ? 1 : 0)}
            isSaved={jobActions.isSaved(job.id)}
            onToggleSave={() => jobActions.toggleSave(job)}
          />
          <JobDescriptionCard job={job} />
          <CompanyCard job={job} />
        </div>

        <aside aria-label="AI match" className="space-y-6 lg:sticky lg:top-24">
          <AIMatchCard
            analysis={analysis}
            application={application}
            assessment={assessment}
            status={status}
            onApply={openConfirm}
          />
          <MatchReasonsCard analysis={analysis} />
        </aside>
      </div>

      {confirmOpen && !application && (
        <ConfirmApplicationModal
          job={job}
          resumeFileName={hasResume(profile) ? profile.resume.fileName : ''}
          matchScore={analysis.score}
          assessmentMinutes={previewAssessmentMinutes(job)}
          submitting={submitting}
          error={error}
          onConfirm={confirmApply}
          onClose={closeConfirm}
        />
      )}
    </div>
  )
}
