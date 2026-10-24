// Pure helpers for the Applications page. None of them mutate their input.

export const APPLICATION_TYPES = ['Full-time', 'Part-time', 'Internship', 'Contract', 'Freelance']
export const WORK_MODES = ['Remote', 'Hybrid', 'On-site']
export const EXPERIENCE_LEVELS = ['Entry Level', '1–2 Years', '3–5 Years', '5+ Years']
export const STATUSES = ['Applied', 'Design challenge', 'Interview', 'Final decision', 'Rejected', 'Offer']

export const DEFAULT_FILTERS = {
  workModes: [],
  experience: [],
  statuses: [],
}

const NEXT_STATUS = {
  Applied: 'Design challenge',
  'Design challenge': 'Interview',
  Interview: 'Final decision',
  'Final decision': 'Offer',
}

export function getNextStatus(status) {
  return NEXT_STATUS[status] ?? null
}

const TIMELINE_STEPS = ['Application submitted', 'Design challenge', 'Interview', 'Final decision']

// Offer and Rejected both sit past the last step; the final step then shows the outcome.
const STATUS_STEP = {
  Applied: 0,
  'Design challenge': 1,
  Interview: 2,
  'Final decision': 3,
  Offer: 4,
  Rejected: 4,
}

// Returns [{ label, state }] where state is 'done' | 'current' | 'upcoming' | 'rejected'.
export function getTimeline(status) {
  const activeStep = STATUS_STEP[status] ?? 0
  const lastStep = TIMELINE_STEPS.length - 1

  return TIMELINE_STEPS.map((label, index) => {
    if (index === lastStep && status === 'Rejected') return { label: 'Final decision · Not selected', state: 'rejected' }
    if (index === lastStep && status === 'Offer') return { label: 'Final decision · Offer received', state: 'done' }
    if (index < activeStep) return { label, state: 'done' }
    if (index === activeStep) return { label, state: 'current' }
    return { label, state: 'upcoming' }
  })
}

// Parses `YYYY-MM-DD` as a local calendar date (new Date('YYYY-MM-DD') would be UTC midnight).
function parseDate(iso) {
  const [year, month, day] = iso.split('-').map(Number)
  return new Date(year, month - 1, day)
}

const longDate = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
const shortDate = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short' })
const messageTime = new Intl.DateTimeFormat('en-IN', {
  day: 'numeric',
  month: 'short',
  hour: 'numeric',
  minute: '2-digit',
})

export const formatDate = (iso) => longDate.format(parseDate(iso))
export const formatShortDate = (iso) => shortDate.format(parseDate(iso))
export const formatMessageTime = (dateTime) => messageTime.format(new Date(dateTime))

const DAY_MS = 24 * 60 * 60 * 1000

// `tone` is 'none' | 'normal' | 'soon' | 'overdue' and drives the card's emphasis colour.
export function getDeadlineInfo(deadline, today = new Date()) {
  if (!deadline) return { label: 'No deadline', tone: 'none' }

  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  // Rounding absorbs the one-hour shift on daylight-saving changeover days.
  const days = Math.round((parseDate(deadline) - startOfToday) / DAY_MS)

  if (days < 0) {
    const overdue = -days
    return { label: `Overdue by ${overdue} ${overdue === 1 ? 'day' : 'days'}`, tone: 'overdue' }
  }
  if (days === 0) return { label: 'Due today', tone: 'soon' }
  if (days === 1) return { label: 'Due tomorrow', tone: 'soon' }
  return { label: `Due in ${days} days`, tone: days <= 3 ? 'soon' : 'normal' }
}

// Every whitespace-separated term must appear in the title, company, location or skills.
function matchesQuery(application, query) {
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean)
  if (terms.length === 0) return true
  const haystack = [application.jobTitle, application.company, application.location, ...application.skills]
    .join(' ')
    .toLowerCase()
  return terms.every((term) => haystack.includes(term))
}

const includesOrEmpty = (selected, value) => selected.length === 0 || selected.includes(value)

export function filterApplications(applications, { query, type, filters }) {
  return applications.filter(
    (application) =>
      (type === 'all' || application.type === type) &&
      matchesQuery(application, query) &&
      includesOrEmpty(filters.workModes, application.workMode) &&
      includesOrEmpty(filters.experience, application.experience) &&
      includesOrEmpty(filters.statuses, application.status),
  )
}

// AI mode sorts by match score; otherwise the most recent applications come first.
export function sortApplications(applications, aiSort) {
  const byRecent = (a, b) => b.appliedDate.localeCompare(a.appliedDate)
  const byMatch = (a, b) => b.matchScore - a.matchScore || byRecent(a, b)
  return [...applications].sort(aiSort ? byMatch : byRecent)
}

export function getTopMatch(applications) {
  return applications.reduce((best, app) => (!best || app.matchScore > best.matchScore ? app : best), null)
}

export function countActiveFilters(filters) {
  return filters.workModes.length + filters.experience.length + filters.statuses.length
}
