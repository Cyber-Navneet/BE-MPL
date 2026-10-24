// Form model, conversions and validation for the Publish New Job Opening form.
// The form keeps numbers as strings (what the inputs hold) and list items as { id, text } so
// they can be reordered with stable keys; `formToJob` turns it back into a stored job record.

import { RECRUITER_COMPANY } from '../data/recruiterJobs.js'

export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024

export const ASSESSMENT_FILE_RULES = {
  extensions: ['pdf', 'docx', 'txt'],
  mimeTypes: [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
  ],
  label: 'PDF, DOCX or TXT',
  maxBytes: MAX_UPLOAD_BYTES,
}

export const COMPANY_FILE_RULES = {
  extensions: ['pdf', 'docx'],
  mimeTypes: ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  label: 'PDF or DOCX',
  maxBytes: MAX_UPLOAD_BYTES,
}

export function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

// Returns an error message, or null when the file is acceptable.
export function validateFile(file, rules) {
  const extension = file.name.includes('.') ? file.name.split('.').pop().toLowerCase() : ''
  // Some browsers report an empty MIME type, so the extension is the primary check.
  if (!rules.extensions.includes(extension) || (file.type && !rules.mimeTypes.includes(file.type))) {
    return `"${file.name}" is not a supported file. Upload a ${rules.label} file.`
  }
  if (file.size === 0) return `"${file.name}" is empty.`
  if (file.size > rules.maxBytes) {
    return `"${file.name}" is ${formatBytes(file.size)}. The maximum size is ${formatBytes(rules.maxBytes)}.`
  }
  return null
}

// Metadata kept for an uploaded file. The bytes are not persisted in this demo.
export const fileMeta = (file) => ({ name: file.name, size: file.size, type: file.type, addedAt: Date.now() })

export function todayInputValue(now = new Date()) {
  const pad = (n) => String(n).padStart(2, '0')
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
}

let itemCounter = 0
export const listItem = (text = '') => {
  itemCounter += 1
  return { id: `item-${Date.now().toString(36)}-${itemCounter}`, text }
}

const toText = (value) => (value === null || value === undefined ? '' : String(value))
const toNumber = (value) => {
  if (value === '' || value === null || value === undefined) return null
  const number = Number(value)
  return Number.isFinite(number) ? number : null
}
const toList = (items) => (items.length ? items.map((text) => listItem(text)) : [listItem()])
const fromList = (items) => items.map((item) => item.text.trim()).filter(Boolean)

export function emptyJobForm() {
  return {
    title: '',
    department: 'Engineering',
    employmentType: 'Full-Time',
    workMode: 'Hybrid',
    location: '',
    experienceLevel: '',
    salaryMin: '',
    salaryMax: '',
    salaryPeriod: 'annual',
    vacancies: '1',
    applicationDeadline: '',
    requiredSkills: [],
    mandatoryProofs: ['resume'],
    minimumATSScore: '70',
    minimumAssessmentScore: '70',
    minimumExperience: 'No minimum',
    education: 'Any Graduate',
    otherEligibility: '',
    assessment: {
      type: 'interactive',
      title: '',
      category: '',
      skills: [],
      questionCount: '20',
      durationMinutes: '30',
      difficulty: 'Intermediate',
      passingScore: '70',
      instructions: '',
      document: null,
    },
    description: '',
    learningOutcomes: [listItem()],
    requirements: [listItem()],
    company: { ...RECRUITER_COMPANY, document: null, shareDocument: false },
  }
}

export function jobToForm(job) {
  const base = emptyJobForm()
  const assessment = job.assessment ?? {}
  return {
    ...base,
    title: toText(job.title),
    department: toText(job.department),
    employmentType: job.employmentType ?? base.employmentType,
    workMode: job.workMode ?? base.workMode,
    location: toText(job.location),
    experienceLevel: toText(job.experienceLevel),
    salaryMin: toText(job.salaryMin),
    salaryMax: toText(job.salaryMax),
    salaryPeriod: job.salaryPeriod === 'monthly' ? 'monthly' : 'annual',
    vacancies: toText(job.vacancies),
    applicationDeadline: toText(job.applicationDeadline),
    requiredSkills: [...(job.requiredSkills ?? [])],
    mandatoryProofs: [...(job.mandatoryProofs ?? [])],
    minimumATSScore: toText(job.minimumATSScore),
    minimumAssessmentScore: toText(job.minimumAssessmentScore),
    minimumExperience: job.minimumExperience ?? base.minimumExperience,
    education: job.education ?? base.education,
    otherEligibility: toText(job.otherEligibility),
    assessment: {
      ...base.assessment,
      type: assessment.type ?? 'none',
      title: toText(assessment.title),
      category: toText(assessment.category),
      skills: [...(assessment.skills ?? [])],
      questionCount: toText(assessment.questionCount),
      durationMinutes: toText(assessment.durationMinutes),
      difficulty: assessment.difficulty ?? base.assessment.difficulty,
      passingScore: toText(assessment.passingScore),
      instructions: toText(assessment.instructions),
      document: assessment.document ?? null,
    },
    description: toText(job.description),
    learningOutcomes: toList(job.learningOutcomes ?? []),
    requirements: toList(job.requirements ?? []),
    company: { ...base.company, ...(job.company ?? {}) },
  }
}

export function formToJob(form) {
  const assessment = form.assessment
  return {
    title: form.title.trim(),
    department: form.department.trim(),
    employmentType: form.employmentType,
    workMode: form.workMode,
    location: form.location.trim(),
    experienceLevel: form.experienceLevel,
    salaryMin: toNumber(form.salaryMin),
    salaryMax: toNumber(form.salaryMax),
    salaryPeriod: form.salaryPeriod,
    vacancies: toNumber(form.vacancies),
    applicationDeadline: form.applicationDeadline,
    requiredSkills: form.requiredSkills,
    mandatoryProofs: form.mandatoryProofs,
    minimumATSScore: toNumber(form.minimumATSScore),
    minimumAssessmentScore: toNumber(form.minimumAssessmentScore),
    minimumExperience: form.minimumExperience,
    education: form.education,
    otherEligibility: form.otherEligibility.trim(),
    assessment: {
      type: assessment.type,
      title: assessment.title.trim(),
      category: assessment.category,
      skills: assessment.skills,
      questionCount: toNumber(assessment.questionCount),
      durationMinutes: toNumber(assessment.durationMinutes),
      difficulty: assessment.difficulty,
      passingScore: toNumber(assessment.passingScore),
      instructions: assessment.instructions.trim(),
      document: assessment.document,
    },
    description: form.description.trim(),
    learningOutcomes: fromList(form.learningOutcomes),
    requirements: fromList(form.requirements),
    company: {
      ...form.company,
      name: form.company.name.trim(),
      overview: form.company.overview.trim(),
      industry: form.company.industry.trim(),
      website: form.company.website.trim(),
      location: form.company.location.trim(),
    },
  }
}

const isBlank = (value) => !String(value ?? '').trim()
const isInteger = (value) => /^\d+$/.test(String(value).trim())

function checkScore(errors, key, value, label) {
  if (isBlank(value)) return
  const number = Number(value)
  if (!Number.isFinite(number) || number < 0 || number > 100) errors[key] = `${label} must be between 0 and 100.`
}

function checkPositiveInteger(errors, key, value, label, max) {
  if (isBlank(value)) return
  if (!isInteger(value) || Number(value) < 1) errors[key] = `${label} must be a whole number of at least 1.`
  else if (max && Number(value) > max) errors[key] = `${label} cannot be more than ${max}.`
}

// Format checks that apply even to drafts: anything entered must be valid.
function formatErrors(form) {
  const errors = {}
  const min = form.salaryMin
  const max = form.salaryMax
  const badAmount = (value) => !isBlank(value) && !(Number.isFinite(Number(value)) && Number(value) > 0)
  if (badAmount(min) || badAmount(max)) errors.salary = 'Salary amounts must be positive numbers.'
  else if (!isBlank(min) && !isBlank(max) && Number(min) > Number(max)) {
    errors.salary = 'Minimum salary cannot be more than the maximum.'
  }
  checkPositiveInteger(errors, 'vacancies', form.vacancies, 'Vacancies', 1000)
  checkScore(errors, 'minimumATSScore', form.minimumATSScore, 'Minimum ATS score')
  checkScore(errors, 'minimumAssessmentScore', form.minimumAssessmentScore, 'Minimum assessment score')

  if (form.assessment.type !== 'none') {
    checkPositiveInteger(errors, 'assessment.questionCount', form.assessment.questionCount, 'Number of questions', 200)
    checkPositiveInteger(errors, 'assessment.durationMinutes', form.assessment.durationMinutes, 'Duration', 480)
    checkScore(errors, 'assessment.passingScore', form.assessment.passingScore, 'Passing score')
  }
  const website = form.company.website.trim()
  if (website && !/^https?:\/\/[^\s.]+\.[^\s]+$/i.test(website)) errors['company.website'] = 'Enter a full URL starting with https://'
  return errors
}

// `intent`: 'draft' needs only a title; 'publish' publishes a new job or draft; 'save' updates a
// published job (`status` is its current status — the deadline check only applies to open jobs).
export function validateJobForm(form, intent, { status, today = todayInputValue() } = {}) {
  const errors = formatErrors(form)
  if (isBlank(form.title)) errors.title = 'Job title is required.'
  if (intent === 'draft') return errors

  const required = [
    ['department', 'Department is required.'],
    ['location', 'Location is required.'],
    ['experienceLevel', 'Select an experience level.'],
    ['description', 'Add a job description before publishing.'],
  ]
  required.forEach(([key, message]) => {
    if (isBlank(form[key]) && !errors[key]) errors[key] = message
  })
  if (!errors.salary && (isBlank(form.salaryMin) || isBlank(form.salaryMax))) errors.salary = 'Enter both a minimum and maximum salary.'
  if (!errors.vacancies && isBlank(form.vacancies)) errors.vacancies = 'Enter the number of vacancies.'
  if (!form.requiredSkills.length) errors.requiredSkills = 'Add at least one required skill.'
  if (!form.mandatoryProofs.length) errors.mandatoryProofs = 'Select at least one verification artifact.'

  const mustBeFuture = intent === 'publish' || status === 'Open'
  if (isBlank(form.applicationDeadline)) errors.applicationDeadline = 'Choose an application deadline.'
  else if (mustBeFuture && form.applicationDeadline < today) errors.applicationDeadline = 'The deadline cannot be in the past.'

  if (!form.requirements.some((item) => item.text.trim())) errors.requirements = 'Add at least one requirement.'

  const assessment = form.assessment
  if (assessment.type !== 'none') {
    if (isBlank(assessment.title)) errors['assessment.title'] = 'Assessment title is required.'
    if (!errors['assessment.durationMinutes'] && isBlank(assessment.durationMinutes)) errors['assessment.durationMinutes'] = 'Enter a duration.'
    if (!errors['assessment.passingScore'] && isBlank(assessment.passingScore)) errors['assessment.passingScore'] = 'Enter a passing score.'
    if (assessment.type === 'interactive') {
      if (!errors['assessment.questionCount'] && isBlank(assessment.questionCount)) errors['assessment.questionCount'] = 'Enter the number of questions.'
      if (!assessment.skills.length) errors['assessment.skills'] = 'Add at least one skill to assess.'
    }
    if (assessment.type === 'document' && !assessment.document) errors['assessment.document'] = 'Upload the assessment document.'
  }

  if (isBlank(form.company.name)) errors['company.name'] = 'Company name is required.'
  if (isBlank(form.company.overview)) errors['company.overview'] = 'Add a short company overview.'
  return errors
}

const STEP_TWO_PREFIXES = ['description', 'learningOutcomes', 'requirements', 'company']
export const stepOfField = (key) => (STEP_TWO_PREFIXES.some((prefix) => key === prefix || key.startsWith(`${prefix}.`)) ? 2 : 1)
