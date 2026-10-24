import { useCallback, useEffect, useRef } from 'react'
import { useStoredState } from './useStoredState.js'
import { createSeedCandidates, createSeedChats } from '../data/candidates.js'

const REPLY_DELAY_MS = 1500
const isObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value)

// Candidates and hired-candidate chats for the recruiter board, saved in this browser only.
// Every action is a demo: nothing is sent to a real candidate.
export function useCandidates() {
  const [candidates, setCandidates] = useStoredState('talentforge.recruiter.candidates', createSeedCandidates, Array.isArray)
  const [chats, setChats] = useStoredState('talentforge.recruiter.chats', createSeedChats, isObject)

  const replyTimers = useRef([])
  useEffect(() => {
    const timers = replyTimers.current
    return () => timers.forEach(clearTimeout)
  }, [])

  const update = useCallback(
    (id, changes) => setCandidates((prev) => prev.map((c) => (c.id === id ? { ...c, ...changes } : c))),
    [setCandidates],
  )

  const moveTo = (id, stage, changes = {}) => update(id, { ...changes, stage, stageUpdatedAt: new Date().toISOString() })

  const scheduleInterview = (id, interview) => moveTo(id, 'interview', { interview })
  // Editing keeps the candidate's place (and timestamp) in the interview column.
  const updateInterview = (id, interview) => update(id, { interview })
  const sendOffer = (id, offer) => moveTo(id, 'offer', { offer: { ...offer, status: 'Pending' } })
  const reject = (id, fromStage, reason) => moveTo(id, 'rejected', { rejection: { fromStage, reason } })
  const restore = (candidate) => moveTo(candidate.id, candidate.rejection?.fromStage ?? 'applied', { rejection: null })

  // Puts the original demo candidates of one column back exactly as they were seeded.
  const resetStage = (stage) => {
    const seeds = createSeedCandidates().filter((c) => c.stage === stage)
    const seedIds = new Set(seeds.map((c) => c.id))
    setCandidates((prev) => [...prev.filter((c) => !seedIds.has(c.id)), ...seeds])
  }

  const sendMessage = (candidate, text) => {
    const sentAt = Date.now()
    const id = candidate.id
    setChats((prev) => ({
      ...prev,
      [id]: [...(prev[id] ?? []), { id: `${id}-${sentAt}`, from: 'recruiter', text, sentAt: new Date(sentAt).toISOString() }],
    }))
    const reply = {
      id: `${id}-${sentAt}-reply`,
      from: 'candidate',
      text: `Thanks for the update! (Simulated reply from ${candidate.name.split(' ')[0]})`,
    }
    replyTimers.current.push(
      setTimeout(
        () => setChats((prev) => ({ ...prev, [id]: [...(prev[id] ?? []), { ...reply, sentAt: new Date().toISOString() }] })),
        REPLY_DELAY_MS,
      ),
    )
  }

  return { candidates, chats, scheduleInterview, updateInterview, sendOffer, reject, restore, resetStage, sendMessage }
}
