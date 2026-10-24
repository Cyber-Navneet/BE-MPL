import { ArrowUpRight } from 'lucide-react'
import { cn } from '../../utils/cn.js'

// A stat card that opens a details dialog. Blue gradient with a detail line and arrow, or
// (with `progress`) a light card with a progress bar.
export default function SummaryCard({ icon: Icon, label, value, detail, progress, onOpen }) {
  const light = progress !== undefined

  return (
    <button
      type="button"
      onClick={onOpen}
      aria-haspopup="dialog"
      className={cn(
        'group flex min-h-44 flex-col rounded-2xl p-6 text-left transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-home-blue',
        light
          ? 'border border-home-border bg-home-tint text-home-ink hover:border-home-blue/40'
          : 'bg-linear-to-b from-home-gradient-from to-home-blue text-white shadow-[0_8px_24px_rgba(37,99,235,0.22)] hover:brightness-110',
      )}
    >
      <span className="flex items-center gap-4 text-lg font-medium sm:text-xl">
        <Icon size={24} aria-hidden="true" />
        {label}
      </span>
      <span className="mt-4 text-5xl font-bold tracking-tight">{value}</span>

      {light ? (
        <span className="mt-auto block w-full pt-6">
          <span
            role="progressbar"
            aria-label={`${label} progress`}
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            className="block h-1.5 overflow-hidden rounded-full bg-home-blue/10"
          >
            <span className="block h-full rounded-full bg-home-blue" style={{ width: `${progress}%` }} />
          </span>
        </span>
      ) : (
        <span className="mt-auto flex w-full items-end justify-between gap-3 pt-4">
          <span className="text-base text-white/80">{detail}</span>
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-home-ink transition-transform group-hover:-translate-y-0.5">
            <ArrowUpRight size={18} aria-hidden="true" />
          </span>
        </span>
      )}
    </button>
  )
}
