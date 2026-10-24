// Pure helpers for the recruiter's Candidate Applications board. None of them mutate their input.
import { ASSESSMENT_SECTIONS } from '../data/candidates.js'

export const COLUMN_SORTS = {
  newest: 'Newest first',
  name: 'Name (A–Z)',
  score: 'Highest score',
}

export const initialsOf = (name) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('')

// "Just now", "45m ago", "2h ago", "1 day ago", "3 days ago".
export function formatRelative(iso) {
  const minutes = Math.floor((Date.now() - new Date(iso)) / 60000)
  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days} ${days === 1 ? 'day' : 'days'} ago`
}

export const formatInr = (amount) => `₹${Number(amount).toLocaleString('en-IN')}`

export function formatDate(value) {
  return new Date(`${value}T00:00`).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
}

// "Mon, 26 Oct" for compact card labels.
export function formatShortDate(value) {
  return new Date(`${value}T00:00`).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })
}

export function formatTime(value) {
  const [hours, minutes] = value.split(':').map(Number)
  return new Date(2000, 0, 1, hours, minutes).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' })
}

// Today's date as YYYY-MM-DD in local time, for `min` on date inputs.
export function todayInputValue() {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
}

// Every whitespace-separated term must appear in the name, role, company, location or skills.
export function matchesQuery(candidate, query) {
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean)
  if (terms.length === 0) return true
  const haystack = [candidate.name, candidate.role, candidate.company, candidate.location, ...candidate.skills]
    .join(' ')
    .toLowerCase()
  return terms.every((term) => haystack.includes(term))
}

// The score a column ranks by: match % for new applicants, assessment % afterwards.
export const scoreOf = (candidate) =>
  candidate.stage === 'applied' ? candidate.matchScore : candidate.assessmentScore ?? candidate.matchScore

const comparators = {
  newest: (a, b) => new Date(b.stageUpdatedAt) - new Date(a.stageUpdatedAt),
  name: (a, b) => a.name.localeCompare(b.name),
  score: (a, b) => scoreOf(b) - scoreOf(a),
}

export const sortCandidates = (candidates, sort) => [...candidates].sort(comparators[sort] ?? comparators.newest)

// Section scores, clamped to 0–100, derived from the overall score so results stay consistent.
export function assessmentBreakdown(score) {
  const sections = ASSESSMENT_SECTIONS.map(({ name, offset }) => ({
    name,
    score: Math.max(0, Math.min(100, score + offset)),
  }))
  const ranked = [...sections].sort((a, b) => b.score - a.score)
  return { sections, strengths: ranked.slice(0, 2), improvements: ranked.slice(-2).reverse() }
}

export function assessmentStatus(score) {
  if (score >= 80) return 'Passed — strong'
  if (score >= 65) return 'Passed'
  return 'Below threshold'
}

// Plain-text resume built only from the fictional candidate record.
export function buildResumeText(candidate) {
  return [
    candidate.name.toUpperCase(),
    `${candidate.role} candidate · ${candidate.location}`,
    `${candidate.name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
    '',
    'SUMMARY',
    `Engineer currently at ${candidate.company}, applying for the ${candidate.role} role.`,
    '',
    'SKILLS',
    candidate.skills.join(', '),
    '',
    'EXPERIENCE',
    `${candidate.company} — ${candidate.role.replace(/^Senior /, '')} (2023 – Present)`,
    `• Built and shipped features using ${candidate.skills.slice(0, 2).join(' and ')}.`,
    '• Improved reliability and performance of key services.',
    '',
    'EDUCATION',
    'B.Tech in Computer Science, Demo Institute of Technology',
    '',
    'DEMO RESUME — generated from fictional sample data for TalentForge.',
  ].join('\n')
}
