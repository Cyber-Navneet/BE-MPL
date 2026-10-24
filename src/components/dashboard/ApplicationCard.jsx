import { BriefcaseBusiness, Laptop, MapPin, MessageCircle, Trash2 } from 'lucide-react'
import CompanyInitials from './CompanyInitials.jsx'
import MetaList from './MetaList.jsx'
import SkillTags from './SkillTags.jsx'
import StatusBadge from './StatusBadge.jsx'
import StatusMenu from './StatusMenu.jsx'
import { formatAppliedDate } from '../../utils/dashboardUtils.js'

const focusRing = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-home-blue'

export default function ApplicationCard({ application, unread, onChat, onStatusChange, onDelete }) {
  const { title, company } = application
  const meta = [
    { icon: MapPin, label: application.location, srLabel: 'Location' },
    { icon: BriefcaseBusiness, label: application.employmentType.toLowerCase(), srLabel: 'Employment type' },
    { icon: Laptop, label: application.workMode, srLabel: 'Work mode' },
  ]

  return (
    <article className="rounded-2xl border border-home-border bg-white p-5 shadow-[0_1px_2px_rgba(24,49,83,0.04)] sm:p-6">
      <div className="flex gap-4 sm:gap-5">
        <CompanyInitials initials={application.initials} />
        <div className="flex min-w-0 flex-1 flex-wrap items-start justify-between gap-x-4 gap-y-2">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
              <h3 className="text-lg font-semibold text-home-ink sm:text-xl">{title}</h3>
              <StatusBadge status={application.status} />
            </div>
            <p className="mt-1 text-[15px] text-home-muted sm:text-base">
              {company}
              <span className="sr-only">, {formatAppliedDate(application.appliedOn)}</span>
            </p>
          </div>
          <p className="text-base font-bold whitespace-nowrap text-home-ink underline decoration-2 underline-offset-[6px] sm:text-lg">
            <span className="sr-only">Salary: </span>
            {application.salary}
          </p>
        </div>
      </div>

      {/* Indented under the title from `sm`; full width on phones so the actions fit. */}
      <div className="sm:pl-19">
        <MetaList items={meta} className="mt-4" />
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <SkillTags skills={application.skills} />
          <div className="ml-auto flex items-center gap-3">
            <button
              type="button"
              onClick={onChat}
              aria-haspopup="dialog"
              aria-label={unread > 0 ? `Chat with ${company}, ${unread} unread` : `Chat with ${company}`}
              className={`relative inline-flex h-11 items-center gap-2 rounded-xl bg-home-blue px-4 text-[15px] font-semibold text-white transition-colors hover:bg-primary-hover ${focusRing}`}
            >
              <MessageCircle size={18} aria-hidden="true" />
              Chat
              {unread > 0 && (
                <span className="absolute -top-1.5 -right-1.5 h-3.5 w-3.5 rounded-full bg-red-500 ring-2 ring-white" aria-hidden="true" />
              )}
            </button>
            <StatusMenu status={application.status} jobLabel={`${title} at ${company}`} onChange={onStatusChange} />
            <button
              type="button"
              onClick={onDelete}
              aria-haspopup="dialog"
              aria-label={`Delete application for ${title} at ${company}`}
              className={`flex h-11 w-11 items-center justify-center rounded-xl bg-red-100 text-red-600 transition-colors hover:bg-red-200 ${focusRing}`}
            >
              <Trash2 size={19} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}
