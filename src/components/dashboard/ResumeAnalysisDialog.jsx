import { useEffect, useState } from 'react'
import { FileText, LoaderCircle, Sparkles, Upload } from 'lucide-react'
import Modal from './Modal.jsx'
import DemoBadge from '../resume/DemoBadge.jsx'
import { SAMPLE_RESUMES, TARGET_ROLE } from '../../data/dashboard.js'
import { useResumeAnalysis } from '../../hooks/useResumeAnalysis.js'
import { analyzeResume } from '../../utils/atsAnalyzer.js'
import { missingTargetSkills, resumeSuggestions } from '../../utils/dashboardUtils.js'
import { ACCEPTED_EXTENSIONS, formatFileSize } from '../../utils/resumeParser.js'
import { cn } from '../../utils/cn.js'

const SAMPLE_DELAY_MS = 700

const tabClasses = (active) =>
  cn(
    'flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-home-blue',
    active ? 'bg-white text-home-ink shadow-sm' : 'text-home-muted hover:text-home-ink',
  )

function PillList({ items, className, empty }) {
  if (items.length === 0) return <p className="text-sm text-home-muted">{empty}</p>
  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((item) => (
        <li key={item} className={cn('rounded-full px-3 py-1 text-[13px] font-medium', className)}>
          {item}
        </li>
      ))}
    </ul>
  )
}

// Analyze a sample resume or the student's own file (parsed in the browser, never uploaded).
// Results come from the rule-based ATS analyzer and are labelled as demo data.
export default function ResumeAnalysisDialog({ onClose, notify }) {
  const upload = useResumeAnalysis()
  const [mode, setMode] = useState('sample') // sample | upload
  const [sampleId, setSampleId] = useState(SAMPLE_RESUMES[0].id)
  const [sampleState, setSampleState] = useState({ status: 'idle', result: null }) // idle | analyzing | done

  useEffect(() => {
    if (sampleState.status !== 'analyzing') return
    const sample = SAMPLE_RESUMES.find((resume) => resume.id === sampleId)
    const timer = setTimeout(() => setSampleState({ status: 'done', result: analyzeResume(sample.text) }), SAMPLE_DELAY_MS)
    return () => clearTimeout(timer)
  }, [sampleState.status, sampleId])

  const isSample = mode === 'sample'
  const analyzing = isSample ? sampleState.status === 'analyzing' : upload.status === 'analyzing'
  const result = isSample ? sampleState.result : upload.result
  const canAnalyze = !analyzing && (isSample || Boolean(upload.resume))
  const sourceName = isSample ? SAMPLE_RESUMES.find((resume) => resume.id === sampleId).fileName : upload.resume?.file.name

  const analyze = async () => {
    if (isSample) {
      setSampleState({ status: 'analyzing', result: null })
      return
    }
    const outcome = await upload.analyze()
    if (outcome) notify(`Resume analyzed: estimated ATS score ${outcome.score}/100 (demo).`, 'success')
  }

  return (
    <Modal
      title="Resume analysis"
      subtitle="Find skill gaps before you apply"
      onClose={onClose}
      size="lg"
      footer={
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="h-10 rounded-lg border border-home-border bg-white px-4 text-sm font-medium text-home-ink hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-home-blue"
          >
            {result ? 'Close' : 'Cancel'}
          </button>
          <button
            type="button"
            onClick={analyze}
            disabled={!canAnalyze}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-home-blue px-4 text-sm font-medium text-white hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-home-blue disabled:cursor-not-allowed disabled:opacity-50"
          >
            {analyzing ? <LoaderCircle size={16} className="animate-spin" aria-hidden="true" /> : <Sparkles size={16} aria-hidden="true" />}
            {analyzing ? 'Analyzing…' : result ? 'Analyze again' : 'Analyze resume'}
          </button>
        </div>
      }
    >
      <div className="flex gap-1 rounded-lg bg-home-bg p-1" role="group" aria-label="Resume source">
        <button type="button" aria-pressed={isSample} onClick={() => setMode('sample')} className={tabClasses(isSample)}>
          Use a sample resume
        </button>
        <button type="button" aria-pressed={!isSample} onClick={() => setMode('upload')} className={tabClasses(!isSample)}>
          Upload your own
        </button>
      </div>

      {isSample ? (
        <fieldset className="mt-4 grid gap-3 sm:grid-cols-2" disabled={analyzing}>
          <legend className="sr-only">Sample resumes</legend>
          {SAMPLE_RESUMES.map((resume) => (
            <label
              key={resume.id}
              className={cn(
                'flex cursor-pointer gap-3 rounded-xl border p-4 transition-colors has-focus-visible:outline-2 has-focus-visible:outline-home-blue',
                resume.id === sampleId ? 'border-home-blue bg-home-tint' : 'border-home-border hover:bg-slate-50',
              )}
            >
              <input
                type="radio"
                name="sample-resume"
                checked={resume.id === sampleId}
                onChange={() => {
                  setSampleId(resume.id)
                  setSampleState({ status: 'idle', result: null })
                }}
                className="mt-1 h-4 w-4 accent-home-blue"
              />
              <span className="min-w-0 text-sm">
                <span className="flex items-center gap-2 font-semibold break-all text-home-ink">
                  <FileText size={16} className="shrink-0 text-home-blue" aria-hidden="true" />
                  {resume.fileName}
                </span>
                <span className="mt-1 block text-home-muted">{resume.summary}</span>
              </span>
            </label>
          ))}
        </fieldset>
      ) : (
        <div className="mt-4 rounded-xl border border-dashed border-home-border p-5 text-center">
          <input
            type="file"
            accept={ACCEPTED_EXTENSIONS}
            className="peer sr-only"
            id="dashboard-resume-file"
            onChange={(event) => {
              const file = event.target.files?.[0]
              if (file) upload.selectFile(file)
              event.target.value = ''
            }}
          />
          <label
            htmlFor="dashboard-resume-file"
            className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-lg border border-home-border bg-white px-4 text-sm font-medium text-home-ink hover:bg-slate-50 peer-focus-visible:outline-2 peer-focus-visible:outline-home-blue"
          >
            <Upload size={16} aria-hidden="true" /> Choose a file
          </label>
          <p className="mt-2 text-xs text-home-muted">PDF, DOCX or TXT, up to 10MB. Read in your browser only; nothing is uploaded.</p>
          {upload.resume && (
            <p className="mt-3 text-sm font-medium break-all text-home-ink">
              {upload.resume.file.name} ({formatFileSize(upload.resume.file.size)})
            </p>
          )}
          {upload.fileError && (
            <p role="alert" className="mt-3 text-sm text-danger">
              {upload.fileError}
            </p>
          )}
          {upload.analysisError && (
            <p role="alert" className="mt-3 text-sm text-danger">
              {upload.analysisError}
            </p>
          )}
        </div>
      )}

      <section aria-live="polite" className="mt-6">
        {result && (
          <div className="rounded-xl border border-home-border p-4 sm:p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-base font-semibold text-home-ink">Results</h3>
                  <DemoBadge />
                </div>
                <p className="mt-1 text-xs break-all text-home-muted">
                  {sourceName} · compared with a {TARGET_ROLE} role
                </p>
              </div>
              <p className="text-right">
                <span className="block text-3xl font-bold tracking-tight text-home-ink">{result.score}/100</span>
                <span className="text-xs font-medium text-home-muted">{result.tier}</span>
              </p>
            </div>

            <h4 className="mt-5 text-sm font-semibold text-home-ink">Detected skills</h4>
            <div className="mt-2">
              <PillList items={result.skills} className="bg-emerald-50 text-emerald-700" empty="No known skills detected." />
            </div>

            <h4 className="mt-5 text-sm font-semibold text-home-ink">Missing skills for {TARGET_ROLE}</h4>
            <div className="mt-2">
              <PillList
                items={missingTargetSkills(result.skills)}
                className="bg-amber-50 text-amber-700"
                empty="None — every core skill was found."
              />
            </div>

            <h4 className="mt-5 text-sm font-semibold text-home-ink">Suggestions to improve</h4>
            {resumeSuggestions(result.rules).length > 0 ? (
              <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-body marker:text-home-muted">
                {resumeSuggestions(result.rules).map((tip) => (
                  <li key={tip}>{tip}</li>
                ))}
              </ol>
            ) : (
              <p className="mt-2 text-sm text-home-muted">Great work — no major gaps found.</p>
            )}
            <p className="mt-4 text-xs text-home-muted">
              Estimated with simple rules for this demo. It is not an official ATS score.
            </p>
          </div>
        )}
      </section>
    </Modal>
  )
}
