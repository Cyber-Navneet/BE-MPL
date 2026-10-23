import { useRef } from 'react'
import { useDialog } from '../../hooks/useDialog.js'

export default function ApplyConfirmDialog({ job, onConfirm, onCancel }) {
  const cancelRef = useRef(null)
  useDialog({ open: true, onClose: onCancel, initialFocusRef: cancelRef })

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-navy/50" onClick={onCancel} aria-hidden="true" />
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="apply-title"
        aria-describedby="apply-description"
        className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
      >
        <h2 id="apply-title" className="text-lg font-semibold text-navy">
          Apply to {job.title}?
        </h2>
        <p id="apply-description" className="mt-2 text-sm leading-relaxed text-body">
          You are applying to <span className="font-medium text-navy">{job.company}</span>. This is a frontend demo: no
          application is sent to any company. Your applied status is saved in this browser only.
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
            className="h-10 rounded-lg bg-primary px-4 text-sm font-medium text-white hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            Confirm application
          </button>
        </div>
      </div>
    </div>
  )
}
