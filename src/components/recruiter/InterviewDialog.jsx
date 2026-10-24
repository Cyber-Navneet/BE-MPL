import { useId, useState } from 'react'
import { CalendarCheck } from 'lucide-react'
import Modal from '../dashboard/Modal.jsx'
import DialogButtons from './DialogButtons.jsx'
import Field from './Field.jsx'
import { INTERVIEW_TYPES } from '../../data/candidates.js'
import { todayInputValue } from '../../utils/candidateUtils.js'
import { cn } from '../../utils/cn.js'

const EMPTY = { date: '', time: '', type: 'Video', interviewer: '', notes: '' }

function validate(values) {
  const errors = {}
  if (!values.date) errors.date = 'Choose a date.'
  if (!values.time) errors.time = 'Choose a time.'
  if (values.date && values.time && new Date(`${values.date}T${values.time}`) <= new Date()) {
    errors.time = 'The interview must be in the future.'
  }
  if (!values.interviewer.trim()) errors.interviewer = 'Enter the interviewer’s name.'
  return errors
}

// Schedule a new interview, or edit the one already on the candidate (demo; no calendar invite is sent).
export default function InterviewDialog({ candidate, onSave, onClose }) {
  const formId = useId()
  const editing = Boolean(candidate.interview)
  const [values, setValues] = useState(() => ({ ...EMPTY, ...candidate.interview }))
  const [errors, setErrors] = useState({})

  const set = (field) => (event) => setValues((prev) => ({ ...prev, [field]: event.target.value }))

  const handleSubmit = (event) => {
    event.preventDefault()
    const nextErrors = validate(values)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length === 0) onSave({ ...values, interviewer: values.interviewer.trim(), notes: values.notes.trim() })
  }

  return (
    <Modal
      title={editing ? 'Edit interview' : 'Schedule interview'}
      subtitle={`${candidate.name} · ${candidate.role}`}
      onClose={onClose}
      footer={
        <DialogButtons onCancel={onClose} confirmLabel={editing ? 'Save changes' : 'Schedule interview'} confirmIcon={CalendarCheck} form={formId} />
      }
    >
      <form id={formId} onSubmit={handleSubmit} noValidate className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Candidate" value={candidate.name} readOnly />
          <Field label="Role" value={candidate.role} readOnly />
          <Field label="Date" type="date" min={todayInputValue()} value={values.date} onChange={set('date')} error={errors.date} />
          <Field label="Time" type="time" value={values.time} onChange={set('time')} error={errors.time} />
        </div>

        <fieldset>
          <legend className="text-sm font-medium text-home-ink">Interview type</legend>
          <div className="mt-1.5 flex flex-wrap gap-2">
            {INTERVIEW_TYPES.map((type) => (
              <label
                key={type}
                className={cn(
                  'flex h-10 cursor-pointer items-center gap-2 rounded-lg border px-3 text-sm has-focus-visible:outline-2 has-focus-visible:outline-home-blue',
                  values.type === type ? 'border-home-blue bg-home-tint text-home-ink' : 'border-home-border text-body hover:bg-slate-50',
                )}
              >
                <input
                  type="radio"
                  name={`${formId}-type`}
                  value={type}
                  checked={values.type === type}
                  onChange={set('type')}
                  className="h-4 w-4 accent-home-blue"
                />
                {type}
              </label>
            ))}
          </div>
        </fieldset>

        <Field label="Interviewer" value={values.interviewer} onChange={set('interviewer')} error={errors.interviewer} placeholder="e.g. Rahul Verma" />
        <Field label="Notes" optional multiline value={values.notes} onChange={set('notes')} placeholder="Topics to cover, links, etc." />

        <p className="rounded-lg bg-home-bg px-3 py-2.5 text-xs text-home-muted">
          Demo only: saved in this browser. No calendar invite or video link is created.
        </p>
      </form>
    </Modal>
  )
}
