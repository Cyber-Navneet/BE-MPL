import { useEffect, useMemo, useState } from 'react'
import { CalendarDays, CalendarX2, ChevronLeft, ChevronRight, FilterX, ListFilter, SearchX, Video } from 'lucide-react'
import SearchInput from '../dashboard/SearchInput.jsx'
import SelectField from '../jobs/SelectField.jsx'
import OverflowMenu from './OverflowMenu.jsx'
import InterviewCard from './InterviewCard.jsx'
import InterviewDetailsDialog from './InterviewDetailsDialog.jsx'
import {
  addDays,
  formatLongDate,
  formatWeekRange,
  interviewState,
  isSameDay,
  matchesInterviewSearch,
  setInterviewStatus,
  startOfDay,
  startOfWeek,
  weekDays,
} from '../../utils/recruiterDashboardMetrics.js'
import { cn } from '../../utils/cn.js'

const shortDay = (timestamp) => new Date(timestamp).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })
const plural = (count, word) => `${count} ${word}${count === 1 ? '' : 's'}`

// Interviews for the selected day, narrowed by search and job. The selected day (and so the week)
// lives in the page because the Interviewed and Hired cards follow the same week.
export default function UpcomingInterviews({ interviews, now: openedAt, selectedDay, onSelectDay, notify }) {
  // Ticks every 30 seconds so a card switches to "In progress" (blue Meet button) when its time arrives.
  const [now, setNow] = useState(openedAt)
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 30 * 1000)
    return () => clearInterval(timer)
  }, [])
  const [query, setQuery] = useState('')
  const [jobId, setJobId] = useState('')
  const [activeId, setActiveId] = useState(null)

  const today = startOfDay(now)
  const weekStart = startOfWeek(selectedDay)
  const days = weekDays(weekStart)
  const filtering = query.trim() !== '' || jobId !== ''

  // Only jobs that have interviews, taken from the seeded job records.
  const jobOptions = useMemo(() => {
    const titles = new Map(interviews.map((item) => [item.job.id, item.job.title]))
    return [
      { value: '', label: 'All Jobs' },
      ...[...titles].sort((a, b) => a[1].localeCompare(b[1])).map(([value, label]) => ({ value, label })),
    ]
  }, [interviews])

  const matching = useMemo(
    () => interviews.filter((item) => (!jobId || item.jobId === jobId) && matchesInterviewSearch(item, query)),
    [interviews, jobId, query],
  )
  const dayList = matching.filter((item) => isSameDay(item.start, selectedDay)).sort((a, b) => a.start - b.start)
  const dayHasInterviews = interviews.some((item) => isSameDay(item.start, selectedDay))
  const nextInterview = matching
    .filter((item) => item.start >= addDays(selectedDay, 1) && interviewState(item, now) === 'Scheduled')
    .sort((a, b) => a.start - b.start)[0]
  const active = activeId ? interviews.find((item) => item.id === activeId) : null

  const clearFilters = () => {
    setQuery('')
    setJobId('')
  }

  const handleAction = (interview) => {
    const state = interviewState(interview, now)
    if (interview.type === 'Video' && interview.meetingUrl && (state === 'Scheduled' || state === 'In progress')) {
      window.open(interview.meetingUrl, '_blank', 'noopener,noreferrer')
      return
    }
    setActiveId(interview.id)
  }

  const changeStatus = (status, message) => {
    setInterviewStatus(active.id, status)
    setActiveId(null)
    notify(message, 'success')
  }

  return (
    <section aria-labelledby="upcoming-interviews-title" className="rounded-2xl border border-line bg-white p-4 shadow-[0_1px_3px_rgba(16,25,46,0.06)] sm:p-6">
      <div className="flex items-center gap-3">
        <Video size={26} className="shrink-0 text-primary" aria-hidden="true" />
        <h2 id="upcoming-interviews-title" className="flex-1 text-lg font-semibold text-heading sm:text-xl">
          Upcoming Interviews
        </h2>
        <OverflowMenu
          label="Upcoming interview options"
          items={[
            { key: 'today', label: 'Go to today', icon: CalendarDays, onSelect: () => onSelectDay(today) },
            { key: 'clear', label: 'Clear search and filter', icon: FilterX, onSelect: clearFilters },
          ]}
        />
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <SearchInput
          label="Search interviews"
          placeholder="Search interviewees, interviewers..."
          value={query}
          onChange={setQuery}
          className="min-w-0 flex-1"
        />
        <div className="relative sm:w-48">
          <ListFilter size={17} className="pointer-events-none absolute top-1/2 left-3.5 z-10 -translate-y-1/2 text-muted" aria-hidden="true" />
          <SelectField label="Filter interviews by job" value={jobId} onChange={setJobId} options={jobOptions} selectClassName="h-10 pl-10 text-sm" />
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between gap-2">
        <p className="text-sm font-medium text-body">{formatWeekRange(weekStart)}</p>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onSelectDay(addDays(selectedDay, -7))}
            aria-label="Previous week"
            className="flex h-10 w-10 items-center justify-center rounded-lg text-body hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-primary"
          >
            <ChevronLeft size={18} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => onSelectDay(addDays(selectedDay, 7))}
            aria-label="Next week"
            className="flex h-10 w-10 items-center justify-center rounded-lg text-body hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-primary"
          >
            <ChevronRight size={18} aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="mt-2 overflow-x-auto rounded-2xl bg-selected p-2">
        <div role="group" aria-label="Interview date" className="grid min-w-[16rem] grid-cols-7 gap-0.5 sm:gap-1">
          {days.map((day) => {
            const selected = isSameDay(day, selectedDay)
            const count = matching.filter((item) => isSameDay(item.start, day)).length
            const date = new Date(day)
            return (
              <button
                key={day}
                type="button"
                onClick={() => onSelectDay(day)}
                aria-pressed={selected}
                aria-label={`${formatLongDate(day)}${day === today ? ' (today)' : ''}, ${plural(count, 'interview')}`}
                className={cn(
                  'flex min-h-16 flex-col items-center justify-center rounded-xl py-2 transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary',
                  selected ? 'bg-primary text-white shadow-sm' : 'text-navy hover:bg-white/70',
                  !selected && day === today && 'ring-1 ring-primary/40 ring-inset',
                )}
              >
                <span className={cn('text-xs sm:text-sm', selected ? 'text-white' : 'text-body')}>
                  {date.toLocaleDateString('en-IN', { weekday: 'short' })}
                </span>
                <span className="mt-1 text-base font-semibold sm:text-lg">{date.getDate()}</span>
                <span className={cn('mt-1 h-1.5 w-1.5 rounded-full', count ? (selected ? 'bg-white' : 'bg-primary') : 'bg-transparent')} aria-hidden="true" />
              </button>
            )
          })}
        </div>
      </div>

      <p className="mt-4 text-sm text-secondary" aria-live="polite">
        {plural(dayList.length, 'interview')} on {shortDay(selectedDay)}
        {filtering && ' matching your filters'}
      </p>

      {dayList.length ? (
        <div className="mt-3 max-h-[35rem] space-y-3 overflow-y-auto pr-1">
          {dayList.map((interview) => (
            <InterviewCard key={interview.id} interview={interview} state={interviewState(interview, now)} onAction={handleAction} />
          ))}
        </div>
      ) : (
        <div className="mt-3 flex flex-col items-center rounded-xl border border-dashed border-line px-4 py-10 text-center">
          {dayHasInterviews && filtering ? (
            <>
              <SearchX size={28} className="text-muted" aria-hidden="true" />
              <p className="mt-3 font-medium text-navy">No interviews on this day match your search or job filter.</p>
              <button type="button" onClick={clearFilters} className="mt-3 rounded text-sm font-medium text-primary hover:underline focus-visible:outline-2 focus-visible:outline-primary">
                Clear search and filter
              </button>
            </>
          ) : (
            <>
              <CalendarX2 size={28} className="text-muted" aria-hidden="true" />
              <p className="mt-3 font-medium text-navy">No upcoming interviews scheduled for this day.</p>
            </>
          )}
        </div>
      )}

      {nextInterview && !dayList.some((item) => ['Scheduled', 'In progress'].includes(interviewState(item, now))) && (
        <button
          type="button"
          onClick={() => onSelectDay(startOfDay(nextInterview.start))}
          className="mt-3 inline-flex min-h-10 items-center gap-1 rounded text-sm font-medium text-primary hover:underline focus-visible:outline-2 focus-visible:outline-primary"
        >
          Next scheduled interview: {shortDay(nextInterview.start)} <ChevronRight size={16} aria-hidden="true" />
        </button>
      )}

      {active && (
        <InterviewDetailsDialog
          interview={active}
          state={interviewState(active, now)}
          onClose={() => setActiveId(null)}
          onComplete={() => changeStatus('Completed', `Marked the interview with ${active.candidateName} as completed.`)}
          onCancel={() => changeStatus('Cancelled', `Cancelled the interview with ${active.candidateName} (demo — no one is notified).`)}
        />
      )}
    </section>
  )
}
