import { useCallback, useEffect, useMemo, useRef } from 'react'
import { useStoredState } from './useStoredState.js'
import { DEMO_ASSESSMENTS, DEMO_PROFILE, createSeedApplications, createSeedConversations } from '../data/dashboard.js'
import { countUnread, createApplication, isAppliedTo, profileCompletion } from '../utils/dashboardUtils.js'

const REPLY_DELAY_MS = 1500
const isObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value)

// Applications and recruiter chats for the home dashboard, saved in this browser per account email.
// Everything is fictional demo data.
export function useHomeDashboard(email) {
  const prefix = `talentforge.home.${email}`
  const [applications, setApplications] = useStoredState(`${prefix}.applications`, createSeedApplications, Array.isArray)
  const [conversations, setConversations] = useStoredState(`${prefix}.conversations`, createSeedConversations, isObject)

  const replyTimers = useRef([])
  useEffect(() => {
    const timers = replyTimers.current
    return () => timers.forEach(clearTimeout)
  }, [])

  const unreadByApplication = useMemo(
    () => Object.fromEntries(applications.map((app) => [app.id, countUnread(conversations[app.id])])),
    [applications, conversations],
  )

  const stats = {
    applications: applications.length,
    newMessages: Object.values(unreadByApplication).reduce((sum, count) => sum + count, 0),
    assessments: DEMO_ASSESSMENTS.length,
    needAttention: DEMO_ASSESSMENTS.filter((assessment) => assessment.status !== 'Completed').length,
    profileCompletion: profileCompletion(DEMO_PROFILE.fields),
  }

  // Returns false (and changes nothing) when the student already applied to this job.
  const apply = (recommendation) => {
    if (isAppliedTo(applications, recommendation)) return false
    setApplications((prev) => [createApplication(recommendation), ...prev])
    return true
  }

  const updateStatus = (id, status) =>
    setApplications((prev) => prev.map((app) => (app.id === id ? { ...app, status } : app)))

  const remove = (id) => {
    setApplications((prev) => prev.filter((app) => app.id !== id))
    setConversations((prev) => {
      const { [id]: _removed, ...rest } = prev
      return rest
    })
  }

  // Adds the student's message, then a simulated recruiter reply (unread) after a short delay.
  const sendMessage = (application, text) => {
    const sentAt = Date.now()
    const id = application.id
    setConversations((prev) => ({
      ...prev,
      [id]: [...(prev[id] ?? []), { id: `${id}-${sentAt}`, from: 'student', text, sentAt: new Date(sentAt).toISOString(), read: true }],
    }))
    const reply = {
      id: `${id}-${sentAt}-reply`,
      from: 'recruiter',
      text: `Thanks for your message! The ${application.company} hiring team will follow up here. (Simulated demo reply)`,
      read: false,
    }
    replyTimers.current.push(
      setTimeout(() => {
        // Skip the reply if the application was deleted in the meantime.
        setConversations((prev) =>
          prev[id] ? { ...prev, [id]: [...prev[id], { ...reply, sentAt: new Date().toISOString() }] } : prev,
        )
      }, REPLY_DELAY_MS),
    )
  }

  const markRead = useCallback(
    (id) =>
      setConversations((prev) =>
        countUnread(prev[id]) === 0
          ? prev
          : { ...prev, [id]: prev[id].map((message) => (message.from === 'recruiter' ? { ...message, read: true } : message)) },
      ),
    [setConversations],
  )

  return { applications, conversations, unreadByApplication, stats, apply, updateStatus, remove, sendMessage, markRead }
}
