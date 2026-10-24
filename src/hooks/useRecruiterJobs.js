import { useMemo } from 'react'
import { applicantsStore, ensureRecruiterSeed, jobsStore } from '../utils/recruiterJobStorage.js'
import { groupApplicantsByJob } from '../utils/jobMetrics.js'

let seedChecked = false

// Recruiter jobs and applicants from demo storage. The demo data is seeded the first time a
// recruiter page needs it, so student sessions never touch these keys.
export function useRecruiterJobs() {
  if (!seedChecked) {
    seedChecked = true
    ensureRecruiterSeed()
  }
  const jobs = jobsStore.useStore()
  const applicants = applicantsStore.useStore()
  const applicantsByJob = useMemo(() => groupApplicantsByJob(applicants), [applicants])
  return { jobs, applicants, applicantsByJob }
}
