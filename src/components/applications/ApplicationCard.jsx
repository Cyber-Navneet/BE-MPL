import { Link } from 'react-router-dom'
import { BriefcaseBusiness, Laptop, MapPin } from 'lucide-react'
import { CompanyLogo } from '../jobs/JobBadges.jsx'
import { ScoreBadge, StatusBadge } from '../assessment/AssessmentBadges.jsx'
import { formatSalary } from '../../utils/jobUtils.js'
import { formatDate } from '../../utils/formatTime.js'

// The title link stretches over the card so the whole card opens the application.
export default function ApplicationCard({ application, job, assessment, status }) {
  const meta = [
    { key: 'location', icon: MapPin, text: job.location },
    { key: 'type', icon: BriefcaseBusiness, text: job.employmentType },
    { key: 'arrangement', icon: Laptop, text: job.locationType },
  ]

  return (
    <article className="relative rounded-2xl border border-line bg-white p-4 shadow-[0_1px_2px_rgba(16,25,46,0.04)] transition-[border-color,box-shadow] duration-150 hover:border-primary/30 hover:shadow-[0_4px_14px_rgba(16,25,46,0.07)] has-focus-visible:border-primary sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <div className="flex min-w-0 flex-1 gap-3 sm:gap-4">
          <CompanyLogo initials={job.companyInitials} className="h-11 w-11 rounded-xl text-base sm:h-14 sm:w-14 sm:text-lg" />
          <div className="min-w-0">
            <h3 className="text-base font-semibold text-navy sm:text-lg">
              <Link
                to={`/applications/${application.id}`}
                className="outline-none after:absolute after:inset-0 after:rounded-2xl after:content-['']"
              >
                {job.title}
              </Link>
            </h3>
            <p className="mt-0.5 text-[15px] text-muted">{job.company}</p>
            <ul className="mt-3 flex flex-wrap items-center gap-y-1.5 text-[15px] text-muted">
              {meta.map(({ key, icon: Icon, text }, index) => (
                <li
                  key={key}
                  className={index > 0 ? 'ml-3 flex items-center gap-1.5 border-l border-line pl-3' : 'flex items-center gap-1.5'}
                >
                  <Icon size={15} aria-hidden="true" />
                  {text}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:items-end">
          <p className="text-base font-bold text-navy underline decoration-line decoration-1 underline-offset-[6px]">
            <span className="sr-only">Salary: </span>
            {formatSalary(job)}
          </p>
          <p className="text-[13px] text-muted">Submitted {formatDate(application.appliedAt)}</p>
          <div className="mt-1 flex flex-wrap gap-2">
            {assessment?.result && (
              <ScoreBadge percentage={assessment.result.percentage} provisional={assessment.result.provisional} />
            )}
            {assessment && <StatusBadge status={status} />}
          </div>
        </div>
      </div>
    </article>
  )
}
