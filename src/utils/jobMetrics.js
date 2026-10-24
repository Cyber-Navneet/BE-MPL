// Derived numbers for the My Jobs module. Everything is computed from the stored jobs and applicants,
// so the stat cards, tab counts and funnels always agree with each other.

import { PIPELINE_STAGES, PROOF_OPTIONS } from '../data/recruiterJobs.js'

const DAY = 24 * 60 * 60 * 1000
const URGENT_AFTER_DAYS = 5

const lakh = (value) => `${Number(value.toFixed(2))}`
const rupees = (value) => `₹${Math.round(value).toLocaleString('en-IN')}`

// "₹24–32 LPA", "₹25,000–₹35,000 / month", or null when no salary is set.
export function formatSalary({ salaryMin, salaryMax, salaryPeriod }) {
  const min = Number(salaryMin)
  const max = Number(salaryMax)
  const hasMin = salaryMin !== null && salaryMin !== '' && Number.isFinite(min) && min > 0
  const hasMax = salaryMax !== null && salaryMax !== '' && Number.isFinite(max) && max > 0
  if (!hasMin && !hasMax) return null
  if (salaryPeriod === 'monthly') {
    if (hasMin && hasMax && min !== max) return `${rupees(min)}–${rupees(max)} / month`
    return `${rupees(hasMin ? min : max)} / month`
  }
  if (hasMin && hasMax && min !== max) return `₹${lakh(min)}–${lakh(max)} LPA`
  return `₹${lakh(hasMin ? min : max)} LPA`
}

export const daysSince = (timestamp, now = Date.now()) => Math.max(0, Math.floor((now - timestamp) / DAY))

export function formatRelative(timestamp, now = Date.now()) {
  const minutes = Math.max(0, Math.round((now - timestamp) / 60000))
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.round(hours / 24)
  return `${days} day${days === 1 ? '' : 's'} ago`
}

// "Open for 18 days", "Paused 4 days ago", ... for a job card.
export function jobAgeLabel(job, now = Date.now()) {
  const plural = (n) => `${n} day${n === 1 ? '' : 's'}`
  if (job.status === 'Draft') return `Draft saved ${formatRelative(job.updatedAt, now)}`
  if (job.status === 'Closed' && job.closedAt) return `Closed after ${plural(daysSince(job.publishedAt, job.closedAt))}`
  if (job.status === 'Paused' && job.pausedAt) return `Paused ${formatRelative(job.pausedAt, now)}`
  return `Open for ${plural(daysSince(job.publishedAt, now))}`
}

export const proofLabel = (key, field = 'label') => PROOF_OPTIONS.find((option) => option.key === key)?.[field] ?? key

// Short gateway summary for a card, e.g. "GitHub + ATS >85%".
export function gatewaySummary(job) {
  const proofs = job.mandatoryProofs.filter((key) => key !== 'resume').map((key) => proofLabel(key, 'short'))
  const parts = [...proofs]
  if (job.minimumATSScore != null && job.minimumATSScore !== '') parts.push(`ATS >${job.minimumATSScore}%`)
  return parts.join(' + ')
}

export function groupApplicantsByJob(applicants) {
  const map = new Map()
  applicants.forEach((app) => {
    if (!map.has(app.jobId)) map.set(app.jobId, [])
    map.get(app.jobId).push(app)
  })
  return map
}

// Candidates currently sitting in each funnel stage, plus how many in Assessment have a score.
export function stageCounts(applicants) {
  const counts = Object.fromEntries(PIPELINE_STAGES.map((stage) => [stage, 0]))
  let rejected = 0
  let assessmentsCompleted = 0
  applicants.forEach((app) => {
    if (app.stage === 'Rejected') rejected += 1
    else counts[app.stage] += 1
    if (app.stage === 'Assessment' && app.assessmentScore != null) assessmentsCompleted += 1
  })
  return { counts, rejected, assessmentsCompleted }
}

export function lastScreenedAt(applicants) {
  const screened = applicants.filter((app) => app.stage !== 'Applied').map((app) => app.stageUpdatedAt)
  return screened.length ? Math.max(...screened) : null
}

const average = (values) => (values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : null)
const roundOne = (value) => Math.round(value * 10) / 10

export function dashboardStats(jobs, applicants, now = Date.now()) {
  const jobsById = new Map(jobs.map((job) => [job.id, job]))
  const linked = applicants.filter((app) => jobsById.get(app.jobId) && jobsById.get(app.jobId).status !== 'Draft')
  const openJobs = jobs.filter((job) => job.status === 'Open')

  const pending = linked.filter((app) => {
    const status = jobsById.get(app.jobId).status
    return app.stage === 'Applied' && (status === 'Open' || status === 'Paused')
  })

  const hires = linked.filter((app) => app.stage === 'Hired' && app.hiredAt)
  const hireDays = (list) => average(list.map((app) => (app.hiredAt - app.appliedAt) / DAY))
  const recent = hires.filter((app) => now - app.hiredAt <= 30 * DAY)
  const previous = hires.filter((app) => now - app.hiredAt > 30 * DAY && now - app.hiredAt <= 60 * DAY)
  const recentAvg = hireDays(recent)
  const previousAvg = hireDays(previous)
  const avgHiringDays = recentAvg ?? hireDays(hires)

  return {
    activeJobs: openJobs.length,
    newThisWeek: openJobs.filter((job) => job.publishedAt && now - job.publishedAt <= 7 * DAY).length,
    totalApplications: linked.length,
    pendingReviews: pending.length,
    urgent: pending.some((app) => now - app.appliedAt > URGENT_AFTER_DAYS * DAY),
    avgHiringDays: avgHiringDays == null ? null : roundOne(avgHiringDays),
    hiringTrendDays: recentAvg != null && previousAvg != null ? roundOne(previousAvg - recentAvg) : null,
    hiringWindowLabel: recentAvg != null ? 'last 30 days' : 'all time',
  }
}

// Verification outcome for one applicant against the job's configured gateways.
export function verificationStatus(applicant, job) {
  const missing = job.mandatoryProofs.filter((key) => !applicant.proofs?.[key])
  if (job.minimumATSScore != null && applicant.atsScore != null && applicant.atsScore < job.minimumATSScore) {
    return { label: 'Below ATS threshold', tone: 'danger', missing }
  }
  if (missing.length || applicant.resumeStatus !== 'Verified') return { label: 'Needs review', tone: 'warning', missing }
  return { label: 'Verified', tone: 'success', missing }
}

export function matchesJobSearch(job, query) {
  const needle = query.trim().toLowerCase()
  if (!needle) return true
  const haystack = [
    job.title,
    job.department,
    job.description,
    job.company?.name,
    job.id,
    job.requisitionId,
    job.location,
    job.employmentType,
    job.workMode,
    ...(job.requiredSkills ?? []),
  ]
  return haystack.some((value) => typeof value === 'string' && value.toLowerCase().includes(needle))
}
