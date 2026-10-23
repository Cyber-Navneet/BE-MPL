import { useCallback, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import JobToolbar from '../components/jobs/JobToolbar.jsx'
import AIRecommendationBanner from '../components/jobs/AIRecommendationBanner.jsx'
import SelectField from '../components/jobs/SelectField.jsx'
import JobCard from '../components/jobs/JobCard.jsx'
import EmptyState from '../components/jobs/EmptyState.jsx'
import JobFiltersPanel from '../components/jobs/JobFiltersPanel.jsx'
import JobDetailsDrawer from '../components/jobs/JobDetailsDrawer.jsx'
import ApplyConfirmDialog from '../components/jobs/ApplyConfirmDialog.jsx'
import { JOBS } from '../data/jobs.js'
import { useJobDiscovery } from '../hooks/useJobDiscovery.js'
import { useStoredIds } from '../hooks/useStoredIds.js'
import { SORT_OPTIONS, uniqueValues } from '../utils/jobUtils.js'

const LOCATIONS = uniqueValues(JOBS, (job) => job.location)
const SKILLS = uniqueValues(JOBS, (job) => job.skills)

export default function JobDiscovery() {
  const { notify } = useOutletContext()
  const discovery = useJobDiscovery(JOBS)
  const saved = useStoredIds('talentforge.savedJobs')
  const applied = useStoredIds('talentforge.appliedJobs')

  const [selectedJobId, setSelectedJobId] = useState(null)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)

  const selectedJob = JOBS.find((job) => job.id === selectedJobId) ?? null
  const resultCount = discovery.results.length

  const closeDetails = useCallback(() => setSelectedJobId(null), [])
  const closeFilters = useCallback(() => setFiltersOpen(false), [])
  const cancelApply = useCallback(() => setConfirmOpen(false), [])

  const toggleSave = (job) => {
    const wasSaved = saved.has(job.id)
    saved.toggle(job.id)
    notify(wasSaved ? `Removed ${job.title} from saved jobs.` : `Saved ${job.title}.`, wasSaved ? 'info' : 'success')
  }

  const confirmApply = () => {
    applied.add(selectedJob.id)
    setConfirmOpen(false)
    notify(`Application recorded for ${selectedJob.title} at ${selectedJob.company} (demo).`, 'success')
  }

  return (
    <div className="mx-auto max-w-[1180px]">
      <h1 className="text-2xl font-bold tracking-tight text-navy sm:text-[28px]">Job Discovery</h1>
      <p className="mt-1.5 text-[15px] text-muted">AI-matched opportunities tailored to your profile</p>

      <div className="mt-6 space-y-6">
        <JobToolbar
          query={discovery.query}
          onQueryChange={discovery.setQuery}
          jobType={discovery.jobType}
          onJobTypeChange={discovery.setJobType}
          activeFilterCount={discovery.activeFilterCount}
          onOpenFilters={() => setFiltersOpen(true)}
        />

        <AIRecommendationBanner topMatch={discovery.topMatch} sort={discovery.sort} onOpenJob={setSelectedJobId} />

        <section aria-labelledby="results-heading">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <h2 id="results-heading" aria-live="polite" className="text-[15px] font-normal text-muted">
                {resultCount} {resultCount === 1 ? 'job' : 'jobs'} found
              </h2>
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
            <SelectField
              label="Sort jobs"
              value={discovery.sort}
              onChange={discovery.setSort}
              options={SORT_OPTIONS}
              className="w-full sm:w-56"
              selectClassName="h-10 text-sm"
            />
          </div>

          {resultCount === 0 ? (
            <EmptyState onClear={discovery.resetAll} />
          ) : (
            <>
              <ul className="space-y-4">
                {discovery.visibleJobs.map((job) => (
                  <li key={job.id}>
                    <JobCard
                      job={job}
                      isSaved={saved.has(job.id)}
                      isApplied={applied.has(job.id)}
                      onOpen={() => setSelectedJobId(job.id)}
                      onToggleSave={() => toggleSave(job)}
                    />
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
        </section>
      </div>

      {filtersOpen && (
        <JobFiltersPanel
          filters={discovery.filters}
          locations={LOCATIONS}
          skills={SKILLS}
          onApply={discovery.setFilters}
          onClose={closeFilters}
        />
      )}

      {selectedJob && (
        <JobDetailsDrawer
          job={selectedJob}
          isSaved={saved.has(selectedJob.id)}
          isApplied={applied.has(selectedJob.id)}
          confirmOpen={confirmOpen}
          onToggleSave={() => toggleSave(selectedJob)}
          onApply={() => setConfirmOpen(true)}
          onClose={closeDetails}
        />
      )}

      {selectedJob && confirmOpen && (
        <ApplyConfirmDialog job={selectedJob} onConfirm={confirmApply} onCancel={cancelApply} />
      )}
    </div>
  )
}
