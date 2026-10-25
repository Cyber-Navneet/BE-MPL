import { useState } from 'react'
import { Eye, EyeOff, KeyRound } from 'lucide-react'
import Field from '../recruiter/Field.jsx'
import { MIN_PASSWORD_LENGTH, validatePasswordChange } from '../../utils/recruiterFormUtils.js'

const EMPTY = { current: '', next: '', confirm: '' }

// Demo password change: validates the input, then clears it. Passwords are never stored or sent anywhere.
export default function PasswordForm({ notify }) {
  const [values, setValues] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [visible, setVisible] = useState(false)

  const set = (field) => (event) => setValues((prev) => ({ ...prev, [field]: event.target.value }))
  const type = visible ? 'text' : 'password'

  const handleSubmit = (event) => {
    event.preventDefault()
    const nextErrors = validatePasswordChange(values)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return
    setValues(EMPTY)
    notify('Password change simulated. Demo accounts keep their demo password; nothing was stored.', 'success')
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Current password" type={type} autoComplete="current-password" value={values.current} onChange={set('current')} error={errors.current} />
        <Field label="New password" type={type} autoComplete="new-password" value={values.next} onChange={set('next')} error={errors.next} />
        <Field label="Confirm new password" type={type} autoComplete="new-password" value={values.confirm} onChange={set('confirm')} error={errors.confirm} />
      </div>
      <p className="text-xs text-home-muted">
        At least {MIN_PASSWORD_LENGTH} characters, with at least one letter and one number.
      </p>
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => setVisible((value) => !value)}
          aria-pressed={visible}
          className="inline-flex h-10 items-center gap-2 rounded-lg border border-home-border bg-white px-4 text-sm font-medium text-home-ink hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-home-blue"
        >
          {visible ? <EyeOff size={16} aria-hidden="true" /> : <Eye size={16} aria-hidden="true" />}
          {visible ? 'Hide passwords' : 'Show passwords'}
        </button>
        <button
          type="submit"
          className="inline-flex h-10 items-center gap-2 rounded-lg bg-home-blue px-4 text-sm font-medium text-white hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-home-blue"
        >
          <KeyRound size={16} aria-hidden="true" /> Update password
        </button>
      </div>
    </form>
  )
}
