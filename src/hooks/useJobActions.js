import { useStoredIds } from './useStoredIds.js'

// Saved and applied job state (persisted in localStorage) with user feedback via `notify`.
export function useJobActions(notify) {
  const saved = useStoredIds('talentforge.savedJobs')
  const applied = useStoredIds('talentforge.appliedJobs')

  return {
    isSaved: saved.has,
    isApplied: applied.has,
    toggleSave: (job) => {
      const wasSaved = saved.has(job.id)
      saved.toggle(job.id)
      notify(wasSaved ? `Removed ${job.title} from saved jobs.` : `Saved ${job.title}.`, wasSaved ? 'info' : 'success')
    },
    apply: (job) => {
      applied.add(job.id)
      notify(`Application recorded for ${job.title} at ${job.company} (demo).`, 'success')
    },
  }
}
