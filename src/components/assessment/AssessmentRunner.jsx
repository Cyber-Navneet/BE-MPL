import { useCallback, useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, Check, Timer } from 'lucide-react'
import { useDialog } from '../../hooks/useDialog.js'
import { saveAnswer, submitAssessment } from '../../utils/applicationStore.js'
import { formatClock } from '../../utils/formatTime.js'
import { cn } from '../../utils/cn.js'

const SHORT_ANSWER_LIMIT = 600
const FIVE_MINUTES = 5 * 60 * 1000
const ONE_MINUTE = 60 * 1000

const isAnswered = (question, value) => (question.type === 'mcq' ? Boolean(value) : Boolean(value?.trim()))

function SubmitDialog({ unanswered, onConfirm, onCancel }) {
  const cancelRef = useRef(null)
  useDialog({ open: true, onClose: onCancel, initialFocusRef: cancelRef })

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-navy/50" onClick={onCancel} aria-hidden="true" />
      <div role="alertdialog" aria-modal="true" aria-labelledby="submit-title" aria-describedby="submit-description" className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <h2 id="submit-title" className="text-lg font-semibold text-navy">
          Submit assessment?
        </h2>
        <p id="submit-description" className="mt-2 text-sm leading-relaxed text-body">
          {unanswered > 0
            ? `You have ${unanswered} unanswered ${unanswered === 1 ? 'question' : 'questions'}; they will score 0. `
            : 'All questions are answered. '}
          You can’t change your answers after submitting.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button ref={cancelRef} type="button" onClick={onCancel} className="h-10 rounded-lg border border-line bg-white px-4 text-sm font-medium text-navy hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
            Keep working
          </button>
          <button type="button" onClick={onConfirm} className="h-10 rounded-lg bg-primary px-4 text-sm font-medium text-white hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
            Submit now
          </button>
        </div>
      </div>
    </div>
  )
}

function QuestionBody({ question, value, onChange }) {
  if (question.type === 'mcq') {
    return (
      <fieldset>
        <legend className="text-lg font-semibold text-navy">{question.question}</legend>
        <div className="mt-5 space-y-3">
          {question.options.map((option, index) => {
            const selected = value === option
            return (
              <label
                key={option}
                className={cn(
                  'flex cursor-pointer items-start gap-3 rounded-xl border p-4 text-[15px] transition-colors has-focus-visible:outline-2 has-focus-visible:outline-primary',
                  selected ? 'border-primary bg-pale text-navy' : 'border-line bg-white text-navy hover:border-slate-300',
                )}
              >
                <input type="radio" name={question.id} value={option} checked={selected} onChange={() => onChange(option)} className="sr-only" />
                <span className={cn('flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-semibold', selected ? 'border-primary bg-primary text-white' : 'border-line text-muted')} aria-hidden="true">
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="pt-0.5">{option}</span>
              </label>
            )
          })}
        </div>
      </fieldset>
    )
  }

  const text = value ?? ''
  return (
    <div>
      <label htmlFor={`answer-${question.id}`} className="text-lg font-semibold text-navy">
        {question.question}
      </label>
      <textarea
        id={`answer-${question.id}`}
        rows={6}
        maxLength={SHORT_ANSWER_LIMIT}
        value={text}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Type your answer here…"
        spellCheck={false}
        className="mt-5 w-full resize-y rounded-xl border border-line bg-white p-4 font-mono text-sm text-navy placeholder:font-sans placeholder:text-placeholder focus-visible:border-primary focus-visible:outline-2 focus-visible:outline-primary/30"
      />
      <div className="mt-1.5 flex justify-between text-xs text-muted">
        <span>{text.trim() ? 'Answer saved' : 'Written answer'}</span>
        <span>
          {text.length}/{SHORT_ANSWER_LIMIT}
        </span>
      </div>
    </div>
  )
}

// Live attempt. The deadline lives in the stored assessment, so refreshing or navigating away
// never resets the timer; when it reaches zero the saved answers are submitted automatically.
export default function AssessmentRunner({ assessment, questions, job, now, notify }) {
  const [index, setIndex] = useState(0)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const closeConfirm = useCallback(() => setConfirmOpen(false), [])
  // `now` can lag up to a tick behind the start time; never show more than the time limit.
  const remaining = Math.min(assessment.deadline - now, assessment.durationMinutes * 60 * 1000)
  const warned = useRef({ five: remaining <= FIVE_MINUTES, one: remaining <= ONE_MINUTE })

  useEffect(() => {
    if (remaining <= 0) {
      submitAssessment(assessment.id, 'timeout')
      notify('Time is up. Your saved answers were submitted automatically.', 'info')
    } else if (!warned.current.one && remaining <= ONE_MINUTE) {
      warned.current = { five: true, one: true }
      notify('1 minute remaining. Your answers will be submitted automatically when time runs out.', 'info')
    } else if (!warned.current.five && remaining <= FIVE_MINUTES) {
      warned.current.five = true
      notify('5 minutes remaining.', 'info')
    }
  }, [remaining, assessment.id, notify])

  const question = questions[index]
  const answers = assessment.answers
  const answeredCount = questions.filter((q) => isAnswered(q, answers[q.id])).length

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_17rem]">
      <div className="min-w-0">
        <div className="sticky top-16 z-20 -mx-4 mb-4 flex items-center justify-between gap-3 border-b border-line bg-canvas/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:static lg:mx-0 lg:mb-6 lg:rounded-2xl lg:border lg:bg-white lg:px-5">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-navy">{assessment.title}</p>
            <p className="truncate text-xs text-muted">{job.company}</p>
          </div>
          <p
            role="timer"
            aria-label={`Time remaining ${formatClock(remaining)}`}
            className={cn(
              'inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-1.5 font-mono text-lg font-bold tabular-nums',
              remaining <= ONE_MINUTE ? 'bg-red-50 text-red-600' : remaining <= FIVE_MINUTES ? 'bg-amber-50 text-amber-700' : 'bg-pale text-primary',
            )}
          >
            <Timer size={18} aria-hidden="true" />
            {formatClock(remaining)}
          </p>
        </div>

        <section aria-label={`Question ${index + 1} of ${questions.length}`} className="rounded-2xl border border-line bg-white p-5 shadow-[0_1px_2px_rgba(16,25,46,0.04)] sm:p-8">
          <div className="mb-4 flex flex-wrap items-center gap-2 text-xs">
            <span className="font-semibold text-muted">
              Question {index + 1} of {questions.length}
            </span>
            <span className="rounded-full bg-pale px-2.5 py-0.5 font-medium text-primary">{question.skill}</span>
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-body">{question.difficulty}</span>
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-body">
              {question.type === 'mcq' ? 'Multiple choice' : 'Written'} · {question.points} {question.points === 1 ? 'point' : 'points'}
            </span>
          </div>

          <QuestionBody key={question.id} question={question} value={answers[question.id]} onChange={(value) => saveAnswer(assessment.id, question.id, value)} />

          <div className="mt-8 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setIndex((i) => i - 1)}
              disabled={index === 0}
              className="inline-flex h-11 items-center gap-2 rounded-lg border border-line bg-white px-4 text-sm font-medium text-navy hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ArrowLeft size={16} aria-hidden="true" /> Previous
            </button>
            {index < questions.length - 1 ? (
              <button type="button" onClick={() => setIndex((i) => i + 1)} className="inline-flex h-11 items-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-white hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
                Next <ArrowRight size={16} aria-hidden="true" />
              </button>
            ) : (
              <button type="button" onClick={() => setConfirmOpen(true)} className="inline-flex h-11 items-center gap-2 rounded-lg bg-emerald-600 px-5 text-sm font-semibold text-white hover:bg-emerald-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
                Review &amp; submit
              </button>
            )}
          </div>
        </section>
      </div>

      <aside aria-label="Question navigator" className="h-fit rounded-2xl border border-line bg-white p-5 lg:sticky lg:top-24">
        <p className="text-sm font-semibold text-navy">Questions</p>
        <p className="mt-0.5 text-xs text-muted">
          {answeredCount} of {questions.length} answered
        </p>
        <ol className="mt-4 grid grid-cols-6 gap-2 sm:grid-cols-10 lg:grid-cols-5">
          {questions.map((q, i) => {
            const answered = isAnswered(q, answers[q.id])
            return (
              <li key={q.id}>
                <button
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-current={i === index ? 'step' : undefined}
                  aria-label={`Question ${i + 1}, ${q.type === 'mcq' ? 'multiple choice' : 'written'}, ${answered ? 'answered' : 'not answered'}`}
                  className={cn(
                    'relative flex h-10 w-full items-center justify-center rounded-lg border text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
                    answered ? 'border-primary bg-primary text-white' : 'border-line bg-white text-navy hover:bg-slate-50',
                    i === index && 'ring-2 ring-primary ring-offset-2',
                  )}
                >
                  {i + 1}
                  {q.type === 'short_answer' && (
                    <span className={cn('absolute top-0.5 right-1 text-[9px] font-bold', answered ? 'text-white/80' : 'text-primary')} aria-hidden="true">
                      W
                    </span>
                  )}
                </button>
              </li>
            )
          })}
        </ol>
        <div className="mt-4 space-y-1.5 text-xs text-muted">
          <p className="flex items-center gap-2">
            <span className="flex h-4 w-4 items-center justify-center rounded bg-primary text-white" aria-hidden="true">
              <Check size={11} />
            </span>
            Answered
          </p>
          <p className="flex items-center gap-2">
            <span className="h-4 w-4 rounded border border-line" aria-hidden="true" /> Not answered
          </p>
          <p>
            <span className="font-bold text-primary">W</span> = written answer
          </p>
        </div>
        <button type="button" onClick={() => setConfirmOpen(true)} className="mt-5 h-11 w-full rounded-lg bg-emerald-600 text-sm font-semibold text-white hover:bg-emerald-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
          Submit assessment
        </button>
      </aside>

      {confirmOpen && (
        <SubmitDialog
          unanswered={questions.length - answeredCount}
          onCancel={closeConfirm}
          onConfirm={() => {
            submitAssessment(assessment.id, 'manual')
            notify('Assessment submitted.', 'success')
          }}
        />
      )}
    </div>
  )
}
