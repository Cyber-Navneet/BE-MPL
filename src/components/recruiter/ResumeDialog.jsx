import { Download } from 'lucide-react'
import Modal from '../dashboard/Modal.jsx'
import DialogButtons from './DialogButtons.jsx'
import DemoBadge from '../resume/DemoBadge.jsx'
import { buildResumeText } from '../../utils/candidateUtils.js'

// Shows a generated demo resume and downloads it as a local .txt file (no server, no real file).
export default function ResumeDialog({ candidate, onClose }) {
  const text = buildResumeText(candidate)
  const fileName = `${candidate.name.replace(/\s+/g, '_')}_Resume_DEMO.txt`

  const download = () => {
    const url = URL.createObjectURL(new Blob([text], { type: 'text/plain' }))
    const link = document.createElement('a')
    link.href = url
    link.download = fileName
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Modal
      title={`${candidate.name} — Resume`}
      subtitle={candidate.role}
      onClose={onClose}
      size="lg"
      footer={<DialogButtons cancelLabel="Close" onCancel={onClose} confirmLabel="Download .txt" confirmIcon={Download} onConfirm={download} />}
    >
      <div className="mb-3 flex items-center gap-2">
        <DemoBadge />
        <p className="text-xs text-home-muted">Generated from fictional sample data; not a real person&apos;s resume.</p>
      </div>
      <pre className="rounded-xl border border-home-border bg-home-bg p-4 font-sans text-sm leading-relaxed whitespace-pre-wrap text-home-ink">
        {text}
      </pre>
    </Modal>
  )
}
