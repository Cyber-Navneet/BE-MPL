import { useRef, useState } from 'react'
import { CircleAlert, CloudUpload, FileUp, LoaderCircle, ScanText, ShieldCheck, Sparkles, Trash2 } from 'lucide-react'
import { ACCEPTED_EXTENSIONS, formatFileSize, getResumeFormat } from '../../utils/resumeParser.js'
import { cn } from '../../utils/cn.js'

const FORMAT_STYLES = {
  pdf: 'bg-red-50 text-red-600',
  docx: 'bg-blue-50 text-primary',
  txt: 'bg-slate-100 text-body',
}

const timeFormatter = new Intl.DateTimeFormat('en-IN', { hour: 'numeric', minute: '2-digit' })

function DropZone({ onSelect, disabled }) {
  const inputRef = useRef(null)
  const [dragging, setDragging] = useState(false)

  const openPicker = () => {
    if (!disabled) inputRef.current?.click()
  }

  const handleDrop = (event) => {
    event.preventDefault()
    setDragging(false)
    if (disabled) return
    const file = event.dataTransfer.files?.[0]
    if (file) onSelect(file)
  }

  return (
    <div
      onClick={openPicker}
      onDragOver={(event) => {
        event.preventDefault()
        if (!disabled) setDragging(true)
      }}
      onDragLeave={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setDragging(false)
      }}
      onDrop={handleDrop}
      className={cn(
        'flex min-h-56 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-5 py-8 text-center transition-colors',
        dragging ? 'border-primary bg-pale' : 'border-line bg-white hover:border-primary/40',
        disabled && 'cursor-not-allowed opacity-60',
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_EXTENSIONS}
        className="hidden"
        tabIndex={-1}
        onChange={(event) => {
          const file = event.target.files?.[0]
          if (file) onSelect(file)
          // Reset so choosing the same file again still triggers onChange.
          event.target.value = ''
        }}
      />
      <span className="flex h-14 w-14 items-center justify-center rounded-xl border border-line bg-white text-primary shadow-sm">
        <CloudUpload size={26} aria-hidden="true" />
      </span>
      <p className="mt-5 text-base font-semibold text-navy">
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation()
            openPicker()
          }}
          disabled={disabled}
          className="rounded text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          Browse files
        </button>{' '}
        or drag &amp; drop your resume here
      </p>
      <p className="mt-1.5 text-[13px] text-muted">Supported formats: PDF, DOCX, TXT (Maximum file size: 10MB)</p>
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-md bg-slate-100 px-2.5 py-1 text-xs text-body">
          <ShieldCheck size={13} className="text-emerald-600" aria-hidden="true" />
          Processed locally in your browser
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-md bg-slate-100 px-2.5 py-1 text-xs text-body">
          <ScanText size={13} aria-hidden="true" />
          Rule-based ATS parser
        </span>
      </div>
    </div>
  )
}

function LoadedDocument({ resume, analyzed, onRemove, disabled }) {
  if (!resume) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-dashed border-line bg-white p-4">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-muted">
          <FileUp size={18} aria-hidden="true" />
        </span>
        <p className="text-sm text-muted">No resume uploaded yet. Add a file to enable the ATS check.</p>
      </div>
    )
  }

  const { file, addedAt } = resume
  const format = getResumeFormat(file)

  return (
    <div className="flex items-center gap-3 rounded-xl border border-line bg-white p-4">
      <span
        className={cn(
          'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-xs font-bold',
          FORMAT_STYLES[format],
        )}
        aria-hidden="true"
      >
        {format.toUpperCase()}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[15px] font-semibold text-navy" title={file.name}>
          {file.name}
        </p>
        <p className="mt-0.5 text-[13px] text-muted">
          {formatFileSize(file.size)} <span aria-hidden="true">•</span>{' '}
          {analyzed ? 'Analysed' : `Uploaded ${timeFormatter.format(addedAt)}`}
        </p>
      </div>
      <button
        type="button"
        onClick={onRemove}
        disabled={disabled}
        aria-label={`Remove ${file.name}`}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted hover:bg-red-50 hover:text-danger focus-visible:outline-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Trash2 size={17} aria-hidden="true" />
      </button>
    </div>
  )
}

export default function ResumeUploadCard({ analysis, onAnalyze }) {
  const { resume, fileError, status, analysisError, selectFile, removeFile } = analysis
  const analyzing = status === 'analyzing'

  return (
    <section
      aria-label="Upload resume"
      className="grid gap-6 rounded-2xl border border-line bg-white p-4 shadow-[0_1px_2px_rgba(16,25,46,0.04)] sm:p-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:gap-8 lg:p-8"
    >
      <div>
        <DropZone onSelect={selectFile} disabled={analyzing} />
        {fileError && (
          <p role="alert" className="mt-3 flex items-center gap-2 text-sm text-danger">
            <CircleAlert size={16} className="shrink-0" aria-hidden="true" />
            {fileError}
          </p>
        )}
      </div>

      <div className="flex flex-col rounded-2xl border border-line bg-canvas p-5 sm:p-6">
        <h2 className="text-xs font-semibold tracking-wider text-muted uppercase">Loaded document</h2>
        <div className="mt-4">
          <LoadedDocument resume={resume} analyzed={status === 'done'} onRemove={removeFile} disabled={analyzing} />
        </div>
        <button
          type="button"
          onClick={onAnalyze}
          disabled={!resume || analyzing}
          className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary text-[15px] font-semibold text-white shadow-[0_6px_16px_rgba(33,99,246,0.25)] transition-colors hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
        >
          {analyzing ? (
            <LoaderCircle size={18} className="animate-spin" aria-hidden="true" />
          ) : (
            <Sparkles size={18} aria-hidden="true" />
          )}
          {analyzing ? 'Analyzing your resume…' : 'Check ATS Score'}
        </button>
        <p aria-live="polite" className="mt-3 text-center text-xs text-muted">
          {!resume && 'Upload a resume first to check its ATS score.'}
          {analyzing && 'Reading your resume and checking sections, skills and keywords…'}
        </p>
        {analysisError && (
          <p role="alert" className="mt-1 flex items-start gap-2 text-sm text-danger">
            <CircleAlert size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
            {analysisError}
          </p>
        )}
      </div>
    </section>
  )
}
