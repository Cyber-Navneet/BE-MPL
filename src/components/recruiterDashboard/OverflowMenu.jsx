import { useCallback, useRef, useState } from 'react'
import { Ellipsis } from 'lucide-react'
import { useDismiss } from '../../hooks/useDismiss.js'

// Three-dot menu for a dashboard panel. `items` is [{ key, label, icon, onSelect }].
export default function OverflowMenu({ label, items }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const close = useCallback(() => setOpen(false), [])
  useDismiss(ref, open, close)

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex h-10 w-10 items-center justify-center rounded-lg text-navy hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-primary"
      >
        <Ellipsis size={22} aria-hidden="true" />
      </button>
      {open && (
        <div role="menu" aria-label={label} className="absolute right-0 z-30 mt-1 w-56 rounded-xl border border-line bg-white p-1.5 shadow-lg">
          {items.map(({ key, label: itemLabel, icon: Icon, onSelect }) => (
            <button
              key={key}
              type="button"
              role="menuitem"
              onClick={() => {
                close()
                onSelect()
              }}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm text-navy hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-primary"
            >
              <Icon size={16} aria-hidden="true" />
              {itemLabel}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
