import { BriefcaseBusiness, CalendarClock, GraduationCap, Laptop, MapPin, MessageCircle, Target, Trash2 } from 'lucide-react'
import { CompanyLogo } from '../jobs/JobBadges.jsx'
import StatusPill from './StatusPill.jsx'
import { formatDate, getDeadlineInfo } from '../../utils/applicationUtils.js'
import { cn } from '../../utils/cn.js'

const DEADLINE_TONES = {
  none: 'text-muted',
  normal: 'text-muted',
  soon: 'bg-amber-50 text-amber-700',
  overdue: 'bg-red-50 text-danger',
}

const actionClasses =
  'inline-flex h-10 items-center justify-center gap-2 rounded-lg px-4 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'

// Mobile: one column in DOM order (job, details, skills, salary, deadline, actions).
// From `sm`, explicit grid placement moves salary beside the title and actions beside the skills.
export default function ApplicationCard({ application, onOpenChat, onOpenStatus, onDelete }) {
  const deadline = getDeadlineInfo(application.deadline)

  return (
    <article className="rounded-xl border border-line bg-white p-4 shadow-[0_1px_2px_rgba(16,25,46,0.04)] transition-[border-color,box-shadow] duration-150 hover:border-primary/30 hover:shadow-[0_4px_14px_rgba(16,25,46,0.07)] sm:p-5">
      <div className="flex gap-3 sm:gap-4">
        <CompanyLogo initials={application.companyShortName} className="h-10 w-10 text-sm sm:h-12 sm:w-12 sm:text-base" />

        <div className="grid min-w-0 flex-1 grid-cols-1 gap-y-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:gap-x-6">
          <div className="min-w-0 sm:col-start-1 sm:row-start-1">
            <h3 className="text-base font-semibold text-navy sm:text-lg">{application.jobTitle}</h3>
            <p className="mt-0.5 text-[15px] text-muted">{application.company}</p>
          </div>

          <ul className="flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-muted sm:col-span-2 sm:row-start-2 sm:text-[15px] [&>li+li]:border-l [&>li+li]:border-line [&>li+li]:pl-4">
            <li className="flex items-center gap-1.5">
              <MapPin size={15} aria-hidden="true" />
              {application.location}
            </li>
            <li className="flex items-center gap-1.5">
              <BriefcaseBusiness size={15} aria-hidden="true" />
              {application.type.toLowerCase()}
            </li>
            <li className="flex items-center gap-1.5">
              <Laptop size={15} aria-hidden="true" />
              {application.workMode}
            </li>
            <li className="flex items-center gap-1.5">
              <GraduationCap size={15} aria-hidden="true" />
              {application.experience}
            </li>
          </ul>

          <ul aria-label="Skills" className="flex flex-wrap gap-2 sm:col-start-1 sm:row-start-4 sm:self-end">
            {application.skills.map((skill) => (
              <li key={skill} className="rounded-md border border-line bg-slate-50 px-2.5 py-1 text-[13px] text-body">
                {skill}
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 sm:col-start-2 sm:row-start-1 sm:flex-col sm:items-end">
            <p className="text-base font-semibold whitespace-nowrap text-navy underline decoration-navy/25 underline-offset-4">
              <span className="sr-only">Salary: </span>
              {application.salary}
            </p>
            <StatusPill status={application.status} />
          </div>

          <p
            className={cn(
              'flex w-fit flex-wrap items-center gap-x-1.5 rounded-md text-sm sm:col-span-2 sm:row-start-3',
              DEADLINE_TONES[deadline.tone],
              (deadline.tone === 'soon' || deadline.tone === 'overdue') && 'px-2 py-1 font-medium',
            )}
          >
            <CalendarClock size={15} aria-hidden="true" />
            {application.deadline ? (
              <>
                Deadline: {formatDate(application.deadline)}
                <span aria-hidden="true">·</span>
                {deadline.label}
              </>
            ) : (
              deadline.label
            )}
          </p>

          <div className="flex gap-2 sm:col-start-2 sm:row-start-4 sm:items-end sm:justify-end">
            {application.hasChat && (
              <button
                type="button"
                onClick={onOpenChat}
                aria-haspopup="dialog"
                aria-label={`Chat with ${application.company}${application.chatUnread ? ' (unread messages)' : ''}`}
                className={cn(actionClasses, 'relative flex-1 bg-primary text-white hover:bg-primary-hover sm:flex-none')}
              >
                <MessageCircle size={16} aria-hidden="true" />
                Chat
                {application.chatUnread && (
                  <span
                    aria-hidden="true"
                    className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-danger ring-2 ring-white"
                  />
                )}
              </button>
            )}
            <button
              type="button"
              onClick={onOpenStatus}
              aria-haspopup="dialog"
              aria-label={`View status of ${application.jobTitle} at ${application.company}`}
              className={cn(actionClasses, 'flex-1 border border-primary/15 bg-pale text-primary hover:bg-selected sm:flex-none')}
            >
              <Target size={16} aria-hidden="true" />
              Status
            </button>
            <button
              type="button"
              onClick={onDelete}
              aria-label={`Delete application for ${application.jobTitle} at ${application.company}`}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-50 text-danger transition-colors hover:bg-red-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-danger"
            >
              <Trash2 size={17} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}
