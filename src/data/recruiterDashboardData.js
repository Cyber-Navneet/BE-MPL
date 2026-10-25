// Fictional demo data for the recruiter Dashboard — not real people, meetings or hiring figures.
// Jobs and applications come from the My Jobs store (utils/recruiterJobStorage.js); this file only adds
// what the dashboard needs on top of them: the recruiter, the interview panel and monthly analytics.

import { RECRUITER_COMPANY } from './recruiterJobs.js'

export const RECRUITER = {
  id: 'rec-001',
  name: 'Preeti Singh',
  company: RECRUITER_COMPANY.name,
  role: 'Talent Acquisition Lead',
  email: 'recruiter@talentforge.demo',
  phone: '+91 98200 45678',
  location: RECRUITER_COMPANY.location,
  department: 'Human Resources',
  hiringFocus: ['Engineering', 'Data', 'Design'],
}

export const INTERVIEWERS = ['Rahul Verma', 'Anjali Rao', 'Deepak Nair', 'Farah Qureshi', 'Mohit Arora', 'Preeti Singh']

export const INTERVIEW_STATUSES = ['Scheduled', 'Completed', 'Cancelled']

// Interview slots as [hour, minute, durationMinutes], in local time.
export const INTERVIEW_SLOTS = [
  [8, 30, 30],
  [9, 30, 45],
  [10, 30, 45],
  [11, 30, 30],
  [12, 0, 45],
  [14, 0, 45],
  [15, 0, 30],
  [15, 30, 60],
  [16, 30, 30],
  [17, 30, 45],
]

export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]
export const ANALYTICS_YEARS = [2025, 2026, 2027]
// Monthly analytics exist from this month onwards (and never for months that have not started yet).
export const ANALYTICS_START = { year: 2025, month: 0 }

// The five recruitment milestones, each counted as activity during the selected month.
export const FUNNEL_STAGES = [
  { key: 'applications', label: 'Applications', description: 'Applications received' },
  { key: 'assessments', label: 'Assessments', description: 'Assessments completed' },
  { key: 'interviews', label: 'Interviews', description: 'Candidates interviewed' },
  { key: 'offers', label: 'Offers', description: 'Offers issued' },
  { key: 'hires', label: 'Hires', description: 'Candidates hired' },
]

// Per-month base volume of applications (seasonality: quieter around the new year, busier in campus season)
// and the share of the previous stage that reaches each milestone.
export const ANALYTICS_PROFILE = {
  baseApplications: [210, 235, 260, 240, 255, 270, 290, 300, 335, 320, 280, 220],
  growthPerYear: 0.18,
  conversion: {
    assessments: [0.58, 0.7],
    interviews: [0.42, 0.55],
    offers: [0.3, 0.42],
    hires: [0.62, 0.82],
  },
}
