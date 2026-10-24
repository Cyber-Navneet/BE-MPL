// Pure helpers for the student home dashboard. None of them mutate their input.
import { RESUME_TIPS, TARGET_SKILLS } from '../data/dashboard.js'

export const DEFAULT_APPLICATION_FILTERS = { status: '', location: '', employmentType: '', workMode: '' }
export const DEFAULT_RECOMMENDATION_FILTERS = { location: '', employmentType: '', workMode: '', minMatch: '0' }

export const APPLICATION_SORTS = [
  { value: 'newest', label: 'Newest applied' },
  { value: 'oldest', label: 'Oldest applied' },
  { value: 'title', label: 'Job title (A–Z)' },
  { value: 'company', label: 'Company (A–Z)' },
]

export const RECOMMENDATION_SORTS = [
  { value: 'match', label: 'Best match' },
  { value: 'newest', label: 'Newest posted' },
  { value: 'title', label: 'Job title (A–Z)' },
  { value: 'company', label: 'Company (A–Z)' },
]

const DAY_MS = 24 * 60 * 60 * 1000

export function greetingFor(date = new Date()) {
  const hour = date.getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

export const firstName = (name) => name.trim().split(/\s+/)[0] ?? ''

export function profileCompletion(fields) {
  const filled = fields.filter((field) => field.value.trim() !== '').length
  return Math.round((filled / fields.length) * 100)
}

export const uniqueSorted = (values) => [...new Set(values)].sort((a, b) => a.localeCompare(b))

export const isAppliedTo = (applications, recommendation) =>
  applications.some((application) => application.jobId === recommendation.id)

export function createApplication(recommendation) {
  const { id, title, company, initials, salary, location, employmentType, workMode, skills } = recommendation
  return {
    id: `app-${Date.now()}`,
    jobId: id,
    title,
    company,
    initials,
    salary,
    location,
    employmentType,
    workMode,
    skills,
    status: 'Applied',
    appliedOn: new Date().toISOString(),
  }
}

export function countUnread(messages = []) {
  return messages.filter((message) => message.from === 'recruiter' && !message.read).length
}

// Every whitespace-separated term must appear in one of the given fields (case-insensitive).
function matchesQuery(fields, query) {
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean)
  if (terms.length === 0) return true
  const haystack = fields.flat().join(' ').toLowerCase()
  return terms.every((term) => haystack.includes(term))
}

const matchesFilter = (selected, value) => !selected || selected === value

export function filterApplications(applications, query, filters) {
  return applications.filter(
    (app) =>
      matchesQuery([app.title, app.company, app.location, app.status, app.skills], query) &&
      matchesFilter(filters.status, app.status) &&
      matchesFilter(filters.location, app.location) &&
      matchesFilter(filters.employmentType, app.employmentType) &&
      matchesFilter(filters.workMode, app.workMode),
  )
}

export function filterRecommendations(recommendations, query, filters) {
  return recommendations.filter(
    (rec) =>
      matchesQuery([rec.title, rec.company, rec.location, rec.skills], query) &&
      matchesFilter(filters.location, rec.location) &&
      matchesFilter(filters.employmentType, rec.employmentType) &&
      matchesFilter(filters.workMode, rec.workMode) &&
      rec.matchScore >= Number(filters.minMatch),
  )
}

const byNewestApplied = (a, b) => new Date(b.appliedOn) - new Date(a.appliedOn)

const applicationComparators = {
  newest: byNewestApplied,
  oldest: (a, b) => byNewestApplied(b, a),
  title: (a, b) => a.title.localeCompare(b.title) || byNewestApplied(a, b),
  company: (a, b) => a.company.localeCompare(b.company) || byNewestApplied(a, b),
}

const recommendationComparators = {
  match: (a, b) => b.matchScore - a.matchScore,
  newest: (a, b) => a.postedDaysAgo - b.postedDaysAgo || b.matchScore - a.matchScore,
  title: (a, b) => a.title.localeCompare(b.title),
  company: (a, b) => a.company.localeCompare(b.company) || b.matchScore - a.matchScore,
}

export const sortApplications = (applications, sort) =>
  [...applications].sort(applicationComparators[sort] ?? byNewestApplied)

export const sortRecommendations = (recommendations, sort) =>
  [...recommendations].sort(recommendationComparators[sort] ?? recommendationComparators.match)

export function formatPosted(days) {
  if (days === 0) return 'Today'
  if (days < 7) return `${days}d ago`
  return `${Math.floor(days / 7)}w ago`
}

export function formatAppliedDate(iso) {
  const days = Math.floor((Date.now() - new Date(iso)) / DAY_MS)
  if (days <= 0) return 'Applied today'
  return `Applied ${days} ${days === 1 ? 'day' : 'days'} ago`
}

// "10:42 am" for today, otherwise "22 Oct, 10:42 am".
export function formatMessageTime(iso) {
  const date = new Date(iso)
  const time = date.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' })
  if (date.toDateString() === new Date().toDateString()) return time
  return `${date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}, ${time}`
}

export const missingTargetSkills = (detectedSkills) => TARGET_SKILLS.filter((skill) => !detectedSkills.includes(skill))

export const resumeSuggestions = (rules) =>
  rules.filter((rule) => rule.earned < rule.max && RESUME_TIPS[rule.label]).map((rule) => RESUME_TIPS[rule.label])
