// Pure helpers for filtering, sorting and formatting job listings. None of them mutate their input.

export const PAGE_SIZE = 6

export const EMPLOYMENT_TYPES = ['Full-time', 'Part-time', 'Internship', 'Contract']
export const WORK_MODES = ['Remote', 'On-site', 'Hybrid']
export const EXPERIENCE_LEVELS = ['Entry Level', 'Junior', 'Mid Level']

export const SORT_OPTIONS = [
  { value: 'match', label: 'AI Match: High to Low' },
  { value: 'recent', label: 'Recently Posted' },
  { value: 'salary-desc', label: 'Salary: High to Low' },
  { value: 'salary-asc', label: 'Salary: Low to High' },
]

// Salary filters are entered in LPA (lakhs per annum); monthly pay is annualised to compare.
export const DEFAULT_FILTERS = {
  location: '',
  workModes: [],
  employmentTypes: [],
  experienceLevels: [],
  minSalary: '',
  maxSalary: '',
  minMatch: 0,
  skills: [],
}

const LAKH = 100000

const roundOne = (value) => String(Math.round(value * 10) / 10)

const annualise = (amount, period) => (period === 'month' ? amount * 12 : amount)

export function annualSalaryRange(job) {
  return [annualise(job.salaryMin, job.salaryPeriod), annualise(job.salaryMax, job.salaryPeriod)]
}

// Monthly pay shows as "₹15K–25K/month"; annual pay as "₹6–10 LPA".
export function formatSalary(job) {
  const { salaryMin, salaryMax, salaryPeriod } = job
  if (salaryPeriod === 'month') {
    const thousands = (value) => `${roundOne(value / 1000)}K`
    const range = salaryMin === salaryMax ? thousands(salaryMin) : `${thousands(salaryMin)}–${thousands(salaryMax)}`
    return `₹${range}/month`
  }
  const lakhs = (value) => roundOne(value / LAKH)
  const range = salaryMin === salaryMax ? lakhs(salaryMin) : `${lakhs(salaryMin)}–${lakhs(salaryMax)}`
  return `₹${range} LPA`
}

export function formatPostedShort(days) {
  if (days === 0) return 'Today'
  if (days < 7) return `${days}d ago`
  return `${Math.floor(days / 7)}w ago`
}

export function formatPostedLong(days) {
  if (days === 0) return 'Posted today'
  if (days < 7) return `Posted ${days} ${days === 1 ? 'day' : 'days'} ago`
  const weeks = Math.floor(days / 7)
  return `Posted ${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`
}

export function uniqueValues(jobs, pick) {
  return [...new Set(jobs.flatMap(pick))].sort((a, b) => a.localeCompare(b))
}

// Every whitespace-separated term must appear somewhere in the job (case-insensitive, partial).
function matchesQuery(job, query) {
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean)
  if (terms.length === 0) return true
  const haystack = [
    job.title,
    job.company,
    job.location,
    job.locationType,
    job.employmentType,
    job.experienceLevel,
    job.description,
    ...job.skills,
  ]
    .join(' ')
    .toLowerCase()
  return terms.every((term) => haystack.includes(term))
}

const includesOrEmpty = (selected, value) => selected.length === 0 || selected.includes(value)

function matchesFilters(job, filters) {
  const [annualMin, annualMax] = annualSalaryRange(job)
  const minSalary = parseFloat(filters.minSalary)
  const maxSalary = parseFloat(filters.maxSalary)

  return (
    (!filters.location || job.location === filters.location) &&
    includesOrEmpty(filters.workModes, job.locationType) &&
    includesOrEmpty(filters.employmentTypes, job.employmentType) &&
    includesOrEmpty(filters.experienceLevels, job.experienceLevel) &&
    // A job qualifies when its pay range overlaps the requested range.
    (Number.isNaN(minSalary) || annualMax >= minSalary * LAKH) &&
    (Number.isNaN(maxSalary) || annualMin <= maxSalary * LAKH) &&
    job.matchScore >= filters.minMatch &&
    filters.skills.every((skill) => job.skills.includes(skill))
  )
}

export function filterJobs(jobs, { query, jobType, filters }) {
  return jobs.filter(
    (job) =>
      (jobType === 'all' || job.employmentType === jobType) && matchesQuery(job, query) && matchesFilters(job, filters),
  )
}

const midSalary = (job) => {
  const [min, max] = annualSalaryRange(job)
  return (min + max) / 2
}

const comparators = {
  match: (a, b) => b.matchScore - a.matchScore,
  recent: (a, b) => a.postedDaysAgo - b.postedDaysAgo || b.matchScore - a.matchScore,
  'salary-desc': (a, b) => midSalary(b) - midSalary(a) || b.matchScore - a.matchScore,
  'salary-asc': (a, b) => midSalary(a) - midSalary(b) || b.matchScore - a.matchScore,
}

export function sortJobs(jobs, sort) {
  return [...jobs].sort(comparators[sort] ?? comparators.match)
}

export function getTopMatch(jobs) {
  return jobs.reduce((best, job) => (!best || job.matchScore > best.matchScore ? job : best), null)
}

export function countActiveFilters(filters) {
  return [
    filters.location !== '',
    filters.workModes.length > 0,
    filters.employmentTypes.length > 0,
    filters.experienceLevels.length > 0,
    filters.minSalary !== '',
    filters.maxSalary !== '',
    filters.minMatch > 0,
    filters.skills.length > 0,
  ].filter(Boolean).length
}
