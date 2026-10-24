import { useCallback, useRef, useState } from 'react'
import { Check, Target } from 'lucide-react'
import StatusBadge from './StatusBadge.jsx'
import { APPLICATION_STATUSES } from '../../data/dashboard.js'
import { useDismiss } from '../../hooks/useDismiss.js'
import { cn } from '../../utils/cn.js'

// "Status" button with a dropdown of every status; the current one is checked.
export default function StatusMenu({ status, jobLabel, onChange }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const close = useCallback(() => setOpen(false), [])
  useDismiss(ref, open, close)

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-label={`Status for ${jobLabel}: ${status}. Change status`}
        className="inline-flex h-11 items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 text-[15px] font-semibold text-home-ink transition-colors hover:bg-emerald-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-home-blue"
      >
        <Target size={18} aria-hidden="true" />
        Status
      </button>
      {open && (
        <div className="absolute top-full right-0 z-30 mt-2 w-64 rounded-xl border border-home-border bg-white p-2 shadow-lg">
          <p className="px-2 py-1.5 text-xs font-semibold tracking-wide text-home-muted uppercase">
            Current: <span className="normal-case">{status}</span>
          </p>
          <ul>
            {APPLICATION_STATUSES.map((option) => {
              const current = option === status
              return (
                <li key={option}>
                  <button
                    type="button"
                    aria-pressed={current}
                    onClick={() => {
                      close()
                      if (!current) onChange(option)
                    }}
                    className={cn(
                      'flex w-full items-center justify-between gap-2 rounded-lg px-2 py-2 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-home-blue',
                      current && 'bg-slate-50',
                    )}
                  >
                    <StatusBadge status={option} />
                    {current && <Check size={16} className="text-home-blue" aria-hidden="true" />}
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}
