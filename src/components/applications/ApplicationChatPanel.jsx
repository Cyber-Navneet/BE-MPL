import { useCallback, useEffect, useRef, useState } from 'react'
import { AtSign, Send, Smile, X } from 'lucide-react'
import { CompanyLogo } from '../jobs/JobBadges.jsx'
import { useDialog } from '../../hooks/useDialog.js'
import { useDismiss } from '../../hooks/useDismiss.js'
import { formatMessageTime } from '../../utils/applicationUtils.js'
import { cn } from '../../utils/cn.js'

const EMOJIS = ['😀', '😊', '👍', '🙏', '🎉', '👋', '🤝', '✅']

const iconButtonClasses =
  'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-muted transition-colors hover:bg-slate-100 hover:text-navy focus-visible:outline-2 focus-visible:outline-primary'

// Chat with one application's employer. Messages are kept in page state only; nothing is sent anywhere.
// Keyed by application id in the page, so the draft resets when another application's chat opens.
export default function ApplicationChatPanel({ application, onSend, onClose }) {
  const [draft, setDraft] = useState('')
  const [emojiOpen, setEmojiOpen] = useState(false)
  const inputRef = useRef(null)
  const listRef = useRef(null)
  const emojiRef = useRef(null)

  const closeEmoji = useCallback(() => setEmojiOpen(false), [])
  useDialog({ open: true, onClose, initialFocusRef: inputRef, escapeEnabled: !emojiOpen })
  useDismiss(emojiRef, emojiOpen, closeEmoji)

  const messageCount = application.messages.length
  useEffect(() => {
    const list = listRef.current
    if (list) list.scrollTop = list.scrollHeight
  }, [messageCount])

  const insert = (text) => {
    setDraft((prev) => (prev && !prev.endsWith(' ') ? `${prev} ${text}` : `${prev}${text}`))
    inputRef.current?.focus()
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const text = draft.trim()
    if (!text) return
    onSend(text)
    setDraft('')
    setEmojiOpen(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-navy/40" onClick={onClose} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="chat-title"
        className="relative flex h-full w-full max-w-md flex-col bg-white shadow-xl"
      >
        <div className="flex items-center gap-3 border-b border-line px-4 py-3 sm:px-5">
          <CompanyLogo initials={application.companyShortName} className="h-10 w-10 text-sm" />
          <div className="min-w-0 flex-1">
            <h2 id="chat-title" className="truncate text-base font-semibold text-navy">
              {application.company}
            </h2>
            <p className="truncate text-sm text-muted">{application.jobTitle}</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close chat" className={iconButtonClasses}>
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <ol ref={listRef} aria-label="Messages" className="min-h-0 flex-1 space-y-4 overflow-y-auto bg-canvas px-4 py-5 sm:px-5">
          {messageCount === 0 && <li className="py-10 text-center text-sm text-muted">No messages yet. Say hello!</li>}
          {application.messages.map((message) => {
            const mine = message.from === 'candidate'
            return (
              <li key={message.id} className={cn('flex flex-col', mine ? 'items-end' : 'items-start')}>
                <div
                  className={cn(
                    'max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed wrap-break-word whitespace-pre-line',
                    mine ? 'rounded-br-md bg-primary text-white' : 'rounded-bl-md border border-line bg-white text-navy',
                  )}
                >
                  <span className="sr-only">{mine ? 'You' : application.recruiter}: </span>
                  {message.text}
                </div>
                <span className="mt-1 px-1 text-xs text-muted">
                  {mine ? 'You' : `${application.recruiter} · ${application.company}`} · {formatMessageTime(message.sentAt)}
                </span>
              </li>
            )
          })}
        </ol>

        <form onSubmit={handleSubmit} className="flex items-center gap-1 border-t border-line px-3 py-3 sm:px-4">
          <div ref={emojiRef} className="relative">
            <button
              type="button"
              onClick={() => setEmojiOpen((open) => !open)}
              aria-label="Insert emoji"
              aria-expanded={emojiOpen}
              className={iconButtonClasses}
            >
              <Smile size={20} aria-hidden="true" />
            </button>
            {emojiOpen && (
              <div className="absolute bottom-12 left-0 grid w-max grid-cols-4 gap-1 rounded-xl border border-line bg-white p-2 shadow-lg">
                {EMOJIS.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => {
                      insert(emoji)
                      setEmojiOpen(false)
                    }}
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-lg hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-primary"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={() => insert(`@${application.recruiter} `)}
            aria-label={`Mention ${application.recruiter}`}
            className={iconButtonClasses}
          >
            <AtSign size={20} aria-hidden="true" />
          </button>
          <input
            ref={inputRef}
            type="text"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Start typing..."
            aria-label="Message"
            className="h-11 min-w-0 flex-1 rounded-lg border border-line bg-white px-3 text-[15px] text-navy placeholder:text-placeholder focus-visible:border-primary focus-visible:outline-2 focus-visible:outline-primary/30"
          />
          <button
            type="submit"
            disabled={!draft.trim()}
            aria-label="Send message"
            className="ml-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary text-white hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Send size={18} aria-hidden="true" />
          </button>
        </form>
      </div>
    </div>
  )
}
