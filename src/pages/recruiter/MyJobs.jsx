import { useMemo, useState } from 'react'
import { useLocation, useNavigate, useOutletContext } from 'react-router-dom'
import { BriefcaseBusiness, CirclePlus, SearchX } from 'lucide-react'
import Button from '../../components/Button.jsx'
import ConfirmationDialog from '../../components/recruiter/ConfirmationDialog.jsx'
import JobCard from '../../components/recruiter/JobCard.jsx'
import JobSearchFilters from '../../components/recruiter/JobSearchFilters.jsx'
import JobStatCards from '../../components/recruiter/JobStatCards.jsx'
import { JOB_STATUSES } from '../../data/recruiterJobs.js'
import { useRecruiterJobs } from '../../hooks/useRecruiterJobs.js'
import { dashboardStats, matchesJobSearch } from '../../utils/jobMetrics.js'
import { deleteDraft, setJobStatus } from '../../utils/recruiterJobStorage.js'

const DEFAULT_STATUS = 'Open'
const EMPTY_COPY = {
  Open: 'No open jobs right now. Publish a job to start receiving applications.',
  Draft: 'No drafts. Use "Save as Draft" in the job form to keep work in progress here.',
  Paused: 'No paused jobs.',
  Closed: 'No closed jobs yet.',
  all: 'You have not created any jobs yet.',
}

// Recruiter "My Jobs": stats, search/filters and the job cards. All data is fictional demo data
// saved in this browser.
export default function MyJobs() {
  const { notify } = useOutletContext()
  const navigate = useNavigate()
  const location = useLocation()
  const { jobs, applicants, applicantsByJob } = useRecruiterJobs()
  const [now] = useState(Date.now)
  const [query, setQuery] = useState('')
  // After saving in the job form, open the tab the job landed in.
  const [status, setStatus] = useState(() => (JOB_STATUSES.includes(location.state?.status) ? location.state.status : DEFAULT_STATUS))
  const [confirm, setConfirm] = useState(null) // { type: 'close' | 'delete', job }

  const stats = useMemo(() => dashboardStats(jobs, applicants, now), [jobs, applicants, now])
  const searched = useMemo(() => jobs.filter((job) => matchesJobSearch(job, query)), [jobs, query])
  const counts = useMemo(
    () => Object.fromEntries(JOB_STATUSES.map((value) => [value, searched.filter((job) => job.status === value).length])),
    [searched],
  )
  const visible = status === 'all' ? searched : searched.filter((job) => job.status === status)
  const canReset = Boolean(query) || status !== DEFAULT_STATUS

  const resetFilters = () => {
    setQuery('')
    setStatus(DEFAULT_STATUS)
  }

  const handleAction = (action, job) => {
    switch (action) {
      case 'edit':
        navigate(`/recruiter/jobs/${job.id}/edit`)
        break
      case 'view':
        navigate(`/recruiter/jobs/${job.id}`)
        break
      case 'pause':
        if (setJobStatus(job.id, 'Paused')) notify(`${job.title} is paused. Candidates can no longer apply.`, 'success')
        break
      case 'resume':
        if (setJobStatus(job.id, 'Open')) notify(`${job.title} is open again.`, 'success')
        break
      case 'close':
      case 'delete':
        setConfirm({ type: action, job })
        break
      default:
    }
  }

  const confirmAction = () => {
    const { type, job } = confirm
    setConfirm(null)
    if (type === 'close' && setJobStatus(job.id, 'Closed')) notify(`${job.title} is closed and no longer accepts applications.`, 'success')
    if (type === 'delete' && deleteDraft(job.id)) notify(`Deleted the draft "${job.title}".`, 'success')
  }

  // Opens the pipeline of the job with the most candidates waiting for screening.
  const batchReview = () => {
    const pendingByJob = jobs
      .filter((job) => job.status === 'Open' || job.status === 'Paused')
      .map((job) => ({ job, pending: (applicantsByJob.get(job.id) ?? []).filter((app) => app.stage === 'Applied').length }))
      .sort((a, b) => b.pending - a.pending)
    if (pendingByJob[0]?.pending) navigate(`/recruiter/jobs/${pendingByJob[0].job.id}/pipeline?stage=Applied`)
  }

  return (
    <div className="mx-auto max-w-[1280px] space-y-6 sm:space-y-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-3xl">
          <h1 className="text-2xl font-bold tracking-tight text-navy sm:text-[32px]">Active Openings</h1>
          <p className="mt-2 text-[15px] text-body sm:text-lg">
            Create, publish, and track candidates across recruitment stages with automated verification checkpoints.
          </p>
        </div>
        <Button to="/recruiter/jobs/new" className="shrink-0 rounded-xl">
          Create New Job <CirclePlus size={20} aria-hidden="true" />
        </Button>
      </header>

      <JobStatCards stats={stats} onBatchReview={batchReview} />

      <JobSearchFilters
        query={query}
        onQueryChange={setQuery}
        status={status}
        onStatusChange={setStatus}
        counts={counts}
        resultCount={visible.length}
        canReset={canReset}
        onReset={resetFilters}
      />

      {visible.length ? (
        <div className="space-y-6">
          {visible.map((job) => (
            <JobCard key={job.id} job={job} applicants={applicantsByJob.get(job.id) ?? []} now={now} onAction={handleAction} />
          ))}
        </div>
      ) : (
        <section className="flex flex-col items-center rounded-2xl border border-dashed border-line bg-white px-6 py-14 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-selected text-primary">
            {query ? <SearchX size={22} aria-hidden="true" /> : <BriefcaseBusiness size={22} aria-hidden="true" />}
          </span>
          <h2 className="mt-4 text-lg font-semibold text-navy">{query ? 'No matching jobs' : 'Nothing here yet'}</h2>
          <p className="mt-1 max-w-md text-sm text-muted">
            {query ? `No jobs in this view match "${query.trim()}". Try another keyword or reset the filters.` : EMPTY_COPY[status]}
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            {canReset && (
              <Button variant="outline" size="sm" onClick={resetFilters}>
                Reset filters
              </Button>
            )}
            <Button to="/recruiter/jobs/new" size="sm">
              Create New Job
            </Button>
          </div>
        </section>
      )}

      {confirm?.type === 'close' && (
        <ConfirmationDialog
          title="Close this job?"
          message={
            <>
              <span className="font-semibold text-navy">{confirm.job.title}</span> will stop accepting applications. Existing
              candidates stay in the pipeline. A closed job cannot be reopened.
            </>
          }
          onCancel={() => setConfirm(null)}
          actions={[{ label: 'Close job', onClick: confirmAction, tone: 'danger' }]}
        />
      )}
      {confirm?.type === 'delete' && (
        <ConfirmationDialog
          title="Delete this draft?"
          message={
            <>
              The draft <span className="font-semibold text-navy">{confirm.job.title}</span> will be permanently removed. This
              cannot be undone.
            </>
          }
          onCancel={() => setConfirm(null)}
          actions={[{ label: 'Delete draft', onClick: confirmAction, tone: 'danger' }]}
        />
      )}
    </div>
  )
}
