import { Bookmark, BookmarkCheck, BriefcaseBusiness, Clock, MapPin, Users } from 'lucide-react'
import { CompanyLogo } from '../jobs/JobBadges.jsx'
import { formatPostedLong, formatSalary } from '../../utils/jobUtils.js'
import { cn } from '../../utils/cn.js'

const applicantCount = new Intl.NumberFormat('en-IN')

export default function JobSummaryCard({ job, applicants, isSaved, onToggleSave }) {
  const SaveIcon = isSaved ? BookmarkCheck : Bookmark

  return (
    <section
      aria-label="Job summary"
      className="rounded-xl border border-line bg-white p-5 shadow-[0_1px_2px_rgba(16,25,46,0.04)] sm:p-6"
    >
      <div className="flex gap-4">
        <CompanyLogo initials={job.companyInitials} className="h-14 w-14 rounded-xl text-lg sm:h-16 sm:w-16 sm:text-xl" />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h1 className="text-xl font-bold tracking-tight text-navy sm:text-2xl">{job.title}</h1>
              <p className="mt-0.5 text-[15px] text-muted">{job.company}</p>
            </div>
            <button
              type="button"
              onClick={onToggleSave}
              aria-pressed={isSaved}
              aria-label={isSaved ? `Remove ${job.title} from saved jobs` : `Save ${job.title}`}
              className={cn(
                'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors focus-visible:outline-2 focus-visible:outline-primary',
                isSaved ? 'text-primary hover:bg-pale' : 'text-muted hover:bg-slate-100 hover:text-navy',
              )}
            >
              <SaveIcon size={20} aria-hidden="true" />
            </button>
          </div>

          <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted sm:text-[15px]">
            <li className="flex items-center gap-1.5">
              <MapPin size={16} aria-hidden="true" />
              {job.location}
            </li>
            <li className="flex items-center gap-1.5">
              <BriefcaseBusiness size={16} aria-hidden="true" />
              {job.employmentType}
            </li>
            <li className="flex items-center gap-1.5">
              <Clock size={16} aria-hidden="true" />
              {formatPostedLong(job.postedDaysAgo)}
            </li>
            <li className="flex items-center gap-1.5">
              <Users size={16} aria-hidden="true" />
              {applicantCount.format(applicants)} applicants
            </li>
          </ul>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded-full bg-pale px-3 py-1 text-sm font-semibold text-primary">
              <span className="sr-only">Salary: </span>
              {formatSalary(job)}
            </span>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
              <span className="sr-only">Work arrangement: </span>
              {job.locationType}
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
