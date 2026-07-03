import { useNavigate } from 'react-router-dom'
import { useQuery } from '@evolu/react'
import { Dumbbell } from 'lucide-react'
import { completedSetsForSession } from '@/evolu/queries'
import type { WorkoutSessionRow } from '@/evolu/rows'
import type { WorkoutSessionId } from '@/evolu/schema'
import { IconTile } from '@/shared/components/IconTile'
import { ListRow } from '@/shared/components/ListRow'
import { finishedDurationSec, formatDurationSec } from '@/shared/utils/workoutStats'
import { formatVolume } from '@/shared/utils/units'
import { useUnits } from '@/shared/units/UnitsContext'
import { summarizeSession } from './sessionSummary'

/**
 * Home recap of the most recent finished workout (mock 1b): a flat row —
 * dumbbell tile, session name, and a `·`-separated recall of duration,
 * exercise/set counts and volume. Tap → session detail. The "Last workout ·
 * <day>" overline is the section header rendered by `TodayPage`.
 */
export function LastWorkoutCard({ session }: { session: WorkoutSessionRow }) {
  const navigate = useNavigate()
  const { unit } = useUnits()
  const rows = useQuery(completedSetsForSession(session.id as WorkoutSessionId))
  const summary = summarizeSession(rows)
  const durationSec = finishedDurationSec(session)

  const meta = [
    durationSec != null ? formatDurationSec(durationSec) : null,
    `${summary.exerciseCount} ${summary.exerciseCount === 1 ? 'exercise' : 'exercises'}`,
    `${summary.setCount} ${summary.setCount === 1 ? 'set' : 'sets'}`,
    `${formatVolume(summary.volumeKg, unit)} ${unit}`,
  ]
    .filter(Boolean)
    .join(' · ')

  return (
    <ListRow
      onClick={() => navigate(`/history/${session.id as WorkoutSessionId}`)}
      leading={
        <IconTile>
          <Dumbbell size={20} strokeWidth={1.75} />
        </IconTile>
      }
      title={summary.name}
      titleClassName="font-display text-[17px] tracking-[-0.01em]"
      meta={meta}
    />
  )
}
