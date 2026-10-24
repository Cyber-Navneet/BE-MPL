import { BriefcaseBusiness, Building2, CircleCheck, Clock, ExternalLink, FileText, Laptop, ShieldCheck } from 'lucide-react'
import { departmentIcon } from './departmentIcon.js'
import { formatSalary, jobAgeLabel, proofLabel } from '../../utils/jobMetrics.js'
import { formatBytes } from '../../utils/jobValidation.js'

function PreviewSection({ title, children }) {
  return (
    <section className="border-t border-primary/15 pt-5">
      <h3 className="text-[17px] font-medium text-navy">{title}</h3>
      <div className="mt-3">{children}</div>
    </section>
  )
}

function CheckList({ items }) {
  return (
    <ul className="space-y-2">
      {items.map((item, index) => (
        <li key={`${index}-${item}`} className="flex gap-2.5 text-sm text-body sm:text-[15px]">
          <CircleCheck size={17} className="mt-0.5 shrink-0 text-emerald-600" aria-hidden="true" />
          <span className="min-w-0 break-words">{item}</span>
        </li>
      ))}
    </ul>
  )
}

const Empty = ({ children }) => <p className="text-sm text-muted italic">{children}</p>

const ASSESSMENT_TYPE_LABELS = {
  interactive: 'Interactive timed assessment',
  document: 'Assessment document',
}

// The posting card as candidates would see it, built only from `job` (the current form values or a
// saved job). `badge` is the pill in the header; `actions` renders under the card.
export default function JobPostingPreview({ job, badge, heading = 'Live posting card preview', actions, now }) {
  const Icon = departmentIcon(job.department)
  const salary = formatSalary(job)
  const meta = [
    job.location && { icon: Building2, text: job.location },
    job.employmentType && { icon: BriefcaseBusiness, text: job.employmentType },
    job.workMode && { icon: Laptop, text: job.workMode },
  ].filter(Boolean)
  const assessment = job.assessment
  const eligibility = [
    job.minimumATSScore != null && `Minimum ATS score: ${job.minimumATSScore}%`,
    job.minimumAssessmentScore != null && `Minimum assessment score: ${job.minimumAssessmentScore}%`,
    job.minimumExperience && job.minimumExperience !== 'No minimum' && `Experience: ${job.minimumExperience}`,
    job.education && `Education: ${job.education}`,
    job.experienceLevel && `Level: ${job.experienceLevel}`,
    job.vacancies && `${job.vacancies} ${job.vacancies === 1 ? 'vacancy' : 'vacancies'}`,
    job.applicationDeadline && `Apply by ${new Date(`${job.applicationDeadline}T00:00`).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`,
  ].filter(Boolean)
  const company = job.company ?? {}

  return (
    <div className="rounded-2xl border border-primary/40 bg-selected/70 p-4 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xs font-semibold tracking-wider text-body uppercase">{heading}</h2>
        {badge && <span className="shrink-0 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white">{badge}</span>}
      </div>

      <div className="mt-5 space-y-5">
        <article className="rounded-xl bg-white p-4 sm:p-5">
          <div className="flex gap-3 sm:gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-selected text-primary">
              <Icon size={22} aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
                <p className="text-lg font-semibold break-words text-navy sm:text-xl">{job.title || 'Job title'}</p>
                <p className="shrink-0 font-bold text-navy">{salary ?? <span className="text-sm font-normal text-muted">Salary not set</span>}</p>
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-body">
                {job.requisitionId && <span className="rounded-md bg-segment px-2 py-0.5 font-medium">{job.requisitionId}</span>}
                <span className="flex items-center gap-1">
                  <Clock size={14} aria-hidden="true" />
                  {job.publishedAt ? jobAgeLabel(job, now) : 'Not published yet'}
                </span>
                {job.department && <span>· {job.department}</span>}
              </div>
              {meta.length > 0 && (
                <ul className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-body">
                  {meta.map(({ icon: MetaIcon, text }, index) => (
                    <li key={text} className="flex items-center gap-1.5">
                      {index > 0 && <span aria-hidden="true">•</span>}
                      <MetaIcon size={15} aria-hidden="true" /> {text}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          {job.requiredSkills?.length > 0 && (
            <ul className="mt-4 flex flex-wrap gap-2" aria-label="Required skills">
              {job.requiredSkills.map((skill) => (
                <li key={skill} className="rounded-md bg-selected px-2.5 py-1 text-xs font-medium text-navy">
                  {skill}
                </li>
              ))}
            </ul>
          )}
        </article>

        <PreviewSection title="Job Description">
          {job.description ? (
            <p className="text-sm leading-relaxed break-words whitespace-pre-line text-body sm:text-[15px]">{job.description}</p>
          ) : (
            <Empty>Add a job description to see it here.</Empty>
          )}
        </PreviewSection>

        <PreviewSection title="What Candidate will learn">
          {job.learningOutcomes?.length ? <CheckList items={job.learningOutcomes} /> : <Empty>No learning outcomes added.</Empty>}
        </PreviewSection>

        <PreviewSection title="Requirements">
          {job.requirements?.length ? <CheckList items={job.requirements} /> : <Empty>Add requirements to see them here.</Empty>}
        </PreviewSection>

        <PreviewSection title="Eligibility & Verification">
          {job.mandatoryProofs?.length > 0 && (
            <ul className="mb-3 flex flex-wrap gap-2" aria-label="Mandatory proof">
              {job.mandatoryProofs.map((key) => (
                <li key={key} className="flex items-center gap-1.5 rounded-md bg-white px-2.5 py-1 text-xs font-medium text-navy">
                  <ShieldCheck size={14} className="text-primary" aria-hidden="true" /> {proofLabel(key)}
                </li>
              ))}
            </ul>
          )}
          {eligibility.length ? <CheckList items={eligibility} /> : <Empty>No eligibility criteria set.</Empty>}
          {job.otherEligibility && <p className="mt-2 text-sm whitespace-pre-line text-body">{job.otherEligibility}</p>}
        </PreviewSection>

        {assessment && assessment.type !== 'none' && (
          <PreviewSection title="Assessment">
            <p className="text-sm font-medium text-navy sm:text-[15px]">{assessment.title || 'Untitled assessment'}</p>
            <p className="mt-1 text-sm text-body">
              {[
                ASSESSMENT_TYPE_LABELS[assessment.type],
                assessment.type === 'interactive' && assessment.questionCount && `${assessment.questionCount} questions`,
                assessment.durationMinutes && `${assessment.durationMinutes} min`,
                assessment.difficulty,
                assessment.passingScore != null && `Pass at ${assessment.passingScore}%`,
              ]
                .filter(Boolean)
                .join(' · ')}
            </p>
            {assessment.skills?.length > 0 && <p className="mt-1 text-sm text-body">Skills: {assessment.skills.join(', ')}</p>}
            {assessment.document && (
              <p className="mt-2 flex items-center gap-1.5 text-sm text-body">
                <FileText size={15} aria-hidden="true" /> {assessment.document.name} ({formatBytes(assessment.document.size)}) — shared after applying
              </p>
            )}
          </PreviewSection>
        )}

        <PreviewSection title="About Company">
          {company.name ? (
            <div className="space-y-2 text-sm text-body sm:text-[15px]">
              <p className="font-medium text-navy">{company.name}</p>
              {company.overview && <p className="leading-relaxed whitespace-pre-line">{company.overview}</p>}
              <p className="text-sm">{[company.industry, company.location].filter(Boolean).join(' · ')}</p>
              {company.website && !/^https?:\/\//i.test(company.website) && <p className="text-sm break-all">{company.website}</p>}
              {/^https?:\/\//i.test(company.website ?? '') && (
                <a
                  href={company.website}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-sm font-medium break-all text-primary hover:underline"
                >
                  {company.website} <ExternalLink size={13} aria-hidden="true" />
                </a>
              )}
              {company.document && company.shareDocument && (
                <p className="flex items-center gap-1.5 text-sm">
                  <FileText size={15} aria-hidden="true" /> {company.document.name}
                </p>
              )}
            </div>
          ) : (
            <Empty>Add company details to see them here.</Empty>
          )}
        </PreviewSection>
      </div>

      {actions && <div className="mt-6">{actions}</div>}
    </div>
  )
}
