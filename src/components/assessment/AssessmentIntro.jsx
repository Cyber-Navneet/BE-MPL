import { CalendarCheck, CircleX, ListChecks, Tags, Target, Timer } from 'lucide-react'
import { formatDateTime } from '../../utils/formatTime.js'

const SOURCE_TEXT = {
  resume: 'the skills detected in your analysed resume',
  profile: 'the skills in your profile (no analysed resume was available)',
}

export default function AssessmentIntro({ assessment, job, expired, onStart }) {
  const facts = [
    { icon: ListChecks, label: 'Questions', value: `${assessment.questionCount} (${assessment.mcqCount} multiple-choice, ${assessment.shortAnswerCount} written)` },
    { icon: Timer, label: 'Time limit', value: `${assessment.durationMinutes} minutes` },
    { icon: Target, label: 'Passing score', value: `${assessment.passingScore}%` },
    { icon: CalendarCheck, label: 'Start by', value: formatDateTime(assessment.startBy) },
  ]

  return (
    <section className="rounded-2xl border border-line bg-white p-5 shadow-[0_1px_2px_rgba(16,25,46,0.04)] sm:p-8">
      <p className="text-sm font-medium text-primary">
        {job.company} · {job.title}
      </p>
      <h1 className="mt-1 text-2xl font-bold tracking-tight text-navy sm:text-[28px]">{assessment.title}</h1>

      <dl className="mt-6 grid gap-3 sm:grid-cols-2">
        {facts.map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex items-start gap-3 rounded-xl bg-canvas p-4">
            <Icon size={20} className="mt-0.5 shrink-0 text-primary" aria-hidden="true" />
            <div>
              <dt className="text-xs text-muted">{label}</dt>
              <dd className="mt-0.5 text-[15px] font-medium text-navy">{value}</dd>
            </div>
          </div>
        ))}
      </dl>

      <div className="mt-6">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-navy">
          <Tags size={16} aria-hidden="true" /> Skills tested
        </h2>
        <ul className="mt-2 flex flex-wrap gap-2">
          {assessment.skills.map((skill) => (
            <li key={skill} className="rounded-full bg-pale px-3 py-1 text-[13px] font-medium text-primary">
              {skill}
            </li>
          ))}
        </ul>
        <p className="mt-2 text-sm text-muted">
          {assessment.general
            ? 'This job’s skills are not covered by our question bank yet, so this is a general technical assessment.'
            : `Chosen from the job’s required skills and ${SOURCE_TEXT[assessment.skillSource]}.`}
        </p>
      </div>

      <div className="mt-6 rounded-xl border border-line p-4">
        <h2 className="text-sm font-semibold text-navy">Before you start</h2>
        <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm text-body marker:text-muted">
          <li>You get one attempt. The timer starts as soon as you click Start and keeps running if you leave or refresh.</li>
          <li>Answers are saved automatically, and you can move between questions and change answers until you submit.</li>
          <li>When time runs out, your saved answers are submitted automatically.</li>
          <li>Multiple-choice questions are worth 1 point; written questions are worth 2–3 points. There is no negative marking.</li>
        </ul>
      </div>

      {expired ? (
        <p role="alert" className="mt-6 flex items-center gap-2 rounded-xl bg-slate-100 p-4 text-sm text-body">
          <CircleX size={18} className="shrink-0" aria-hidden="true" />
          The start window closed on {formatDateTime(assessment.startBy)}. This assessment can no longer be attempted.
        </p>
      ) : (
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onStart}
            className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-emerald-600 px-8 text-[15px] font-semibold text-white hover:bg-emerald-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:w-auto"
          >
            Start assessment
          </button>
        </div>
      )}
    </section>
  )
}
