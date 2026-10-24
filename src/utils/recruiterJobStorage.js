// Recruiter jobs and their applicants, persisted in localStorage.
// Demo persistence only: a real product needs server-side storage, authentication and authorization.
// Uploaded documents are stored as metadata (name, size, type) only — the file bytes never leave the browser.

import { APPLICANT_STAGES, FIRST_NAMES, LAST_NAMES, RECRUITER_COMPANY, SEED_JOBS } from '../data/recruiterJobs.js'
import { createLocalStore } from './localStore.js'

const JOBS_KEY = 'talentforge_recruiter_jobs_v1'
const APPLICANTS_KEY = 'talentforge_recruiter_applicants_v1'
const FORM_DRAFTS_KEY = 'talentforge_recruiter_job_form_v1'

const DAY = 24 * 60 * 60 * 1000
const HOUR = 60 * 60 * 1000

const isObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value)
const isJob = (job) => isObject(job) && typeof job.id === 'string' && typeof job.title === 'string' && typeof job.status === 'string'
const isApplicant = (app) => isObject(app) && typeof app.id === 'string' && typeof app.jobId === 'string' && APPLICANT_STAGES.includes(app.stage)

const toDateInput = (timestamp) => {
  const date = new Date(timestamp)
  const pad = (n) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

// Seeded PRNG so every seeded applicant is the same on every machine.
function seededRandom(seed) {
  let state = seed >>> 0
  return () => {
    state = (state + 0x6d2b79f5) >>> 0
    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export const jobIdFor = (number) => `job-${number}`

function seedJob(spec, now) {
  const { number, openDays, endedDaysAgo, createdDaysAgo, deadlineInDays, funnel: _funnel, hireDays: _hireDays, ...fields } = spec
  const publishedAt = spec.status === 'Draft' ? null : now - openDays * DAY
  const endedAt = endedDaysAgo != null ? now - endedDaysAgo * DAY : null
  return {
    ...fields,
    id: jobIdFor(number),
    requisitionId: `REQ-${number}`,
    otherEligibility: '',
    company: { ...RECRUITER_COMPANY, document: null, shareDocument: false },
    assessmentId: spec.assessment.type === 'none' ? null : `asm-cfg-${number}`,
    applicationDeadline: toDateInput(now + deadlineInDays * DAY),
    createdAt: publishedAt ? publishedAt - 2 * DAY : now - (createdDaysAgo ?? 1) * DAY,
    updatedAt: endedAt ?? publishedAt ?? now - (createdDaysAgo ?? 1) * DAY,
    publishedAt,
    pausedAt: spec.status === 'Paused' ? endedAt : null,
    closedAt: spec.status === 'Closed' ? endedAt : null,
    seeded: true,
  }
}

// Builds the applicants for one seeded job from its funnel counts. Scores respect the job's thresholds:
// anyone past screening met the ATS minimum, and only completed assessments get a score.
function seedApplicants(spec, job, now) {
  const random = seededRandom(spec.number * 7919)
  const pick = (list) => list[Math.floor(random() * list.length)]
  const between = (min, max) => min + random() * (max - min)
  const intBetween = (min, max) => Math.round(between(min, max))
  const activeUntil = job.closedAt ?? job.pausedAt ?? now
  const minAts = job.minimumATSScore ?? 60
  const minAssessment = job.minimumAssessmentScore ?? 60
  const proofs = job.mandatoryProofs

  const applicants = []
  const add = (stage, extra) => {
    const index = applicants.length + 1
    const first = pick(FIRST_NAMES)
    const last = pick(LAST_NAMES)
    const appliedAt = extra.appliedAt ?? between(job.publishedAt, activeUntil - HOUR)
    applicants.push({
      id: `cand-${spec.number}-${String(index).padStart(3, '0')}`,
      jobId: job.id,
      name: `${first} ${last}`,
      email: `${first}.${last}${index}@example.com`.toLowerCase(),
      appliedAt: Math.round(appliedAt),
      stage,
      stageUpdatedAt: Math.round(extra.stageUpdatedAt ?? (stage === 'Applied' ? appliedAt : between(appliedAt, activeUntil))),
      hiredAt: extra.hiredAt ?? null,
      resumeStatus: extra.resumeStatus ?? 'Verified',
      atsScore: extra.atsScore,
      assessmentScore: extra.assessmentScore ?? null,
      proofs: Object.fromEntries(proofs.map((key) => [key, extra.allProofs || random() < 0.85])),
    })
  }

  const [applied, assessment, interview, offer, hired, rejected] = spec.funnel
  for (let i = 0; i < applied; i += 1) {
    add('Applied', { atsScore: intBetween(48, 98), resumeStatus: random() < 0.2 ? 'Pending verification' : 'Verified' })
  }
  for (let i = 0; i < assessment; i += 1) {
    const completed = random() < 0.6
    add('Assessment', {
      atsScore: intBetween(minAts, 98),
      assessmentScore: completed ? intBetween(Math.max(40, minAssessment - 20), 96) : null,
      allProofs: true,
    })
  }
  const passed = () => ({ atsScore: intBetween(minAts, 98), assessmentScore: intBetween(minAssessment, 97), allProofs: true })
  for (let i = 0; i < interview; i += 1) add('Technical Interview', passed())
  for (let i = 0; i < offer; i += 1) add('Offer', passed())
  for (let i = 0; i < hired; i += 1) {
    const hiredAt = activeUntil - (1 + i + random()) * DAY
    const appliedAt = hiredAt - (spec.hireDays[i] ?? 5) * DAY
    add('Hired', { ...passed(), appliedAt, hiredAt: Math.round(hiredAt), stageUpdatedAt: hiredAt })
  }
  for (let i = 0; i < rejected; i += 1) {
    const tookTest = random() < 0.5
    add('Rejected', {
      atsScore: intBetween(35, 90),
      assessmentScore: tookTest ? intBetween(25, Math.max(30, minAssessment - 1)) : null,
    })
  }
  return applicants
}

function buildSeed(now) {
  const jobs = SEED_JOBS.map((spec) => seedJob(spec, now))
  const applicants = SEED_JOBS.flatMap((spec, index) =>
    spec.status === 'Draft' ? [] : seedApplicants(spec, jobs[index], now),
  )
  return { jobs, applicants }
}

const storedArrayIsValid = (key, isValid) => {
  try {
    const raw = localStorage.getItem(key)
    if (raw === null) return false
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) && parsed.every(isValid)
  } catch {
    return false
  }
}

export const jobsStore = createLocalStore(JOBS_KEY, {
  fallback: () => [],
  parse: (value) => (Array.isArray(value) ? value.filter(isJob) : []),
})

export const applicantsStore = createLocalStore(APPLICANTS_KEY, {
  fallback: () => [],
  parse: (value) => (Array.isArray(value) ? value.filter(isApplicant) : []),
})

// Unsaved form state per job ("new" for a job being created), so leaving the form never loses work.
export const formDraftsStore = createLocalStore(FORM_DRAFTS_KEY, {
  fallback: () => ({}),
  parse: (value) => (isObject(value) ? value : {}),
})

// Writes the demo data once. Missing or corrupted storage is reseeded; valid data is never overwritten.
export function ensureRecruiterSeed(now = Date.now()) {
  const jobsValid = storedArrayIsValid(JOBS_KEY, isJob)
  const applicantsValid = storedArrayIsValid(APPLICANTS_KEY, isApplicant)
  if (jobsValid && applicantsValid) return
  const seed = buildSeed(now)
  if (!jobsValid) {
    jobsStore.write(seed.jobs)
    applicantsStore.write(seed.applicants)
    return
  }
  // Jobs survived but applicants were lost: rebuild applicants for the seeded jobs that still exist.
  const existing = new Set(jobsStore.read().map((job) => job.id))
  applicantsStore.write(seed.applicants.filter((app) => existing.has(app.jobId)))
}

export function nextJobNumber(jobs) {
  const numbers = jobs.map((job) => Number(job.id.replace('job-', ''))).filter(Number.isFinite)
  return numbers.length ? Math.max(...numbers) + 1 : 101
}

// Creates a job (no id yet) or updates the one with the same id. Returns the saved job.
export function saveJob(job, status, now = Date.now()) {
  let saved
  jobsStore.write((jobs) => {
    const existing = job.id ? jobs.find((item) => item.id === job.id) : null
    if (existing) {
      const publishing = status === 'Open' && existing.status === 'Draft'
      saved = {
        ...existing,
        ...job,
        status,
        updatedAt: now,
        publishedAt: publishing ? now : existing.publishedAt,
        assessmentId: job.assessment.type === 'none' ? null : existing.assessmentId ?? `asm-cfg-${existing.id.replace('job-', '')}`,
      }
      return jobs.map((item) => (item.id === existing.id ? saved : item))
    }
    const number = nextJobNumber(jobs)
    saved = {
      ...job,
      id: jobIdFor(number),
      requisitionId: `REQ-${number}`,
      status,
      assessmentId: job.assessment.type === 'none' ? null : `asm-cfg-${number}`,
      createdAt: now,
      updatedAt: now,
      publishedAt: status === 'Open' ? now : null,
      pausedAt: null,
      closedAt: null,
      seeded: false,
    }
    return [saved, ...jobs]
  })
  return saved
}

// Allowed status changes from the job actions menu.
const TRANSITIONS = {
  Open: ['Paused', 'Closed'],
  Paused: ['Open', 'Closed'],
  Draft: [],
  Closed: [],
}

export const canTransition = (from, to) => TRANSITIONS[from]?.includes(to) ?? false

export function setJobStatus(jobId, status, now = Date.now()) {
  let changed = false
  jobsStore.write((jobs) =>
    jobs.map((job) => {
      if (job.id !== jobId || !canTransition(job.status, status)) return job
      changed = true
      return {
        ...job,
        status,
        updatedAt: now,
        pausedAt: status === 'Paused' ? now : job.pausedAt,
        closedAt: status === 'Closed' ? now : job.closedAt,
      }
    }),
  )
  return changed
}

// Only drafts can be deleted; published jobs keep their applicant history.
export function deleteDraft(jobId) {
  let deleted = false
  jobsStore.write((jobs) => {
    const target = jobs.find((job) => job.id === jobId)
    if (!target || target.status !== 'Draft') return jobs
    deleted = true
    return jobs.filter((job) => job.id !== jobId)
  })
  if (deleted) {
    applicantsStore.write((apps) => (apps.some((app) => app.jobId === jobId) ? apps.filter((app) => app.jobId !== jobId) : apps))
    clearFormDraft(jobId)
  }
  return deleted
}

export function setApplicantStage(applicantId, stage, now = Date.now()) {
  if (!APPLICANT_STAGES.includes(stage)) return
  applicantsStore.write((apps) =>
    apps.map((app) =>
      app.id === applicantId && app.stage !== stage
        ? { ...app, stage, stageUpdatedAt: now, hiredAt: stage === 'Hired' ? now : null }
        : app,
    ),
  )
}

export const formDraftKey = (jobId) => jobId ?? 'new'

export function saveFormDraft(jobId, form) {
  formDraftsStore.write((drafts) => ({ ...drafts, [formDraftKey(jobId)]: { form, savedAt: Date.now() } }))
}

export function clearFormDraft(jobId) {
  const key = formDraftKey(jobId)
  formDraftsStore.write((drafts) => {
    if (!(key in drafts)) return drafts
    const next = { ...drafts }
    delete next[key]
    return next
  })
}
