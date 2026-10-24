import { useEffect, useMemo, useState } from 'react'
import { INITIAL_APPLICATIONS } from '../data/applications.js'
import {
  DEFAULT_FILTERS,
  countActiveFilters,
  filterApplications,
  getNextStatus,
  getTopMatch,
  sortApplications,
} from '../utils/applicationUtils.js'

// Bump the version if the shape of the demo data changes, so stale browser copies are ignored.
const STORAGE_KEY = 'talentforge.applications.v1'

function readStoredApplications() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY))
    const valid =
      Array.isArray(stored) &&
      stored.every((app) => Number.isInteger(app?.id) && Array.isArray(app.messages) && Array.isArray(app.skills))
    return valid ? stored : INITIAL_APPLICATIONS
  } catch {
    return INITIAL_APPLICATIONS
  }
}

function writeStoredApplications(applications) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(applications))
  } catch {
    // Storage unavailable (e.g. private mode); changes live in React state only.
  }
}

// Application list (persisted in localStorage) plus search, type, filter and AI-sort state.
export function useApplications() {
  const [applications, setApplications] = useState(readStoredApplications)
  const [query, setQuery] = useState('')
  const [type, setType] = useState('all')
  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  const [aiSort, setAiSort] = useState(true)

  useEffect(() => {
    writeStoredApplications(applications)
  }, [applications])

  const results = useMemo(
    () => sortApplications(filterApplications(applications, { query, type, filters }), aiSort),
    [applications, query, type, filters, aiSort],
  )
  const topMatch = useMemo(() => getTopMatch(results), [results])
  const activeFilterCount = countActiveFilters(filters)

  const updateApplication = (id, change) =>
    setApplications((prev) => prev.map((app) => (app.id === id ? { ...app, ...change(app) } : app)))

  return {
    applications,
    results,
    topMatch,
    query,
    type,
    filters,
    aiSort,
    activeFilterCount,
    hasAnyCriteria: query.trim() !== '' || type !== 'all' || activeFilterCount > 0,
    setQuery,
    setType,
    setFilters,
    setAiSort,
    clearCriteria: () => {
      setQuery('')
      setType('all')
      setFilters(DEFAULT_FILTERS)
    },
    deleteApplication: (id) => setApplications((prev) => prev.filter((app) => app.id !== id)),
    advanceStatus: (id) =>
      updateApplication(id, (app) => {
        const next = getNextStatus(app.status)
        // Once an outcome is reached there is no pending deadline left.
        return next ? { status: next, deadline: next === 'Offer' ? null : app.deadline } : {}
      }),
    markChatRead: (id) => updateApplication(id, () => ({ chatUnread: false })),
    sendMessage: (id, text) =>
      updateApplication(id, (app) => ({
        messages: [
          ...app.messages,
          { id: `m${Date.now()}`, from: 'candidate', text, sentAt: new Date().toISOString() },
        ],
      })),
    resetDemoData: () => setApplications(INITIAL_APPLICATIONS),
  }
}
