import { CircleAlert, CircleCheck, CircleMinus, CircleX } from 'lucide-react'
import CircularProgress from '../resume/CircularProgress.jsx'
import { PassBadge } from './AssessmentBadges.jsx'
import { formatDateTime, formatDuration } from '../../utils/formatTime.js'
import { cn } from '../../utils/cn.js'

function ItemIcon({ item }) {
  if (item.needsReview) return <CircleAlert size={18} className="text-amber-600" aria-label="Needs manual review" />
  if (!item.answered) return <CircleMinus size={18} className="text-muted" aria-label="Not answered" />
  if (item.isCorrect) return <CircleCheck size={18} className="text-emerald-600" aria-label="Correct" />
  if (item.scoreAwarded > 0) return <CircleCheck size={18} className="text-amber-600" aria-label="Partially correct" />
  return <CircleX size={18} className="text-red-600" aria-label="Incorrect" />
}

function ReviewItem({ question, item, number }) {
  return (
    <li className="rounded-xl border border-line p-4 sm:p-5">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 shrink-0">
          <ItemIcon item={item} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
            <span className="font-semibold">Q{number}</span>
            <span>{question.skill}</span>
            <span>·</span>
            <span>{question.type === 'mcq' ? 'Multiple choice' : 'Written'}</span>
            <span className="ml-auto font-semibold text-navy">
              {item.scoreAwarded}/{item.maxPoints} pts
            </span>
          </div>
          <p className="mt-1.5 text-[15px] font-medium text-navy">{question.question}</p>

          <dl className="mt-3 space-y-2 text-sm">
            <div>
              <dt className="text-xs text-muted">Your answer</dt>
              <dd className={cn('mt-0.5 break-words', question.type === 'short_answer' && 'font-mono text-[13px] whitespace-pre-wrap', item.answered ? 'text-navy' : 'text-muted italic')}>
                {item.answered ? item.answer : 'Not answered'}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted">{question.type === 'mcq' ? 'Correct answer' : 'Expected answer'}</dt>
              <dd className={cn('mt-0.5 text-emerald-700', question.type === 'short_answer' && 'font-mono text-[13px]')}>
                {question.type === 'mcq' ? question.correctAnswer : question.expectedAnswer}
              </dd>
            </div>
          </dl>

          {question.type === 'short_answer' && (
            <div className="mt-3 rounded-lg bg-canvas p-3 text-sm">
              <p className="text-xs font-semibold text-navy">Evaluation criteria</p>
              <ul className="mt-1.5 space-y-1">
                {(item.criteria.length > 0 ? item.criteria : question.evaluationCriteria.map((label) => ({ label, met: false }))).map((criterion) => (
                  <li key={criterion.label} className="flex items-center gap-2 text-body">
                    {criterion.met ? (
                      <CircleCheck size={14} className="shrink-0 text-emerald-600" aria-label="Met" />
                    ) : (
                      <CircleMinus size={14} className="shrink-0 text-muted" aria-label="Not met" />
                    )}
                    {criterion.label}
                  </li>
                ))}
              </ul>
              <p className={cn('mt-2 text-[13px]', item.needsReview ? 'font-medium text-amber-700' : 'text-body')}>{item.feedback}</p>
            </div>
          )}

          <p className="mt-3 text-[13px] text-muted">{question.explanation}</p>
        </div>
      </div>
    </li>
  )
}

export default function AssessmentResults({ assessment, questions, job }) {
  const { result } = assessment
  const stats = [
    ['Correct MCQs', result.mcqCorrect],
    ['Incorrect MCQs', result.mcqIncorrect],
    ['Written evaluated', `${result.shortAnswerEvaluated}/${result.shortAnswerTotal}`],
    ['Unanswered', result.unanswered],
    ['Time taken', formatDuration(result.timeTakenSeconds)],
    ['Time limit', `${assessment.durationMinutes}m`],
  ]
  const itemsById = new Map(result.items.map((item) => [item.questionId, item]))

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-line bg-white p-5 shadow-[0_1px_2px_rgba(16,25,46,0.04)] sm:p-8">
        <p className="text-sm font-medium text-primary">
          {job.company} · {job.title}
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-navy sm:text-[28px]">{assessment.title}</h1>
        <p className="mt-1 text-sm text-muted">
          Submitted {formatDateTime(assessment.submittedAt)}
          {assessment.submitReason === 'timeout' ? ' automatically when time ran out' : ''}
        </p>

        {result.provisional && (
          <p role="note" className="mt-4 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
            <CircleAlert size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
            Provisional result: {result.needsReviewCount} written {result.needsReviewCount === 1 ? 'answer needs' : 'answers need'} manual review and currently score 0.
          </p>
        )}

        <div className="mt-6 flex flex-col items-center gap-6 sm:flex-row sm:items-center">
          <CircularProgress value={result.percentage} label={`Score ${result.percentage} percent`} />
          <div className="text-center sm:text-left">
            <PassBadge passed={result.passed} />
            <p className="mt-2 text-lg font-semibold text-navy">
              {result.pointsEarned} of {result.pointsPossible} points
            </p>
            <p className="text-sm text-muted">Passing score: {result.passingScore}%</p>
          </div>
        </div>

        <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {stats.map(([label, value]) => (
            <div key={label} className="rounded-xl bg-canvas p-3">
              <dt className="text-xs text-muted">{label}</dt>
              <dd className="mt-0.5 text-lg font-semibold text-navy">{value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="skills-heading" className="rounded-2xl border border-line bg-white p-5 shadow-[0_1px_2px_rgba(16,25,46,0.04)] sm:p-8">
        <h2 id="skills-heading" className="text-lg font-bold text-navy">
          Skill-wise performance
        </h2>
        <ul className="mt-4 space-y-4">
          {result.skills.map((skill) => (
            <li key={skill.skill}>
              <div className="flex flex-wrap items-baseline justify-between gap-2 text-sm">
                <span className="font-medium text-navy">{skill.skill}</span>
                <span className="text-muted">
                  <span className="font-semibold text-navy">{skill.percentage}%</span> · {skill.earned}/{skill.possible} pts ·{' '}
                  {skill.questions} {skill.questions === 1 ? 'question' : 'questions'}
                </span>
              </div>
              <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-slate-100" role="progressbar" aria-label={`${skill.skill} score`} aria-valuenow={skill.percentage} aria-valuemin={0} aria-valuemax={100}>
                <div className={cn('h-full rounded-full', skill.percentage >= result.passingScore ? 'bg-primary' : 'bg-amber-500')} style={{ width: `${skill.percentage}%` }} />
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="review-heading" className="rounded-2xl border border-line bg-white p-5 shadow-[0_1px_2px_rgba(16,25,46,0.04)] sm:p-8">
        <h2 id="review-heading" className="text-lg font-bold text-navy">
          Answer review
        </h2>
        <p className="mt-1 text-sm text-muted">
          Written answers are checked against a transparent rubric in your browser, not executed or graded by AI.
        </p>
        <ol className="mt-4 space-y-3">
          {questions.map((question, index) => (
            <ReviewItem key={question.id} question={question} item={itemsById.get(question.id)} number={index + 1} />
          ))}
        </ol>
      </section>
    </div>
  )
}
