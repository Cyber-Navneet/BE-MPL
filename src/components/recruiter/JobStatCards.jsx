import { ArrowRight, BriefcaseBusiness, Gauge, MailCheck, Users } from 'lucide-react'

const cardClasses =
  'flex min-h-40 flex-col rounded-2xl bg-linear-to-b from-home-gradient-from to-primary p-5 text-white shadow-[0_8px_24px_rgba(36,99,245,0.18)] sm:p-6'

function StatCard({ icon: Icon, label, value, unit, badge, footer }) {
  return (
    <section aria-label={label} className={cardClasses}>
      <h2 className="flex items-center gap-3 text-base font-medium sm:text-lg">
        <Icon size={20} aria-hidden="true" />
        {label}
      </h2>
      <p className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="text-4xl font-bold tracking-tight sm:text-[44px]">{value}</span>
        {unit && <span className="text-base text-white/85">{unit}</span>}
        {badge}
      </p>
      <div className="mt-auto pt-3 text-sm text-white/80">{footer}</div>
    </section>
  )
}

// The four summary cards above the job list. `stats` comes from dashboardStats().
export default function JobStatCards({ stats, onBatchReview }) {
  const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`
  const hiringFooter =
    stats.hiringTrendDays == null
      ? `Average over ${stats.hiringWindowLabel}`
      : stats.hiringTrendDays > 0
        ? `${plural(stats.hiringTrendDays, 'day')} faster than last month`
        : stats.hiringTrendDays < 0
          ? `${plural(Math.abs(stats.hiringTrendDays), 'day')} slower than last month`
          : 'Same as last month'

  return (
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
        footer="Across all published jobs"
      />
      <StatCard
        icon={MailCheck}
        label="Pending Reviews"
        value={stats.pendingReviews}
        badge={
          stats.urgent && (
            <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-sm font-semibold text-red-700">Urgent</span>
          )
        }
        footer={
          stats.pendingReviews ? (
            <button
              type="button"
              onClick={onBatchReview}
              className="ml-auto flex items-center gap-1 rounded font-medium text-white hover:underline focus-visible:outline-2 focus-visible:outline-white"
            >
              Batch review <ArrowRight size={16} aria-hidden="true" />
            </button>
          ) : (
            'All caught up'
          )
        }
      />
      <StatCard
        icon={Gauge}
        label="Avg Hiring time"
        value={stats.avgHiringDays ?? '—'}
        unit={stats.avgHiringDays == null ? 'No hires yet' : stats.avgHiringDays === 1 ? 'Day' : 'Days'}
        footer={stats.avgHiringDays == null ? 'Measured from application to joining' : hiringFooter}
      />
    </div>
  )
}
