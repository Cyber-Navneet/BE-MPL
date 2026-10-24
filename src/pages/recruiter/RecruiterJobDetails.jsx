import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, PencilLine } from 'lucide-react'
import JobPostingPreview from '../../components/recruiter/JobPostingPreview.jsx'
import JobStatusBadge from '../../components/recruiter/JobStatusBadge.jsx'
import { useRecruiterJobs } from '../../hooks/useRecruiterJobs.js'
import { formatBytes } from '../../utils/jobValidation.js'

// Read-only view of a job posting (View Job), with links to edit it and to its pipeline.
export default function RecruiterJobDetails() {
  const { jobId } = useParams()
  const { jobs, applicantsByJob } = useRecruiterJobs()
  const [now] = useState(Date.now)
  const job = jobs.find((item) => item.id === jobId)

  if (!job) {
    return (
      <div className="mx-auto max-w-xl rounded-2xl border border-line bg-white p-8 text-center">
        <h1 className="text-xl font-semibold text-navy">Job not found</h1>
        <p className="mt-2 text-sm text-muted">This job may have been deleted.</p>
        <Link to="/recruiter/jobs" className="mt-5 inline-flex font-medium text-primary hover:underline">
          Back to My Jobs
        </Link>
      </div>
    )
  }

  const applicantCount = (applicantsByJob.get(job.id) ?? []).length
  const privateDocument = job.company?.document && !job.company.shareDocument ? job.company.document : null

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link to="/recruiter/jobs" className="inline-flex items-center gap-1.5 rounded text-sm font-medium text-primary hover:underline focus-visible:outline-2 focus-visible:outline-primary">
        <ArrowLeft size={16} aria-hidden="true" /> Back to My Jobs
      </Link>
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-navy sm:text-3xl">{job.title}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-body">
            <JobStatusBadge status={job.status} />
            {job.status !== 'Draft' && <span>{applicantCount} {applicantCount === 1 ? 'applicant' : 'applicants'}</span>}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            to={`/recruiter/jobs/${job.id}/edit`}
            className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-line bg-white px-4 text-sm font-medium text-navy hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-primary"
          >
            <PencilLine size={16} aria-hidden="true" /> {job.status === 'Draft' ? 'Continue editing' : 'Edit job'}
          </Link>
          {job.status !== 'Draft' && (
            <Link
              to={`/recruiter/jobs/${job.id}/pipeline`}
              className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-primary px-4 text-sm font-medium text-white hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              View pipeline <ArrowRight size={16} aria-hidden="true" />
            </Link>
          )}
        </div>
      </header>

      <JobPostingPreview job={job} now={now} heading="Job posting" badge={job.requisitionId} />

      {privateDocument && (
        <p className="rounded-xl border border-line bg-white p-4 text-sm text-body">
          Private company document on file: <span className="font-medium text-navy">{privateDocument.name}</span> ({formatBytes(privateDocument.size)}). It is not
          shown on the posting.
        </p>
      )}
    </div>
  )
}
