import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, CircleAlert, CircleCheck, Sparkles } from 'lucide-react'
import { MATCH_WEIGHTS, matchReasons } from '../../utils/matchScore.js'
import { cn } from '../../utils/cn.js'

const COLLAPSED_ROWS = 3

// Roughly how many points learning a missing skill would add to the match score.
function pointsFor(row, analysis) {
  if (row.kind === 'preferred') return Math.round(MATCH_WEIGHTS.preferred / analysis.preferred.length)
  const shareOfPreferred = analysis.preferred.length === 0 ? MATCH_WEIGHTS.preferred : 0
  return Math.round((MATCH_WEIGHTS.required + shareOfPreferred) / analysis.required.length)
}

function explain(row, analysis) {
  const type = row.kind === 'required' ? 'a required skill' : 'a preferred (nice-to-have) skill'
  if (row.matched) return `${row.skill} is ${type} for this job and it’s listed on your profile.`
  return `${row.skill} is ${type} for this job but isn’t on your profile yet. Adding it would raise your match by about ${pointsFor(row, analysis)} points.`
}

// Collapsed view: a couple of strengths plus the first gap, like "React ✓, TypeScript ✓, X — gap".
function collapsedRows(rows) {
  const matched = rows.filter((row) => row.matched)
  const gaps = rows.filter((row) => !row.matched)
  return gaps.length > 0 ? [...matched.slice(0, COLLAPSED_ROWS - 1), gaps[0]] : matched.slice(0, COLLAPSED_ROWS)
}

export default function MatchReasonsCard({ analysis }) {
  const [expanded, setExpanded] = useState(false)
  const [openSkill, setOpenSkill] = useState(null)
  const rows = matchReasons(analysis)
  const visible = expanded ? rows : collapsedRows(rows)
  const hiddenCount = rows.length - visible.length

  return (
    <section
      aria-labelledby="match-reasons-title"
      className="rounded-xl border border-line bg-white p-5 shadow-[0_1px_2px_rgba(16,25,46,0.04)] sm:p-6"
    >
      <h2 id="match-reasons-title" className="flex items-center gap-2.5 text-base font-semibold text-navy">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-white">
          <Sparkles size={15} aria-hidden="true" />
        </span>
        Why This Matches You
      </h2>

      {rows.length === 0 ? (
        <p className="mt-4 text-sm text-muted">This job doesn’t list specific skills.</p>
      ) : (
        <ul className="mt-4 space-y-1">
          {visible.map((row) => {
            const isOpen = openSkill === row.skill
            const Icon = row.matched ? CircleCheck : CircleAlert
            return (
              <li key={row.skill}>
                <button
                  type="button"
                  onClick={() => setOpenSkill(isOpen ? null : row.skill)}
                  aria-expanded={isOpen}
                  className="-mx-2 flex w-[calc(100%+1rem)] items-start gap-3 rounded-lg px-2 py-2 text-left hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-primary"
                >
                  <Icon
                    size={18}
                    className={cn('mt-0.5 shrink-0', row.matched ? 'text-success' : 'text-amber-500')}
                    aria-hidden="true"
                  />
                  <span className="text-sm text-body">
                    <span className="font-semibold text-navy">{row.skill}</span>
                    {row.matched ? ' — matches your profile' : ' — skill gap, consider learning'}
                  </span>
                </button>
                {isOpen && (
                  <p className="mb-2 ml-7 rounded-lg bg-slate-50 px-3 py-2 text-xs leading-relaxed text-body">
                    {explain(row, analysis)}
                    {!row.matched && (
                      <>
                        {' '}
                        <Link to="/profile" className="font-medium text-primary hover:underline">
                          Update your skills
                        </Link>
                      </>
                    )}
                  </p>
                )}
              </li>
            )
          })}
        </ul>
      )}

      {(hiddenCount > 0 || expanded) && (
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          className="mt-3 inline-flex items-center gap-1 rounded text-sm font-medium text-primary hover:underline focus-visible:outline-2 focus-visible:outline-primary"
        >
          {expanded ? 'Show less' : `Show all ${rows.length} skills`}
          <ChevronDown size={15} className={cn('transition-transform', expanded && 'rotate-180')} aria-hidden="true" />
        </button>
      )}
    </section>
  )
}
