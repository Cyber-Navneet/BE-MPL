// Options and fictional defaults for the recruiter's Settings page. Team members are made-up people
// with example.com addresses. Passwords are never stored anywhere.
import { INTERVIEWERS, RECRUITER } from './recruiterDashboardData.js'

export const SETTINGS_TABS = [
  { id: 'account', label: 'Account & security' },
  { id: 'notifications', label: 'Notifications' },
  { id: 'hiring', label: 'Hiring preferences' },
  { id: 'team', label: 'Team' },
  { id: 'privacy', label: 'Privacy & data' },
]

export const TIME_ZONES = [
  { value: 'Asia/Kolkata', label: 'India (IST, UTC+5:30)' },
  { value: 'Asia/Dubai', label: 'Dubai (GST, UTC+4)' },
  { value: 'Asia/Singapore', label: 'Singapore (SGT, UTC+8)' },
  { value: 'Europe/London', label: 'London (GMT/BST)' },
  { value: 'America/New_York', label: 'New York (ET)' },
]
export const DIGEST_OPTIONS = [
  { value: 'instant', label: 'Instantly' },
  { value: 'daily', label: 'Daily summary' },
  { value: 'weekly', label: 'Weekly summary' },
]
export const INTERVIEW_DURATIONS = ['30', '45', '60', '90']
export const INTERVIEW_TYPES = ['Video', 'Phone', 'In Person']
export const REMINDER_OPTIONS = [
  { value: '1', label: '1 hour before' },
  { value: '24', label: '24 hours before' },
  { value: '48', label: '48 hours before' },
]
export const RETENTION_OPTIONS = [
  { value: '6', label: '6 months' },
  { value: '12', label: '12 months' },
  { value: '24', label: '24 months' },
]
export const TEAM_ROLES = ['Admin', 'Recruiter', 'Interviewer']

export const NOTIFICATION_TOGGLES = [
  { key: 'newApplications', label: 'New applications', description: 'When a candidate applies to one of your jobs.' },
  { key: 'assessmentSubmissions', label: 'Assessment submissions', description: 'When a candidate finishes an assessment.' },
  { key: 'interviewReminders', label: 'Interview reminders', description: 'Before each scheduled interview.' },
  { key: 'candidateMessages', label: 'Candidate messages', description: 'When a candidate replies to you.' },
  { key: 'weeklyReport', label: 'Weekly hiring report', description: 'A summary of your pipeline every Monday.' },
]

export const PRIVACY_TOGGLES = [
  { key: 'showSalary', label: 'Show salary on job posts', description: 'Candidates see the salary range before applying.' },
  {
    key: 'anonymizeRejected',
    label: 'Anonymise rejected candidates',
    description: 'Hide names and contact details once a candidate is rejected.',
  },
  {
    key: 'shareFeedback',
    label: 'Share feedback with candidates',
    description: 'Send a short summary of interview feedback after a decision.',
  },
]

export function createDefaultSettings(user) {
  return {
    account: {
      name: user?.name || RECRUITER.name,
      jobTitle: RECRUITER.role,
      email: user?.email || RECRUITER.email,
      phone: RECRUITER.phone,
      timeZone: 'Asia/Kolkata',
    },
    notifications: {
      newApplications: true,
      assessmentSubmissions: true,
      interviewReminders: true,
      candidateMessages: true,
      weeklyReport: false,
      email: true,
      inApp: true,
      digest: 'daily',
    },
    hiring: {
      interviewDuration: '45',
      interviewType: 'Video',
      reminderHours: '24',
      passingScore: 70,
      autoReject: false,
      autoRejectBelow: 40,
    },
    privacy: {
      retentionMonths: '12',
      showSalary: true,
      anonymizeRejected: false,
      shareFeedback: true,
    },
  }
}

const emailFor = (name) => `${name.toLowerCase().replace(/\s+/g, '.')}@techflow.example.com`

export function createDefaultTeam() {
  return INTERVIEWERS.map((name, index) => ({
    id: `tm-${index + 1}`,
    name,
    email: name === RECRUITER.name ? RECRUITER.email : emailFor(name),
    role: name === RECRUITER.name ? 'Admin' : index < 2 ? 'Recruiter' : 'Interviewer',
    status: 'Active',
  }))
}
