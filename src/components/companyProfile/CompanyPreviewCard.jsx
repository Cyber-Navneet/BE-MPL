import { Building2, Globe, Mail, MapPin, Users } from 'lucide-react'
import { initialsOf } from '../../utils/recruiterFormUtils.js'

// How the saved profile appears to candidates on job pages (a demo preview).
export default function CompanyPreviewCard({ profile }) {
  const facts = [
    { icon: Building2, label: profile.industry },
    { icon: Users, label: profile.size ? `${profile.size} employees` : '' },
    { icon: MapPin, label: profile.headquarters },
    { icon: Globe, label: profile.website.replace(/^https?:\/\//, '') },
    { icon: Mail, label: profile.hrEmail },
  ].filter((fact) => fact.label)

  return (
    <section aria-label="Candidate preview" className="rounded-2xl border border-home-border bg-white p-5">
      <p className="text-xs font-semibold tracking-wide text-home-blue uppercase">Candidate preview</p>
      <div className="mt-4 flex items-center gap-3">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-home-tint text-lg font-bold text-home-blue">
          {profile.logo ? <img src={profile.logo} alt="" className="h-full w-full object-contain" /> : initialsOf(profile.name || '?')}
        </span>
        <div className="min-w-0">
          <p className="truncate text-lg font-bold text-heading">{profile.name || 'Company name'}</p>
          {profile.tagline && <p className="text-sm text-secondary">{profile.tagline}</p>}
        </div>
      </div>

      <ul className="mt-4 space-y-2 text-sm text-home-ink">
        {facts.map(({ icon: Icon, label }) => (
          <li key={label} className="flex items-center gap-2 break-all">
            <Icon size={15} className="shrink-0 text-home-muted" aria-hidden="true" />
            {label}
          </li>
        ))}
      </ul>

      {profile.overview && <p className="mt-4 line-clamp-4 text-sm leading-relaxed text-body">{profile.overview}</p>}

      {profile.benefits.length > 0 && (
        <ul aria-label="Benefits" className="mt-4 flex flex-wrap gap-1.5">
          {profile.benefits.slice(0, 6).map((benefit) => (
            <li key={benefit} className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
              {benefit}
            </li>
          ))}
          {profile.benefits.length > 6 && (
            <li className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-home-muted">+{profile.benefits.length - 6} more</li>
          )}
        </ul>
      )}
      <p className="mt-4 text-xs text-home-muted">Shows your last saved details.</p>
    </section>
  )
}
