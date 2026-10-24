import { useMemo, useState } from 'react'
import { ArrowRight, SearchX } from 'lucide-react'
import ApplicationCard from './ApplicationCard.jsx'
import FilterBar from './FilterBar.jsx'
import ResultsLine from './ResultsLine.jsx'
import { APPLICATION_STATUSES } from '../../data/dashboard.js'
import { EMPLOYMENT_TYPES, WORK_MODES } from '../../utils/jobUtils.js'
import {
  APPLICATION_SORTS,
  DEFAULT_APPLICATION_FILTERS,
  filterApplications,
  sortApplications,
  uniqueSorted,
} from '../../utils/dashboardUtils.js'

const PREVIEW_COUNT = 3

const toOptions = (anyLabel, values) => [{ value: '', label: anyLabel }, ...values.map((value) => ({ value, label: value }))]

// "View all" expands the list in place; search, filters and sorting apply to it.
export default function ApplicationsSection({ applications, unreadByApplication, onChat, onDelete, onStatusChange }) {
  const [query, setQuery] = useState('')
  const [filters, setFilters] = useState(DEFAULT_APPLICATION_FILTERS)
  const [sort, setSort] = useState('newest')
  const [expanded, setExpanded] = useState(false)

  const results = useMemo(
    () => sortApplications(filterApplications(applications, query, filters), sort),
    [applications, query, filters, sort],
  )
  const visible = expanded ? results : results.slice(0, PREVIEW_COUNT)
  const canExpand = results.length > PREVIEW_COUNT
  const hasCriteria = query.trim() !== '' || Object.values(filters).some(Boolean)

  const setFilter = (field) => (value) => setFilters((prev) => ({ ...prev, [field]: value }))
  const clearAll = () => {
    setQuery('')
    setFilters(DEFAULT_APPLICATION_FILTERS)
  }

  const statusOptions = [
    { value: '', label: `All statuses (${applications.length})` },
    ...APPLICATION_STATUSES.map((status) => ({
      value: status,
      label: `${status} (${applications.filter((app) => app.status === status).length})`,
    })),
  ]

  return (
    <section aria-labelledby="applications-heading">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 id="applications-heading" className="text-xl font-semibold text-home-ink sm:text-[22px]">
          Your applications
        </h2>
        {canExpand && (
          <button
            type="button"
            onClick={() => setExpanded((value) => !value)}
            aria-expanded={expanded}
            aria-controls="applications-list"
            className="inline-flex items-center gap-1.5 rounded text-[15px] font-medium text-home-blue hover:underline focus-visible:outline-2 focus-visible:outline-home-blue sm:text-base"
          >
            {expanded ? 'Show less' : 'View all'}
            <ArrowRight size={18} className={expanded ? '-rotate-90' : undefined} aria-hidden="true" />
          </button>
        )}
      </div>

      <FilterBar
        searchLabel="Search applications"
        searchPlaceholder="Search by title, company, location, skill or status…"
        query={query}
        onQueryChange={setQuery}
        selects={[
          { label: 'Application status', value: filters.status, onChange: setFilter('status'), options: statusOptions },
          {
            label: 'Location',
            value: filters.location,
            onChange: setFilter('location'),
            options: toOptions('All locations', uniqueSorted(applications.map((app) => app.location))),
          },
          {
            label: 'Employment type',
            value: filters.employmentType,
            onChange: setFilter('employmentType'),
            options: toOptions('All job types', EMPLOYMENT_TYPES),
          },
          { label: 'Work mode', value: filters.workMode, onChange: setFilter('workMode'), options: toOptions('All work modes', WORK_MODES) },
          { label: 'Sort applications', value: sort, onChange: setSort, options: APPLICATION_SORTS },
        ]}
      />

      <div className="mt-3 mb-4">
        <ResultsLine showClear={hasCriteria} onClear={clearAll}>
          Showing {visible.length} of {results.length} matching {results.length === 1 ? 'application' : 'applications'}
          {hasCriteria && ` (${applications.length} total)`}
        </ResultsLine>
      </div>

      {results.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-home-border bg-white px-6 py-12 text-center">
          <SearchX size={28} className="text-home-blue" aria-hidden="true" />
          <h3 className="mt-3 text-lg font-semibold text-home-ink">
            {applications.length === 0 ? 'No applications yet' : 'No applications match'}
          </h3>
          <p className="mt-1 max-w-sm text-sm text-home-muted">
            {applications.length === 0
              ? 'Apply to a recommended job below and it will appear here.'
              : 'Try a different search or clear the filters.'}
          </p>
        </div>
      ) : (
        <ul id="applications-list" className="space-y-4">
          {visible.map((application) => (
            <li key={application.id}>
              <ApplicationCard
                application={application}
                unread={unreadByApplication[application.id] ?? 0}
                onChat={() => onChat(application.id)}
                onStatusChange={(status) => onStatusChange(application, status)}
                onDelete={() => onDelete(application.id)}
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
