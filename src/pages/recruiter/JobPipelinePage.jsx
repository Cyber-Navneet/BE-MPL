import { useMemo, useState } from 'react'
import { Link, useOutletContext, useParams, useSearchParams } from 'react-router-dom'
import { ArrowLeft, Users } from 'lucide-react'
import SearchInput from '../../components/dashboard/SearchInput.jsx'
import SelectField from '../../components/jobs/SelectField.jsx'
import CandidateDetailDialog from '../../components/recruiter/CandidateDetailDialog.jsx'
import CandidateStageFunnel from '../../components/recruiter/CandidateStageFunnel.jsx'
import JobStatusBadge from '../../components/recruiter/JobStatusBadge.jsx'
import { APPLICANT_STAGES } from '../../data/recruiterJobs.js'
import { useRecruiterJobs } from '../../hooks/useRecruiterJobs.js'
import { verificationStatus } from '../../utils/jobMetrics.js'
import { setApplicantStage } from '../../utils/recruiterJobStorage.js'
import { formatDate } from '../../utils/formatTime.js'
import { cn } from '../../utils/cn.js'

const toneClasses = {
  success: 'bg-emerald-50 text-emerald-700',
  warning: 'bg-amber-50 text-amber-800',
  danger: 'bg-red-50 text-red-700',
}

const score = (value) => (value == null ? <span className="text-muted">—</span> : `${value}%`)

// Applicants for one job, with search, a stage filter and a detail dialog to move candidates between stages.
export default function JobPipelinePage() {
  const { jobId } = useParams()
  const { notify } = useOutletContext()
  const [searchParams, setSearchParams] = useSearchParams()
  const { jobs, applicantsByJob } = useRecruiterJobs()
  const [now] = useState(Date.now)
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState(null)

  const job = jobs.find((item) => item.id === jobId)
  const applicants = useMemo(
    () => [...(applicantsByJob.get(jobId) ?? [])].sort((a, b) => b.appliedAt - a.appliedAt),
    [applicantsByJob, jobId],
  )
  const stageParam = searchParams.get('stage')
  const stage = APPLICANT_STAGES.includes(stageParam) ? stageParam : 'all'

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return applicants.filter(
      (app) =>
        (stage === 'all' || app.stage === stage) &&
        (!needle || app.name.toLowerCase().includes(needle) || app.email.toLowerCase().includes(needle)),
    )
  }, [applicants, stage, query])

  if (!job || job.status === 'Draft') {
    return (
      <div className="mx-auto max-w-xl rounded-2xl border border-line bg-white p-8 text-center">
        <h1 className="text-xl font-semibold text-navy">{job ? 'Drafts have no pipeline' : 'Job not found'}</h1>
        <p className="mt-2 text-sm text-muted">{job ? 'Publish this job to start receiving applicants.' : 'This job may have been deleted.'}</p>
        <Link to="/recruiter/jobs" className="mt-5 inline-flex font-medium text-primary hover:underline">
          Back to My Jobs
        </Link>
      </div>
    )
  }

  const selected = applicants.find((app) => app.id === selectedId)
  const stageOptions = [
    { value: 'all', label: `All stages (${applicants.length})` },
    ...APPLICANT_STAGES.map((value) => ({ value, label: `${value} (${applicants.filter((app) => app.stage === value).length})` })),
  ]

  const changeStage = (applicant, nextStage) => {
    setApplicantStage(applicant.id, nextStage)
    setSelectedId(null)
    notify(`${applicant.name} moved to ${nextStage}.`, 'success')
  }

  return (
    <div className="mx-auto max-w-[1280px] space-y-6">
      <Link to="/recruiter/jobs" className="inline-flex items-center gap-1.5 rounded text-sm font-medium text-primary hover:underline focus-visible:outline-2 focus-visible:outline-primary">
        <ArrowLeft size={16} aria-hidden="true" /> Back to My Jobs
      </Link>

      <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-navy sm:text-3xl">{job.title} — Pipeline</h1>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-body">
            <span className="rounded-full bg-segment px-3 py-1 font-medium">{job.requisitionId}</span>
            <JobStatusBadge status={job.status} />
            <span className="flex items-center gap-1.5">
              <Users size={16} aria-hidden="true" /> {applicants.length} {applicants.length === 1 ? 'applicant' : 'applicants'}
            </span>
          </div>
        </div>
        <Link to={`/recruiter/jobs/${job.id}`} className="inline-flex h-10 items-center rounded-lg border border-line bg-white px-4 text-sm font-medium text-navy hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-primary">
          View job posting
        </Link>
      </header>

      <section className="rounded-2xl border border-line bg-white p-4 sm:p-6">
        <CandidateStageFunnel applicants={applicants} now={now} />
      </section>

      <section aria-label="Applicants" className="rounded-2xl border border-line bg-white">
        <div className="flex flex-col gap-3 border-b border-line p-4 sm:flex-row sm:items-center sm:p-5">
          <SearchInput label="Search applicants" placeholder="Search by name or email..." value={query} onChange={setQuery} className="min-w-0 flex-1" />
          <SelectField
            label="Filter by stage"
            value={stage}
            onChange={(value) => setSearchParams(value === 'all' ? {} : { stage: value }, { replace: true })}
            options={stageOptions}
            className="sm:w-64"
            selectClassName="h-10 text-sm"
          />
        </div>

        {visible.length === 0 ? (
          <p className="px-6 py-12 text-center text-sm text-muted">
            {applicants.length ? 'No applicants match your search or stage filter.' : 'No applicants yet.'}
          </p>
        ) : (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-left text-sm">
                <thead className="bg-canvas text-xs tracking-wide text-muted uppercase">
                  <tr>
                    <th scope="col" className="px-5 py-3 font-semibold">Candidate</th>
                    <th scope="col" className="px-3 py-3 font-semibold">Applied</th>
                    <th scope="col" className="px-3 py-3 font-semibold">Resume</th>
                    <th scope="col" className="px-3 py-3 font-semibold">ATS</th>
                    <th scope="col" className="px-3 py-3 font-semibold">Assessment</th>
                    <th scope="col" className="px-3 py-3 font-semibold">Stage</th>
                    <th scope="col" className="px-3 py-3 font-semibold">Verification</th>
                    <th scope="col" className="px-5 py-3"><span className="sr-only">Actions</span></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {visible.map((app) => {
                    const verification = verificationStatus(app, job)
                    return (
                      <tr key={app.id} className="hover:bg-slate-50/60">
                        <td className="px-5 py-3">
                          <p className="font-medium text-navy">{app.name}</p>
                          <p className="text-xs text-muted">{app.email}</p>
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap text-body">{formatDate(app.appliedAt)}</td>
                        <td className="px-3 py-3 text-body">{app.resumeStatus}</td>
                        <td className="px-3 py-3 text-navy">{score(app.atsScore)}</td>
                        <td className="px-3 py-3 text-navy">{score(app.assessmentScore)}</td>
                        <td className="px-3 py-3 whitespace-nowrap text-navy">{app.stage}</td>
                        <td className="px-3 py-3">
                          <span className={cn('inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap', toneClasses[verification.tone])}>
                            {verification.label}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-right">
                          <button
                            type="button"
                            onClick={() => setSelectedId(app.id)}
                            className="rounded-md px-2 py-1 font-medium text-primary hover:bg-pale focus-visible:outline-2 focus-visible:outline-primary"
                          >
                            View<span className="sr-only"> {app.name}</span>
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            <ul className="divide-y divide-line md:hidden">
              {visible.map((app) => {
                const verification = verificationStatus(app, job)
                return (
                  <li key={app.id}>
                    <button type="button" onClick={() => setSelectedId(app.id)} className="w-full p-4 text-left hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-primary">
                      <span className="flex items-start justify-between gap-3">
                        <span className="min-w-0">
                          <span className="block font-medium text-navy">{app.name}</span>
                          <span className="block truncate text-xs text-muted">{app.email}</span>
                        </span>
                        <span className="shrink-0 rounded-full bg-selected px-2.5 py-0.5 text-xs font-medium text-primary">{app.stage}</span>
                      </span>
                      <span className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-body">
                        <span>Applied {formatDate(app.appliedAt)}</span>
                        <span>ATS {app.atsScore != null ? `${app.atsScore}%` : '—'}</span>
                        <span>Test {app.assessmentScore != null ? `${app.assessmentScore}%` : '—'}</span>
                        <span className={cn('rounded-full px-2 font-medium', toneClasses[verification.tone])}>{verification.label}</span>
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </>
        )}
      </section>

      {selected && <CandidateDetailDialog applicant={selected} job={job} onClose={() => setSelectedId(null)} onStageChange={changeStage} />}
    </div>
  )
}
