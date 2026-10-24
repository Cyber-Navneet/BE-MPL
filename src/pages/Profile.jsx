import { useId, useMemo, useState } from 'react'
import { Link, useOutletContext } from 'react-router-dom'
import { FileText, Plus, Sparkles, Upload, X } from 'lucide-react'
import SelectField from '../components/jobs/SelectField.jsx'
import { JOBS } from '../data/jobs.js'
import { SKILLS } from '../data/skills.js'
import { DEMO_STUDENTS, EXPERIENCE_LEVELS, WORKPLACE_TYPES } from '../data/users.js'
import { analyzeMatch } from '../utils/matchScore.js'
import { initialsOf, profileStore } from '../utils/profileStore.js'
import { cn } from '../utils/cn.js'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_PATTERN = /^\+?[\d\s-]{10,16}$/
const SKILL_SUGGESTIONS = [...new Set([...SKILLS.map((skill) => skill.name), 'Testing Library', 'Accessibility'])].sort()
const MAX_SKILLS = 25

const inputClasses =
  'mt-1.5 h-11 w-full rounded-lg border bg-white px-3 text-[15px] text-navy placeholder:text-placeholder focus-visible:outline-2 focus-visible:outline-primary/30'

// The form edits strings; these convert to and from the stored profile.
const toDraft = (profile) => ({
  ...profile,
  graduationYear: String(profile.graduationYear),
  locationsText: profile.preferences.locations.join(', '),
})

function fromDraft(draft) {
  const { locationsText, ...rest } = draft
  return {
    ...rest,
    name: draft.name.trim(),
    email: draft.email.trim(),
    phone: draft.phone.trim(),
    location: draft.location.trim(),
    university: draft.university.trim(),
    degree: draft.degree.trim(),
    graduationYear: Number(draft.graduationYear),
    avatarInitials: initialsOf(draft.name),
    preferences: {
      workplaceTypes: draft.preferences.workplaceTypes,
      locations: locationsText
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
    },
  }
}

// JSON with object keys sorted, so two profiles compare equal regardless of key order.
const canonicalJson = (value) =>
  JSON.stringify(value, (_key, item) =>
    item && typeof item === 'object' && !Array.isArray(item)
      ? Object.fromEntries(Object.entries(item).sort(([a], [b]) => a.localeCompare(b)))
      : item,
  )

function validate(draft) {
  const errors = {}
  if (draft.name.trim().length < 2) errors.name = 'Enter your full name.'
  if (!EMAIL_PATTERN.test(draft.email.trim())) errors.email = 'Enter a valid email address.'
  if (draft.phone.trim() && !PHONE_PATTERN.test(draft.phone.trim())) errors.phone = 'Enter a valid phone number, e.g. +91 98765 43210.'
  if (!draft.university.trim()) errors.university = 'Enter your college or university.'
  if (!draft.degree.trim()) errors.degree = 'Enter your degree.'
  const year = Number(draft.graduationYear)
  if (!Number.isInteger(year) || year < 2000 || year > 2035) errors.graduationYear = 'Enter a year between 2000 and 2035.'
  if (draft.skills.length === 0) errors.skills = 'Add at least one skill.'
  return errors
}

function Field({ label, error, children, hint }) {
  const id = useId()
  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium text-navy">
        {label}
      </label>
      {children({ id, describedBy: error ? `${id}-error` : undefined, invalid: Boolean(error) })}
      {hint && !error && <p className="mt-1 text-xs text-muted">{hint}</p>}
      {error && (
        <p id={`${id}-error`} className="mt-1 text-xs text-danger">
          {error}
        </p>
      )}
    </div>
  )
}

function TextField({ label, value, onChange, error, type = 'text', hint, ...props }) {
  return (
    <Field label={label} error={error} hint={hint}>
      {({ id, describedBy, invalid }) => (
        <input
          id={id}
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          aria-invalid={invalid}
          aria-describedby={describedBy}
          className={cn(inputClasses, invalid ? 'border-danger' : 'border-line')}
          {...props}
        />
      )}
    </Field>
  )
}

function Card({ title, children }) {
  return (
    <section className="rounded-xl border border-line bg-white p-5 shadow-[0_1px_2px_rgba(16,25,46,0.04)] sm:p-6">
      <h2 className="text-base font-semibold text-navy">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  )
}

export default function Profile() {
  const { notify } = useOutletContext()
  const profile = profileStore.useStore()
  const [draft, setDraft] = useState(() => toDraft(profile))
  const [errors, setErrors] = useState({})
  const [skillInput, setSkillInput] = useState('')

  const dirty = canonicalJson(fromDraft(draft)) !== canonicalJson(profile)
  const set = (field) => (value) => setDraft((prev) => ({ ...prev, [field]: value }))

  // Live preview: how the current (unsaved) skills would score against the best-matching jobs.
  const preview = useMemo(() => {
    const candidate = fromDraft(draft)
    return JOBS.map((job) => ({ job, score: analyzeMatch(candidate, job).score }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 4)
  }, [draft])

  const addSkill = (raw) => {
    const name = raw.trim()
    if (!name) return
    const known = SKILL_SUGGESTIONS.find((skill) => skill.toLowerCase() === name.toLowerCase()) ?? name
    setDraft((prev) =>
      prev.skills.some((skill) => skill.toLowerCase() === known.toLowerCase()) || prev.skills.length >= MAX_SKILLS
        ? prev
        : { ...prev, skills: [...prev.skills, known] },
    )
    setSkillInput('')
  }

  const toggleWorkplace = (type) =>
    setDraft((prev) => {
      const current = prev.preferences.workplaceTypes
      const workplaceTypes = current.includes(type) ? current.filter((item) => item !== type) : [...current, type]
      return { ...prev, preferences: { ...prev.preferences, workplaceTypes } }
    })

  const handleSave = (event) => {
    event.preventDefault()
    const nextErrors = validate(draft)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      notify('Please fix the highlighted fields.', 'info')
      return
    }
    const saved = fromDraft(draft)
    profileStore.write(saved)
    setDraft(toDraft(saved))
    notify('Profile saved. Your AI match scores are updated.', 'success')
  }

  const loadDemo = (id) => {
    const student = DEMO_STUDENTS.find((item) => item.id === id)
    if (!student) return
    profileStore.write(student)
    setDraft(toDraft(student))
    setErrors({})
    notify(`Loaded the demo profile for ${student.name}.`, 'info')
  }

  return (
    <div className="mx-auto max-w-[1180px]">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-navy sm:text-[28px]">My Profile</h1>
          <p className="mt-1.5 text-[15px] text-muted">Your details, skills and resume. Skills drive your AI match scores.</p>
        </div>
        <SelectField
          label="Load a demo profile"
          value={profile.id}
          onChange={loadDemo}
          options={DEMO_STUDENTS.map((student) => ({ value: student.id, label: `Demo: ${student.name}` }))}
          className="w-full sm:w-64"
          selectClassName="h-10 text-sm"
        />
      </div>

      <form onSubmit={handleSave} noValidate className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_317px] lg:items-start">
        <div className="min-w-0 space-y-6">
          <Card title="Personal details">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <TextField label="Full name" value={draft.name} onChange={set('name')} error={errors.name} autoComplete="name" />
              <TextField label="Email" type="email" value={draft.email} onChange={set('email')} error={errors.email} autoComplete="email" />
              <TextField label="Phone" type="tel" value={draft.phone} onChange={set('phone')} error={errors.phone} autoComplete="tel" />
              <TextField label="Location" value={draft.location} onChange={set('location')} autoComplete="address-level2" />
            </div>
          </Card>

          <Card title="Education & experience">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <TextField label="College / university" value={draft.university} onChange={set('university')} error={errors.university} />
              <TextField label="Degree" value={draft.degree} onChange={set('degree')} error={errors.degree} />
              <TextField
                label="Graduation year"
                type="number"
                inputMode="numeric"
                min="2000"
                max="2035"
                value={draft.graduationYear}
                onChange={set('graduationYear')}
                error={errors.graduationYear}
              />
              <Field label="Experience level">
                {({ id }) => (
                  <select
                    id={id}
                    value={draft.experienceLevel}
                    onChange={(event) => set('experienceLevel')(event.target.value)}
                    className={cn(inputClasses, 'border-line')}
                  >
                    {EXPERIENCE_LEVELS.map((level) => (
                      <option key={level}>{level}</option>
                    ))}
                  </select>
                )}
              </Field>
            </div>
          </Card>

          <Card title="Skills">
            {draft.skills.length > 0 && (
              <ul aria-label="Your skills" className="flex flex-wrap gap-2">
                {draft.skills.map((skill) => (
                  <li key={skill} className="inline-flex items-center gap-1 rounded-full bg-pale py-1 pr-1 pl-3 text-sm text-primary">
                    {skill}
                    <button
                      type="button"
                      onClick={() => setDraft((prev) => ({ ...prev, skills: prev.skills.filter((item) => item !== skill) }))}
                      aria-label={`Remove ${skill}`}
                      className="flex h-6 w-6 items-center justify-center rounded-full hover:bg-selected focus-visible:outline-2 focus-visible:outline-primary"
                    >
                      <X size={13} aria-hidden="true" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-3 flex gap-2">
              <label htmlFor="skill-input" className="sr-only">
                Add a skill
              </label>
              <input
                id="skill-input"
                list="skill-suggestions"
                value={skillInput}
                onChange={(event) => setSkillInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault()
                    addSkill(skillInput)
                  }
                }}
                placeholder="Add a skill, e.g. Next.js"
                aria-invalid={Boolean(errors.skills)}
                className={cn(inputClasses, 'mt-0 min-w-0 flex-1', errors.skills ? 'border-danger' : 'border-line')}
              />
              <datalist id="skill-suggestions">
                {SKILL_SUGGESTIONS.map((skill) => (
                  <option key={skill} value={skill} />
                ))}
              </datalist>
              <button
                type="button"
                onClick={() => addSkill(skillInput)}
                disabled={!skillInput.trim()}
                className="inline-flex h-11 shrink-0 items-center gap-1.5 rounded-lg border border-line bg-white px-4 text-sm font-medium text-navy hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Plus size={16} aria-hidden="true" /> Add
              </button>
            </div>
            {errors.skills && <p className="mt-1 text-xs text-danger">{errors.skills}</p>}
          </Card>

          <Card title="Resume">
            {draft.resume.uploaded && draft.resume.fileName ? (
              <div className="flex flex-wrap items-center gap-3 rounded-lg border border-line p-3">
                <FileText size={20} className="text-primary" aria-hidden="true" />
                <span className="min-w-0 flex-1 truncate text-sm font-medium text-navy">{draft.resume.fileName}</span>
                <button
                  type="button"
                  onClick={() => set('resume')({ fileName: '', uploaded: false })}
                  className="rounded text-sm font-medium text-danger hover:underline focus-visible:outline-2 focus-visible:outline-primary"
                >
                  Remove
                </button>
              </div>
            ) : (
              <p className="text-sm text-muted">No resume yet. You need one to apply for jobs.</p>
            )}
            <label className="mt-3 inline-flex h-10 cursor-pointer items-center gap-2 rounded-lg border border-line bg-white px-4 text-sm font-medium text-navy hover:bg-slate-50 has-focus-visible:outline-2 has-focus-visible:outline-primary">
              <Upload size={16} aria-hidden="true" />
              {draft.resume.uploaded ? 'Replace resume' : 'Upload resume'}
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                className="sr-only"
                onChange={(event) => {
                  const file = event.target.files?.[0]
                  if (file) set('resume')({ fileName: file.name, uploaded: true })
                  event.target.value = ''
                }}
              />
            </label>
            <p className="mt-2 text-xs text-muted">Demo: only the file name is kept, in this browser. The file itself isn’t uploaded anywhere.</p>
          </Card>

          <Card title="Job preferences">
            <fieldset>
              <legend className="text-sm font-medium text-navy">Preferred workplace</legend>
              <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2">
                {WORKPLACE_TYPES.map((type) => (
                  <label key={type} className="flex cursor-pointer items-center gap-2 text-sm text-navy">
                    <input
                      type="checkbox"
                      checked={draft.preferences.workplaceTypes.includes(type)}
                      onChange={() => toggleWorkplace(type)}
                      className="h-4 w-4 cursor-pointer accent-primary"
                    />
                    {type}
                  </label>
                ))}
              </div>
            </fieldset>
            <div className="mt-4">
              <TextField
                label="Preferred locations"
                value={draft.locationsText}
                onChange={set('locationsText')}
                hint="Separate cities with commas, e.g. Bengaluru, India, Pune, India"
              />
            </div>
          </Card>
        </div>

        <aside className="space-y-6 lg:sticky lg:top-24">
          <section className="rounded-xl border border-line bg-white p-5 text-center shadow-[0_1px_2px_rgba(16,25,46,0.04)]">
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-navy text-lg font-semibold text-white">
              {initialsOf(draft.name) || '?'}
            </span>
            <p className="mt-3 font-semibold text-navy">{draft.name || 'Your name'}</p>
            <p className="text-sm text-muted">{draft.degree}</p>
            <div className="mt-5 flex flex-col gap-2">
              <button
                type="submit"
                disabled={!dirty}
                className="h-11 rounded-lg bg-primary text-sm font-medium text-white hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50"
              >
                {dirty ? 'Save changes' : 'All changes saved'}
              </button>
              {dirty && (
                <button
                  type="button"
                  onClick={() => {
                    setDraft(toDraft(profile))
                    setErrors({})
                  }}
                  className="h-11 rounded-lg border border-line bg-white text-sm font-medium text-navy hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-primary"
                >
                  Discard changes
                </button>
              )}
            </div>
          </section>

          <section aria-labelledby="match-preview-title" className="rounded-xl border border-line bg-white p-5 shadow-[0_1px_2px_rgba(16,25,46,0.04)]">
            <h2 id="match-preview-title" className="flex items-center gap-2 text-base font-semibold text-navy">
              <Sparkles size={17} className="text-primary" aria-hidden="true" /> AI match preview
            </h2>
            <p className="mt-1 text-xs text-muted">Updates as you edit. Save to apply it across the app.</p>
            <ul className="mt-4 space-y-3" aria-live="polite">
              {preview.map(({ job, score }) => (
                <li key={job.id} className="flex items-center gap-3">
                  <Link to={`/jobs/${job.id}`} className="min-w-0 flex-1 rounded text-sm hover:text-primary focus-visible:outline-2 focus-visible:outline-primary">
                    <span className="block truncate font-medium text-navy">{job.title}</span>
                    <span className="block truncate text-xs text-muted">{job.company}</span>
                  </Link>
                  <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">{score}%</span>
                </li>
              ))}
            </ul>
          </section>
        </aside>
      </form>
    </div>
  )
}
