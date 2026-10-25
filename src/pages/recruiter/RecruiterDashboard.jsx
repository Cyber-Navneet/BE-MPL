import { useMemo, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { BriefcaseBusiness, Gauge, MailCheck, Users } from 'lucide-react'
import { StatCard } from '../../components/recruiter/JobStatCards.jsx'
import UpcomingInterviews from '../../components/recruiterDashboard/UpcomingInterviews.jsx'
import RecruitmentProgress from '../../components/recruiterDashboard/RecruitmentProgress.jsx'
import { RECRUITER } from '../../data/recruiterDashboardData.js'
import { useRecruiterJobs } from '../../hooks/useRecruiterJobs.js'
import { useRecruiterInterviews } from '../../hooks/useRecruiterInterviews.js'
import { dashboardStats } from '../../utils/jobMetrics.js'
import { startOfDay, startOfWeek, weeklyHiringStats } from '../../utils/recruiterDashboardMetrics.js'

const plural = (count, word) => `${count} ${word}${count === 1 ? '' : 's'}`

function trend(current, previous, against) {
  const diff = current - previous
  if (diff > 0) return `+${diff} more than ${against}`
  if (diff < 0) return `${Math.abs(diff)} fewer than ${against}`
  return `Same as ${against}`
}

function WeekBadge({ children }) {
  return <span className="rounded-full bg-white px-3 py-0.5 text-sm font-semibold text-deep">{children}</span>
}

// Recruiter home at /dashboard. Every figure is derived from the demo jobs, applications and
// interviews saved in this browser; nothing is sent to a server.
export default function RecruiterDashboard({ user }) {
  const { notify } = useOutletContext()
  // One clock per visit, so derived figures do not shift while the page is open.
  const [now] = useState(() => Date.now())
  const [selectedDay, setSelectedDay] = useState(() => startOfDay(now))

  const { jobs, applicants } = useRecruiterJobs()
  const interviews = useRecruiterInterviews(jobs, applicants)

  const weekStart = startOfWeek(selectedDay)
  const currentWeek = weekStart === startOfWeek(now)
  const stats = useMemo(() => dashboardStats(jobs, applicants, now), [jobs, applicants, now])
  const weekly = useMemo(
    () => weeklyHiringStats(interviews, jobs, applicants, weekStart, now),
    [interviews, jobs, applicants, weekStart, now],
  )
  const publishedJobs = jobs.filter((job) => job.status !== 'Draft').length
  const weekLabel = currentWeek
    ? 'this week'
    : `week of ${new Date(weekStart).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`
  const against = currentWeek ? 'last week' : 'the week before'

  return (
    <div className="mx-auto max-w-[1180px] space-y-8">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-heading sm:text-[32px]">
          Welcome back, {user.name || RECRUITER.name} <span aria-hidden="true">👋</span>
        </h1>
        <p className="mt-2 text-[15px] text-secondary sm:text-lg">
          Track active jobs, monitor applications, manage upcoming interviews, and stay updated on your recruitment progress.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 xl:gap-5">
        <StatCard
          icon={BriefcaseBusiness}
          label="Total Active Jobs"
          value={stats.activeJobs}
          unit={stats.activeJobs === 1 ? 'open position' : 'open positions'}
          footer={stats.newThisWeek ? `+${stats.newThisWeek} new this week` : 'No new jobs this week'}
        />
        <StatCard
          icon={Users}
          label="Total Applications"
          value={stats.totalApplications.toLocaleString('en-IN')}
          unit={stats.totalApplications === 1 ? 'candidate' : 'candidates'}
          footer={`Across ${plural(publishedJobs, 'published job')}`}
        />
        <StatCard
          icon={MailCheck}
          label="Interviewed"
          value={weekly.interviewed}
          badge={<WeekBadge>{weekLabel}</WeekBadge>}
          footer={trend(weekly.interviewed, weekly.interviewedPrevious, against)}
        />
        <StatCard
          icon={Gauge}
          label="Hired"
          value={weekly.hired}
          badge={<WeekBadge>{weekLabel}</WeekBadge>}
          footer={trend(weekly.hired, weekly.hiredPrevious, against)}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2 xl:items-start">
        <UpcomingInterviews
          interviews={interviews}
          now={now}
          selectedDay={selectedDay}
          onSelectDay={setSelectedDay}
          notify={notify}
        />
        <RecruitmentProgress now={now} notify={notify} />
      </div>
    </div>
  )
}
