import { ArrowUpRight, FileText } from 'lucide-react'

export default function NextStepBanner({ onAnalyze }) {
  return (
    <section
      aria-labelledby="next-step-title"
      className="flex flex-col gap-5 rounded-2xl border border-home-border bg-home-tint p-5 sm:flex-row sm:items-stretch sm:justify-between sm:p-7"
    >
      <div className="min-w-0">
        <p className="text-sm font-semibold tracking-wide text-home-blue uppercase">Your next step</p>
        <h2 id="next-step-title" className="mt-3 text-xl font-semibold text-home-ink sm:text-[22px]">
          Complete your resume analysis
        </h2>
        <p className="mt-2 text-[15px] text-home-muted sm:text-base">
          Identify skill gaps and improve your profile before applying.
        </p>
      </div>
      <div className="flex shrink-0 flex-row-reverse items-center justify-end gap-4 sm:flex-col sm:items-end sm:justify-between">
        <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-white text-home-blue shadow-[0_1px_3px_rgba(24,49,83,0.08)]">
          <FileText size={26} aria-hidden="true" />
        </span>
        <button
          type="button"
          onClick={onAnalyze}
          aria-haspopup="dialog"
          className="inline-flex h-11 items-center gap-2 rounded-xl bg-home-blue px-5 text-[15px] font-medium whitespace-nowrap text-white transition-colors hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-home-blue"
        >
          Analyze resume <ArrowUpRight size={18} aria-hidden="true" />
        </button>
      </div>
    </section>
  )
}
