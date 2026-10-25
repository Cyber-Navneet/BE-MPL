import { CircleCheck, CircleX, ExternalLink, Info } from 'lucide-react'
import Modal from '../dashboard/Modal.jsx'
import Button from '../Button.jsx'
import { formatSalary } from '../../utils/jobMetrics.js'
import { formatClock, formatLongDate } from '../../utils/recruiterDashboardMetrics.js'

// Details for one interview. Recruiters can mark a started interview completed or cancel one that is
// not finished; both are demo state changes saved in this browser.
export default function InterviewDetailsDialog({ interview, state, onClose, onComplete, onCancel }) {
  const { job, application } = interview
  const open = state === 'Scheduled' || state === 'In progress' || state === 'Awaiting update'
  const canComplete = state === 'In progress' || state === 'Awaiting update'
  const rows = [
    ['Candidate', `${interview.candidateName} (${interview.candidateEmail})`],
    ['Application ID', interview.applicationId],
    ['Application stage', application.stage],
    ['Job', `${job.title} · ${job.requisitionId}`],
    ['Company', job.company?.name],
    ['Interviewer', interview.interviewerName],
    ['Round', interview.round],
    ['Interview type', interview.type],
    ['Date', formatLongDate(interview.start)],
    ['Time', `${formatClock(interview.start)} to ${formatClock(interview.end)}`],
    ['Status', state],
    ['Location', `${job.location} · ${job.employmentType} · ${job.workMode}`],
    ['Salary', formatSalary(job) ?? 'Not disclosed'],
  ]

  return (
    <Modal
      title={`Interview with ${interview.candidateName}`}
      subtitle={job.title}
      onClose={onClose}
      footer={
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
          {open && (
            <Button variant="outline" size="sm" onClick={onCancel} className="text-danger hover:bg-red-50">
              <CircleX size={16} aria-hidden="true" /> Cancel interview
            </Button>
          )}
          {canComplete && (
            <Button size="sm" onClick={onComplete}>
              <CircleCheck size={16} aria-hidden="true" /> Mark as completed
            </Button>
          )}
        </div>
      }
    >
      {open && interview.type === 'Video' && (
        <div className="mb-5 flex gap-3 rounded-xl border border-home-border bg-pale p-4 text-sm text-body">
          <Info size={18} className="mt-0.5 shrink-0 text-primary" aria-hidden="true" />
          {interview.meetingUrl ? (
            <a href={interview.meetingUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-medium text-primary hover:underline">
              Open meeting link <ExternalLink size={14} aria-hidden="true" />
            </a>
          ) : (
            <p>This is a demo interview, so no video meeting link is attached. A real meeting link would open from here.</p>
          )}
        </div>
      )}
      <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-[9.5rem_1fr]">
        {rows.map(([label, value]) => (
          <div key={label} className="contents">
            <dt className="text-sm text-muted">{label}</dt>
            <dd className="text-sm font-medium break-words text-navy">{value}</dd>
          </div>
        ))}
      </dl>
    </Modal>
  )
}
