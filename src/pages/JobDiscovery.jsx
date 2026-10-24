import { useCallback, useMemo, useState } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import JobToolbar from '../components/jobs/JobToolbar.jsx'
import AIRecommendationBanner from '../components/jobs/AIRecommendationBanner.jsx'
import SelectField from '../components/jobs/SelectField.jsx'
import JobCard from '../components/jobs/JobCard.jsx'
import EmptyState from '../components/jobs/EmptyState.jsx'
import JobFiltersPanel from '../components/jobs/JobFiltersPanel.jsx'
import { JOBS } from '../data/jobs.js'
import { useJobDiscovery } from '../hooks/useJobDiscovery.js'
import { useJobActions } from '../hooks/useJobActions.js'
import { applicationsStore } from '../utils/applicationStore.js'
import { SORT_OPTIONS, uniqueValues } from '../utils/jobUtils.js'
import { analyzeMatch } from '../utils/matchScore.js'
import { profileStore } from '../utils/profileStore.js'

const LOCATIONS = uniqueValues(JOBS, (job) => job.location)
const SKILLS = uniqueValues(JOBS, (job) => job.skills)

export default function JobDiscovery() {
  const { notify } = useOutletContext()
  const navigate = useNavigate()
  const profile = profileStore.useStore()
  const applications = applicationsStore.useStore()

  // Match scores come from the student's current profile, and the applicant count includes
  // their own application, so both agree with the job details page.
  const jobs = useMemo(
    () =>
      JOBS.map((job) => ({
        ...job,
        matchScore: analyzeMatch(profile, job).score,
        applicants: job.applicants + (applications.some((app) => app.jobId === job.id) ? 1 : 0),
      })),
    [profile, applications],
  )
  const discovery = useJobDiscovery(jobs)
  const jobActions = useJobActions(notify)

  const [filtersOpen, setFiltersOpen] = useState(false)

  const resultCount = discovery.results.length
  const openJob = (jobId) => navigate(`/jobs/${jobId}`)

  const closeFilters = useCallback(() => setFiltersOpen(false), [])

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

        <AIRecommendationBanner topMatch={discovery.topMatch} sort={discovery.sort} onOpenJob={openJob} />

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
                      isSaved={jobActions.isSaved(job.id)}
                      isApplied={jobActions.isApplied(job.id)}
                      onOpen={() => openJob(job.id)}
                      onToggleSave={() => jobActions.toggleSave(job)}
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
    </div>
  )
}
