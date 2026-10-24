// Applications, their skill assessments and the latest resume skills, persisted in localStorage.
// Frontend-only demo: a real product must enforce deadlines and grading on the server.

import { JOBS } from '../data/jobs.js'
import { QUESTIONS_BY_ID } from '../data/questionBank.js'
import { buildAssessment } from './assessmentBuilder.js'
import { computeResult } from './assessmentScoring.js'
import { createLocalStore } from './localStore.js'
import { hasResume, profileStore } from './profileStore.js'

const isObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value)
const LEGACY_APPLIED_KEY = 'talentforge.appliedJobs'
const APPLICATIONS_KEY = 'talentforge.applications'

const hasStoredKey = (key) => {
  try {
    return localStorage.getItem(key) !== null
  } catch {
    return true
  }
}

function legacyApplications() {
  try {
    const ids = JSON.parse(localStorage.getItem(LEGACY_APPLIED_KEY) ?? '[]')
    const now = Date.now()
    return Array.isArray(ids)
      ? ids.filter(Number.isInteger).map((jobId) => ({ id: `app-${jobId}`, jobId, appliedAt: now, notes: [] }))
      : []
  } catch {
    return []
  }
}

// Applications: [{ id, jobId, appliedAt, notes: [{ id, text, sentAt }] }]
export const applicationsStore = createLocalStore(APPLICATIONS_KEY, {
  // First run after this feature shipped: carry over jobs applied to from Job Discovery.
  fallback: legacyApplications,
  parse: (value) =>
    Array.isArray(value)
      ? value.filter((app) => isObject(app) && typeof app.id === 'string' && Number.isInteger(app.jobId))
      : [],
})

// Assessments keyed by id: { [id]: assessment } (see buildAssessment for the shape).
export const assessmentsStore = createLocalStore('talentforge.assessments', {
  fallback: () => ({}),
  parse: (value) => (isObject(value) ? value : {}),
})

// Only the detected skill names are kept, never the resume file or its text.
export const resumeSkillsStore = createLocalStore('talentforge.resumeSkills', {
  fallback: () => [],
  parse: (value) => (Array.isArray(value) ? value.filter((skill) => typeof skill === 'string') : []),
})

export const findJob = (jobId) => JOBS.find((job) => job.id === jobId) ?? null
export const questionsFor = (assessment) => assessment.questionIds.map((id) => QUESTIONS_BY_ID.get(id)).filter(Boolean)

// Creates the assessment for an application once; later calls are no-ops.
function ensureAssessment(application, now) {
  const job = findJob(application.jobId)
  if (!job) return
  assessmentsStore.write((map) =>
    map[`asm-${application.id}`]
      ? map
      : {
          ...map,
          [`asm-${application.id}`]: buildAssessment({
            application,
            job,
            resumeSkills: resumeSkillsStore.read(),
            profileSkills: profileStore.read().skills,
            now,
          }),
        },
  )
}

// Length of the assessment a new application to `job` would get, for the confirmation modal.
export function previewAssessmentMinutes(job) {
  return buildAssessment({
    application: { id: 'preview' },
    job,
    resumeSkills: resumeSkillsStore.read(),
    profileSkills: profileStore.read().skills,
    now: 0,
  }).durationMinutes
}

const SUBMIT_DELAY_MS = 900

// Simulated "submit application" request: waits briefly, then records the application.
// Rejects (with a user-facing message) on a duplicate or a missing resume.
export function submitApplication(job) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (applicationsStore.read().some((app) => app.jobId === job.id)) {
        reject(new Error('You have already applied to this job.'))
        return
      }
      if (!hasResume(profileStore.read())) {
        reject(new Error('Add your resume on My Profile before applying.'))
        return
      }
      try {
        resolve(applyToJob(job))
      } catch {
        reject(new Error('Could not save your application. Please try again.'))
      }
    }, SUBMIT_DELAY_MS)
  })
}

export function applyToJob(job, now = Date.now()) {
  const existing = applicationsStore.read().find((app) => app.jobId === job.id)
  const application = existing ?? { id: `app-${job.id}`, jobId: job.id, appliedAt: now, notes: [] }
  if (!existing) applicationsStore.write((apps) => [...apps, application])
  ensureAssessment(application, now)
  return application
}

// Assigns missing assessments (e.g. for migrated applications) and submits any
// in-progress assessment whose deadline passed while the page was closed. Idempotent.
export function syncAssessments(now = Date.now()) {
  // Persist migrated legacy applications once so their dates stay fixed across reloads.
  if (!hasStoredKey(APPLICATIONS_KEY)) applicationsStore.write((apps) => [...apps])
  applicationsStore.read().forEach((application) => ensureAssessment(application, now))
  Object.values(assessmentsStore.read()).forEach((assessment) => {
    if (assessment.status === 'in_progress' && now >= assessment.deadline) submitAssessment(assessment.id, 'timeout', now)
  })
}

export function assessmentStatus(assessment, now = Date.now()) {
  if (assessment.status === 'not_started' && now > assessment.startBy) return 'expired'
  return assessment.status
}

const updateAssessment = (id, update) =>
  assessmentsStore.write((map) => {
    const current = map[id]
    if (!current) return map
    const next = update(current)
    return next === current ? map : { ...map, [id]: next }
  })

export function startAssessment(id, now = Date.now()) {
  updateAssessment(id, (assessment) =>
    assessmentStatus(assessment, now) !== 'not_started'
      ? assessment
      : { ...assessment, status: 'in_progress', startedAt: now, deadline: now + assessment.durationMinutes * 60 * 1000 },
  )
}

// Answers are only accepted while the attempt is in progress and before the deadline.
export function saveAnswer(id, questionId, value, now = Date.now()) {
  updateAssessment(id, (assessment) =>
    assessment.status !== 'in_progress' || now >= assessment.deadline
      ? assessment
      : { ...assessment, answers: { ...assessment.answers, [questionId]: value } },
  )
}

// Same path for manual and automatic submission; a second call does nothing.
export function submitAssessment(id, reason, now = Date.now()) {
  updateAssessment(id, (assessment) => {
    if (assessment.status !== 'in_progress') return assessment
    const submittedAt = Math.min(now, assessment.deadline)
    return {
      ...assessment,
      status: 'submitted',
      submittedAt,
      submitReason: reason,
      result: computeResult({
        questions: questionsFor(assessment),
        answers: assessment.answers,
        startedAt: assessment.startedAt,
        submittedAt,
        passingScore: assessment.passingScore,
      }),
    }
  })
}

// Recruiter-side stages after the assessment. Demo only: set from the demo controls on the
// application page, never automatically.
export const REVIEW_STAGES = {
  under_review: 'Under Review',
  shortlisted: 'Shortlisted',
  rejected: 'Rejected',
  offer: 'Offer Received',
}

// Which demo stage changes are allowed from each status.
export const NEXT_STAGES = {
  'Assessment Completed': ['under_review'],
  'Under Review': ['shortlisted', 'rejected'],
  Shortlisted: ['offer', 'rejected'],
}

// Applied → Assessment Pending → In Progress → Completed → Under Review → Shortlisted / Rejected → Offer Received.
export function applicationStatus(application, assessment, now = Date.now()) {
  if (application.stage && REVIEW_STAGES[application.stage]) return REVIEW_STAGES[application.stage]
  if (!assessment) return 'Applied'
  const status = assessmentStatus(assessment, now)
  if (status === 'not_started') return 'Assessment Pending'
  if (status === 'in_progress') return 'Assessment In Progress'
  if (status === 'submitted') return 'Assessment Completed'
  return 'Assessment Expired'
}

export function setApplicationStage(applicationId, stage) {
  if (!REVIEW_STAGES[stage]) return
  applicationsStore.write((apps) => apps.map((app) => (app.id === applicationId ? { ...app, stage } : app)))
}

export function addApplicationNote(applicationId, text, now = Date.now()) {
  applicationsStore.write((apps) =>
    apps.map((app) =>
      app.id === applicationId
        ? { ...app, notes: [...(app.notes ?? []), { id: `${now}`, text, sentAt: now }] }
        : app,
    ),
  )
}
