import { useCallback, useRef, useState } from 'react'
import { CirclePause, CirclePlay, CircleX, Eye, EllipsisVertical, PencilLine, Trash2 } from 'lucide-react'
import { useDismiss } from '../../hooks/useDismiss.js'
import { cn } from '../../utils/cn.js'

// Actions offered per status; invalid transitions (e.g. pausing a draft) are never shown.
function actionsFor(status) {
  switch (status) {
    case 'Open':
      return ['edit', 'view', 'pause', 'close']
    case 'Paused':
      return ['edit', 'view', 'resume', 'close']
    case 'Draft':
      return ['edit', 'delete']
    default:
      return ['view', 'edit']
  }
}

const ACTIONS = {
  edit: { icon: PencilLine, label: (status) => (status === 'Draft' ? 'Continue editing' : 'Edit job') },
  view: { icon: Eye, label: () => 'View job' },
  pause: { icon: CirclePause, label: () => 'Pause job' },
  resume: { icon: CirclePlay, label: () => 'Resume job' },
  close: { icon: CircleX, label: () => 'Close job', danger: true },
  delete: { icon: Trash2, label: () => 'Delete draft', danger: true },
}

export default function JobActionsMenu({ job, onAction }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const close = useCallback(() => setOpen(false), [])
  useDismiss(ref, open, close)

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label={`More actions for ${job.title}`}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex h-11 w-11 items-center justify-center rounded-lg text-navy hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-primary"
      >
        <EllipsisVertical size={20} aria-hidden="true" />
      </button>
      {open && (
        <div role="menu" aria-label={`Actions for ${job.title}`} className="absolute right-0 z-30 mt-1 w-52 rounded-xl border border-line bg-white p-1.5 shadow-lg">
          {actionsFor(job.status).map((key) => {
            const { icon: Icon, label, danger } = ACTIONS[key]
            return (
              <button
                key={key}
                type="button"
                role="menuitem"
                onClick={() => {
                  close()
                  onAction(key, job)
                }}
                className={cn(
                  'flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm focus-visible:outline-2 focus-visible:outline-primary',
                  danger ? 'text-danger hover:bg-red-50' : 'text-navy hover:bg-slate-50',
                )}
              >
                <Icon size={16} aria-hidden="true" />
                {label(job.status)}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
