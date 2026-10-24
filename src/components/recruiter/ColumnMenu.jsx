import { useCallback, useRef, useState } from 'react'
import { Check, Ellipsis, RotateCcw } from 'lucide-react'
import { COLUMN_SORTS } from '../../utils/candidateUtils.js'
import { useDismiss } from '../../hooks/useDismiss.js'

const itemClasses =
  'flex w-full items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-left text-sm text-home-ink hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-home-blue'

// "…" menu for a column: sort its cards or restore its original demo candidates.
export default function ColumnMenu({ stageLabel, sort, scoreLabel, onSort, onReset }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const close = useCallback(() => setOpen(false), [])
  useDismiss(ref, open, close)

  const options = Object.entries(COLUMN_SORTS)
    .filter(([value]) => value !== 'score' || scoreLabel)
    .map(([value, label]) => [value, value === 'score' ? scoreLabel : label])

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-label={`${stageLabel} column options`}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-home-ink hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-home-blue"
      >
        <Ellipsis size={20} aria-hidden="true" />
      </button>
      {open && (
        <div className="absolute top-full right-0 z-30 mt-1 w-56 rounded-xl border border-home-border bg-white p-1.5 shadow-lg">
          <p className="px-2.5 pt-1.5 pb-1 text-xs font-semibold tracking-wide text-home-muted uppercase">Sort cards</p>
          {options.map(([value, label]) => (
            <button
              key={value}
              type="button"
              aria-pressed={sort === value}
              onClick={() => {
                onSort(value)
                close()
              }}
              className={itemClasses}
            >
              {label}
              {sort === value && <Check size={15} className="text-home-blue" aria-hidden="true" />}
            </button>
          ))}
          <div className="my-1 border-t border-home-border" />
          <button
            type="button"
            onClick={() => {
              onReset()
              close()
            }}
            className={itemClasses}
          >
            <span className="flex items-center gap-2">
              <RotateCcw size={15} aria-hidden="true" /> Reset column demo data
            </span>
          </button>
        </div>
      )}
    </div>
  )
}
