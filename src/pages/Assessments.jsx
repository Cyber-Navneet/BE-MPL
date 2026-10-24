import { Link, useOutletContext } from 'react-router-dom'
import { ListChecks, Timer } from 'lucide-react'
import { CompanyLogo } from '../components/jobs/JobBadges.jsx'
import { PassBadge, ScoreBadge, StatusBadge } from '../components/assessment/AssessmentBadges.jsx'
import NoApplications from '../components/applications/NoApplications.jsx'
import { useAssessmentSync } from '../hooks/useAssessmentSync.js'
import { assessmentStatus, assessmentsStore, findJob } from '../utils/applicationStore.js'
import { formatClock, formatDateTime } from '../utils/formatTime.js'

const ACTION_LABELS = { not_started: 'Start', in_progress: 'Resume', submitted: 'View results', expired: 'View details' }

function AssessmentRow({ assessment, job, status, now }) {
  return (
    <article className="relative flex flex-col gap-4 rounded-2xl border border-line bg-white p-4 shadow-[0_1px_2px_rgba(16,25,46,0.04)] transition-[border-color,box-shadow] hover:border-primary/30 has-focus-visible:border-primary sm:flex-row sm:items-center sm:p-5">
      <div className="flex min-w-0 flex-1 gap-3 sm:gap-4">
        <CompanyLogo initials={job.companyInitials} className="h-11 w-11 rounded-xl" />
        <div className="min-w-0">
          <h3 className="text-base font-semibold text-navy">
            <Link to={`/assessments/${assessment.id}`} className="outline-none after:absolute after:inset-0 after:rounded-2xl after:content-['']">
              {assessment.title}
            </Link>
          </h3>
          <p className="text-sm text-muted">{job.company}</p>
          <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-body">
            <span className="flex items-center gap-1.5">
              <ListChecks size={14} aria-hidden="true" /> {assessment.questionCount} questions ({assessment.shortAnswerCount} written)
            </span>
            <span className="flex items-center gap-1.5">
              <Timer size={14} aria-hidden="true" /> {assessment.durationMinutes} min
            </span>
            <span>{assessment.skills.join(' · ')}</span>
          </p>
          <p className="mt-1 text-xs text-muted">
            {status === 'not_started' && `Start by ${formatDateTime(assessment.startBy)}`}
            {status === 'in_progress' && `${formatClock(assessment.deadline - now)} left · submits automatically at ${formatDateTime(assessment.deadline)}`}
            {status === 'submitted' && `Submitted ${formatDateTime(assessment.submittedAt)}`}
            {status === 'expired' && `Start window closed ${formatDateTime(assessment.startBy)}`}
          </p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2 sm:justify-end">
        {assessment.result && (
          <>
            <PassBadge passed={assessment.result.passed} />
            <ScoreBadge percentage={assessment.result.percentage} provisional={assessment.result.provisional} />
          </>
        )}
        <StatusBadge status={status} />
        <span className="hidden text-sm font-semibold text-primary sm:inline" aria-hidden="true">
          {ACTION_LABELS[status]} →
        </span>
      </div>
    </article>
  )
}

function Group({ title, entries, now }) {
  if (entries.length === 0) return null
  return (
    <section aria-label={title} className="mt-8 first:mt-6">
      <h2 className="text-sm font-semibold tracking-wider text-muted uppercase">
        {title} <span className="font-normal">({entries.length})</span>
      </h2>
      <ul className="mt-3 space-y-3">
        {entries.map(({ assessment, job, status }) => (
          <li key={assessment.id}>
            <AssessmentRow assessment={assessment} job={job} status={status} now={now} />
          </li>
        ))}
      </ul>
    </section>
  )
}

export default function Assessments() {
  const { notify } = useOutletContext()
  const now = useAssessmentSync()
  const assessments = assessmentsStore.useStore()

  const entries = Object.values(assessments)
    .map((assessment) => ({ assessment, job: findJob(assessment.jobId), status: assessmentStatus(assessment, now) }))
    .filter((entry) => entry.job)
  const toDo = entries
    .filter((entry) => entry.status === 'in_progress' || entry.status === 'not_started')
    .sort((a, b) => (a.status === 'in_progress' ? -1 : 0) - (b.status === 'in_progress' ? -1 : 0) || a.assessment.startBy - b.assessment.startBy)
  const completed = entries.filter((entry) => entry.status === 'submitted').sort((a, b) => b.assessment.submittedAt - a.assessment.submittedAt)
  const expired = entries.filter((entry) => entry.status === 'expired')

  return (
    <div className="mx-auto max-w-[1180px]">
      <h1 className="text-2xl font-bold tracking-tight text-navy sm:text-[28px]">Assessments</h1>
      <p className="mt-1.5 text-[15px] text-muted">
        Skill-based assessments for the jobs you applied to, built from each job’s requirements and your skills.
      </p>

      {entries.length === 0 ? (
        <div className="mt-6">
          <NoApplications message="Each job you apply to gets its own skills assessment. Apply to a job to get started." notify={notify} />
        </div>
      ) : (
        <>
          <Group title="To do" entries={toDo} now={now} />
          <Group title="Completed" entries={completed} now={now} />
          <Group title="Expired" entries={expired} now={now} />
        </>
      )}
    </div>
  )
}
