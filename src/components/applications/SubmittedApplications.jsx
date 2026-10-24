import { Link } from 'react-router-dom'
import { ArrowRight, ClipboardList, Send } from 'lucide-react'
import { CompanyLogo } from '../jobs/JobBadges.jsx'
import LifecycleBadge from './LifecycleBadge.jsx'
import { useAssessmentSync } from '../../hooks/useAssessmentSync.js'
import { applicationStatus, applicationsStore, assessmentsStore, findJob } from '../../utils/applicationStore.js'
import { formatDate } from '../../utils/formatTime.js'

const ASSESSMENT_ACTIONS = { 'Assessment Pending': 'Start assessment', 'Assessment In Progress': 'Resume assessment' }

// Real applications made from a job's details page (stored in applicationStore), newest first.
export default function SubmittedApplications() {
  const now = useAssessmentSync()
  const applications = applicationsStore.useStore()
  const assessments = assessmentsStore.useStore()

  const rows = applications
    .map((application) => {
      const assessment = assessments[`asm-${application.id}`] ?? null
      return { application, assessment, job: findJob(application.jobId), status: applicationStatus(application, assessment, now) }
    })
    .filter((row) => row.job)
    .sort((a, b) => b.application.appliedAt - a.application.appliedAt)

  return (
    <section aria-labelledby="submitted-heading" className="mt-6">
      <h2 id="submitted-heading" className="text-sm font-semibold tracking-wider text-muted uppercase">
        Submitted from Job Discovery <span className="font-normal">({rows.length})</span>
      </h2>

      {rows.length === 0 ? (
        <div className="mt-3 flex flex-wrap items-center gap-3 rounded-xl border border-dashed border-line bg-white p-4 text-sm text-muted">
          <Send size={18} className="text-primary" aria-hidden="true" />
          <span className="flex-1">Jobs you apply to from a job’s details page show up here with their assessment and status.</span>
          <Link to="/jobs" className="rounded font-medium text-primary hover:underline focus-visible:outline-2 focus-visible:outline-primary">
            Browse jobs
          </Link>
        </div>
      ) : (
        <ul className="mt-3 space-y-3">
          {rows.map(({ application, assessment, job, status }) => (
            <li
              key={application.id}
              className="flex flex-col gap-4 rounded-xl border border-line bg-white p-4 shadow-[0_1px_2px_rgba(16,25,46,0.04)] sm:flex-row sm:items-center sm:p-5"
            >
              <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-4">
                <CompanyLogo initials={job.companyInitials} className="h-11 w-11 text-sm" />
                <div className="min-w-0">
                  <Link
                    to={`/jobs/${job.id}`}
                    className="block truncate rounded font-semibold text-navy hover:text-primary focus-visible:outline-2 focus-visible:outline-primary"
                  >
                    {job.title}
                  </Link>
                  <p className="truncate text-sm text-muted">
                    {job.company} · Applied {formatDate(application.appliedAt)}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                <LifecycleBadge status={status} />
                {assessment && ASSESSMENT_ACTIONS[status] && (
                  <Link
                    to={`/assessments/${assessment.id}`}
                    className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-3 text-sm font-medium text-white hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  >
                    <ClipboardList size={15} aria-hidden="true" />
                    {ASSESSMENT_ACTIONS[status]}
                  </Link>
                )}
                <Link
                  to={`/applications/${application.id}`}
                  className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-line bg-white px-3 text-sm font-medium text-navy hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-primary"
                >
                  View application
                  <ArrowRight size={15} aria-hidden="true" />
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
