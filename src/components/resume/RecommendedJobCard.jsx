import { BriefcaseBusiness, Clock, Eye, Laptop, MapPin, Sparkles, Users } from 'lucide-react'
import { CompanyLogo, SkillList } from '../jobs/JobBadges.jsx'
import { formatPostedShort, formatSalary } from '../../utils/jobUtils.js'

export default function RecommendedJobCard({ job, onView }) {
  const meta = [
    { key: 'location', icon: MapPin, text: job.location },
    { key: 'type', icon: BriefcaseBusiness, text: job.employmentType.toLowerCase() },
    { key: 'arrangement', icon: Laptop, text: job.locationType },
    { key: 'posted', icon: Clock, text: formatPostedShort(job.postedDaysAgo) },
    { key: 'applicants', icon: Users, text: `${job.applicants} applicants` },
  ]

  return (
    <article className="rounded-2xl border border-line bg-white p-4 shadow-[0_1px_2px_rgba(16,25,46,0.04)] transition-[border-color,box-shadow] duration-150 hover:border-primary/30 hover:shadow-[0_4px_14px_rgba(16,25,46,0.07)] sm:p-6">
      <div className="flex gap-3 sm:gap-4">
        <CompanyLogo initials={job.companyInitials} className="h-11 w-11 rounded-xl text-base sm:h-14 sm:w-14 sm:text-lg" />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-1">
            <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1.5">
              <h3 className="text-base font-semibold text-navy sm:text-lg">{job.title}</h3>
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap text-emerald-700">
                <Sparkles size={12} aria-hidden="true" />
                {job.matchScore}% Match
              </span>
            </div>
            <p className="text-base font-bold whitespace-nowrap text-navy underline decoration-2 underline-offset-4 sm:text-lg">
              <span className="sr-only">Salary: </span>
              {formatSalary(job)}
            </p>
          </div>
          <p className="mt-1 text-[15px] text-muted">{job.company}</p>

          <ul className="mt-3 flex flex-wrap items-center gap-y-1.5 text-[15px] text-muted">
            {meta.map(({ key, icon: Icon, text }, index) => (
              <li
                key={key}
                className={
                  index > 0
                    ? 'flex items-center gap-1.5 sm:ml-4 sm:border-l sm:border-line sm:pl-4 max-sm:ml-3'
                    : 'flex items-center gap-1.5'
                }
              >
                <Icon size={15} aria-hidden="true" />
                {text}
              </li>
            ))}
          </ul>

          <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
            <SkillList skills={job.skills} />
            <button
              type="button"
              onClick={onView}
              aria-haspopup="dialog"
              aria-label={`View ${job.title} at ${job.company}`}
              className="ml-auto inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-white hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <Eye size={16} aria-hidden="true" />
              View
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}
