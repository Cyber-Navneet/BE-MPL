import { Link } from 'react-router-dom'
import { ArrowRight, Building2, Clock, PencilLine, ShieldCheck, Users } from 'lucide-react'
import CandidateStageFunnel from './CandidateStageFunnel.jsx'
import JobActionsMenu from './JobActionsMenu.jsx'
import JobStatusBadge from './JobStatusBadge.jsx'
import { departmentIcon } from './departmentIcon.js'
import { formatSalary, gatewaySummary, jobAgeLabel } from '../../utils/jobMetrics.js'

const secondaryButton =
  'inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-selected px-4 text-[15px] font-medium text-navy hover:bg-[#d2e5ff] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:px-5'

export default function JobCard({ job, applicants, now, onAction }) {
  const Icon = departmentIcon(job.department)
  const salary = formatSalary(job)
  const gateway = gatewaySummary(job)
  const isDraft = job.status === 'Draft'
  const workModeLocation = [job.workMode, job.location].filter(Boolean).join(' • ')

  return (
    <article aria-labelledby={`${job.id}-title`} className="rounded-2xl border border-line bg-white p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <span className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-selected text-primary sm:flex">
          <Icon size={26} aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <h3 id={`${job.id}-title`} className="text-xl font-semibold tracking-tight text-navy sm:text-2xl">
            {job.title || 'Untitled job'}
          </h3>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-segment px-3 py-1 text-sm font-medium text-body">{job.requisitionId}</span>
            <JobStatusBadge status={job.status} />
          </div>
          <ul className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-sm text-body sm:text-[15px]">
            <li className="flex items-center gap-1.5">
              <Clock size={16} aria-hidden="true" /> {jobAgeLabel(job, now)}
            </li>
            {!isDraft && (
              <li className="flex items-center gap-1.5 before:mr-1.5 before:text-muted before:content-['•']">
                <Users size={16} className="text-primary" aria-hidden="true" />
                <span className="font-semibold text-navy">
                  {applicants.length} total {applicants.length === 1 ? 'applicant' : 'applicants'}
                </span>
              </li>
            )}
            {job.department && (
              <li className="flex items-center gap-1.5 before:mr-1.5 before:text-muted before:content-['•']">
                <Building2 size={16} aria-hidden="true" /> {job.department} Dept
              </li>
            )}
          </ul>
        </div>
        <div className="flex items-center gap-2 sm:self-center">
          {isDraft ? (
            <Link to={`/recruiter/jobs/${job.id}/edit`} className={secondaryButton}>
              <PencilLine size={17} aria-hidden="true" /> Continue editing
            </Link>
          ) : (
            <Link to={`/recruiter/jobs/${job.id}/pipeline`} className={secondaryButton}>
              View pipeline <ArrowRight size={17} aria-hidden="true" />
            </Link>
          )}
          <JobActionsMenu job={job} onAction={onAction} />
        </div>
      </div>

      <dl className="mt-6 grid gap-4 rounded-xl bg-selected/70 p-4 sm:grid-cols-2 sm:p-5 lg:grid-cols-[1fr_1fr_2fr]">
        <div>
          <dt className="text-sm text-body">Compensation Range</dt>
          <dd className="mt-1 font-semibold text-navy">{salary ?? <span className="font-normal text-muted">Not set</span>}</dd>
        </div>
        <div>
          <dt className="text-sm text-body">Work Model &amp; Location</dt>
          <dd className="mt-1 font-medium text-navy">{workModeLocation || <span className="font-normal text-muted">Not set</span>}</dd>
        </div>
        <div className="sm:col-span-2 lg:col-span-1">
          <dt className="text-sm text-body">Required Skills &amp; Strict Proof</dt>
          <dd className="mt-1.5 flex flex-wrap items-center gap-2">
            {job.requiredSkills.map((skill) => (
              <span key={skill} className="rounded-md bg-white px-2.5 py-1 text-sm text-navy">
                {skill}
              </span>
            ))}
            {!job.requiredSkills.length && <span className="text-sm text-muted">No skills added</span>}
            {gateway && (
              <span className="flex items-center gap-1.5 rounded-md bg-primary/10 px-2.5 py-1 text-sm font-semibold text-navy">
                <ShieldCheck size={15} className="text-primary" aria-hidden="true" />
                {gateway}
              </span>
            )}
          </dd>
        </div>
      </dl>

      {isDraft ? (
        <p className="mt-5 text-sm text-muted">Drafts are not visible to candidates. Publish this job to start receiving applications.</p>
      ) : (
        <div className="mt-6">
          <CandidateStageFunnel applicants={applicants} now={now} />
        </div>
      )}
    </article>
  )
}
