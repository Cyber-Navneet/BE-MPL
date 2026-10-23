const SIZE = 148
const STROKE = 16
const RADIUS = (SIZE - STROKE) / 2
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

// SVG ring showing `value` (0–100). The arc animates when the value changes.
export default function CircularProgress({ value, label }) {
  const clamped = Math.max(0, Math.min(100, value))

  return (
    <div role="img" aria-label={label} className="relative h-[148px] w-[148px]">
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="h-full w-full -rotate-90" aria-hidden="true">
        <circle cx={SIZE / 2} cy={SIZE / 2} r={RADIUS} fill="none" strokeWidth={STROKE} className="stroke-slate-200" />
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          strokeWidth={STROKE}
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE * (1 - clamped / 100)}
          className="stroke-primary transition-[stroke-dashoffset] duration-700 ease-out"
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
        <span className="text-[40px] leading-none font-bold tracking-tight text-navy">
          {clamped}
          <span className="text-2xl text-primary">%</span>
        </span>
      </span>
    </div>
  )
}
