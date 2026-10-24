import { useEffect, useState } from 'react'

const SIZE = 160
const STROKE = 12
const RADIUS = (SIZE - STROKE) / 2
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

// Green SVG ring for the AI match score. Starts empty and fills to `value` after mounting,
// and animates again whenever the score changes.
export default function MatchRing({ value }) {
  const clamped = Math.max(0, Math.min(100, value))
  const [shown, setShown] = useState(0)

  useEffect(() => {
    const frame = requestAnimationFrame(() => setShown(clamped))
    return () => cancelAnimationFrame(frame)
  }, [clamped])

  return (
    <div role="img" aria-label={`AI match score ${clamped} out of 100`} className="relative mx-auto aspect-square w-full max-w-40">
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="h-full w-full -rotate-90" aria-hidden="true">
        <circle cx={SIZE / 2} cy={SIZE / 2} r={RADIUS} fill="none" strokeWidth={STROKE} className="stroke-emerald-50" />
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE * (1 - shown / 100)}
          className="stroke-success transition-[stroke-dashoffset] duration-1000 ease-out motion-reduce:transition-none"
        />
      </svg>
      <span className="absolute inset-0 flex flex-col items-center justify-center" aria-hidden="true">
        <span className="text-[40px] leading-none font-bold tracking-tight text-success">{clamped}</span>
        <span className="mt-1 text-sm text-muted">match score</span>
      </span>
    </div>
  )
}
