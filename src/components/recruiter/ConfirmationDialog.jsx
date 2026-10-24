import { useId, useRef } from 'react'
import { useDialog } from '../../hooks/useDialog.js'
import { cn } from '../../utils/cn.js'

const tones = {
  danger: 'bg-danger text-white hover:bg-red-700 focus-visible:outline-danger',
  primary: 'bg-primary text-white hover:bg-primary-hover focus-visible:outline-primary',
  outline: 'border border-line bg-white text-navy hover:bg-slate-50 focus-visible:outline-primary',
}

// Accessible confirm dialog. Focus starts on the cancel button so Enter never confirms by accident.
// `actions` is [{ label, onClick, tone: 'danger' | 'primary' | 'outline' }], rendered after Cancel.
export default function ConfirmationDialog({ title, message, cancelLabel = 'Cancel', onCancel, actions }) {
  const cancelRef = useRef(null)
  const titleId = useId()
  const messageId = useId()
  useDialog({ open: true, onClose: onCancel, initialFocusRef: cancelRef })

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-navy/50" onClick={onCancel} aria-hidden="true" />
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={messageId}
        className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
      >
        <h2 id={titleId} className="text-lg font-semibold text-navy">
          {title}
        </h2>
        <div id={messageId} className="mt-2 text-sm leading-relaxed text-body">
          {message}
        </div>
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:flex-wrap sm:justify-end">
          <button
            ref={cancelRef}
            type="button"
            onClick={onCancel}
            className={cn('h-10 rounded-lg px-4 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2', tones.outline)}
          >
            {cancelLabel}
          </button>
          {actions.map(({ label, onClick, tone = 'primary' }) => (
            <button
              key={label}
              type="button"
              onClick={onClick}
              className={cn('h-10 rounded-lg px-4 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2', tones[tone])}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
