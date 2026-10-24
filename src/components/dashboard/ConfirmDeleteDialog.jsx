import { useId, useRef } from 'react'
import { useDialog } from '../../hooks/useDialog.js'

// Asks before deleting an application. Focus starts on Cancel so Enter never deletes by accident.
export default function ConfirmDeleteDialog({ application, onConfirm, onCancel }) {
  const cancelRef = useRef(null)
  const titleId = useId()
  const messageId = useId()
  useDialog({ open: true, onClose: onCancel, initialFocusRef: cancelRef })

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-home-ink/50" onClick={onCancel} aria-hidden="true" />
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={messageId}
        className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
      >
        <h2 id={titleId} className="text-lg font-semibold text-home-ink">
          Delete this application?
        </h2>
        <p id={messageId} className="mt-2 text-sm leading-relaxed text-body">
          Your application for <span className="font-semibold text-home-ink">{application.title}</span> at{' '}
          <span className="font-semibold text-home-ink">{application.company}</span> and its chat history will be removed.
          This cannot be undone.
        </p>
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            ref={cancelRef}
            type="button"
            onClick={onCancel}
            className="h-10 rounded-lg border border-home-border bg-white px-4 text-sm font-medium text-home-ink hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-home-blue"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="h-10 rounded-lg bg-danger px-4 text-sm font-medium text-white hover:bg-red-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-danger"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}
