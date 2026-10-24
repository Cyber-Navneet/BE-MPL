import { useRef } from 'react'
import { useDialog } from '../../hooks/useDialog.js'

export default function DeleteApplicationDialog({ application, onConfirm, onCancel }) {
  const cancelRef = useRef(null)
  useDialog({ open: true, onClose: onCancel, initialFocusRef: cancelRef })

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-navy/50" onClick={onCancel} aria-hidden="true" />
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-title"
        aria-describedby="delete-description"
        className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
      >
        <h2 id="delete-title" className="text-lg font-semibold text-navy">
          Delete application?
        </h2>
        <p id="delete-description" className="mt-2 text-sm leading-relaxed text-body">
          Are you sure you want to remove your application for{' '}
          <span className="font-medium text-navy">
            {application.jobTitle} at {application.company}
          </span>
          ? This action cannot be undone.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            ref={cancelRef}
            type="button"
            onClick={onCancel}
            className="h-10 rounded-lg border border-line bg-white px-4 text-sm font-medium text-navy hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
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
