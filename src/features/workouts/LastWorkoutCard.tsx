import { useQuery } from '@evolu/react'
import { Clock } from 'lucide-react'
import { completedSetsForSession } from '@/evolu/queries'
import type { WorkoutSessionRow } from '@/evolu/rows'
import type { WorkoutSessionId } from '@/evolu/schema'
import { Overline } from '@/shared/components/Overline'
import { StatTile } from '@/shared/components/StatTile'
import { formatRelativeDay } from '@/shared/utils/dates'
import { formatElapsed } from '@/shared/utils/workoutStats'
import { formatVolume } from '@/shared/utils/units'
import { useUnits } from '@/shared/units/UnitsContext'
import { summarizeSession } from './sessionSummary'

/** Home recap of the most recent finished workout: name + three stat tiles. */
export function LastWorkoutCard({ session }: { session: WorkoutSessionRow }) {
  const { unit } = useUnits()
  const rows = useQuery(completedSetsForSession(session.id as WorkoutSessionId))
  const summary = summarizeSession(rows)
  const duration =
    session.startedAt && session.finishedAt
      ? formatElapsed(session.startedAt, session.finishedAt)
      : '—'

  return (
    <div className="rounded-[22px] border border-white/[0.07] bg-surface p-[18px]">
      <div className="mb-[14px] flex items-center justify-between">
        <Overline className="whitespace-nowrap">
          Last workout · {session.startedAt ? formatRelativeDay(session.startedAt) : '—'}
        </Overline>
        <div className="flex items-center gap-[5px] text-[12.5px] font-medium text-muted">
          <Clock size={14} strokeWidth={1.75} className="text-faint" />
          {duration}
        </div>
      </div>
      <div className="mb-4 font-display text-[21px] font-semibold tracking-tight text-white">
        {summary.name}
      </div>
      <div className="flex gap-[10px]">
        <StatTile value={summary.exerciseCount} label="exercises" />
        <StatTile value={summary.setCount} label="sets" />
        <StatTile value={formatVolume(summary.volumeKg, unit)} label={`${unit} lifted`} />
      </div>
    </div>
  )
}
