import { useMemo, useState } from 'react'
import { CalendarDays, ChartColumn, Download } from 'lucide-react'
import SelectField from '../jobs/SelectField.jsx'
import OverflowMenu from './OverflowMenu.jsx'
import ProgressChart from './ProgressChart.jsx'
import { ANALYTICS_YEARS, FUNNEL_STAGES, MONTHS } from '../../data/recruiterDashboardData.js'
import { analyticsCsv, chartMonths, formatCount, monthlyAnalytics } from '../../utils/recruiterDashboardMetrics.js'
import { cn } from '../../utils/cn.js'

const MONTH_OPTIONS = MONTHS.map((label, index) => ({ value: String(index), label }))

function downloadCsv(filename, text) {
  const url = URL.createObjectURL(new Blob([text], { type: 'text/csv;charset=utf-8' }))
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  setTimeout(() => URL.revokeObjectURL(url), 0)
}

// Funnel figures for the selected month (activity during that month, not cumulative totals) and a
// five-month bar chart of the chosen stage.
export default function RecruitmentProgress({ now, notify }) {
  const today = new Date(now)
  const [period, setPeriod] = useState({ year: today.getFullYear(), month: today.getMonth() })
  const [metricKey, setMetricKey] = useState('assessments')

  const years = [...new Set([...ANALYTICS_YEARS, today.getFullYear()])].sort()
  const data = monthlyAnalytics(period.year, period.month, now)
  const months = useMemo(() => chartMonths(period.year, period.month, 5, now), [period, now])
  const metric = FUNNEL_STAGES.find((stage) => stage.key === metricKey)
  const periodLabel = `${MONTHS[period.month]} ${period.year}`

  const exportYear = () => {
    downloadCsv(`talentforge-recruitment-${period.year}.csv`, analyticsCsv(period.year, now))
    notify(`Downloaded recruitment progress for ${period.year}.`, 'success')
  }

  return (
    <section aria-labelledby="recruitment-progress-title" className="rounded-2xl border border-line bg-white p-4 shadow-[0_1px_3px_rgba(16,25,46,0.06)] sm:p-6">
      <div className="flex flex-wrap items-center gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-selected text-primary">
          <ChartColumn size={22} strokeWidth={2.5} aria-hidden="true" />
        </span>
        <h2 id="recruitment-progress-title" className="flex-auto text-lg font-semibold whitespace-nowrap text-heading sm:text-xl">
          Recruitment Progress
        </h2>
        <div className="flex w-full items-center gap-2 sm:ml-auto sm:w-auto">
          <SelectField
            label="Month"
            value={String(period.month)}
            onChange={(value) => setPeriod((prev) => ({ ...prev, month: Number(value) }))}
            options={MONTH_OPTIONS}
            className="min-w-0 flex-1 sm:w-40 sm:flex-none"
            selectClassName="h-10 text-sm"
          />
          <SelectField
            label="Year"
            value={String(period.year)}
            onChange={(value) => setPeriod((prev) => ({ ...prev, year: Number(value) }))}
            options={years.map((year) => ({ value: String(year), label: String(year) }))}
            className="w-28 shrink-0"
            selectClassName="h-10 text-sm"
          />
          <OverflowMenu
            label="Recruitment progress options"
            items={[
              {
                key: 'current',
                label: 'Go to current month',
                icon: CalendarDays,
                onSelect: () => setPeriod({ year: today.getFullYear(), month: today.getMonth() }),
              },
              { key: 'export', label: `Download ${period.year} as CSV`, icon: Download, onSelect: exportYear },
            ]}
          />
        </div>
      </div>

      <p className="mt-4 text-sm text-secondary" aria-live="polite">
        {data
          ? `Activity during ${periodLabel}${data.partial ? ' (month to date)' : ''}. Each figure counts events in that month, not running totals.`
          : `No recruitment records for ${periodLabel}.`}
      </p>

      <div role="group" aria-label="Chart metric" className="mt-4 grid grid-cols-3 gap-x-2 gap-y-3 sm:grid-cols-5">
        {FUNNEL_STAGES.map((stage) => {
          const selected = stage.key === metricKey
          return (
            <button
              key={stage.key}
              type="button"
              onClick={() => setMetricKey(stage.key)}
              aria-pressed={selected}
              title={`${stage.description} in ${periodLabel}`}
              className={cn(
                'rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-primary',
                selected && 'bg-pale',
              )}
            >
              <span className={cn('block text-sm', selected ? 'text-primary' : 'text-secondary')}>{stage.label}</span>
              <span className={cn('mt-1 block text-xl font-bold sm:text-2xl', selected ? 'text-primary' : 'text-heading')}>
                {formatCount(data?.[stage.key] ?? 0)}
              </span>
            </button>
          )
        })}
      </div>

      <ProgressChart
        months={months}
        metricKey={metricKey}
        metricLabel={metric.label}
        selectedKey={`${period.year}-${period.month}`}
        onSelectMonth={(year, month) => setPeriod({ year, month })}
      />
      <p className="mt-3 text-xs text-muted">
        Showing {metric.label.toLowerCase()} for the five months up to {periodLabel}. Select a stage above to change the chart.
      </p>
    </section>
  )
}
