import { useState } from 'react'
import { formatCount, niceScale } from '../../utils/recruiterDashboardMetrics.js'
import { cn } from '../../utils/cn.js'

// Bar chart of one funnel metric over the months in `months` (from chartMonths). The selected month is the
// darker bar; hovering or focusing a bar shows its value and clicking it selects that month.
export default function ProgressChart({ months, metricLabel, metricKey, selectedKey, onSelectMonth }) {
  const [hoveredKey, setHoveredKey] = useState(null)
  const values = months.map((item) => item.data?.[metricKey] ?? 0)
  const { top, ticks } = niceScale(Math.max(...values))
  const empty = values.every((value) => value === 0)

  return (
    <div className="mt-6 rounded-2xl bg-selected px-3 pt-6 pb-4 sm:px-6">
      <div className="flex">
        <div className="relative h-56 w-10 shrink-0 text-xs text-secondary sm:w-12" aria-hidden="true">
          {ticks.map((tick) => (
            <span key={tick} className="absolute left-0" style={{ bottom: `${(tick / top) * 100}%`, transform: 'translateY(50%)' }}>
              {formatCount(tick)}
            </span>
          ))}
        </div>

        <div className="min-w-0 flex-1">
          <div className="relative h-56">
            {ticks.map((tick) => (
              <span key={tick} className="absolute inset-x-0 border-t border-primary/10" style={{ bottom: `${(tick / top) * 100}%` }} aria-hidden="true" />
            ))}

            {empty && (
              <p className="absolute inset-0 flex items-center justify-center px-4 text-center text-sm font-medium text-body">
                No recruitment activity recorded for this period.
              </p>
            )}

            <div className="absolute inset-0 flex items-end justify-around gap-1">
              {months.map((item, index) => {
                const value = values[index]
                const height = (value / top) * 100
                const selected = item.key === selectedKey
                const showTip = hoveredKey === item.key
                const label = `${item.label} ${item.year}: ${item.data ? `${value.toLocaleString('en-IN')} ${metricLabel.toLowerCase()}` : 'no records'}${item.data?.partial ? ' (month to date)' : ''}`
                return (
                  <div key={item.key} className="relative flex h-full w-full max-w-16 flex-col items-center justify-end">
                    {showTip && (
                      <div
                        role="tooltip"
                        className={cn(
                          'pointer-events-none absolute z-10 rounded-lg bg-navy px-2.5 py-1.5 text-xs whitespace-nowrap text-white shadow-lg',
                          index === 0 ? 'left-0' : index === months.length - 1 ? 'right-0' : 'left-1/2 -translate-x-1/2',
                        )}
                        style={{ bottom: `calc(${height}% + 8px)` }}
                      >
                        <span className="block font-semibold">
                          {item.label} {item.year}
                          {item.data?.partial && ' · to date'}
                        </span>
                        {item.data ? `${metricLabel}: ${value.toLocaleString('en-IN')}` : 'No records'}
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => onSelectMonth(item.year, item.month)}
                      onMouseEnter={() => setHoveredKey(item.key)}
                      onMouseLeave={() => setHoveredKey(null)}
                      onFocus={() => setHoveredKey(item.key)}
                      onBlur={() => setHoveredKey(null)}
                      aria-label={label}
                      aria-pressed={selected}
                      className={cn(
                        'w-7 rounded-t-md transition-[height,background-color] duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:w-10',
                        selected ? 'bg-primary' : 'bg-primary/60 hover:bg-primary/75',
                      )}
                      style={{ height: `${height}%`, minHeight: value > 0 ? 4 : 2 }}
                    />
                  </div>
                )
              })}
            </div>
          </div>

          <div className="mt-2 flex justify-around gap-1" aria-hidden="true">
            {months.map((item) => (
              <span
                key={item.key}
                className={cn('w-full max-w-16 text-center text-sm sm:text-base', item.key === selectedKey ? 'font-semibold text-primary' : 'text-body')}
              >
                {item.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
