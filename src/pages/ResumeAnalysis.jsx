import { useMemo } from 'react'
import { useOutletContext } from 'react-router-dom'
import ResumeUploadCard from '../components/resume/ResumeUploadCard.jsx'
import AtsScoreCard from '../components/resume/AtsScoreCard.jsx'
import DetectedSkillsCard from '../components/resume/DetectedSkillsCard.jsx'
import RecommendedJobs from '../components/resume/RecommendedJobs.jsx'
import { JOBS } from '../data/jobs.js'
import { DEMO_ANALYSIS } from '../data/studentProfile.js'
import { useResumeAnalysis } from '../hooks/useResumeAnalysis.js'
import { matchJobs } from '../utils/jobMatcher.js'

export default function ResumeAnalysis() {
  const { notify } = useOutletContext()
  const analysis = useResumeAnalysis()
  const { result } = analysis
  const isDemo = !result

  const jobs = useMemo(() => (result ? matchJobs(JOBS, result.skills) : JOBS), [result])

  const handleAnalyze = async () => {
    const outcome = await analysis.analyze()
    if (outcome) notify(`Analysis complete: estimated ATS score ${outcome.score}%.`, 'success')
  }

  return (
    <div className="mx-auto max-w-[1180px]">
      <h1 className="text-2xl font-bold tracking-tight text-navy sm:text-[28px]">Resume Analysis &amp; ATS Optimizer</h1>
      <p className="mt-1.5 text-[15px] text-muted">
        Check your resume&apos;s ATS score, improve readability, and find jobs that match your skills.
      </p>

      <div className="mt-6 space-y-6">
        <ResumeUploadCard analysis={analysis} onAnalyze={handleAnalyze} />

        <div className="grid gap-6 rounded-2xl border border-line bg-white p-4 shadow-[0_1px_2px_rgba(16,25,46,0.04)] sm:p-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:p-8">
          <AtsScoreCard
            score={result?.score ?? DEMO_ANALYSIS.score}
            summary={result?.summary ?? DEMO_ANALYSIS.summary}
            rules={result?.rules}
            isDemo={isDemo}
          />
          <DetectedSkillsCard skills={result?.skills ?? DEMO_ANALYSIS.skills} isDemo={isDemo} />
        </div>
      </div>

      <RecommendedJobs jobs={jobs} isDemo={isDemo} detectedSkillCount={result?.skills.length ?? 0} notify={notify} />
    </div>
  )
}
