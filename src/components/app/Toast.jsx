import { useEffect } from 'react'
import { CircleCheck, Info, X } from 'lucide-react'

const DISMISS_AFTER_MS = 3500

// A single auto-dismissing notification, placed clear of the assessment timer and drawer buttons. `toast` is { id, message, tone: 'success' | 'info' } or null.
export default function Toast({ toast, onDismiss }) {
  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(onDismiss, DISMISS_AFTER_MS)
    return () => clearTimeout(timer)
  }, [toast, onDismiss])

  const Icon = toast?.tone === 'success' ? CircleCheck : Info

  return (
    <div aria-live="polite" className="pointer-events-none fixed inset-x-4 top-[8.5rem] z-[70] flex justify-center sm:inset-x-auto sm:top-20 sm:left-1/2 sm:w-96 sm:-translate-x-1/2">
      {toast && (
        <div
          role="status"
          className="pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl border border-line bg-white p-4 shadow-lg"
        >
          <Icon
            size={20}
            className={toast.tone === 'success' ? 'shrink-0 text-emerald-600' : 'shrink-0 text-primary'}
            aria-hidden="true"
          />
          <p className="flex-1 text-sm text-navy">{toast.message}</p>
          <button
            type="button"
            onClick={onDismiss}
            aria-label="Dismiss notification"
            className="-m-1 rounded-md p-1 text-muted hover:text-navy focus-visible:outline-2 focus-visible:outline-primary"
          >
            <X size={16} aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  )
}
