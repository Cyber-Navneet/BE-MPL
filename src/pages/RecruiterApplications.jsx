import { useCallback, useMemo, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { MoveHorizontal, SearchX } from 'lucide-react'
import CandidateFilters from '../components/recruiter/CandidateFilters.jsx'
import StageColumn from '../components/recruiter/StageColumn.jsx'
import ResumeDialog from '../components/recruiter/ResumeDialog.jsx'
import ResultDialog from '../components/recruiter/ResultDialog.jsx'
import InterviewDialog from '../components/recruiter/InterviewDialog.jsx'
import RejectDialog from '../components/recruiter/RejectDialog.jsx'
import OfferDialog from '../components/recruiter/OfferDialog.jsx'
import ConversationDialog from '../components/recruiter/ConversationDialog.jsx'
import { REJECTED_STAGE, STAGES } from '../data/candidates.js'
import { useCandidates } from '../hooks/useCandidates.js'
import { formatDate, formatInr, formatTime, matchesQuery, sortCandidates } from '../utils/candidateUtils.js'

const ALL_STAGES = [...STAGES, REJECTED_STAGE]

// Recruiter view of /applications: a horizontally scrolling hiring pipeline. Every action opens a
// dialog on this page; all candidates and actions are fictional demo data saved in this browser.
export default function RecruiterApplications() {
  const { notify } = useOutletContext()
  const board = useCandidates()
  const [query, setQuery] = useState('')
  const [role, setRole] = useState('')
  const [stageFilter, setStageFilter] = useState('')
  const [sorts, setSorts] = useState({})
  const [dialog, setDialog] = useState(null) // { type, id }

  const { candidates } = board
  const active = dialog ? candidates.find((c) => c.id === dialog.id) : null
  const closeDialog = useCallback(() => setDialog(null), [])

  const filtered = useMemo(
    () => candidates.filter((c) => matchesQuery(c, query) && (!role || c.role === role)),
    [candidates, query, role],
  )

  const roles = [...new Set(candidates.map((c) => c.role))].sort((a, b) => a.localeCompare(b))
  const roleOptions = [
    { value: '', label: `All Roles (${roles.length})` },
    ...roles.map((value) => ({ value, label: `${value} (${candidates.filter((c) => c.role === value).length})` })),
  ]
  const activeStageCount = STAGES.filter((s) => s.id !== 'hired' && candidates.some((c) => c.stage === s.id)).length
  const stageOptions = [
    { value: '', label: `All Stages (${activeStageCount} Active)` },
    ...ALL_STAGES.map((s) => ({ value: s.id, label: `${s.label} (${candidates.filter((c) => c.stage === s.id).length})` })),
  ]

  const columns = stageFilter ? ALL_STAGES.filter((s) => s.id === stageFilter) : STAGES
  const visibleIds = new Set(columns.map((s) => s.id))
  const shownCount = filtered.filter((c) => visibleIds.has(c.stage)).length
  const pipelineTotal = candidates.filter((c) => visibleIds.has(c.stage)).length
  const hasCriteria = query.trim() !== '' || role !== '' || stageFilter !== ''

  const clearFilters = () => {
    setQuery('')
    setRole('')
    setStageFilter('')
  }

  const handleAction = (type, candidate) => {
    if (type === 'restore') {
      board.restore(candidate)
      notify(`${candidate.name} was restored to the pipeline.`, 'success')
      return
    }
    setDialog({ type, id: candidate.id })
  }

  const saveInterview = (interview) => {
    if (active.stage === 'interview') board.updateInterview(active.id, interview)
    else board.scheduleInterview(active.id, interview)
    notify(
      `Interview with ${active.name} set for ${formatDate(interview.date)} at ${formatTime(interview.time)} (${interview.type}). Demo only.`,
      'success',
    )
    setDialog(null)
  }

  const confirmReject = (reason) => {
    board.reject(active.id, active.stage, reason)
    notify(`${active.name} was rejected and moved out of the pipeline.`)
    setDialog(null)
  }

  const sendOffer = (offer) => {
    board.sendOffer(active.id, offer)
    notify(`Offer of ${formatInr(offer.salary)}/year recorded for ${active.name}. Demo only — nothing was sent.`, 'success')
    setDialog(null)
  }

  const resetColumn = (stage) => {
    board.resetStage(stage.id)
    notify(`${stage.label} column restored to its demo candidates.`)
  }

  return (
    <div className="mx-auto max-w-[1180px]">
      <h1 className="text-2xl font-bold tracking-tight text-heading sm:text-[32px]">Candidate Applications</h1>
      <p className="mt-2 text-[15px] text-home-muted sm:text-lg">
        Track hiring stages, review candidate work, and collaborate on technical interviews.
      </p>

      <div className="mt-6">
        <CandidateFilters
          query={query}
          onQueryChange={setQuery}
          role={role}
          onRoleChange={setRole}
          roleOptions={roleOptions}
          stage={stageFilter}
          onStageChange={setStageFilter}
          stageOptions={stageOptions}
        />
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <div className="flex flex-wrap items-center gap-3">
          <p aria-live="polite" className="text-sm text-home-muted">
            Showing {shownCount} of {pipelineTotal} candidates
          </p>
          {hasCriteria && (
            <button
              type="button"
              onClick={clearFilters}
              className="rounded text-sm font-medium text-home-blue hover:underline focus-visible:outline-2 focus-visible:outline-home-blue"
            >
              Clear filters
            </button>
          )}
        </div>
        {columns.length > 1 && (
          <p className="flex items-center gap-1.5 text-xs text-home-muted">
            <MoveHorizontal size={14} aria-hidden="true" /> Scroll sideways to see every stage
          </p>
        )}
      </div>

      {shownCount === 0 && hasCriteria ? (
        <div className="mt-4 flex flex-col items-center rounded-2xl border border-dashed border-home-border bg-white px-6 py-14 text-center">
          <SearchX size={28} className="text-home-blue" aria-hidden="true" />
          <h2 className="mt-3 text-lg font-semibold text-home-ink">No candidates match</h2>
          <p className="mt-1 max-w-sm text-sm text-home-muted">Try a different name, role or skill, or clear the filters.</p>
          <button
            type="button"
            onClick={clearFilters}
            className="mt-5 inline-flex h-10 items-center rounded-lg bg-home-blue px-4 text-sm font-medium text-white hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-home-blue"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div
          role="region"
          aria-label="Hiring pipeline. Scroll horizontally to see every stage."
          tabIndex={0}
          className="relative mt-3 overflow-x-auto scroll-smooth rounded-2xl pb-3 focus-visible:outline-2 focus-visible:outline-home-blue"
        >
          <div className="flex w-max gap-5">
            {columns.map((stage) => (
              <StageColumn
                key={stage.id}
                stage={stage}
                candidates={sortCandidates(
                  filtered.filter((c) => c.stage === stage.id),
                  sorts[stage.id] ?? 'newest',
                )}
                sort={sorts[stage.id] ?? 'newest'}
                onSort={(sort) => setSorts((prev) => ({ ...prev, [stage.id]: sort }))}
                onReset={() => resetColumn(stage)}
                onAction={handleAction}
              />
            ))}
          </div>
        </div>
      )}

      {active && dialog.type === 'resume' && <ResumeDialog candidate={active} onClose={closeDialog} />}
      {active && dialog.type === 'result' && <ResultDialog candidate={active} onClose={closeDialog} />}
      {active && dialog.type === 'interview' && <InterviewDialog candidate={active} onSave={saveInterview} onClose={closeDialog} />}
      {active && dialog.type === 'reject' && <RejectDialog candidate={active} onConfirm={confirmReject} onClose={closeDialog} />}
      {active && dialog.type === 'offer' && <OfferDialog candidate={active} onSend={sendOffer} onClose={closeDialog} />}
      {active && dialog.type === 'chat' && (
        <ConversationDialog candidate={active} messages={board.chats[active.id] ?? []} onSend={board.sendMessage} onClose={closeDialog} />
      )}
    </div>
  )
}
