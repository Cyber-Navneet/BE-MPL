import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import SelectField from '../components/jobs/SelectField.jsx'
import { CURRENT_USER } from '../data/users.js'
import { DEFAULT_SETTINGS, profileStore, settingsStore } from '../utils/profileStore.js'
import { cn } from '../utils/cn.js'

const FREQUENCY_OPTIONS = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
]

const TOGGLES = [
  { key: 'applicationUpdates', label: 'Application updates', description: 'When an application moves to a new stage.' },
  { key: 'assessmentReminders', label: 'Assessment reminders', description: 'Before an assessment’s start window closes.' },
  { key: 'jobAlerts', label: 'New job alerts', description: 'Jobs that match your skills and preferences.' },
  {
    key: 'profileVisibleToRecruiters',
    label: 'Visible to recruiters',
    description: 'Let recruiters find your profile in search.',
  },
]

function Toggle({ label, description, checked, onChange }) {
  return (
    <label className="flex cursor-pointer items-start justify-between gap-4 py-4">
      <span>
        <span className="block text-[15px] font-medium text-navy">{label}</span>
        <span className="mt-0.5 block text-sm text-muted">{description}</span>
      </span>
      <input type="checkbox" role="switch" checked={checked} onChange={onChange} className="peer sr-only" />
      <span
        aria-hidden="true"
        className={cn(
          'relative mt-0.5 h-6 w-11 shrink-0 rounded-full transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-primary',
          checked ? 'bg-primary' : 'bg-slate-300',
        )}
      >
        <span className={cn('absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform', checked && 'translate-x-5')} />
      </span>
    </label>
  )
}

export default function Settings() {
  const { notify } = useOutletContext()
  const settings = settingsStore.useStore()
  const [draft, setDraft] = useState(settings)
  const [confirmReset, setConfirmReset] = useState(false)

  const dirty = Object.keys(DEFAULT_SETTINGS).some((key) => draft[key] !== settings[key])
  const set = (key, value) => setDraft((prev) => ({ ...prev, [key]: value }))

  const save = (event) => {
    event.preventDefault()
    settingsStore.write(draft)
    notify('Settings saved.', 'success')
  }

  const resetAll = () => {
    settingsStore.write(DEFAULT_SETTINGS)
    profileStore.write(CURRENT_USER)
    setDraft(DEFAULT_SETTINGS)
    setConfirmReset(false)
    notify('Profile and settings restored to the demo defaults.', 'info')
  }

  return (
    <div className="mx-auto max-w-[760px]">
      <h1 className="text-2xl font-bold tracking-tight text-navy sm:text-[28px]">Settings</h1>
      <p className="mt-1.5 text-[15px] text-muted">Notification and privacy preferences. Saved in this browser only.</p>

      <form onSubmit={save} className="mt-6 space-y-6">
        <section className="rounded-xl border border-line bg-white px-5 shadow-[0_1px_2px_rgba(16,25,46,0.04)] sm:px-6">
          <h2 className="pt-5 text-base font-semibold text-navy">Notifications & privacy</h2>
          <div className="divide-y divide-line">
            {TOGGLES.map(({ key, label, description }) => (
              <Toggle key={key} label={label} description={description} checked={draft[key]} onChange={() => set(key, !draft[key])} />
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-line bg-white p-5 shadow-[0_1px_2px_rgba(16,25,46,0.04)] sm:p-6">
          <h2 className="text-base font-semibold text-navy">Job alert frequency</h2>
          <p className="mt-0.5 text-sm text-muted">How often to bundle new matching jobs into one alert.</p>
          <SelectField
            label="Job alert frequency"
            value={draft.jobAlertFrequency}
            onChange={(value) => set('jobAlertFrequency', value)}
            options={FREQUENCY_OPTIONS}
            className={cn('mt-3 w-full sm:w-56', !draft.jobAlerts && 'opacity-50')}
          />
          {!draft.jobAlerts && <p className="mt-2 text-xs text-muted">Turn on new job alerts to use this.</p>}
        </section>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          {dirty && (
            <button
              type="button"
              onClick={() => setDraft(settings)}
              className="h-11 rounded-lg border border-line bg-white px-5 text-sm font-medium text-navy hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-primary"
            >
              Discard
            </button>
          )}
          <button
            type="submit"
            disabled={!dirty}
            className="h-11 rounded-lg bg-primary px-5 text-sm font-medium text-white hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50"
          >
            {dirty ? 'Save settings' : 'All changes saved'}
          </button>
        </div>
      </form>

      <section className="mt-8 rounded-xl border border-red-200 bg-white p-5 sm:p-6">
        <h2 className="text-base font-semibold text-navy">Restore demo defaults</h2>
        <p className="mt-0.5 text-sm text-muted">Resets your profile and these settings. Applications and assessments are kept.</p>
        {confirmReset ? (
          <div className="mt-4 flex flex-wrap items-center gap-3" role="group" aria-label="Confirm reset">
            <span className="text-sm font-medium text-navy">Reset profile and settings?</span>
            <button
              type="button"
              onClick={resetAll}
              className="h-10 rounded-lg bg-danger px-4 text-sm font-medium text-white hover:bg-red-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-danger"
            >
              Yes, reset
            </button>
            <button
              type="button"
              onClick={() => setConfirmReset(false)}
              className="h-10 rounded-lg border border-line bg-white px-4 text-sm font-medium text-navy hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-primary"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirmReset(true)}
            className="mt-4 h-10 rounded-lg border border-red-200 bg-white px-4 text-sm font-medium text-danger hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-danger"
          >
            Restore defaults
          </button>
        )}
      </section>
    </div>
  )
}
