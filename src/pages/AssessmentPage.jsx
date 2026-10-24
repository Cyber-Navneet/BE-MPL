import { Link, useOutletContext, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import AssessmentIntro from '../components/assessment/AssessmentIntro.jsx'
import AssessmentRunner from '../components/assessment/AssessmentRunner.jsx'
import AssessmentResults from '../components/assessment/AssessmentResults.jsx'
import { useAssessmentSync } from '../hooks/useAssessmentSync.js'
import { assessmentStatus, assessmentsStore, findJob, questionsFor, startAssessment } from '../utils/applicationStore.js'

// One route for the whole lifecycle: intro → live attempt → results. A submitted
// assessment only ever shows its results, so it can't be restarted by accident.
export default function AssessmentPage() {
  const { assessmentId } = useParams()
  const { notify } = useOutletContext()
  const now = useAssessmentSync()
  const assessments = assessmentsStore.useStore()
  const assessment = assessments[assessmentId]
  const job = assessment && findJob(assessment.jobId)

  const back = (
    <Link
      to="/assessments"
      className="mb-4 inline-flex items-center gap-2 rounded-md py-1 text-[15px] text-navy hover:text-primary focus-visible:outline-2 focus-visible:outline-primary"
    >
      <ArrowLeft size={18} aria-hidden="true" /> All assessments
    </Link>
  )

  if (!assessment || !job) {
    return (
      <div className="mx-auto max-w-[1180px]">
        {back}
        <h1 className="text-2xl font-bold tracking-tight text-navy">Assessment not found</h1>
        <p className="mt-1.5 text-[15px] text-muted">This assessment doesn’t exist on this device.</p>
      </div>
    )
  }

  const status = assessmentStatus(assessment, now)
  const questions = questionsFor(assessment)

  return (
    <div className="mx-auto max-w-[1180px]">
      {status !== 'in_progress' && back}
      {status === 'in_progress' && (
        <AssessmentRunner assessment={assessment} questions={questions} job={job} now={now} notify={notify} />
      )}
      {status === 'submitted' && <AssessmentResults assessment={assessment} questions={questions} job={job} />}
      {(status === 'not_started' || status === 'expired') && (
        <AssessmentIntro
          assessment={assessment}
          job={job}
          expired={status === 'expired'}
          onStart={() => {
            startAssessment(assessment.id)
            notify(`Assessment started. You have ${assessment.durationMinutes} minutes.`, 'info')
          }}
        />
      )}
    </div>
  )
}
