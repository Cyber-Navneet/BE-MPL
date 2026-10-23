import { Check } from 'lucide-react'
import DemoBadge from './DemoBadge.jsx'

export default function DetectedSkillsCard({ skills, isDemo }) {
  const count = skills.length

  return (
    <section
      aria-labelledby="skills-title"
      className="relative flex flex-col overflow-hidden rounded-2xl bg-[#204bd9] p-5 text-white sm:p-6"
    >
      <span
        className="pointer-events-none absolute -right-10 -bottom-10 h-40 w-40 rounded-full bg-white/10 blur-2xl"
        aria-hidden="true"
      />
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <h2 id="skills-title" className="text-[13px] font-semibold tracking-wider uppercase">
            Top detected skills
          </h2>
          {isDemo && <DemoBadge />}
        </div>
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/15">
          <Check size={17} aria-hidden="true" />
        </span>
      </div>

      <p className="mt-5 text-4xl font-bold">{count}</p>
      <p className="mt-1 text-sm text-white/80">
        {isDemo
          ? 'Skills from the demo student profile'
          : count === 1
            ? 'Skill detected in your resume'
            : 'Skills detected in your resume'}
      </p>

      <div className="my-5 border-t border-white/20" />

      {count > 0 ? (
        <ul aria-label="Detected skills" className="relative flex flex-wrap gap-2">
          {skills.map((skill) => (
            <li key={skill} className="rounded-md bg-white/15 px-3 py-1 text-[13px] font-medium">
              {skill}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-white/85">
          No skills from our dictionary were found. List your technical skills (e.g. React, SQL, Git) in a dedicated
          Skills section so parsers can pick them up.
        </p>
      )}
    </section>
  )
}
