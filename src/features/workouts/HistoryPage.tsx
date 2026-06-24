import { useNavigate } from 'react-router-dom'
import { useQuery } from '@evolu/react'
import { CalendarDays, ChevronRight, Clock } from 'lucide-react'
import { finishedWorkoutSessions, finishedSessionSets } from '@/evolu/queries'
import type { WorkoutSessionRow, FinishedSessionSetRow } from '@/evolu/rows'
import type { WorkoutSessionId } from '@/evolu/schema'
import { StatTile } from '@/shared/components/StatTile'
import { Overline } from '@/shared/components/Overline'
import { formatRelativeDay, formatMonth, monthKey } from '@/shared/utils/dates'
import { finishedDurationSec, formatDurationSec } from '@/shared/utils/workoutStats'
import { formatVolume } from '@/shared/utils/units'
import { useUnits } from '@/shared/units/UnitsContext'
import { sessionSummaries, historyTotals } from './historyStats'
import type { SessionSummary } from './sessionSummary'

/**
 * History — every finished workout, newest first and grouped by month, with an
 * all-time stats header. Answers "what have I done?" without re-querying each
 * session: one set query feeds every per-session summary and the totals.
 */
export function HistoryPage() {
  const navigate = useNavigate()
  const { unit } = useUnits()
  const sessions = useQuery(finishedWorkoutSessions) as readonly WorkoutSessionRow[]
  const sets = useQuery(finishedSessionSets) as readonly FinishedSessionSetRow[]

  const summaries = sessionSummaries(sets)
  const totals = historyTotals(sessions, sets)

  // Group sessions into month buckets, preserving the newest-first order.
  const months: { key: string; label: string; sessions: WorkoutSessionRow[] }[] = []
  for (const s of sessions) {
    if (!s.startedAt) continue
    const key = monthKey(s.startedAt)
    let bucket = months.find((m) => m.key === key)
    if (!bucket) {
      bucket = { key, label: formatMonth(s.startedAt), sessions: [] }
      months.push(bucket)
    }
    bucket.sessions.push(s)
  }

  return (
    <div className="px-5 pb-[130px] pt-[6px]">
      <h1 className="mb-[22px] font-display text-[30px] font-semibold leading-[1.08] tracking-tight text-white">
        History
      </h1>

      {sessions.length === 0 ? (
        <div className="mt-6 rounded-[22px] border-[1.5px] border-dashed border-white/[0.14] px-6 py-[42px] text-center">
          <div
            className="mx-auto mb-4 flex h-14 w-14 items-center justify-center bg-inset text-neon"
            style={{ borderRadius: '20px' }}
          >
            <CalendarDays size={26} strokeWidth={1.75} />
          </div>
          <div className="mb-[6px] font-display text-lg font-semibold text-white">
            No workouts yet
          </div>
          <div className="text-sm leading-[1.45] text-muted">
            Finish a workout and it'll show up here —
            <br />
            with everything you logged, ready to recall.
          </div>
        </div>
      ) : (
        <>
          <div className="mb-[26px] flex gap-[10px]">
            <StatTile value={totals.workouts} label="workouts" />
            <StatTile value={totals.thisMonth} label="this month" />
            <StatTile value={formatVolume(totals.volumeKg, unit)} label={`${unit} lifted`} />
          </div>

          {months.map((month) => (
            <section key={month.key} className="mb-[26px]">
              <Overline className="mb-3">{month.label}</Overline>
              <div className="flex flex-col gap-[10px]">
                {month.sessions.map((session) => (
                  <SessionRow
                    key={session.id}
                    session={session}
                    summary={summaries.get(String(session.id))}
                    onClick={() =>
                      navigate(`/history/${session.id as WorkoutSessionId}`)
                    }
                  />
                ))}
              </div>
            </section>
          ))}
        </>
      )}
    </div>
  )
}

/** One finished workout in the list: name, date, duration and quick stats. */
function SessionRow({
  session,
  summary,
  onClick,
}: {
  session: WorkoutSessionRow
  summary: SessionSummary | undefined
  onClick: () => void
}) {
  const { unit } = useUnits()
  const durationSec = finishedDurationSec(session)
  const duration = durationSec != null ? formatDurationSec(durationSec) : null
  const name = summary?.name ?? 'Workout'
  const setCount = summary?.setCount ?? 0
  const exerciseCount = summary?.exerciseCount ?? 0
  const volumeKg = summary?.volumeKg ?? 0

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-[18px] border border-white/[0.07] bg-surface px-[16px] py-[14px] text-left"
    >
      <div className="min-w-0 flex-1">
        <div className="mb-[5px] flex items-center gap-[10px]">
          <span className="truncate font-display text-[17px] font-semibold tracking-tight text-white">
            {name}
          </span>
          <span className="whitespace-nowrap text-[12.5px] font-medium text-muted">
            {session.startedAt ? formatRelativeDay(session.startedAt) : '—'}
          </span>
        </div>
        <div className="flex items-center gap-[5px] text-[12.5px] text-muted tnum">
          <span>
            {exerciseCount} {exerciseCount === 1 ? 'exercise' : 'exercises'}
          </span>
          <span className="text-faint">·</span>
          <span>
            {setCount} {setCount === 1 ? 'set' : 'sets'}
          </span>
          {volumeKg > 0 && (
            <>
              <span className="text-faint">·</span>
              <span>
                {formatVolume(volumeKg, unit)} {unit}
              </span>
            </>
          )}
          {duration && (
            <>
              <span className="text-faint">·</span>
              <span className="flex items-center gap-[3px]">
                <Clock size={12} strokeWidth={1.75} className="text-faint" />
                {duration}
              </span>
            </>
          )}
        </div>
      </div>
      <ChevronRight size={18} strokeWidth={1.75} className="flex-none text-faint" />
    </button>
  )
}
