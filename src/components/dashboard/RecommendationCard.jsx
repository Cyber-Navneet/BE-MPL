import { BriefcaseBusiness, CircleCheck, Clock, Laptop, MapPin, Sparkles, Users } from 'lucide-react'
import CompanyInitials from './CompanyInitials.jsx'
import MetaList from './MetaList.jsx'
import SkillTags from './SkillTags.jsx'
import { formatPosted } from '../../utils/dashboardUtils.js'

export default function RecommendationCard({ job, applied, onApply }) {
  const meta = [
    { icon: MapPin, label: job.location, srLabel: 'Location' },
    { icon: BriefcaseBusiness, label: job.employmentType.toLowerCase(), srLabel: 'Employment type' },
    { icon: Laptop, label: job.workMode, srLabel: 'Work mode' },
    { icon: Clock, label: formatPosted(job.postedDaysAgo), srLabel: 'Posted' },
    { icon: Users, label: `${job.applicants} applicants`, srLabel: 'Applicants' },
  ]

  return (
    <article className="rounded-2xl border border-home-border bg-white p-5 shadow-[0_1px_2px_rgba(24,49,83,0.04)] sm:p-6">
      <div className="flex gap-4 sm:gap-5">
        <CompanyInitials initials={job.initials} />
        <div className="flex min-w-0 flex-1 flex-wrap items-start justify-between gap-x-4 gap-y-2">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
              <h3 className="text-lg font-semibold text-home-ink sm:text-xl">{job.title}</h3>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm font-semibold whitespace-nowrap text-emerald-700">
                <Sparkles size={14} aria-hidden="true" />
                {job.matchScore}% Match
              </span>
            </div>
            <p className="mt-1 text-[15px] text-home-muted sm:text-base">{job.company}</p>
          </div>
          <p className="text-base font-bold whitespace-nowrap text-home-ink underline decoration-2 underline-offset-[6px] sm:text-lg">
            <span className="sr-only">Salary: </span>
            {job.salary}
          </p>
        </div>
      </div>

      {/* Indented under the title from `sm`; full width on phones. */}
      <div className="sm:pl-19">
        <MetaList items={meta} className="mt-4" />
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <SkillTags skills={job.skills} />
          <button
            type="button"
            onClick={onApply}
            disabled={applied}
            aria-label={applied ? `Applied to ${job.title} at ${job.company}` : `Apply now to ${job.title} at ${job.company}`}
            className="ml-auto inline-flex h-11 items-center gap-2 rounded-xl bg-home-blue px-5 text-[15px] font-semibold text-white transition-colors hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-home-blue disabled:cursor-default disabled:border disabled:border-emerald-200 disabled:bg-emerald-50 disabled:text-emerald-700"
          >
            {applied && <CircleCheck size={17} aria-hidden="true" />}
            {applied ? 'Applied' : 'Apply Now'}
          </button>
        </div>
      </div>
    </article>
  )
}
