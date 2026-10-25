// Interview records and derived numbers for the recruiter Dashboard.
// Interviews are seeded once from the My Jobs applicants (so every interview belongs to a real demo
// job and application) and persisted in localStorage. Demo persistence only — not a real scheduler.

import {
  ANALYTICS_PROFILE,
  ANALYTICS_START,
  FUNNEL_STAGES,
  INTERVIEW_SLOTS,
  INTERVIEW_STATUSES,
  INTERVIEWERS,
  MONTHS,
} from '../data/recruiterDashboardData.js'
import { INTERVIEW_TYPES } from '../data/candidates.js'
import { createLocalStore } from './localStore.js'
import { seededRandom } from './recruiterJobStorage.js'

const INTERVIEWS_KEY = 'talentforge_recruiter_interviews_v1'

const MINUTE = 60 * 1000
const HOUR = 60 * MINUTE

// ---- Dates (local time, weeks run Monday to Sunday) ----

export function startOfDay(timestamp) {
  const date = new Date(timestamp)
  date.setHours(0, 0, 0, 0)
  return date.getTime()
}

export function addDays(timestamp, days) {
  const date = new Date(timestamp)
  date.setDate(date.getDate() + days)
  return date.getTime()
}

export function startOfWeek(timestamp) {
  const date = new Date(startOfDay(timestamp))
  date.setDate(date.getDate() - ((date.getDay() + 6) % 7))
  return date.getTime()
}

export const weekDays = (weekStart) => Array.from({ length: 7 }, (_, index) => addDays(weekStart, index))
export const isSameDay = (a, b) => startOfDay(a) === startOfDay(b)
const inWeek = (timestamp, weekStart) => timestamp >= weekStart && timestamp < addDays(weekStart, 7)

// "8:30am"
export function formatClock(timestamp) {
  const date = new Date(timestamp)
  const hours = date.getHours()
  return `${hours % 12 || 12}:${String(date.getMinutes()).padStart(2, '0')}${hours < 12 ? 'am' : 'pm'}`
}

export const formatLongDate = (timestamp) =>
  new Date(timestamp).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

// "19 Oct – 25 Oct 2026"
export function formatWeekRange(weekStart) {
  const end = addDays(weekStart, 6)
  const short = (timestamp) => new Date(timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
  return `${short(weekStart)} – ${short(end)} ${new Date(end).getFullYear()}`
}

// ---- Interview seed and store ----

function hashString(value) {
  let hash = 2166136261
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

function atSlot(day, slotIndex) {
  const [hours, minutes, duration] = INTERVIEW_SLOTS[slotIndex]
  const date = new Date(day)
  date.setHours(hours, minutes, 0, 0)
  return { start: date.getTime(), end: date.getTime() + duration * MINUTE }
}

// Each applicant record is one candidate's application, so the applicant id is both the
// application id and the candidate id.
const interviewRecord = (app, time, fields) => ({
  id: `int-${app.id}`,
  applicationId: app.id,
  candidateId: app.id,
  jobId: app.jobId,
  candidateName: app.name,
  candidateEmail: app.email,
  round: 'Technical Interview',
  meetingUrl: null,
  ...time,
  ...fields,
})

const isWeekend = (day) => [0, 6].includes(new Date(day).getDay())

// Candidates in the Technical Interview stage of an open job get one weekday interview: most in the
// coming two weeks, the rest in the past week. Candidates already at Offer or Hired get the completed
// interview that got them there, dated between their application and their move to Offer / Hired.
export function buildInterviews(jobs, applicants, now = Date.now()) {
  const jobsById = new Map(jobs.map((job) => [job.id, job]))
  const today = startOfDay(now)
  const taken = new Set()
  const interviews = []

  ;[...applicants]
    .sort((a, b) => a.id.localeCompare(b.id))
    .forEach((app) => {
      const job = jobsById.get(app.jobId)
      if (!job || job.status === 'Draft') return
      const random = seededRandom(hashString(app.id))
      const pick = (list) => list[Math.floor(random() * list.length)]
      const type = random() < 0.7 ? INTERVIEW_TYPES[0] : random() < 0.6 ? INTERVIEW_TYPES[1] : INTERVIEW_TYPES[2]
      const interviewerName = pick(INTERVIEWERS)

      if (app.stage === 'Technical Interview' && job.status === 'Open') {
        const roll = random()
        const offset = roll < 0.55 ? Math.floor(random() * 8) : roll < 0.7 ? 8 + Math.floor(random() * 6) : -1 - Math.floor(random() * 7)
        let day = addDays(today, offset)
        let slot = Math.floor(random() * INTERVIEW_SLOTS.length)
        let time = atSlot(day, slot)
        // Weekdays only, never before the candidate reached this stage, and never two interviews in one slot.
        const blocked = () => isWeekend(day) || time.start < app.stageUpdatedAt + 2 * HOUR || taken.has(`${day}-${slot}`)
        for (let guard = 0; blocked() && guard < 400; guard += 1) {
          slot += 1
          if (slot === INTERVIEW_SLOTS.length) {
            slot = 0
            day = addDays(day, 1)
          }
          time = atSlot(day, slot)
        }
        taken.add(`${day}-${slot}`)
        const status = time.end <= now ? (random() < 0.85 ? 'Completed' : 'Cancelled') : random() < 0.1 ? 'Cancelled' : 'Scheduled'
        interviews.push(interviewRecord(app, time, { type, interviewerName, status }))
        return
      }

      if (app.stage === 'Offer' || app.stage === 'Hired') {
        const decidedAt = app.hiredAt ?? app.stageUpdatedAt
        const target = app.appliedAt + (decidedAt - app.appliedAt) * (0.5 + random() * 0.2)
        const slot = Math.floor(random() * INTERVIEW_SLOTS.length)
        let day = startOfDay(target)
        let time = atSlot(day, slot)
        while (isWeekend(day) || time.end > decidedAt - HOUR) {
          day = addDays(day, -1)
          time = atSlot(day, slot)
        }
        if (time.start <= app.appliedAt) {
          const start = Math.round(target / (15 * MINUTE)) * 15 * MINUTE
          time = { start, end: start + 30 * MINUTE }
        }
        interviews.push(interviewRecord(app, time, { type, interviewerName, status: 'Completed' }))
      }
    })

  return interviews.sort((a, b) => a.start - b.start)
}

const isObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value)
const isInterview = (item) =>
  isObject(item) &&
  typeof item.id === 'string' &&
  typeof item.applicationId === 'string' &&
  typeof item.jobId === 'string' &&
  Number.isFinite(item.start) &&
  Number.isFinite(item.end) &&
  INTERVIEW_STATUSES.includes(item.status)

export const interviewsStore = createLocalStore(INTERVIEWS_KEY, {
  fallback: () => [],
  parse: (value) => (Array.isArray(value) ? value.filter(isInterview) : []),
})

// Writes the demo interviews once. Valid stored interviews (including status changes) are never overwritten.
export function ensureInterviewSeed(jobs, applicants, now = Date.now()) {
  try {
    const raw = localStorage.getItem(INTERVIEWS_KEY)
    if (raw !== null && Array.isArray(JSON.parse(raw))) return
  } catch {
    // Missing, corrupted or unavailable storage: seed below.
  }
  interviewsStore.write(buildInterviews(jobs, applicants, now))
}

export function setInterviewStatus(interviewId, status) {
  if (!INTERVIEW_STATUSES.includes(status)) return
  interviewsStore.write((list) =>
    list.map((item) => (item.id === interviewId && item.status !== status ? { ...item, status } : item)),
  )
}

// ---- Interview views ----

// Attaches each interview's job and application; interviews whose job or application no longer exists are dropped.
export function linkInterviews(interviews, jobs, applicants) {
  const jobsById = new Map(jobs.map((job) => [job.id, job]))
  const appsById = new Map(applicants.map((app) => [app.id, app]))
  return interviews.flatMap((interview) => {
    const job = jobsById.get(interview.jobId)
    const application = appsById.get(interview.applicationId)
    return job && application ? [{ ...interview, job, application }] : []
  })
}

// What the recruiter sees: a scheduled interview that has started is "In progress", one that has ended
// without being marked completed is "Awaiting update". Only stored "Completed" counts as interviewed.
export function interviewState(interview, now = Date.now()) {
  if (interview.status !== 'Scheduled') return interview.status
  if (interview.end <= now) return 'Awaiting update'
  if (interview.start <= now) return 'In progress'
  return 'Scheduled'
}

export function matchesInterviewSearch(interview, query) {
  const needle = query.trim().toLowerCase()
  if (!needle) return true
  return [
    interview.candidateName,
    interview.interviewerName,
    interview.job.title,
    interview.job.company?.name,
    interview.type,
    interview.round,
  ].some((value) => typeof value === 'string' && value.toLowerCase().includes(needle))
}

// ---- Stat cards ----

// Interviewed = distinct applications with a completed interview that week; Hired = applicants hired that week.
export function weeklyHiringStats(interviews, jobs, applicants, weekStart, now = Date.now()) {
  const published = new Set(jobs.filter((job) => job.status !== 'Draft').map((job) => job.id))
  const interviewedIn = (start) =>
    new Set(
      interviews
        .filter((item) => item.status === 'Completed' && item.start <= now && inWeek(item.start, start))
        .map((item) => item.applicationId),
    ).size
  const hiredIn = (start) =>
    applicants.filter((app) => published.has(app.jobId) && app.stage === 'Hired' && app.hiredAt && inWeek(app.hiredAt, start)).length
  const previous = addDays(weekStart, -7)
  return {
    interviewed: interviewedIn(weekStart),
    interviewedPrevious: interviewedIn(previous),
    hired: hiredIn(weekStart),
    hiredPrevious: hiredIn(previous),
  }
}

// ---- Monthly recruitment analytics ----

// Activity during one month: applications received, assessments completed, candidates interviewed,
// offers issued and candidates hired. Deterministic per month; null for months without records
// (before the analytics start or not started yet). The running month only counts the days so far.
export function monthlyAnalytics(year, month, now = Date.now()) {
  const index = (year - ANALYTICS_START.year) * 12 + (month - ANALYTICS_START.month)
  if (index < 0 || new Date(year, month, 1).getTime() > now) return null

  const random = seededRandom(year * 100 + month + 1)
  const { baseApplications, growthPerYear, conversion } = ANALYTICS_PROFILE
  let volume = baseApplications[month] * (1 + (growthPerYear * index) / 12) * (0.92 + random() * 0.16)
  const counts = { applications: volume }
  ;['assessments', 'interviews', 'offers', 'hires'].forEach((key) => {
    const [low, high] = conversion[key]
    volume *= low + random() * (high - low)
    counts[key] = volume
  })

  const today = new Date(now)
  const partial = today.getFullYear() === year && today.getMonth() === month
  const share = partial ? today.getDate() / new Date(year, month + 1, 0).getDate() : 1
  return {
    year,
    month,
    partial,
    ...Object.fromEntries(FUNNEL_STAGES.map(({ key }) => [key, Math.round(counts[key] * share)])),
  }
}

// The `size` months ending at the selected month (crossing into the previous year when needed).
export function chartMonths(year, month, size = 5, now = Date.now()) {
  return Array.from({ length: size }, (_, i) => {
    const date = new Date(year, month - (size - 1 - i), 1)
    const y = date.getFullYear()
    const m = date.getMonth()
    return { key: `${y}-${m}`, year: y, month: m, label: MONTHS[m].slice(0, 3), data: monthlyAnalytics(y, m, now) }
  })
}

// Rounded axis maximum and evenly spaced ticks for a bar chart.
export function niceScale(max, tickCount = 4) {
  if (!(max > 0)) return { top: 1, ticks: [0] }
  const rough = max / tickCount
  const power = 10 ** Math.floor(Math.log10(rough))
  const step = [1, 2, 2.5, 5, 10].map((m) => m * power).find((value) => value >= rough)
  const top = Math.ceil(max / step) * step
  return { top, ticks: Array.from({ length: Math.round(top / step) + 1 }, (_, i) => Math.round(i * step * 100) / 100) }
}

// "46.2k" from 46,200; smaller numbers keep Indian digit grouping.
export function formatCount(value) {
  if (value >= 10000) return `${Number((value / 1000).toFixed(1))}k`
  return value.toLocaleString('en-IN')
}

export function analyticsCsv(year, now = Date.now()) {
  const header = ['Month', 'Year', ...FUNNEL_STAGES.map((stage) => stage.label)].join(',')
  const rows = MONTHS.map((name, month) => {
    const data = monthlyAnalytics(year, month, now)
    return [name, year, ...FUNNEL_STAGES.map(({ key }) => (data ? data[key] : ''))].join(',')
  })
  return [header, ...rows].join('\n')
}
