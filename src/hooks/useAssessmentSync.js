import { useEffect, useState } from 'react'
import { syncAssessments } from '../utils/applicationStore.js'

const SYNC_INTERVAL_MS = 1000

// Current time, refreshed every second, plus a sync that assigns missing assessments
// and auto-submits any attempt whose deadline has passed (also while the page is open).
export function useAssessmentSync() {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    syncAssessments()
    const timer = setInterval(() => {
      const current = Date.now()
      syncAssessments(current)
      setNow(current)
    }, SYNC_INTERVAL_MS)
    return () => clearInterval(timer)
  }, [])

  return now
}
