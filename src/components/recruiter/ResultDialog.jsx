import Modal from '../dashboard/Modal.jsx'
import DialogButtons from './DialogButtons.jsx'
import DemoBadge from '../resume/DemoBadge.jsx'
import { SAMPLE_ANSWERS } from '../../data/candidates.js'
import { assessmentBreakdown, assessmentStatus } from '../../utils/candidateUtils.js'

export default function ResultDialog({ candidate, onClose }) {
  const score = candidate.assessmentScore
  const { sections, strengths, improvements } = assessmentBreakdown(score)

  return (
    <Modal
      title={`${candidate.name} — Assessment result`}
      subtitle={candidate.role}
      onClose={onClose}
      size="lg"
      footer={<DialogButtons cancelLabel="Close" onCancel={onClose} />}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-home-tint p-4">
        <div>
          <p className="text-sm text-home-muted">Overall score</p>
          <p className="text-4xl font-bold tracking-tight text-home-ink">{score}%</p>
        </div>
        <div className="text-right">
          <DemoBadge />
          <p className="mt-1.5 text-sm font-semibold text-home-ink">{assessmentStatus(score)}</p>
        </div>
      </div>

      <h3 className="mt-6 text-sm font-semibold text-home-ink">Section breakdown</h3>
      <ul className="mt-3 space-y-3">
        {sections.map((section) => (
          <li key={section.name}>
            <div className="flex justify-between text-sm">
              <span className="text-home-ink">{section.name}</span>
              <span className="font-semibold text-home-ink">{section.score}%</span>
            </div>
            <div
              role="progressbar"
              aria-label={`${section.name} score`}
              aria-valuenow={section.score}
              aria-valuemin={0}
              aria-valuemax={100}
              className="mt-1 h-1.5 overflow-hidden rounded-full bg-home-blue/10"
            >
              <div className="h-full rounded-full bg-home-blue" style={{ width: `${section.score}%` }} />
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-4">
          <h3 className="text-sm font-semibold text-emerald-800">Strengths</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-emerald-900">
            {strengths.map((section) => (
              <li key={section.name}>
                Strong {section.name.toLowerCase()} ({section.score}%)
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-4">
          <h3 className="text-sm font-semibold text-amber-800">Areas to improve</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-amber-900">
            {improvements.map((section) => (
              <li key={section.name}>
                Practise {section.name.toLowerCase()} ({section.score}%)
              </li>
            ))}
          </ul>
        </div>
      </div>

      <h3 className="mt-6 text-sm font-semibold text-home-ink">Sample answers</h3>
      <ol className="mt-3 space-y-3">
        {SAMPLE_ANSWERS.map((item, index) => (
          <li key={item.question} className="rounded-lg bg-home-bg p-3 text-sm">
            <p className="font-medium text-home-ink">
              {index + 1}. {item.question}
            </p>
            <p className="mt-1 text-body">{item.answer}</p>
          </li>
        ))}
      </ol>
    </Modal>
  )
}
