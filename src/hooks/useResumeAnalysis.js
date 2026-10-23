import { useRef, useState } from 'react'
import { analyzeResume } from '../utils/atsAnalyzer.js'
import { ResumeParseError, extractResumeText, validateResumeFile } from '../utils/resumeParser.js'

// Holds the selected resume and its analysis. Selecting, replacing or removing a file clears
// the previous result; a result that finishes after the file changed is discarded.
export function useResumeAnalysis() {
  const [resume, setResume] = useState(null) // { file, addedAt }
  const [fileError, setFileError] = useState('')
  const [status, setStatus] = useState('idle') // idle | analyzing | done | error
  const [result, setResult] = useState(null)
  const [analysisError, setAnalysisError] = useState('')
  const runId = useRef(0)

  const resetAnalysis = () => {
    runId.current += 1
    setStatus('idle')
    setResult(null)
    setAnalysisError('')
  }

  const selectFile = (file) => {
    const error = validateResumeFile(file)
    setFileError(error)
    if (error) return false
    resetAnalysis()
    setResume({ file, addedAt: new Date() })
    return true
  }

  const removeFile = () => {
    resetAnalysis()
    setResume(null)
    setFileError('')
  }

  const analyze = async () => {
    if (!resume || status === 'analyzing') return null
    const id = ++runId.current
    setStatus('analyzing')
    setAnalysisError('')
    try {
      const text = await extractResumeText(resume.file)
      const analysis = analyzeResume(text)
      if (id !== runId.current) return null
      setResult(analysis)
      setStatus('done')
      return analysis
    } catch (error) {
      if (id !== runId.current) return null
      setAnalysisError(
        error instanceof ResumeParseError ? error.message : 'Something went wrong while analysing this resume. Please try again.',
      )
      setStatus('error')
      return null
    }
  }

  return { resume, fileError, status, result, analysisError, selectFile, removeFile, analyze, clearFileError: () => setFileError('') }
}
