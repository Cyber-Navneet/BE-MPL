import { useRef, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { Bell, CalendarClock, Download, Lock, RotateCcw, ShieldCheck, UserRound, Users } from 'lucide-react'
import SectionCard from '../../components/recruiterForms/SectionCard.jsx'
import SaveBar from '../../components/recruiterForms/SaveBar.jsx'
import SelectInput from '../../components/recruiterForms/SelectInput.jsx'
import ToggleRow from '../../components/recruiterForms/ToggleRow.jsx'
import ChipGroup from '../../components/recruiterForms/ChipGroup.jsx'
import Field from '../../components/recruiter/Field.jsx'
import DialogButtons from '../../components/recruiter/DialogButtons.jsx'
import Modal from '../../components/dashboard/Modal.jsx'
import PasswordForm from '../../components/recruiterSettings/PasswordForm.jsx'
import TeamSection from '../../components/recruiterSettings/TeamSection.jsx'
import {
  DIGEST_OPTIONS,
  INTERVIEW_DURATIONS,
  INTERVIEW_TYPES,
  NOTIFICATION_TOGGLES,
  PRIVACY_TOGGLES,
  REMINDER_OPTIONS,
  RETENTION_OPTIONS,
  SETTINGS_TABS,
  TIME_ZONES,
  createDefaultSettings,
  createDefaultTeam,
} from '../../data/recruiterSettings.js'
import { useAuth } from '../../hooks/useAuth.js'
import { useStoredState } from '../../hooks/useStoredState.js'
import { downloadJson, validateAccount } from '../../utils/recruiterFormUtils.js'
import { cn } from '../../utils/cn.js'

const isObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value)

// Fills sections or fields missing from older saved data with the defaults.
function mergeSettings(defaults, saved) {
  return Object.fromEntries(Object.entries(defaults).map(([section, values]) => [section, { ...values, ...saved?.[section] }]))
}

// Recruiter Settings at /recruiter/settings. Everything is demo data saved in this browser only.
export default function RecruiterSettings() {
  const { notify } = useOutletContext()
  const { user } = useAuth()
  const defaults = createDefaultSettings(user)
  const [stored, setStored] = useStoredState('talentforge.recruiter.settings', () => defaults, isObject)
  const [team, setTeam] = useStoredState('talentforge.recruiter.team', createDefaultTeam, Array.isArray)
  const saved = mergeSettings(defaults, stored)
  const [draft, setDraft] = useState(saved)
  const [errors, setErrors] = useState({})
  const [tab, setTab] = useState('account')
  const [confirmReset, setConfirmReset] = useState(false)
  const tabRefs = useRef({})

  const isDirty = JSON.stringify(draft) !== JSON.stringify(saved)
  const set = (section, field) => (value) => {
    setDraft((prev) => ({ ...prev, [section]: { ...prev[section], [field]: value } }))
    if (section === 'account' && errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
  }
  const account = (field) => ({
    value: draft.account[field],
    onChange: (event) => set('account', field)(event.target.value),
    error: errors[field],
  })

  const save = () => {
    const nextErrors = validateAccount(draft.account)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      setTab('account')
      notify('Fix the highlighted account details before saving.')
      requestAnimationFrame(() => document.querySelector('[aria-invalid="true"]')?.focus())
      return
    }
    const clean = { ...draft, account: Object.fromEntries(Object.entries(draft.account).map(([key, value]) => [key, value.trim()])) }
    setStored(clean)
    setDraft(clean)
    notify('Settings saved.', 'success')
  }

  const discard = () => {
    setDraft(saved)
    setErrors({})
  }

  const restoreDefaults = () => {
    const fresh = createDefaultSettings(user)
    setStored(fresh)
    setDraft(fresh)
    setTeam(createDefaultTeam())
    setErrors({})
    setConfirmReset(false)
    notify('Settings and team restored to the demo defaults.', 'success')
  }

  // Arrow keys move between tabs (WAI-ARIA tabs pattern).
  const handleTabKey = (event, index) => {
    const step = { ArrowRight: 1, ArrowLeft: -1 }[event.key]
    if (!step) return
    event.preventDefault()
    const next = SETTINGS_TABS[(index + step + SETTINGS_TABS.length) % SETTINGS_TABS.length]
    setTab(next.id)
    tabRefs.current[next.id]?.focus()
  }

  const bothChannelsOff = !draft.notifications.email && !draft.notifications.inApp

  return (
    <div className="mx-auto max-w-[1180px]">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-heading sm:text-[32px]">Settings</h1>
        <p className="mt-2 text-[15px] text-secondary sm:text-lg">
          Manage your account, notifications, hiring defaults, team access and data preferences.
        </p>
      </header>

      <div role="tablist" aria-label="Settings sections" className="mt-6 flex gap-1 overflow-x-auto rounded-2xl border border-home-border bg-white p-1.5">
        {SETTINGS_TABS.map((item, index) => (
          <button
            key={item.id}
            ref={(element) => {
              tabRefs.current[item.id] = element
            }}
            type="button"
            role="tab"
            id={`tab-${item.id}`}
            aria-selected={tab === item.id}
            aria-controls={`panel-${item.id}`}
            tabIndex={tab === item.id ? 0 : -1}
            onClick={() => setTab(item.id)}
            onKeyDown={(event) => handleTabKey(event, index)}
            className={cn(
              'h-10 shrink-0 rounded-xl px-4 text-sm font-medium whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-home-blue',
              tab === item.id ? 'bg-home-blue text-white' : 'text-home-ink hover:bg-slate-100',
            )}
          >
            {item.label}
            {item.id === 'team' && <span className="ml-1.5 opacity-80">({team.length})</span>}
          </button>
        ))}
      </div>

      <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`} className="mt-6 space-y-6">
        {tab === 'account' && (
          <>
            <SectionCard icon={UserRound} title="Profile" description="Shown to candidates in messages and interview invites.">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Full name" autoComplete="name" {...account('name')} />
                <Field label="Job title" {...account('jobTitle')} />
                <Field label="Work email" type="email" autoComplete="email" {...account('email')} />
                <Field label="Phone" optional type="tel" autoComplete="tel" {...account('phone')} />
                <SelectInput label="Time zone" value={draft.account.timeZone} onChange={set('account', 'timeZone')} options={TIME_ZONES} />
              </div>
            </SectionCard>
            <SectionCard icon={Lock} title="Password" description="Demo only: no password is stored or sent anywhere.">
              <PasswordForm notify={notify} />
            </SectionCard>
          </>
        )}

        {tab === 'notifications' && (
          <SectionCard icon={Bell} title="Notifications" description="Choose what you hear about and how.">
            <div className="divide-y divide-home-border">
              {NOTIFICATION_TOGGLES.map(({ key, label, description }) => (
                <ToggleRow key={key} label={label} description={description} checked={draft.notifications[key]} onChange={set('notifications', key)} />
              ))}
            </div>
            <h3 className="mt-6 text-sm font-semibold text-home-ink">Delivery</h3>
            <div className="divide-y divide-home-border">
              <ToggleRow label="Email" description="Sent to your work email." checked={draft.notifications.email} onChange={set('notifications', 'email')} />
              <ToggleRow label="In-app" description="Shown in the bell menu." checked={draft.notifications.inApp} onChange={set('notifications', 'inApp')} />
            </div>
            {bothChannelsOff && (
              <p role="status" className="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">
                Both channels are off, so you will not receive any notifications.
              </p>
            )}
            <SelectInput
              label="How often"
              value={draft.notifications.digest}
              onChange={set('notifications', 'digest')}
              options={DIGEST_OPTIONS}
              className="mt-4 sm:w-64"
            />
          </SectionCard>
        )}

        {tab === 'hiring' && (
          <SectionCard icon={CalendarClock} title="Hiring preferences" description="Defaults used when you schedule interviews and review assessments.">
            <div className="grid gap-5 sm:grid-cols-2">
              <SelectInput
                label="Default interview length"
                value={draft.hiring.interviewDuration}
                onChange={set('hiring', 'interviewDuration')}
                options={INTERVIEW_DURATIONS.map((minutes) => ({ value: minutes, label: `${minutes} minutes` }))}
              />
              <SelectInput label="Interview reminder" value={draft.hiring.reminderHours} onChange={set('hiring', 'reminderHours')} options={REMINDER_OPTIONS} />
              <div className="sm:col-span-2">
                <ChipGroup label="Default interview type" options={INTERVIEW_TYPES} value={draft.hiring.interviewType} onChange={set('hiring', 'interviewType')} single />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="passing-score" className="flex justify-between text-sm font-medium text-home-ink">
                  Default assessment passing score <span className="font-semibold">{draft.hiring.passingScore}%</span>
                </label>
                <input
                  id="passing-score"
                  type="range"
                  min="40"
                  max="95"
                  step="5"
                  value={draft.hiring.passingScore}
                  onChange={(event) => set('hiring', 'passingScore')(Number(event.target.value))}
                  className="mt-2 w-full cursor-pointer accent-home-blue"
                />
              </div>
            </div>
            <div className="mt-4 border-t border-home-border">
              <ToggleRow
                label="Auto-reject low matches"
                description="Move applicants below the match score to Rejected automatically."
                checked={draft.hiring.autoReject}
                onChange={set('hiring', 'autoReject')}
              />
              <label htmlFor="auto-reject" className={cn('flex justify-between text-sm font-medium', draft.hiring.autoReject ? 'text-home-ink' : 'text-home-muted')}>
                Reject below <span className="font-semibold">{draft.hiring.autoRejectBelow}% match</span>
              </label>
              <input
                id="auto-reject"
                type="range"
                min="10"
                max="80"
                step="5"
                disabled={!draft.hiring.autoReject}
                value={draft.hiring.autoRejectBelow}
                onChange={(event) => set('hiring', 'autoRejectBelow')(Number(event.target.value))}
                className="mt-2 w-full cursor-pointer accent-home-blue disabled:cursor-not-allowed disabled:opacity-40"
              />
            </div>
          </SectionCard>
        )}

        {tab === 'team' && (
          <SectionCard icon={Users} title="Team members" description="People who can access your jobs and candidates. Role changes apply immediately.">
            <TeamSection team={team} onChange={setTeam} currentEmail={user.email} notify={notify} />
          </SectionCard>
        )}

        {tab === 'privacy' && (
          <>
            <SectionCard icon={ShieldCheck} title="Privacy & candidate data" description="How long you keep candidate data and what candidates see.">
              <SelectInput
                label="Keep candidate data for"
                value={draft.privacy.retentionMonths}
                onChange={set('privacy', 'retentionMonths')}
                options={RETENTION_OPTIONS}
                className="sm:w-64"
              />
              <div className="mt-2 divide-y divide-home-border">
                {PRIVACY_TOGGLES.map(({ key, label, description }) => (
                  <ToggleRow key={key} label={label} description={description} checked={draft.privacy[key]} onChange={set('privacy', key)} />
                ))}
              </div>
            </SectionCard>
            <SectionCard icon={Download} title="Your data" description="Export or reset the demo settings saved in this browser.">
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => {
                    downloadJson({ settings: saved, team }, 'talentforge-recruiter-settings.json')
                    notify('Settings exported as a JSON file.', 'success')
                  }}
                  className="inline-flex h-10 items-center gap-2 rounded-lg border border-home-border bg-white px-4 text-sm font-medium text-home-ink hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-home-blue"
                >
                  <Download size={16} aria-hidden="true" /> Export settings
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmReset(true)}
                  className="inline-flex h-10 items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 text-sm font-medium text-red-700 hover:bg-red-100 focus-visible:outline-2 focus-visible:outline-home-blue"
                >
                  <RotateCcw size={16} aria-hidden="true" /> Restore defaults
                </button>
              </div>
            </SectionCard>
          </>
        )}
      </div>

      {isDirty && <SaveBar onDiscard={discard} onSave={save} />}

      {confirmReset && (
        <Modal
          title="Restore default settings?"
          onClose={() => setConfirmReset(false)}
          size="sm"
          footer={
            <DialogButtons onCancel={() => setConfirmReset(false)} confirmLabel="Restore defaults" confirmIcon={RotateCcw} tone="danger" onConfirm={restoreDefaults} />
          }
        >
          <p className="text-sm leading-relaxed text-body">
            Your account details, notification and hiring preferences, privacy options and team list will go back to the demo
            defaults. This cannot be undone.
          </p>
        </Modal>
      )}
    </div>
  )
}
