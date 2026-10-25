import { useMemo } from 'react'
import { ensureInterviewSeed, interviewsStore, linkInterviews } from '../utils/recruiterDashboardMetrics.js'

let seedChecked = false

// Dashboard interviews joined with their job and application. Seeded once from the My Jobs data
// the first time the recruiter Dashboard needs it.
export function useRecruiterInterviews(jobs, applicants) {
  if (!seedChecked) {
    seedChecked = true
    ensureInterviewSeed(jobs, applicants)
  }
  const interviews = interviewsStore.useStore()
  return useMemo(() => linkInterviews(interviews, jobs, applicants), [interviews, jobs, applicants])
}
