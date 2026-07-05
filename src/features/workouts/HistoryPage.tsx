import { useNavigate } from 'react-router-dom'
import { useQuery } from '@evolu/react'
import { Dumbbell } from 'lucide-react'
import { finishedWorkoutSessions, finishedSessionSets } from '@/evolu/queries'
import type { WorkoutSessionRow, FinishedSessionSetRow } from '@/evolu/rows'
import type { WorkoutSessionId } from '@/evolu/schema'
import { Divider } from '@/shared/components/Divider'
import { HeroStat } from '@/shared/components/HeroStat'
import { IconTile } from '@/shared/components/IconTile'
import { ListRow } from '@/shared/components/ListRow'
import { Overline } from '@/shared/components/Overline'
import { MetaChip, PrChip } from '@/shared/components/Chips'
import { formatRelativeDay, formatMonth, monthKey } from '@/shared/utils/dates'
import { finishedDurationSec, formatDurationSec } from '@/shared/utils/workoutStats'
import { formatVolume } from '@/shared/utils/units'
import { useUnits } from '@/shared/units/UnitsContext'
import { sessionSummaries, historyTotals } from './historyStats'
import { prsThisMonth } from './weeklyStats'
import type { SessionSummary } from './sessionSummary'

/**
 * History — every finished workout, newest first and grouped by month on the
 * flat black canvas: a this-month volume hero, then overline-labelled month
 * sections of flat rows. One set query feeds every per-session summary and the
 * header totals — no per-session re-query.
 */
export function HistoryPage() {
  const navigate = useNavigate()
  const { unit } = useUnits()
  const sessions = useQuery(finishedWorkoutSessions) as readonly WorkoutSessionRow[]
  const sets = useQuery(finishedSessionSets) as readonly FinishedSessionSetRow[]

  const summaries = sessionSummaries(sets)
  const totals = historyTotals(sessions, sets)
  const prCount = prsThisMonth(sets)

  // Group sessions into month buckets, preserving the newest-first order.
  const currentMonth = monthKey(new Date().toISOString())
  const months: { key: string; label: string; sessions: WorkoutSessionRow[] }[] = []
  let monthVolumeKg = 0
  for (const s of sessions) {
    if (!s.startedAt) continue
    const key = monthKey(s.startedAt)
    if (key === currentMonth) monthVolumeKg += summaries.get(String(s.id))?.volumeKg ?? 0
    let bucket = months.find((m) => m.key === key)
    if (!bucket) {
      bucket = { key, label: formatMonth(s.startedAt), sessions: [] }
      months.push(bucket)
    }
    bucket.sessions.push(s)
  }

  return (
    <div className="px-[22px] pb-[130px] pt-[14px]">
      <h1 className="mb-5 font-display text-[24px] font-semibold tracking-[-0.02em] text-white">
        History
      </h1>

      {sessions.length === 0 ? (
        <div className="mt-4">
          <Overline className="mb-[10px]">No workouts yet</Overline>
          <p className="text-[13.5px] leading-[1.5] text-muted">
            Finish a workout and it’ll show up here — with everything you logged, ready to recall.
          </p>
        </div>
      ) : (
        <>
          <HeroStat
            intro="This month"
            value={formatVolume(monthVolumeKg, unit)}
            unit={unit}
            size={44}
            chips={
              <>
                <MetaChip icon={<Dumbbell size={13} strokeWidth={2} />}>
                  {totals.thisMonth} {totals.thisMonth === 1 ? 'workout' : 'workouts'}
                </MetaChip>
                {prCount > 0 && <PrChip>{`${prCount} PR${prCount === 1 ? '' : 's'}`}</PrChip>}
              </>
            }
          />

          {months.map((month) => (
            <section key={month.key}>
              <Divider className="my-6" />
              <Overline className="mb-3">{month.label}</Overline>
              <div className="flex flex-col gap-[18px]">
                {month.sessions.map((session) => (
                  <SessionRow
                    key={session.id}
                    session={session}
                    summary={summaries.get(String(session.id))}
                    onClick={() => navigate(`/history/${session.id as WorkoutSessionId}`)}
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

/** One finished workout as a flat row: dumbbell tile, name, `date · … · kg` meta. */
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
  const name = summary?.name ?? 'Workout'
  const setCount = summary?.setCount ?? 0
  const volumeKg = summary?.volumeKg ?? 0

  const meta = [
    session.startedAt ? formatRelativeDay(session.startedAt) : null,
    durationSec != null ? formatDurationSec(durationSec) : null,
    `${setCount} ${setCount === 1 ? 'set' : 'sets'}`,
    volumeKg > 0 ? `${formatVolume(volumeKg, unit)} ${unit}` : null,
  ]
    .filter(Boolean)
    .join(' · ')

  return (
    <ListRow
      onClick={onClick}
      leading={
        <IconTile tone="neutral">
          <Dumbbell size={20} strokeWidth={1.75} />
        </IconTile>
      }
      title={name}
      meta={meta}
    />
  )
}
