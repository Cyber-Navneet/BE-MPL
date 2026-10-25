import { Save } from 'lucide-react'

// Sticky bar shown while a form has unsaved changes.
export default function SaveBar({ onDiscard, onSave, message = 'You have unsaved changes.' }) {
  return (
    <div
      role="region"
      aria-label="Unsaved changes"
      className="sticky bottom-4 z-20 mt-6 flex flex-col gap-3 rounded-2xl border border-home-border bg-white p-4 shadow-[0_8px_30px_rgba(24,49,83,0.14)] sm:flex-row sm:items-center sm:justify-between"
    >
      <p className="text-sm font-medium text-home-ink">{message}</p>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onDiscard}
          className="h-10 flex-1 rounded-lg border border-home-border bg-white px-4 text-sm font-medium text-home-ink hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-home-blue sm:flex-none"
        >
          Discard
        </button>
        <button
          type="button"
          onClick={onSave}
          className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-lg bg-home-blue px-4 text-sm font-medium text-white hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-home-blue sm:flex-none"
        >
          <Save size={16} aria-hidden="true" /> Save changes
        </button>
      </div>
    </div>
  )
}
