import { cn } from '../utils/cn.js'

const tones = {
  blue: 'from-blue-500 to-blue-700',
  green: 'from-emerald-500 to-emerald-700',
  orange: 'from-amber-500 to-amber-700',
}

export default function FeatureCard({ icon: Icon, title, description, tone }) {
  return (
    <article className="rounded-xl border border-line bg-white p-6 shadow-[0_1px_3px_rgba(16,25,46,0.06)] transition-shadow hover:shadow-md">
      <div className={cn('flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br text-white', tones[tone])}>
        <Icon size={24} aria-hidden="true" />
      </div>
      <h3 className="mt-4 text-lg font-semibold tracking-tight text-navy">{title}</h3>
      <p className="mt-2 text-sm leading-[1.6] text-muted">{description}</p>
    </article>
  )
}
