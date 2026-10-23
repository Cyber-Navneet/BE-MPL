import { useCallback, useState } from 'react'
import { Info } from 'lucide-react'
import RecommendedJobCard from './RecommendedJobCard.jsx'
import JobToolbar from '../jobs/JobToolbar.jsx'
import EmptyState from '../jobs/EmptyState.jsx'
import JobFiltersPanel from '../jobs/JobFiltersPanel.jsx'
import JobDetailsDrawer from '../jobs/JobDetailsDrawer.jsx'
import ApplyConfirmDialog from '../jobs/ApplyConfirmDialog.jsx'
import { useJobDiscovery } from '../../hooks/useJobDiscovery.js'
import { useJobActions } from '../../hooks/useJobActions.js'
import { uniqueValues } from '../../utils/jobUtils.js'

// `jobs` carry either demo match scores or scores calculated from the analysed resume (`isDemo`).
export default function RecommendedJobs({ jobs, isDemo, detectedSkillCount, notify }) {
  const discovery = useJobDiscovery(jobs)
  const jobActions = useJobActions(notify)
  const [selectedJobId, setSelectedJobId] = useState(null)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)

  const selectedJob = jobs.find((job) => job.id === selectedJobId) ?? null
  const resultCount = discovery.results.length

  const closeDetails = useCallback(() => setSelectedJobId(null), [])
  const closeFilters = useCallback(() => setFiltersOpen(false), [])
  const cancelApply = useCallback(() => setConfirmOpen(false), [])

  return (
    <section aria-labelledby="recommended-title" className="mt-10">
      <h2 id="recommended-title" className="text-xl font-bold tracking-tight text-navy">
        Recommended Jobs Matching Your Resume
      </h2>
      <p className="mt-2 flex items-start gap-2 text-sm text-muted">
        <Info size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
        {isDemo
          ? 'Match scores below are demo values. Analyze your resume to calculate them from your own skills.'
          : `Match = share of each job's required skills found in your resume (${detectedSkillCount} skills detected).`}
      </p>

      <div className="mt-5">
        <JobToolbar
          query={discovery.query}
          onQueryChange={discovery.setQuery}
          jobType={discovery.jobType}
          onJobTypeChange={discovery.setJobType}
          activeFilterCount={discovery.activeFilterCount}
          onOpenFilters={() => setFiltersOpen(true)}
        />
      </div>

      <div className="mt-5 mb-4 flex items-center gap-3">
        <p aria-live="polite" className="text-[15px] text-muted">
          {resultCount} {resultCount === 1 ? 'job' : 'jobs'} found
        </p>
        {discovery.hasAnyCriteria && (
          <button
            type="button"
            onClick={discovery.resetAll}
            className="rounded text-sm font-medium text-primary hover:underline focus-visible:outline-2 focus-visible:outline-primary"
          >
            Clear all
          </button>
        )}
      </div>

      {resultCount === 0 ? (
        <EmptyState onClear={discovery.resetAll} />
      ) : (
        <>
          <ul className="space-y-4">
            {discovery.visibleJobs.map((job) => (
              <li key={job.id}>
                <RecommendedJobCard job={job} onView={() => setSelectedJobId(job.id)} />
              </li>
            ))}
          </ul>
          <div className="mt-6 flex flex-col items-center gap-3">
            <p className="text-sm text-muted">
              Showing {discovery.visibleJobs.length} of {resultCount}
            </p>
            {discovery.hasMore && (
              <button
                type="button"
                onClick={discovery.loadMore}
                className="h-11 rounded-lg border border-line bg-white px-6 text-sm font-medium text-navy hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                Load more jobs
              </button>
            )}
          </div>
        </>
      )}

      {filtersOpen && (
        <JobFiltersPanel
          filters={discovery.filters}
          locations={uniqueValues(jobs, (job) => job.location)}
          skills={uniqueValues(jobs, (job) => job.skills)}
          onApply={discovery.setFilters}
          onClose={closeFilters}
        />
      )}

      {selectedJob && (
        <JobDetailsDrawer
          job={selectedJob}
          isSaved={jobActions.isSaved(selectedJob.id)}
          isApplied={jobActions.isApplied(selectedJob.id)}
          confirmOpen={confirmOpen}
          onToggleSave={() => jobActions.toggleSave(selectedJob)}
          onApply={() => setConfirmOpen(true)}
          onClose={closeDetails}
        />
      )}

      {selectedJob && confirmOpen && (
        <ApplyConfirmDialog
          job={selectedJob}
          onConfirm={() => {
            jobActions.apply(selectedJob)
            setConfirmOpen(false)
          }}
          onCancel={cancelApply}
        />
      )}
    </section>
  )
}
