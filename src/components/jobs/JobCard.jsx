import { Bookmark, BookmarkCheck, BriefcaseBusiness, CircleCheck, Clock, MapPin, Users } from 'lucide-react'
import { CompanyLogo, MatchBadge, SkillList } from './JobBadges.jsx'
import { formatPostedShort, formatSalary } from '../../utils/jobUtils.js'
import { cn } from '../../utils/cn.js'

// The title button stretches over the whole card (via ::after), so clicking anywhere opens the
// job; the save button sits above that layer so it only toggles the saved state.
export default function JobCard({ job, isSaved, isApplied, onOpen, onToggleSave }) {
  const location = job.locationType === 'Hybrid' ? `${job.location} · Hybrid` : job.location
  const SaveIcon = isSaved ? BookmarkCheck : Bookmark

  return (
    <article className="relative rounded-xl border border-line bg-white p-4 shadow-[0_1px_2px_rgba(16,25,46,0.04)] transition-[border-color,box-shadow] duration-150 hover:border-primary/30 hover:shadow-[0_4px_14px_rgba(16,25,46,0.07)] has-focus-visible:border-primary sm:p-5">
      <div className="flex gap-3 sm:gap-4">
        <CompanyLogo initials={job.companyInitials} className="h-10 w-10 text-sm sm:h-12 sm:w-12 sm:text-base" />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
            <div className="min-w-0">
              <h3 className="text-base font-semibold text-navy sm:text-lg">
                <button
                  type="button"
                  onClick={onOpen}
                  aria-haspopup="dialog"
                  className="text-left outline-none after:absolute after:inset-0 after:rounded-xl after:content-['']"
                >
                  {job.title}
                </button>
              </h3>
              <p className="mt-0.5 text-[15px] text-muted">{job.company}</p>
            </div>

            <div className="relative z-10 flex items-center gap-2">
              {isApplied && (
                <span className="inline-flex items-center gap-1 rounded-full bg-pale px-2.5 py-1 text-xs font-semibold text-primary">
                  <CircleCheck size={13} aria-hidden="true" /> Applied
                </span>
              )}
              <MatchBadge score={job.matchScore} />
              <button
                type="button"
                onClick={onToggleSave}
                aria-pressed={isSaved}
                aria-label={isSaved ? `Remove ${job.title} from saved jobs` : `Save ${job.title}`}
                className={cn(
                  'flex h-9 w-9 items-center justify-center rounded-lg transition-colors focus-visible:outline-2 focus-visible:outline-primary',
                  isSaved ? 'text-primary hover:bg-pale' : 'text-muted hover:bg-slate-100 hover:text-navy',
                )}
              >
                <SaveIcon size={18} aria-hidden="true" />
              </button>
            </div>
          </div>

          <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-[15px] text-muted">
            <li className="flex items-center gap-1.5">
              <MapPin size={15} aria-hidden="true" />
              {location}
            </li>
            <li className="flex items-center gap-1.5">
              <BriefcaseBusiness size={15} aria-hidden="true" />
              {job.employmentType.toLowerCase()}
            </li>
            <li className="flex items-center gap-1.5">
              <Clock size={15} aria-hidden="true" />
              {formatPostedShort(job.postedDaysAgo)}
            </li>
            <li className="flex items-center gap-1.5">
              <Users size={15} aria-hidden="true" />
              {job.applicants} applicants
            </li>
          </ul>

          <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
            <SkillList skills={job.skills} />
            <p className="ml-auto text-[15px] font-semibold whitespace-nowrap text-navy sm:text-base">
              <span className="sr-only">Salary: </span>
              {formatSalary(job)}
            </p>
          </div>
        </div>
      </div>
    </article>
  )
}
