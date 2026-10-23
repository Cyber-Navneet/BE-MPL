import { useMemo, useState } from 'react'
import { DEFAULT_FILTERS, PAGE_SIZE, countActiveFilters, filterJobs, getTopMatch, sortJobs } from '../utils/jobUtils.js'

// Search, filter, sort and paging state for the Job Discovery page.
// Results are derived on render; changing any criterion resets paging to the first page.
export function useJobDiscovery(jobs) {
  const [query, setQueryState] = useState('')
  const [jobType, setJobTypeState] = useState('all')
  const [filters, setFiltersState] = useState(DEFAULT_FILTERS)
  const [sort, setSortState] = useState('match')
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  const withPagingReset = (setter) => (value) => {
    setter(value)
    setVisibleCount(PAGE_SIZE)
  }

  const results = useMemo(
    () => sortJobs(filterJobs(jobs, { query, jobType, filters }), sort),
    [jobs, query, jobType, filters, sort],
  )
  const topMatch = useMemo(() => getTopMatch(results), [results])

  return {
    query,
    jobType,
    filters,
    sort,
    results,
    topMatch,
    visibleJobs: results.slice(0, visibleCount),
    hasMore: visibleCount < results.length,
    activeFilterCount: countActiveFilters(filters),
    hasAnyCriteria: query.trim() !== '' || jobType !== 'all' || countActiveFilters(filters) > 0,
    setQuery: withPagingReset(setQueryState),
    setJobType: withPagingReset(setJobTypeState),
    setFilters: withPagingReset(setFiltersState),
    setSort: withPagingReset(setSortState),
    loadMore: () => setVisibleCount((count) => count + PAGE_SIZE),
    resetAll: () => {
      setQueryState('')
      setJobTypeState('all')
      setFiltersState(DEFAULT_FILTERS)
      setVisibleCount(PAGE_SIZE)
    },
  }
}
