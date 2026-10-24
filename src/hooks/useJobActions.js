import { useStoredIds } from './useStoredIds.js'
import { applicationsStore, applyToJob } from '../utils/applicationStore.js'

// Saved jobs and applications (persisted in localStorage) with user feedback via `notify`.
// Applying also assigns the skill-based assessment for that job.
export function useJobActions(notify) {
  const saved = useStoredIds('talentforge.savedJobs')
  const applications = applicationsStore.useStore()

  return {
    isSaved: saved.has,
    isApplied: (jobId) => applications.some((app) => app.jobId === jobId),
    toggleSave: (job) => {
      const wasSaved = saved.has(job.id)
      saved.toggle(job.id)
      notify(wasSaved ? `Removed ${job.title} from saved jobs.` : `Saved ${job.title}.`, wasSaved ? 'info' : 'success')
    },
    apply: (job) => {
      applyToJob(job)
      notify(`Application recorded for ${job.title} at ${job.company} (demo). A skills assessment is waiting in Applications.`, 'success')
    },
  }
}
