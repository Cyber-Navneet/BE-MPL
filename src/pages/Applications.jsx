import { useCallback, useMemo, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import JobToolbar from '../components/jobs/JobToolbar.jsx'
import JobFiltersPanel from '../components/jobs/JobFiltersPanel.jsx'
import EmptyState from '../components/jobs/EmptyState.jsx'
import ApplicationCard from '../components/applications/ApplicationCard.jsx'
import NoApplications from '../components/applications/NoApplications.jsx'
import { useAssessmentSync } from '../hooks/useAssessmentSync.js'
import { applicationsStore, assessmentStatus, assessmentsStore, findJob } from '../utils/applicationStore.js'
import { DEFAULT_FILTERS, countActiveFilters, filterJobs, uniqueValues } from '../utils/jobUtils.js'

export default function Applications() {
  const { notify } = useOutletContext()
  const now = useAssessmentSync()
  const applications = applicationsStore.useStore()
  const assessments = assessmentsStore.useStore()

  const [query, setQuery] = useState('')
  const [jobType, setJobType] = useState('all')
  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const closeFilters = useCallback(() => setFiltersOpen(false), [])

  // Newest application first; applications whose job no longer exists are skipped.
  const entries = useMemo(
    () =>
      applications
        .map((application) => ({ application, job: findJob(application.jobId) }))
        .filter((entry) => entry.job)
        .sort((a, b) => b.application.appliedAt - a.application.appliedAt),
    [applications],
  )
  const jobs = entries.map((entry) => entry.job)
  const visibleJobIds = new Set(filterJobs(jobs, { query, jobType, filters }).map((job) => job.id))
  const visible = entries.filter((entry) => visibleJobIds.has(entry.job.id))

  const resetAll = () => {
    setQuery('')
    setJobType('all')
    setFilters(DEFAULT_FILTERS)
  }

  return (
    <div className="mx-auto max-w-[1180px]">
      <h1 className="text-2xl font-bold tracking-tight text-navy sm:text-[28px]">Applications</h1>
      <p className="mt-1.5 text-[15px] text-muted">Track your submitted applications and take the next step.</p>

      <div className="mt-6">
        {entries.length === 0 ? (
          <NoApplications
            message="Apply to a job from Job Discovery and it will appear here with a skills assessment to complete."
            notify={notify}
          />
        ) : (
          <>
            <JobToolbar
              query={query}
              onQueryChange={setQuery}
              jobType={jobType}
              onJobTypeChange={setJobType}
              activeFilterCount={countActiveFilters(filters)}
              onOpenFilters={() => setFiltersOpen(true)}
            />
            <p aria-live="polite" className="mt-5 mb-4 text-[15px] text-muted">
              {visible.length} {visible.length === 1 ? 'application' : 'applications'}
            </p>
            {visible.length === 0 ? (
              <EmptyState onClear={resetAll} />
            ) : (
              <ul className="space-y-4">
                {visible.map(({ application, job }) => {
                  const assessment = assessments[`asm-${application.id}`]
                  return (
                    <li key={application.id}>
                      <ApplicationCard
                        application={application}
                        job={job}
                        assessment={assessment}
                        status={assessment ? assessmentStatus(assessment, now) : null}
                      />
                    </li>
                  )
                })}
              </ul>
            )}
          </>
        )}
      </div>

      {filtersOpen && (
        <JobFiltersPanel
          filters={filters}
          locations={uniqueValues(jobs, (job) => job.location)}
          skills={uniqueValues(jobs, (job) => job.skills)}
          onApply={setFilters}
          onClose={closeFilters}
        />
      )}
    </div>
  )
}
