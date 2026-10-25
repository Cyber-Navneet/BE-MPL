import { useId } from 'react'

// White card with an icon, heading and short description, used by the recruiter form pages.
export default function SectionCard({ icon: Icon, title, description, action, children }) {
  const headingId = useId()

  return (
    <section aria-labelledby={headingId} className="rounded-2xl border border-home-border bg-white p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          {Icon && (
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-home-tint text-home-blue">
              <Icon size={20} aria-hidden="true" />
            </span>
          )}
          <div>
            <h2 id={headingId} className="text-lg font-semibold text-heading">
              {title}
            </h2>
            {description && <p className="mt-0.5 text-sm text-secondary">{description}</p>}
          </div>
        </div>
        {action}
      </div>
      <div className="mt-5">{children}</div>
    </section>
  )
}
