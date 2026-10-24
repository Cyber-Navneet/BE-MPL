import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useOutletContext, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, CircleAlert, FilePlus2, FilePen, History, Info } from 'lucide-react'
import ConfirmationDialog from '../../components/recruiter/ConfirmationDialog.jsx'
import { Field, SelectInput, TextArea, TextInput } from '../../components/recruiter/FormControls.jsx'
import JobFileUpload from '../../components/recruiter/JobFileUpload.jsx'
import JobFormSection from '../../components/recruiter/JobFormSection.jsx'
import JobPostingPreview from '../../components/recruiter/JobPostingPreview.jsx'
import ListEditor from '../../components/recruiter/ListEditor.jsx'
import TagInput from '../../components/recruiter/TagInput.jsx'
import {
  ASSESSMENT_CATEGORIES,
  DEPARTMENTS,
  DIFFICULTY_LEVELS,
  EDUCATION_OPTIONS,
  EMPLOYMENT_TYPES,
  EXPERIENCE_LEVELS,
  LOCATION_SUGGESTIONS,
  MINIMUM_EXPERIENCE_OPTIONS,
  PROOF_OPTIONS,
  WORK_MODES,
} from '../../data/recruiterJobs.js'
import { SKILLS } from '../../data/skills.js'
import { useRecruiterJobs } from '../../hooks/useRecruiterJobs.js'
import { formatSalary } from '../../utils/jobMetrics.js'
import {
  ASSESSMENT_FILE_RULES,
  COMPANY_FILE_RULES,
  emptyJobForm,
  formToJob,
  jobToForm,
  stepOfField,
  todayInputValue,
  validateJobForm,
} from '../../utils/jobValidation.js'
import {
  clearFormDraft,
  formDraftKey,
  formDraftsStore,
  nextJobNumber,
  saveFormDraft,
  saveJob,
} from '../../utils/recruiterJobStorage.js'
import { formatDateTime } from '../../utils/formatTime.js'
import { cn } from '../../utils/cn.js'

const SKILL_SUGGESTIONS = SKILLS.map((skill) => skill.name)
const DESCRIPTION_LIMIT = 5000
const AUTOSAVE_DELAY_MS = 400

const STEPS = [
  { number: 1, label: 'Role & screening' },
  { number: 2, label: 'Description & company' },
]

const ASSESSMENT_TYPES = [
  {
    value: 'interactive',
    label: 'Interactive timed assessment',
    description: 'Candidates take a skill-based, timed question set in TalentForge after applying.',
  },
  {
    value: 'document',
    label: 'Assessment document',
    description: 'Share an uploaded brief or test paper. It is not converted into interactive questions.',
  },
  { value: 'none', label: 'No assessment', description: 'Screen candidates on resume and proof only.' },
]

const primaryButton =
  'inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#3A27D3] px-5 text-[15px] font-semibold text-white hover:bg-[#2F1FB3] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3A27D3] disabled:cursor-wait disabled:opacity-70'
const secondaryButton =
  'inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-line bg-white px-5 text-[15px] font-semibold text-navy hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-wait disabled:opacity-70'
const navButton =
  'inline-flex h-11 items-center gap-2 rounded-lg px-5 text-[15px] font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'

// Create (/recruiter/jobs/new) or edit (/recruiter/jobs/:jobId/edit) a job.
export default function JobEditor() {
  const { jobId } = useParams()
  const { jobs } = useRecruiterJobs()
  const existing = jobId ? jobs.find((job) => job.id === jobId) : null

  if (jobId && !existing) {
    return (
      <div className="mx-auto max-w-xl rounded-2xl border border-line bg-white p-8 text-center">
        <h1 className="text-xl font-semibold text-navy">Job not found</h1>
        <p className="mt-2 text-sm text-muted">This job may have been deleted.</p>
        <Link to="/recruiter/jobs" className="mt-5 inline-flex font-medium text-primary hover:underline">
          Back to My Jobs
        </Link>
      </div>
    )
  }
  // Keyed so switching between jobs starts from a fresh form.
  return <JobEditorForm key={jobId ?? 'new'} existing={existing} nextNumber={nextJobNumber(jobs)} />
}

function JobEditorForm({ existing, nextNumber }) {
  const { notify } = useOutletContext()
  const navigate = useNavigate()
  const draftKey = formDraftKey(existing?.id)
  const isPublished = existing && existing.status !== 'Draft'

  // The saved job (or a blank form) is the baseline; unsaved edits from an earlier visit are restored on top.
  const [initial] = useState(() => {
    const baseForm = existing ? jobToForm(existing) : emptyJobForm()
    const stored = formDraftsStore.read()[draftKey]
    const restored = stored?.form && typeof stored.form === 'object' ? { ...baseForm, ...stored.form } : null
    return { baseForm, baseline: JSON.stringify(baseForm), restored, restoredAt: restored ? stored.savedAt : null }
  })
  const [form, setForm] = useState(initial.restored ?? initial.baseForm)
  const [restoredAt, setRestoredAt] = useState(initial.restoredAt)
  const [step, setStep] = useState(1)
  const [attempt, setAttempt] = useState(null) // intent of the last failed save: 'draft' | 'publish' | 'save'
  const [focusRequest, setFocusRequest] = useState(null)
  const [confirmCancel, setConfirmCancel] = useState(false)
  const [now] = useState(Date.now)
  const submitting = useRef(false)
  const today = todayInputValue()

  const serialized = JSON.stringify(form)
  const dirty = serialized !== initial.baseline
  const errors = useMemo(
    () => (attempt ? validateJobForm(form, attempt, { status: existing?.status, today }) : {}),
    [attempt, form, existing?.status, today],
  )
  const errorKeys = Object.keys(errors)

  // Keep unsaved changes in storage so leaving the page (or a refresh) never loses work.
  useEffect(() => {
    const timer = setTimeout(() => {
      if (dirty) saveFormDraft(existing?.id, JSON.parse(serialized))
      else clearFormDraft(existing?.id)
    }, AUTOSAVE_DELAY_MS)
    return () => clearTimeout(timer)
  }, [serialized, dirty, existing?.id])

  // Moves focus to the first invalid field once its step is on screen.
  useEffect(() => {
    if (!focusRequest) return
    const container = document.querySelector(`[data-field="${focusRequest.key}"]`)
    const target = container?.querySelector('input:not([type="file"]):not([disabled]), select, textarea, button')
    container?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    target?.focus({ preventScroll: true })
  }, [focusRequest])

  const set = (key, value) => setForm((current) => ({ ...current, [key]: value }))
  const setAssessment = (key, value) => setForm((current) => ({ ...current, assessment: { ...current.assessment, [key]: value } }))
  const setCompany = (key, value) => setForm((current) => ({ ...current, company: { ...current.company, [key]: value } }))
  const bind = (key) => ({ value: form[key], onChange: (event) => set(key, event.target.value) })
  const err = (key) => errors[key]

  const previewJob = useMemo(
    () => ({
      ...formToJob(form),
      requisitionId: existing?.requisitionId ?? `REQ-${nextNumber}`,
      status: existing?.status ?? 'Draft',
      publishedAt: existing?.publishedAt ?? null,
      pausedAt: existing?.pausedAt ?? null,
      closedAt: existing?.closedAt ?? null,
    }),
    [form, existing, nextNumber],
  )

  const failValidation = (intent, found) => {
    setAttempt(intent)
    const firstKey = Object.keys(found)[0]
    setStep(stepOfField(firstKey))
    setFocusRequest({ key: firstKey, at: Date.now() })
    const count = Object.keys(found).length
    notify(`Please fix ${count} ${count === 1 ? 'field' : 'fields'} before saving.`)
  }

  const persist = (intent) => {
    if (submitting.current) return
    const found = validateJobForm(form, intent, { status: existing?.status, today })
    if (Object.keys(found).length) {
      failValidation(intent, found)
      return
    }
    submitting.current = true
    const status = intent === 'draft' ? 'Draft' : intent === 'publish' ? 'Open' : existing.status
    const saved = saveJob({ ...formToJob(form), id: existing?.id }, status)
    clearFormDraft(existing?.id)
    const messages = {
      draft: `Saved "${saved.title}" as a draft.`,
      publish: `Published "${saved.title}". It is now open for applications.`,
      save: `Saved changes to "${saved.title}".`,
    }
    notify(messages[intent], 'success')
    navigate('/recruiter/jobs', { state: { status } })
  }

  const discard = () => {
    clearFormDraft(existing?.id)
    navigate('/recruiter/jobs')
  }

  const cancel = () => (dirty ? setConfirmCancel(true) : navigate('/recruiter/jobs'))

  const discardRestored = () => {
    setForm(initial.baseForm)
    setRestoredAt(null)
    setAttempt(null)
    clearFormDraft(existing?.id)
  }

  const toggleProof = (key) =>
    set('mandatoryProofs', form.mandatoryProofs.includes(key) ? form.mandatoryProofs.filter((item) => item !== key) : [...form.mandatoryProofs, key])

  const salaryPreview = formatSalary({ salaryMin: form.salaryMin, salaryMax: form.salaryMax, salaryPeriod: form.salaryPeriod })
  const salaryUnit = form.salaryPeriod === 'annual' ? 'LPA' : '₹ / month'

  const previewActions = isPublished ? (
    <div className="grid gap-3 sm:grid-cols-2">
      <button type="button" onClick={cancel} className={secondaryButton}>
        Cancel
      </button>
      <button type="button" onClick={() => persist('save')} className={primaryButton}>
        Save Changes
      </button>
    </div>
  ) : (
    <div className="grid gap-3 sm:grid-cols-[1fr_1.4fr]">
      <button type="button" onClick={() => persist('draft')} className={secondaryButton}>
        Save as Draft
      </button>
      <button type="button" onClick={() => persist('publish')} className={primaryButton}>
        Publish Job
      </button>
    </div>
  )

  const HeaderIcon = existing ? FilePen : FilePlus2
  const title = isPublished ? 'Edit Job Opening' : existing ? 'Continue Draft' : 'Publish New Job Opening'

  return (
    <div className="mx-auto max-w-[1280px]">
      <div className="rounded-3xl border border-line bg-white p-4 shadow-[0_1px_3px_rgba(16,25,46,0.06)] sm:p-6 lg:p-10">
        <header className="flex gap-3 sm:gap-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-white sm:h-12 sm:w-12">
            <HeaderIcon size={22} aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <h1 className="text-2xl font-bold tracking-tight text-navy sm:text-[34px] sm:leading-tight">{title}</h1>
            <p className="mt-1 text-sm text-body sm:text-[15px]">Configure job details, proof criteria, and pipeline verification triggers.</p>
          </div>
        </header>

        {restoredAt && (
          <div className="mt-6 flex flex-col gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 sm:flex-row sm:items-center">
            <History size={18} className="shrink-0" aria-hidden="true" />
            <p className="flex-1">Restored unsaved changes from {formatDateTime(restoredAt)}.</p>
            <button type="button" onClick={discardRestored} className="self-start rounded-md font-semibold underline hover:no-underline focus-visible:outline-2 focus-visible:outline-amber-700 sm:self-auto">
              Discard changes
            </button>
          </div>
        )}

        <nav aria-label="Form steps" className="mt-8">
          <ol className="flex gap-2 overflow-x-auto">
            {STEPS.map(({ number, label }) => {
              const active = step === number
              const stepErrors = errorKeys.filter((key) => stepOfField(key) === number).length
              return (
                <li key={number} className="shrink-0">
                  <button
                    type="button"
                    onClick={() => setStep(number)}
                    aria-current={active ? 'step' : undefined}
                    className={cn(
                      'flex h-10 items-center gap-2 rounded-full px-4 text-sm font-medium focus-visible:outline-2 focus-visible:outline-primary',
                      active ? 'bg-selected text-primary' : 'text-body hover:bg-slate-50',
                    )}
                  >
                    <span className={cn('flex h-6 w-6 items-center justify-center rounded-full text-xs', active ? 'bg-primary text-white' : 'bg-segment')}>
                      {number}
                    </span>
                    {label}
                    {stepErrors > 0 && (
                      <span className="rounded-full bg-red-100 px-2 text-xs font-semibold text-red-700">
                        {stepErrors} <span className="sr-only">{stepErrors === 1 ? 'error' : 'errors'}</span>
                      </span>
                    )}
                  </button>
                </li>
              )
            })}
          </ol>
        </nav>

        {errorKeys.length > 0 && (
          <div role="alert" className="mt-5 flex gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            <CircleAlert size={18} className="shrink-0" aria-hidden="true" />
            <p>
              {errorKeys.length === 1 ? 'One field needs' : `${errorKeys.length} fields need`} attention before you can{' '}
              {attempt === 'draft' ? 'save this draft' : attempt === 'save' ? 'save your changes' : 'publish this job'}. Steps with
              problems are marked in red.
            </p>
          </div>
        )}

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-10">
          <form
            noValidate
            onSubmit={(event) => event.preventDefault()}
            className="min-w-0 space-y-10 lg:border-r lg:border-line lg:pr-10"
            aria-label="Job details"
          >
            {step === 1 ? (
              <>
                <JobFormSection id="section-core" number={1} title="Role Core Information">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Job Title" name="title" required error={err('title')} className="sm:col-span-2">
                      {(props) => <TextInput {...props} {...bind('title')} maxLength={120} placeholder="e.g. Staff AI / ML Systems Engineer" />}
                    </Field>
                    <Field label="Type" name="employmentType">
                      {(props) => <SelectInput {...props} {...bind('employmentType')} options={EMPLOYMENT_TYPES} />}
                    </Field>
                    <Field label="Work Mode" name="workMode">
                      {(props) => <SelectInput {...props} {...bind('workMode')} options={WORK_MODES} />}
                    </Field>
                    <Field label="Location" name="location" required error={err('location')}>
                      {(props) => (
                        <>
                          <TextInput {...props} {...bind('location')} list="job-location-options" placeholder="e.g. Bengaluru, India" maxLength={80} />
                          <datalist id="job-location-options">
                            {LOCATION_SUGGESTIONS.map((value) => (
                              <option key={value} value={value} />
                            ))}
                          </datalist>
                        </>
                      )}
                    </Field>
                    <Field label="Department" name="department" required error={err('department')}>
                      {(props) => (
                        <>
                          <TextInput {...props} {...bind('department')} list="job-department-options" placeholder="e.g. Engineering" maxLength={60} />
                          <datalist id="job-department-options">
                            {DEPARTMENTS.map((value) => (
                              <option key={value} value={value} />
                            ))}
                          </datalist>
                        </>
                      )}
                    </Field>
                    <Field label="Experience Level" name="experienceLevel" required error={err('experienceLevel')}>
                      {(props) => <SelectInput {...props} {...bind('experienceLevel')} options={EXPERIENCE_LEVELS} placeholder="Select level" />}
                    </Field>
                    <Field label="Vacancies" name="vacancies" required error={err('vacancies')}>
                      {(props) => <TextInput {...props} {...bind('vacancies')} type="number" inputMode="numeric" min={1} step={1} placeholder="e.g. 5" />}
                    </Field>

                    <fieldset className="sm:col-span-2" data-field="salary">
                      <legend className="text-sm font-semibold text-navy">
                        Salary Range <span className="text-danger" aria-hidden="true">*</span>
                        <span className="sr-only">(required)</span>
                      </legend>
                      <div className="mt-2 flex flex-wrap gap-2" role="radiogroup" aria-label="Salary period">
                        {[
                          { value: 'annual', label: 'Annual (LPA)' },
                          { value: 'monthly', label: 'Monthly (₹)' },
                        ].map((option) => (
                          <label
                            key={option.value}
                            className={cn(
                              'flex h-9 cursor-pointer items-center gap-2 rounded-full border px-3.5 text-sm has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-primary',
                              form.salaryPeriod === option.value ? 'border-primary bg-selected text-primary' : 'border-line text-body',
                            )}
                          >
                            <input
                              type="radio"
                              name="salaryPeriod"
                              value={option.value}
                              checked={form.salaryPeriod === option.value}
                              onChange={() => set('salaryPeriod', option.value)}
                              className="sr-only"
                            />
                            {option.label}
                          </label>
                        ))}
                      </div>
                      <div className="mt-3 grid grid-cols-2 gap-3">
                        <TextInput
                          aria-label={`Minimum salary (${salaryUnit})`}
                          aria-invalid={err('salary') ? true : undefined}
                          aria-describedby="salary-help"
                          type="number"
                          inputMode="decimal"
                          min={0}
                          step="any"
                          placeholder={form.salaryPeriod === 'annual' ? 'Min, e.g. 12' : 'Min, e.g. 25000'}
                          {...bind('salaryMin')}
                        />
                        <TextInput
                          aria-label={`Maximum salary (${salaryUnit})`}
                          aria-invalid={err('salary') ? true : undefined}
                          aria-describedby="salary-help"
                          type="number"
                          inputMode="decimal"
                          min={0}
                          step="any"
                          placeholder={form.salaryPeriod === 'annual' ? 'Max, e.g. 18' : 'Max, e.g. 35000'}
                          {...bind('salaryMax')}
                        />
                      </div>
                      <p id="salary-help" className="mt-1.5 text-xs text-muted">
                        {form.salaryPeriod === 'annual' ? 'Amounts in lakh per annum.' : 'Amounts in rupees per month.'}
                        {salaryPreview && ` Shown as ${salaryPreview}.`}
                      </p>
                      {err('salary') && <p className="mt-1 text-sm text-danger">{err('salary')}</p>}
                    </fieldset>

                    <Field
                      label="Application Deadline"
                      name="applicationDeadline"
                      required
                      error={err('applicationDeadline')}
                      hint="Candidates can apply until the end of this day."
                    >
                      {(props) => <TextInput {...props} {...bind('applicationDeadline')} type="date" min={isPublished ? undefined : today} />}
                    </Field>

                    <Field label="Required Skills" name="requiredSkills" required error={err('requiredSkills')} hint="Press Enter or comma to add a skill." className="sm:col-span-2">
                      {(props) => (
                        <TagInput
                          {...props}
                          values={form.requiredSkills}
                          onChange={(values) => set('requiredSkills', values)}
                          suggestions={SKILL_SUGGESTIONS}
                          placeholder="e.g. React, Java, SQL"
                        />
                      )}
                    </Field>
                  </div>
                </JobFormSection>

                <JobFormSection
                  id="section-proof"
                  number={2}
                  title="Candidate Proof & Mandatory ATS Gateways"
                  subtitle="Select the verification artifacts and minimum criteria candidates must satisfy."
                >
                  <fieldset data-field="mandatoryProofs" className="rounded-2xl bg-selected/60 p-4 sm:p-5">
                    <legend className="sr-only">Mandatory verification artifacts</legend>
                    <p className="text-sm font-semibold text-navy" aria-hidden="true">
                      Select Mandatory Verification Artifacts:
                    </p>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      {PROOF_OPTIONS.filter((option) => !option.extra).map((option) => (
                        <label
                          key={option.key}
                          className={cn(
                            'flex cursor-pointer items-start gap-3 rounded-xl border bg-white p-4 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-primary',
                            form.mandatoryProofs.includes(option.key) ? 'border-primary/50' : 'border-transparent',
                          )}
                        >
                          <input
                            type="checkbox"
                            checked={form.mandatoryProofs.includes(option.key)}
                            onChange={() => toggleProof(option.key)}
                            className="mt-1 h-4 w-4 shrink-0 accent-primary"
                          />
                          <span>
                            <span className="block text-sm font-semibold text-navy sm:text-[15px]">{option.label}</span>
                            <span className="mt-0.5 block text-xs text-body sm:text-sm">{option.description}</span>
                          </span>
                        </label>
                      ))}
                    </div>
                    <p className="mt-5 text-sm font-semibold text-navy" aria-hidden="true">
                      Additional proof (optional)
                    </p>
                    <div className="mt-2 flex flex-wrap gap-x-6 gap-y-2">
                      {PROOF_OPTIONS.filter((option) => option.extra).map((option) => (
                        <label key={option.key} className="flex cursor-pointer items-center gap-2 text-sm text-navy">
                          <input
                            type="checkbox"
                            checked={form.mandatoryProofs.includes(option.key)}
                            onChange={() => toggleProof(option.key)}
                            className="h-4 w-4 accent-primary"
                          />
                          {option.label}
                        </label>
                      ))}
                    </div>
                  </fieldset>
                  {err('mandatoryProofs') && <p className="mt-2 text-sm text-danger">{err('mandatoryProofs')}</p>}
                </JobFormSection>

                <JobFormSection id="section-eligibility" number={3} title="Eligibility">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Minimum ATS score (%)" name="minimumATSScore" error={err('minimumATSScore')}>
                      {(props) => <TextInput {...props} {...bind('minimumATSScore')} type="number" inputMode="numeric" min={0} max={100} placeholder="e.g. 70" />}
                    </Field>
                    <Field label="Minimum assessment score (%)" name="minimumAssessmentScore" error={err('minimumAssessmentScore')}>
                      {(props) => <TextInput {...props} {...bind('minimumAssessmentScore')} type="number" inputMode="numeric" min={0} max={100} placeholder="e.g. 75" />}
                    </Field>
                    <Field label="Minimum experience" name="minimumExperience">
                      {(props) => <SelectInput {...props} {...bind('minimumExperience')} options={MINIMUM_EXPERIENCE_OPTIONS} />}
                    </Field>
                    <Field label="Education requirement" name="education">
                      {(props) => <SelectInput {...props} {...bind('education')} options={EDUCATION_OPTIONS} />}
                    </Field>
                    <Field label="Other eligibility conditions" name="otherEligibility" className="sm:col-span-2" hint="Optional. These are requirements you configure, not verified candidate results.">
                      {(props) => <TextArea {...props} {...bind('otherEligibility')} rows={3} maxLength={1000} placeholder="e.g. Must be able to join within 30 days" />}
                    </Field>
                  </div>
                </JobFormSection>

                <div className="border-t border-line" />

                <JobFormSection id="section-assessment" title="Create Assessment" subtitle="Linked to this job and offered to candidates after they apply.">
                  <fieldset>
                    <legend className="sr-only">Assessment type</legend>
                    <div className="grid gap-3 sm:grid-cols-3">
                      {ASSESSMENT_TYPES.map((option) => (
                        <label
                          key={option.value}
                          className={cn(
                            'flex cursor-pointer flex-col rounded-xl border p-4 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-primary',
                            form.assessment.type === option.value ? 'border-primary bg-selected/60' : 'border-line hover:bg-slate-50',
                          )}
                        >
                          <span className="flex items-center gap-2 text-sm font-semibold text-navy">
                            <input
                              type="radio"
                              name="assessmentType"
                              value={option.value}
                              checked={form.assessment.type === option.value}
                              onChange={() => setAssessment('type', option.value)}
                              className="h-4 w-4 accent-primary"
                            />
                            {option.label}
                          </span>
                          <span className="mt-1.5 text-xs text-body">{option.description}</span>
                        </label>
                      ))}
                    </div>
                  </fieldset>

                  {form.assessment.type !== 'none' && (
                    <div className="mt-6 grid gap-5 sm:grid-cols-2">
                      <Field label="Assessment title" name="assessment.title" required error={err('assessment.title')} className="sm:col-span-2">
                        {(props) => (
                          <TextInput
                            {...props}
                            value={form.assessment.title}
                            onChange={(event) => setAssessment('title', event.target.value)}
                            maxLength={120}
                            placeholder="e.g. Backend Java Technical Assessment"
                          />
                        )}
                      </Field>
                      <Field label="Category" name="assessment.category">
                        {(props) => (
                          <SelectInput
                            {...props}
                            value={form.assessment.category}
                            onChange={(event) => setAssessment('category', event.target.value)}
                            options={ASSESSMENT_CATEGORIES}
                            placeholder="Select category"
                          />
                        )}
                      </Field>
                      <Field label="Difficulty" name="assessment.difficulty">
                        {(props) => (
                          <SelectInput {...props} value={form.assessment.difficulty} onChange={(event) => setAssessment('difficulty', event.target.value)} options={DIFFICULTY_LEVELS} />
                        )}
                      </Field>
                      {form.assessment.type === 'interactive' && (
                        <Field label="Number of questions" name="assessment.questionCount" required error={err('assessment.questionCount')}>
                          {(props) => (
                            <TextInput
                              {...props}
                              type="number"
                              inputMode="numeric"
                              min={1}
                              value={form.assessment.questionCount}
                              onChange={(event) => setAssessment('questionCount', event.target.value)}
                            />
                          )}
                        </Field>
                      )}
                      <Field label="Duration (minutes)" name="assessment.durationMinutes" required error={err('assessment.durationMinutes')}>
                        {(props) => (
                          <TextInput
                            {...props}
                            type="number"
                            inputMode="numeric"
                            min={1}
                            value={form.assessment.durationMinutes}
                            onChange={(event) => setAssessment('durationMinutes', event.target.value)}
                          />
                        )}
                      </Field>
                      <Field label="Passing score (%)" name="assessment.passingScore" required error={err('assessment.passingScore')}>
                        {(props) => (
                          <TextInput
                            {...props}
                            type="number"
                            inputMode="numeric"
                            min={0}
                            max={100}
                            value={form.assessment.passingScore}
                            onChange={(event) => setAssessment('passingScore', event.target.value)}
                          />
                        )}
                      </Field>
                      <Field
                        label="Skills assessed"
                        name="assessment.skills"
                        required={form.assessment.type === 'interactive'}
                        error={err('assessment.skills')}
                        className="sm:col-span-2"
                      >
                        {(props) => (
                          <div>
                            <TagInput
                              {...props}
                              values={form.assessment.skills}
                              onChange={(values) => setAssessment('skills', values)}
                              suggestions={SKILL_SUGGESTIONS}
                              placeholder="e.g. Java, Spring Boot"
                            />
                            {form.requiredSkills.length > 0 && (
                              <button
                                type="button"
                                onClick={() => setAssessment('skills', [...new Set([...form.assessment.skills, ...form.requiredSkills])])}
                                className="mt-2 rounded-md px-1 text-sm font-medium text-primary hover:underline focus-visible:outline-2 focus-visible:outline-primary"
                              >
                                Use the job&apos;s required skills
                              </button>
                            )}
                          </div>
                        )}
                      </Field>
                      <Field label="Instructions for candidates" name="assessment.instructions" className="sm:col-span-2">
                        {(props) => (
                          <TextArea
                            {...props}
                            rows={3}
                            maxLength={1500}
                            value={form.assessment.instructions}
                            onChange={(event) => setAssessment('instructions', event.target.value)}
                            placeholder="e.g. Answer all questions within the time limit. One attempt only."
                          />
                        )}
                      </Field>

                      <div className="sm:col-span-2">
                        <p className="text-sm font-semibold text-navy">
                          Assessment document
                          {form.assessment.type === 'document' ? (
                            <>
                              <span className="text-danger" aria-hidden="true">
                                {' '}
                                *
                              </span>
                              <span className="sr-only"> (required)</span>
                            </>
                          ) : (
                            <span className="font-normal text-muted"> (optional reference)</span>
                          )}
                        </p>
                        <div className="mt-2">
                          <JobFileUpload
                            label="assessment document"
                            name="assessment.document"
                            file={form.assessment.document}
                            rules={ASSESSMENT_FILE_RULES}
                            onChange={(meta) => setAssessment('document', meta)}
                            error={err('assessment.document')}
                          />
                        </div>
                      </div>

                      <p className="flex gap-2 rounded-xl bg-pale p-3 text-xs leading-relaxed text-body sm:col-span-2">
                        <Info size={16} className="shrink-0 text-primary" aria-hidden="true" />
                        {form.assessment.type === 'interactive'
                          ? 'Candidates get a timed question set from the TalentForge assessment engine using these skills, duration and passing score. An uploaded document is kept as a reference only — it is not turned into questions.'
                          : 'Candidates receive the uploaded document as their assessment brief. It is not converted into interactive questions.'}
                      </p>
                    </div>
                  )}
                </JobFormSection>
              </>
            ) : (
              <>
                <JobFormSection id="section-description" number={1} title="Job Description">
                  <Field
                    label="Job description"
                    name="description"
                    required
                    error={err('description')}
                    hint={`${form.description.length.toLocaleString('en-IN')} / ${DESCRIPTION_LIMIT.toLocaleString('en-IN')} characters`}
                  >
                    {(props) => (
                      <TextArea
                        {...props}
                        {...bind('description')}
                        rows={6}
                        maxLength={DESCRIPTION_LIMIT}
                        placeholder="Describe the role, responsibilities, team, and expectations..."
                      />
                    )}
                  </Field>
                </JobFormSection>

                <JobFormSection id="section-learn" number={2} title="Candidate Will Learn" subtitle="Optional. What a new hire will learn or grow in.">
                  <ListEditor
                    id="learning-outcomes"
                    items={form.learningOutcomes}
                    onChange={(items) => set('learningOutcomes', items)}
                    itemLabel="Learning outcome"
                    placeholder="e.g. Build and maintain user-facing features"
                    addLabel="Add learning outcome"
                  />
                </JobFormSection>

                <JobFormSection id="section-requirements" number={3} title="Requirements">
                  <div data-field="requirements">
                    <ListEditor
                      id="requirements"
                      items={form.requirements}
                      onChange={(items) => set('requirements', items)}
                      itemLabel="Requirement"
                      placeholder="e.g. Strong knowledge of JavaScript"
                      addLabel="Add requirement"
                      invalid={Boolean(err('requirements'))}
                      describedBy={err('requirements') ? 'requirements-error' : undefined}
                    />
                    {err('requirements') && (
                      <p id="requirements-error" className="mt-2 text-sm text-danger">
                        {err('requirements')}
                      </p>
                    )}
                  </div>
                </JobFormSection>

                <div className="border-t border-line" />

                <JobFormSection
                  id="section-company"
                  title="About Company"
                  subtitle="Pre-filled from your company details. Changes here apply to this job only."
                >
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Company name" name="company.name" required error={err('company.name')}>
                      {(props) => <TextInput {...props} value={form.company.name} onChange={(event) => setCompany('name', event.target.value)} maxLength={80} />}
                    </Field>
                    <Field label="Industry" name="company.industry">
                      {(props) => <TextInput {...props} value={form.company.industry} onChange={(event) => setCompany('industry', event.target.value)} maxLength={80} />}
                    </Field>
                    <Field label="Website" name="company.website" error={err('company.website')}>
                      {(props) => (
                        <TextInput
                          {...props}
                          type="url"
                          inputMode="url"
                          value={form.company.website}
                          onChange={(event) => setCompany('website', event.target.value)}
                          placeholder="https://"
                          maxLength={200}
                        />
                      )}
                    </Field>
                    <Field label="Company location" name="company.location">
                      {(props) => <TextInput {...props} value={form.company.location} onChange={(event) => setCompany('location', event.target.value)} maxLength={80} />}
                    </Field>
                    <Field label="Company overview" name="company.overview" required error={err('company.overview')} className="sm:col-span-2">
                      {(props) => (
                        <TextArea {...props} rows={4} maxLength={2000} value={form.company.overview} onChange={(event) => setCompany('overview', event.target.value)} />
                      )}
                    </Field>

                    <div className="sm:col-span-2">
                      <p className="text-sm font-semibold text-navy">
                        Company information document <span className="font-normal text-muted">(optional)</span>
                      </p>
                      <div className="mt-2">
                        <JobFileUpload
                          label="company information document"
                          name="company.document"
                          file={form.company.document}
                          rules={COMPANY_FILE_RULES}
                          onChange={(meta) => setForm((current) => ({
                            ...current,
                            company: { ...current.company, document: meta, shareDocument: meta ? current.company.shareDocument : false },
                          }))}
                        />
                      </div>
                      <label className={cn('mt-4 flex items-start gap-2.5 text-sm', form.company.document ? 'cursor-pointer text-navy' : 'cursor-not-allowed text-muted')}>
                        <input
                          type="checkbox"
                          checked={form.company.shareDocument}
                          disabled={!form.company.document}
                          onChange={(event) => setCompany('shareDocument', event.target.checked)}
                          className="mt-0.5 h-4 w-4 accent-primary"
                        />
                        <span>
                          Show this document on the job posting
                          <span className="block text-xs text-muted">Off by default — the document stays private to your team unless you turn this on.</span>
                        </span>
                      </label>
                    </div>
                  </div>
                </JobFormSection>
              </>
            )}

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-6">
              {step === 2 ? (
                <button type="button" onClick={() => setStep(1)} className={cn(navButton, 'bg-segment text-navy hover:bg-slate-200')}>
                  <ArrowLeft size={18} aria-hidden="true" /> Previous
                </button>
              ) : (
                <button type="button" onClick={cancel} className={cn(navButton, 'text-body hover:bg-slate-100')}>
                  Cancel
                </button>
              )}
              {step === 1 ? (
                <button
                  type="button"
                  onClick={() => {
                    setStep(2)
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }}
                  className={cn(navButton, 'bg-primary text-white hover:bg-primary-hover')}
                >
                  Next <ArrowRight size={18} aria-hidden="true" />
                </button>
              ) : (
                <button type="button" onClick={cancel} className={cn(navButton, 'text-body hover:bg-slate-100')}>
                  Cancel
                </button>
              )}
            </div>
          </form>

          <aside aria-label="Live posting preview" className="min-w-0">
            <div className="lg:sticky lg:top-24">
              <JobPostingPreview
                job={previewJob}
                now={now}
                badge={existing ? `${existing.status === 'Draft' ? 'Draft' : 'Editing'} ${existing.requisitionId}` : `New Job #${nextNumber}`}
                actions={previewActions}
              />
              <p className="mt-3 text-center text-xs text-muted">Unsaved changes are kept in this browser until you save or discard them.</p>
            </div>
          </aside>
        </div>
      </div>

      {confirmCancel && (
        <ConfirmationDialog
          title="Discard unsaved changes?"
          message="You have changes that have not been saved to this job."
          cancelLabel="Continue editing"
          onCancel={() => setConfirmCancel(false)}
          actions={[
            { label: 'Discard changes', onClick: discard, tone: 'danger' },
            isPublished
              ? { label: 'Save changes', onClick: () => { setConfirmCancel(false); persist('save') }, tone: 'primary' }
              : { label: 'Save as Draft', onClick: () => { setConfirmCancel(false); persist('draft') }, tone: 'primary' },
          ]}
        />
      )}
    </div>
  )
}
