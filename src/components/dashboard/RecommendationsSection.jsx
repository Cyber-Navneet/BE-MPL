import { useMemo, useState } from 'react'
import { SearchX } from 'lucide-react'
import FilterBar from './FilterBar.jsx'
import RecommendationCard from './RecommendationCard.jsx'
import ResultsLine from './ResultsLine.jsx'
import { RECOMMENDATIONS } from '../../data/dashboard.js'
import { EMPLOYMENT_TYPES, WORK_MODES } from '../../utils/jobUtils.js'
import {
  DEFAULT_RECOMMENDATION_FILTERS,
  RECOMMENDATION_SORTS,
  filterRecommendations,
  isAppliedTo,
  sortRecommendations,
  uniqueSorted,
} from '../../utils/dashboardUtils.js'

const toOptions = (anyLabel, values) => [{ value: '', label: anyLabel }, ...values.map((value) => ({ value, label: value }))]

const LOCATION_OPTIONS = toOptions('All locations', uniqueSorted(RECOMMENDATIONS.map((job) => job.location)))
const TYPE_OPTIONS = toOptions('All job types', EMPLOYMENT_TYPES)
const MODE_OPTIONS = toOptions('All work modes', WORK_MODES)
const MATCH_OPTIONS = [
  { value: '0', label: 'Any match score' },
  { value: '70', label: '70% match or more' },
  { value: '80', label: '80% match or more' },
  { value: '90', label: '90% match or more' },
]

export default function RecommendationsSection({ applications, onApply }) {
  const [query, setQuery] = useState('')
  const [filters, setFilters] = useState(DEFAULT_RECOMMENDATION_FILTERS)
  const [sort, setSort] = useState('match')

  const results = useMemo(
    () => sortRecommendations(filterRecommendations(RECOMMENDATIONS, query, filters), sort),
    [query, filters, sort],
  )
  const hasCriteria =
    query.trim() !== '' || Object.entries(filters).some(([key, value]) => value !== DEFAULT_RECOMMENDATION_FILTERS[key])

  const setFilter = (field) => (value) => setFilters((prev) => ({ ...prev, [field]: value }))
  const clearAll = () => {
    setQuery('')
    setFilters(DEFAULT_RECOMMENDATION_FILTERS)
  }

  return (
    <section aria-labelledby="recommended-heading">
      <h2 id="recommended-heading" className="mb-4 text-xl font-semibold text-home-ink sm:text-[22px]">
        Recommended for you
      </h2>

      <FilterBar
        searchLabel="Search recommended jobs"
        searchPlaceholder="Search by title, company, location or skill…"
        query={query}
        onQueryChange={setQuery}
        selects={[
          { label: 'Location', value: filters.location, onChange: setFilter('location'), options: LOCATION_OPTIONS },
          { label: 'Employment type', value: filters.employmentType, onChange: setFilter('employmentType'), options: TYPE_OPTIONS },
          { label: 'Work mode', value: filters.workMode, onChange: setFilter('workMode'), options: MODE_OPTIONS },
          { label: 'Minimum match score', value: filters.minMatch, onChange: setFilter('minMatch'), options: MATCH_OPTIONS },
          { label: 'Sort recommendations', value: sort, onChange: setSort, options: RECOMMENDATION_SORTS },
        ]}
      />

      <div className="mt-3 mb-4">
        <ResultsLine showClear={hasCriteria} onClear={clearAll}>
          {results.length} of {RECOMMENDATIONS.length} recommendations
        </ResultsLine>
      </div>

      {results.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-home-border bg-white px-6 py-12 text-center">
          <SearchX size={28} className="text-home-blue" aria-hidden="true" />
          <h3 className="mt-3 text-lg font-semibold text-home-ink">No recommendations match</h3>
          <p className="mt-1 max-w-sm text-sm text-home-muted">Try a different search or clear the filters.</p>
        </div>
      ) : (
        <ul className="space-y-4">
          {results.map((job) => (
            <li key={job.id}>
              <RecommendationCard job={job} applied={isAppliedTo(applications, job)} onApply={() => onApply(job)} />
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
