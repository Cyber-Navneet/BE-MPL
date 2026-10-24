import { useEffect, useRef, useState } from 'react'
import { Info, SendHorizontal } from 'lucide-react'
import Modal from '../dashboard/Modal.jsx'
import { formatMessageTime } from '../../utils/dashboardUtils.js'
import { cn } from '../../utils/cn.js'

// Simulated chat with a hired candidate. Enter sends; Shift+Enter adds a new line.
export default function ConversationDialog({ candidate, messages, onSend, onClose }) {
  const [draft, setDraft] = useState('')
  const inputRef = useRef(null)
  const endRef = useRef(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'end' })
  }, [messages.length])

  const send = () => {
    const text = draft.trim()
    if (!text) return
    onSend(candidate, text)
    setDraft('')
  }

  return (
    <Modal
      title={candidate.name}
      subtitle={`${candidate.role} · Hired`}
      onClose={onClose}
      initialFocusRef={inputRef}
      bodyClassName="min-h-72 bg-home-bg"
      footer={
        <form
          onSubmit={(event) => {
            event.preventDefault()
            send()
          }}
          className="flex items-end gap-2"
        >
          <textarea
            ref={inputRef}
            rows={1}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
                event.preventDefault()
                send()
              }
            }}
            placeholder="Type a message…"
            aria-label={`Message to ${candidate.name}`}
            maxLength={500}
            className="max-h-32 min-h-11 min-w-0 flex-1 resize-y rounded-lg border border-home-border bg-white px-3 py-2.5 text-[15px] text-home-ink placeholder:text-placeholder focus-visible:border-home-blue focus-visible:outline-2 focus-visible:outline-home-blue/30"
          />
          <button
            type="submit"
            disabled={!draft.trim()}
            className="inline-flex h-11 items-center gap-2 rounded-lg bg-green-600 px-4 text-sm font-medium text-white hover:bg-green-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-home-blue disabled:cursor-not-allowed disabled:opacity-50"
          >
            <SendHorizontal size={17} aria-hidden="true" />
            Send
          </button>
        </form>
      }
    >
      <p className="mb-4 flex items-start gap-2 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
        <Info size={14} className="mt-0.5 shrink-0" aria-hidden="true" />
        Simulated demo chat. The candidate is fictional and does not receive these messages.
      </p>
      {messages.length === 0 ? (
        <p className="py-10 text-center text-sm text-home-muted">No messages yet. Say hello to {candidate.name}.</p>
      ) : (
        <ol aria-label="Messages" aria-live="polite" className="space-y-4">
          {messages.map((message) => {
            const mine = message.from === 'recruiter'
            return (
              <li key={message.id} className={cn('flex flex-col', mine ? 'items-end' : 'items-start')}>
                <span className="mb-1 text-xs font-medium text-home-muted">{mine ? 'You' : candidate.name}</span>
                <p
                  className={cn(
                    'max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed break-words whitespace-pre-wrap',
                    mine ? 'rounded-br-md bg-home-blue text-white' : 'rounded-bl-md border border-home-border bg-white text-home-ink',
                  )}
                >
                  {message.text}
                </p>
                <time dateTime={message.sentAt} className="mt-1 text-xs text-home-muted">
                  {formatMessageTime(message.sentAt)}
                </time>
              </li>
            )
          })}
        </ol>
      )}
      <div ref={endRef} />
    </Modal>
  )
}
