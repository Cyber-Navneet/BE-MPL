import { useId, useState } from 'react'
import { SquareCheckBig } from 'lucide-react'
import Modal from '../dashboard/Modal.jsx'
import DialogButtons from './DialogButtons.jsx'
import Field from './Field.jsx'
import { formatInr, todayInputValue } from '../../utils/candidateUtils.js'

function validate({ salary, joiningDate }) {
  const errors = {}
  const amount = Number(salary)
  if (!salary) errors.salary = 'Enter the annual salary.'
  else if (!Number.isFinite(amount) || amount <= 0) errors.salary = 'Enter a salary greater than zero.'
  if (!joiningDate) errors.joiningDate = 'Choose a joining date.'
  else if (joiningDate < todayInputValue()) errors.joiningDate = 'The joining date cannot be in the past.'
  return errors
}

// Records a demo offer (INR, annual). Nothing is sent to the candidate.
export default function OfferDialog({ candidate, onSend, onClose }) {
  const formId = useId()
  const [values, setValues] = useState({ salary: '', joiningDate: '', notes: '' })
  const [errors, setErrors] = useState({})

  const set = (field) => (event) => setValues((prev) => ({ ...prev, [field]: event.target.value }))
  const amount = Number(values.salary)

  const handleSubmit = (event) => {
    event.preventDefault()
    const nextErrors = validate(values)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length === 0) onSend({ salary: amount, joiningDate: values.joiningDate, notes: values.notes.trim() })
  }

  return (
    <Modal
      title="Send offer"
      subtitle={`${candidate.name} · ${candidate.role}`}
      onClose={onClose}
      footer={<DialogButtons onCancel={onClose} confirmLabel="Send offer" confirmIcon={SquareCheckBig} tone="success" form={formId} />}
    >
      <form id={formId} onSubmit={handleSubmit} noValidate className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Candidate" value={candidate.name} readOnly />
          <Field label="Role" value={candidate.role} readOnly />
          <div>
            <Field
              label="Annual salary (INR, ₹)"
              type="number"
              min="1"
              step="1000"
              inputMode="numeric"
              placeholder="e.g. 1500000"
              value={values.salary}
              onChange={set('salary')}
              error={errors.salary}
            />
            {amount > 0 && !errors.salary && <p className="mt-1.5 text-xs text-home-muted">{formatInr(amount)} per year</p>}
          </div>
          <Field
            label="Joining date"
            type="date"
            min={todayInputValue()}
            value={values.joiningDate}
            onChange={set('joiningDate')}
            error={errors.joiningDate}
          />
        </div>
        <Field label="Notes" optional multiline value={values.notes} onChange={set('notes')} placeholder="Benefits, location, etc." />
        <p className="rounded-lg bg-amber-50 px-3 py-2.5 text-xs text-amber-800">
          Demo action: this records an offer in this browser only. No real offer is sent to the candidate.
        </p>
      </form>
    </Modal>
  )
}
