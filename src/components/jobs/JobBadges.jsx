import { Sparkles } from 'lucide-react'
import { cn } from '../../utils/cn.js'

export function CompanyLogo({ initials, className }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-selected text-base font-bold text-primary',
        className,
      )}
    >
      {initials}
    </span>
  )
}

export function MatchBadge({ score }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold whitespace-nowrap text-emerald-600">
      <Sparkles size={14} aria-hidden="true" />
      {score}% Match
    </span>
  )
}

export function SkillList({ skills, className }) {
  return (
    <ul aria-label="Skills" className={cn('flex flex-wrap gap-2', className)}>
      {skills.map((skill) => (
        <li key={skill} className="rounded-full bg-slate-100 px-3 py-1 text-[13px] text-navy">
          {skill}
        </li>
      ))}
    </ul>
  )
}
