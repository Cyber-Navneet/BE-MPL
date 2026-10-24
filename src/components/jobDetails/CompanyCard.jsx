import { Building2, ExternalLink } from 'lucide-react'

export default function CompanyCard({ job }) {
  const details = [
    { label: 'Industry', value: job.companyIndustry },
    { label: 'Company size', value: job.companySize },
    { label: 'Founded', value: job.companyFounded },
  ]

  return (
    <section
      aria-labelledby="company-title"
      className="rounded-xl border border-line bg-white p-5 shadow-[0_1px_2px_rgba(16,25,46,0.04)] sm:p-6"
    >
      <h2 id="company-title" className="flex items-center gap-2 text-lg font-semibold text-navy">
        <Building2 size={20} className="text-primary" aria-hidden="true" />
        About {job.company}
      </h2>
      <p className="mt-3 text-[15px] leading-relaxed text-body">{job.companyDescription}</p>

      <dl className="mt-5 grid grid-cols-1 gap-4 border-t border-line pt-5 text-sm sm:grid-cols-2">
        {details.map(({ label, value }) => (
          <div key={label}>
            <dt className="text-muted">{label}</dt>
            <dd className="mt-0.5 font-medium text-navy">{value}</dd>
          </div>
        ))}
        <div>
          <dt className="text-muted">Website</dt>
          <dd className="mt-0.5">
            <a
              href={job.companyWebsite}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 rounded font-medium text-primary hover:underline focus-visible:outline-2 focus-visible:outline-primary"
            >
              {job.companyWebsite.replace(/^https?:\/\//, '')}
              <ExternalLink size={13} aria-hidden="true" />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </dd>
        </div>
      </dl>
    </section>
  )
}
