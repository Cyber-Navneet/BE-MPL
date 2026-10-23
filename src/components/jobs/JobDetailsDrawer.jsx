import { useRef } from 'react'
import { Bookmark, BookmarkCheck, CircleCheck, X } from 'lucide-react'
import { CompanyLogo, MatchBadge, SkillList } from './JobBadges.jsx'
import { useDialog } from '../../hooks/useDialog.js'
import { formatPostedLong, formatSalary } from '../../utils/jobUtils.js'
import { cn } from '../../utils/cn.js'

function Section({ title, children }) {
  return (
    <section className="mt-6">
      <h3 className="text-sm font-semibold text-navy">{title}</h3>
      <div className="mt-2 text-sm leading-relaxed text-body">{children}</div>
    </section>
  )
}

function BulletList({ items }) {
  return (
    <ul className="list-disc space-y-1.5 pl-5 marker:text-muted">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  )
}

// Mounted only while a job is selected. Escape is ignored while the apply dialog is on top.
export default function JobDetailsDrawer({ job, isSaved, isApplied, confirmOpen, onToggleSave, onApply, onClose }) {
  const closeRef = useRef(null)
  useDialog({ open: true, onClose, initialFocusRef: closeRef, escapeEnabled: !confirmOpen })

  const facts = [
    ['Location', job.location],
    ['Work arrangement', job.locationType],
    ['Employment type', job.employmentType],
    ['Experience', job.experienceLevel],
    ['Salary', formatSalary(job)],
    ['Applicants', job.applicants],
  ]

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-navy/40" onClick={onClose} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="job-details-title"
        className="relative flex h-full w-full max-w-xl flex-col bg-white shadow-xl"
      >
        <div className="flex items-start gap-4 border-b border-line px-5 py-5 sm:px-6">
          <CompanyLogo initials={job.companyInitials} />
          <div className="min-w-0 flex-1">
            <h2 id="job-details-title" className="text-lg font-semibold text-navy sm:text-xl">
              {job.title}
            </h2>
            <p className="mt-0.5 text-[15px] text-muted">{job.company}</p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <MatchBadge score={job.matchScore} />
              <span className="text-xs text-muted">{formatPostedLong(job.postedDaysAgo)}</span>
            </div>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close job details"
            className="-mt-1 -mr-2 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-muted hover:bg-slate-100 hover:text-navy focus-visible:outline-2 focus-visible:outline-primary"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-6 sm:px-6">
          <dl className="mt-5 grid grid-cols-2 gap-3">
            {facts.map(([label, value]) => (
              <div key={label} className="rounded-lg bg-canvas px-3 py-2.5">
                <dt className="text-xs text-muted">{label}</dt>
                <dd className="mt-0.5 text-sm font-medium text-navy">{value}</dd>
              </div>
            ))}
          </dl>

          <Section title="Required skills">
            <SkillList skills={job.skills} />
          </Section>
          {job.matchedSkills && (
            <Section title="Your resume vs. this job">
              <p>
                Your analysed resume covers {job.matchedSkills.length} of {job.skills.length} required skills.
                {job.missingSkills.length > 0 && ` Not found in your resume: ${job.missingSkills.join(', ')}.`}
              </p>
            </Section>
          )}
          <Section title="About the role">
            <p>{job.description}</p>
          </Section>
          <Section title="Responsibilities">
            <BulletList items={job.responsibilities} />
          </Section>
          <Section title="Requirements">
            <BulletList items={job.requirements} />
          </Section>
          <Section title={`About ${job.company}`}>
            <p>{job.companyDescription}</p>
          </Section>

          <p className="mt-6 rounded-lg bg-canvas px-3 py-2.5 text-xs text-muted">
            Demo listing: this company and job are fictional. Applying only records your status in this browser.
          </p>
        </div>

        <div className="flex gap-3 border-t border-line px-5 py-4 sm:px-6">
          <button
            type="button"
            onClick={onToggleSave}
            aria-pressed={isSaved}
            className={cn(
              'inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-lg border text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
              isSaved ? 'border-primary/40 bg-pale text-primary' : 'border-line bg-white text-navy hover:bg-slate-50',
            )}
          >
            {isSaved ? <BookmarkCheck size={17} aria-hidden="true" /> : <Bookmark size={17} aria-hidden="true" />}
            {isSaved ? 'Saved' : 'Save Job'}
          </button>
          <button
            type="button"
            onClick={onApply}
            disabled={isApplied}
            aria-haspopup="dialog"
            className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-lg bg-primary text-sm font-medium text-white hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:bg-emerald-50 disabled:text-emerald-700"
          >
            {isApplied && <CircleCheck size={17} aria-hidden="true" />}
            {isApplied ? 'Applied' : 'Apply Now'}
          </button>
        </div>
      </div>
    </div>
  )
}
