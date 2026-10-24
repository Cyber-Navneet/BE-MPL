import { useState } from 'react'
import { CircleX } from 'lucide-react'
import Modal from '../dashboard/Modal.jsx'
import DialogButtons from './DialogButtons.jsx'
import Field from './Field.jsx'

// Confirms a rejection. The candidate can be restored later from the "Rejected" stage filter.
export default function RejectDialog({ candidate, onConfirm, onClose }) {
  const [reason, setReason] = useState('')

  return (
    <Modal
      title="Reject this candidate?"
      subtitle={`${candidate.name} · ${candidate.role}`}
      onClose={onClose}
      size="sm"
      footer={
        <DialogButtons
          onCancel={onClose}
          confirmLabel="Reject candidate"
          confirmIcon={CircleX}
          tone="danger"
          onConfirm={() => onConfirm(reason.trim())}
        />
      }
    >
      <p className="text-sm leading-relaxed text-body">
        <span className="font-semibold text-home-ink">{candidate.name}</span> will be removed from the active pipeline. You can
        review or restore rejected candidates by choosing <span className="font-medium text-home-ink">Rejected</span> in the stage
        filter.
      </p>
      <Field
        label="Reason"
        optional
        multiline
        className="mt-4"
        value={reason}
        onChange={(event) => setReason(event.target.value)}
        placeholder="e.g. Not enough backend experience for this role"
      />
      <p className="mt-4 text-xs text-home-muted">Demo only: no message is sent to the candidate.</p>
    </Modal>
  )
}
