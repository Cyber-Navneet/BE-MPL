import { useId, useRef } from 'react'
import { X } from 'lucide-react'
import { useDialog } from '../../hooks/useDialog.js'
import { cn } from '../../utils/cn.js'

const widths = { sm: 'sm:max-w-md', md: 'sm:max-w-lg', lg: 'sm:max-w-2xl' }

// Dialog with a header (title, subtitle, close button), a scrollable body and an optional footer.
// A bottom sheet on phones, centered from `sm`. Focus starts on `initialFocusRef` or the close button.
export default function Modal({ title, subtitle, onClose, footer, size = 'md', initialFocusRef, bodyClassName, children }) {
  const closeRef = useRef(null)
  const titleId = useId()
  useDialog({ open: true, onClose, initialFocusRef: initialFocusRef ?? closeRef })

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
      <div className="absolute inset-0 bg-home-ink/50" onClick={onClose} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={cn('relative flex max-h-[92vh] w-full flex-col rounded-t-2xl bg-white shadow-xl sm:rounded-2xl', widths[size])}
      >
        <div className="flex items-start gap-3 border-b border-home-border px-5 py-4 sm:px-6">
          <div className="min-w-0 flex-1">
            <h2 id={titleId} className="text-lg font-semibold text-home-ink">
              {title}
            </h2>
            {subtitle && <p className="mt-0.5 text-sm text-home-muted">{subtitle}</p>}
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="-mt-1 -mr-2 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-home-muted hover:bg-slate-100 hover:text-home-ink focus-visible:outline-2 focus-visible:outline-home-blue"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>
        <div className={cn('min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6', bodyClassName)}>{children}</div>
        {footer && <div className="border-t border-home-border px-5 py-4 sm:px-6">{footer}</div>}
      </div>
    </div>
  )
}
