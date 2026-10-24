import { useId, useRef, useState } from 'react'
import { CloudUpload, FileText, RefreshCw, Trash2 } from 'lucide-react'
import { fileMeta, formatBytes, validateFile } from '../../utils/jobValidation.js'
import { cn } from '../../utils/cn.js'

// Drag-and-drop / browse upload for one document. Only the file's details (name, size, type) are kept:
// this demo has no file server, so the document itself is not uploaded anywhere.
export default function JobFileUpload({ label, name, file, rules, onChange, error }) {
  const inputRef = useRef(null)
  const [dragging, setDragging] = useState(false)
  const [localError, setLocalError] = useState(null)
  const helpId = useId()
  const errorId = useId()
  const shownError = localError ?? error

  const accept = rules.extensions.map((extension) => `.${extension}`).join(',')

  const pick = (selected) => {
    if (!selected) return
    const problem = validateFile(selected, rules)
    setLocalError(problem)
    if (!problem) onChange(fileMeta(selected))
  }

  const openPicker = () => inputRef.current?.click()

  return (
    <div data-field={name}>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
        onChange={(event) => {
          pick(event.target.files?.[0])
          event.target.value = ''
        }}
      />

      {file ? (
        <div className="flex flex-col gap-3 rounded-2xl border border-line bg-white p-4 sm:flex-row sm:items-center">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-selected text-primary">
            <FileText size={20} aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-navy">{file.name}</p>
            <p className="text-xs text-muted">
              {formatBytes(file.size)} · File details saved in this browser only (not uploaded to a server)
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={openPicker}
              className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-line bg-white px-3 text-sm font-medium text-navy hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-primary"
            >
              <RefreshCw size={15} aria-hidden="true" /> Replace
            </button>
            <button
              type="button"
              onClick={() => {
                setLocalError(null)
                onChange(null)
              }}
              aria-label={`Remove ${file.name}`}
              className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-line bg-white px-3 text-sm font-medium text-danger hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-primary"
            >
              <Trash2 size={15} aria-hidden="true" /> Remove
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={(event) => {
            event.preventDefault()
            setDragging(true)
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(event) => {
            event.preventDefault()
            setDragging(false)
            pick(event.dataTransfer.files?.[0])
          }}
          className={cn(
            'flex flex-col items-center rounded-2xl border-2 border-dashed px-4 py-8 text-center transition-colors',
            dragging ? 'border-primary bg-pale' : shownError ? 'border-danger/60 bg-red-50/40' : 'border-line bg-canvas',
          )}
        >
          <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-white text-primary shadow-sm">
            <CloudUpload size={26} aria-hidden="true" />
          </span>
          <p className="mt-4 text-[15px] font-medium text-navy">
            <button
              type="button"
              onClick={openPicker}
              aria-describedby={`${helpId}${shownError ? ` ${errorId}` : ''}`}
              className="rounded font-semibold text-deep hover:underline focus-visible:outline-2 focus-visible:outline-primary"
            >
              Browse files
              <span className="sr-only"> for {label}</span>
            </button>{' '}
            or drag &amp; drop your document here
          </p>
          <p id={helpId} className="mt-1 text-xs text-muted">
            Supported formats: {rules.label} (Maximum file size: {formatBytes(rules.maxBytes)})
          </p>
        </div>
      )}

      {shownError && (
        <p id={errorId} role="alert" className="mt-2 text-sm text-danger">
          {shownError}
        </p>
      )}

      {!file && (
        <div className="mt-4 flex justify-center">
          <button
            type="button"
            onClick={openPicker}
            className="inline-flex h-11 items-center gap-2 rounded-lg bg-primary px-5 text-[15px] font-medium text-white hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            Upload <CloudUpload size={18} aria-hidden="true" />
            <span className="sr-only">{label}</span>
          </button>
        </div>
      )}
    </div>
  )
}
