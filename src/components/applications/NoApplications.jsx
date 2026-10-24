import { Send } from 'lucide-react'
import Button from '../Button.jsx'
import { JOBS } from '../../data/jobs.js'
import { applyToJob } from '../../utils/applicationStore.js'

// Frontend Engineer, Backend Java Developer Intern and Backend Developer Intern: three
// different skill sets and assessment lengths.
const SAMPLE_JOB_IDS = [1, 7, 5]

export default function NoApplications({ message, notify }) {
  const addSamples = () => {
    SAMPLE_JOB_IDS.forEach((id) => applyToJob(JOBS.find((job) => job.id === id)))
    notify('Added 3 demo applications, each with its own skills assessment.', 'success')
  }

  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-line bg-white px-6 py-14 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-pale text-primary">
        <Send size={22} aria-hidden="true" />
      </span>
      <h2 className="mt-4 text-lg font-semibold text-navy">No applications yet</h2>
      <p className="mt-1 max-w-md text-sm text-muted">{message}</p>
      <div className="mt-5 flex flex-wrap justify-center gap-3">
        <Button to="/jobs" size="sm">
          Browse jobs
        </Button>
        <Button variant="outline" size="sm" onClick={addSamples}>
          Add 3 demo applications
        </Button>
      </div>
    </div>
  )
}
