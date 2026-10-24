// A numbered form section heading in the style of the design ("1  ROLE CORE INFORMATION").
export default function JobFormSection({ id, number, title, subtitle, children }) {
  return (
    <section aria-labelledby={id} className="scroll-mt-24">
      <h2 id={id} className="flex items-center gap-3 text-sm font-semibold tracking-wider text-primary uppercase">
        {number != null && (
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs text-white" aria-hidden="true">
            {number}
          </span>
        )}
        {title}
      </h2>
      {subtitle && <p className="mt-1.5 text-sm text-muted">{subtitle}</p>}
      <div className="mt-5">{children}</div>
    </section>
  )
}
