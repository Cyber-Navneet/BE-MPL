import { useMemo } from 'react'
import { ensureInterviewSeed, interviewsStore, linkInterviews } from '../utils/recruiterDashboardMetrics.js'

let seedChecked = false

// Dashboard interviews joined with their job and application. Seeded once from the My Jobs data
// the first time the recruiter Dashboard needs it. The signed-in recruiter conducts every interview,
// and every interview is a video meeting (also for interviews saved before this rule).
export function useRecruiterInterviews(jobs, applicants, interviewerName) {
  if (!seedChecked) {
    seedChecked = true
    ensureInterviewSeed(jobs, applicants)
  }
  const interviews = interviewsStore.useStore()
  return useMemo(
    () => linkInterviews(interviews, jobs, applicants).map((item) => ({ ...item, interviewerName, type: 'Video' })),
    [interviews, jobs, applicants, interviewerName],
  )
}
