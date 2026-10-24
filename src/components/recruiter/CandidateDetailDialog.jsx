import { useState } from 'react'
import { CircleCheck, CircleX } from 'lucide-react'
import Modal from '../dashboard/Modal.jsx'
import { APPLICANT_STAGES } from '../../data/recruiterJobs.js'
import { proofLabel, verificationStatus } from '../../utils/jobMetrics.js'
import { formatDateTime } from '../../utils/formatTime.js'
import { cn } from '../../utils/cn.js'

const toneClasses = {
  success: 'bg-emerald-50 text-emerald-700',
  warning: 'bg-amber-50 text-amber-800',
  danger: 'bg-red-50 text-red-700',
}

// One candidate's details for a job, with a control to move them to another recruitment stage.
export default function CandidateDetailDialog({ applicant, job, onClose, onStageChange }) {
  const [stage, setStage] = useState(applicant.stage)
  const verification = verificationStatus(applicant, job)

  const rows = [
    ['Email', applicant.email],
    ['Applied', formatDateTime(applicant.appliedAt)],
    ['Resume', applicant.resumeStatus],
    ['ATS score', applicant.atsScore != null ? `${applicant.atsScore}%${job.minimumATSScore != null ? ` (minimum ${job.minimumATSScore}%)` : ''}` : 'Not available'],
    [
      'Assessment score',
      applicant.assessmentScore != null
        ? `${applicant.assessmentScore}%${job.minimumAssessmentScore != null ? ` (minimum ${job.minimumAssessmentScore}%)` : ''}`
        : 'Not completed',
    ],
    ['Current stage', applicant.stage],
    ['Stage updated', formatDateTime(applicant.stageUpdatedAt)],
  ]

  return (
    <Modal
      title={applicant.name}
      subtitle={`${job.title} · ${job.requisitionId}`}
      onClose={onClose}
      footer={
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <label className="min-w-0 flex-1 text-sm font-medium text-navy">
            Move to stage
            <select
              value={stage}
              onChange={(event) => setStage(event.target.value)}
              className="mt-1.5 h-11 w-full rounded-lg border border-line bg-white px-3 text-[15px] text-navy focus-visible:border-primary focus-visible:outline-2 focus-visible:outline-primary/30"
            >
              {APPLICANT_STAGES.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            disabled={stage === applicant.stage}
            onClick={() => onStageChange(applicant, stage)}
            className="h-11 rounded-lg bg-primary px-5 text-sm font-medium text-white hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50"
          >
            Update stage
          </button>
        </div>
      }
    >
      <span className={cn('inline-flex rounded-full px-3 py-1 text-sm font-medium', toneClasses[verification.tone])}>{verification.label}</span>
      <dl className="mt-4 grid gap-x-4 gap-y-3 sm:grid-cols-[10rem_1fr]">
        {rows.map(([label, value]) => (
          <div key={label} className="contents">
            <dt className="text-sm text-muted">{label}</dt>
            <dd className="text-sm font-medium break-all text-navy">{value}</dd>
          </div>
        ))}
      </dl>
      <h3 className="mt-6 text-sm font-semibold text-navy">Mandatory proof</h3>
      {job.mandatoryProofs.length ? (
        <ul className="mt-2 space-y-1.5">
          {job.mandatoryProofs.map((key) => {
            const submitted = applicant.proofs?.[key]
            return (
              <li key={key} className="flex items-center gap-2 text-sm text-body">
                {submitted ? (
                  <CircleCheck size={16} className="text-emerald-600" aria-hidden="true" />
                ) : (
                  <CircleX size={16} className="text-red-600" aria-hidden="true" />
                )}
                {proofLabel(key)} — {submitted ? 'submitted' : 'missing'}
              </li>
            )
          })}
        </ul>
      ) : (
        <p className="mt-2 text-sm text-muted">This job has no mandatory proof.</p>
      )}
    </Modal>
  )
}
