import { Link } from 'react-router-dom'
import { useQuery } from '@evolu/react'
import { Plus, X } from 'lucide-react'
import { setsForWorkoutExercise, completedSetsForExercise } from '@/evolu/queries'
import { useBodyCacheMutations } from '@/evolu/mutations'
import type { SessionExerciseRow } from '@/evolu/rows'
import type { ExerciseId, ExercisePhotoId, ExerciseType, WorkoutSessionId } from '@/evolu/schema'
import { Card } from '@/shared/components/Card'
import { formatRelativeDay } from '@/shared/utils/dates'
import { formatSetSummary } from '@/shared/utils/units'
import {
  previousSession,
  bestSet,
  isPersonalRecord,
  type HistorySet,
} from '@/shared/utils/exerciseStats'
import { PhotoThumb } from '@/features/exercises/PhotoThumb'
import { SetRow } from './SetRow'
import { PREFILL_KEYS, type SetFieldKey } from './setFields'

interface WorkoutExerciseCardProps {
  workoutExercise: SessionExerciseRow
  currentSessionId: WorkoutSessionId
}

/**
 * One exercise inside the active workout: its photo/name, a "last time"
 * reference and stored best, the list of set rows, and an add-set control.
 * History feeds the previous-set ghost values and the per-set PR badge.
 */
export function WorkoutExerciseCard({
  workoutExercise: we,
  currentSessionId,
}: WorkoutExerciseCardProps) {
  const { addSet, removeExerciseFromWorkout } = useBodyCacheMutations()
  const type = we.exerciseType as ExerciseType

  const sets = useQuery(setsForWorkoutExercise(we.id))
  const historyRows = useQuery(completedSetsForExercise(we.exerciseId as ExerciseId))

  // The join columns are typed nullable by Evolu though the inner joins
  // guarantee them at runtime; normalize to clean `HistorySet`s.
  const history: HistorySet[] = historyRows.flatMap((r) =>
    r.sessionId && r.sessionStartedAt
      ? [
          {
            id: r.id,
            orderIndex: r.orderIndex ?? 0,
            weightKg: r.weightKg,
            reps: r.reps,
            addedWeightKg: r.addedWeightKg,
            assistanceWeightKg: r.assistanceWeightKg,
            durationSec: r.durationSec,
            distanceMeters: r.distanceMeters,
            sessionId: r.sessionId,
            sessionStartedAt: r.sessionStartedAt,
          },
        ]
      : [],
  )

  const previous = previousSession(history, currentSessionId)
  const best = bestSet(history, type)

  const handleAddSet = () => {
    // Pre-fill from the last set logged here, else the previous workout's first set.
    const source = sets.length > 0 ? sets[sets.length - 1] : (previous?.sets[0] ?? null)
    const prefill: Partial<Record<SetFieldKey, number | null>> = {}
    if (source) {
      for (const key of PREFILL_KEYS) prefill[key] = (source[key] as number | null) ?? null
    }
    // Next index past the current max so deleting a middle set can't collide.
    const orderIndex = sets.reduce((m, s) => Math.max(m, (s.orderIndex ?? 0) + 1), 0)
    addSet(we.id, { orderIndex, ...prefill })
  }

  const handleRemove = () => {
    if (!window.confirm(`Remove ${we.exerciseName} from this workout?`)) return
    removeExerciseFromWorkout(we.id)
  }

  return (
    <Card className="flex flex-col gap-2 p-3">
      <div className="flex items-center gap-3">
        <Link to={`/library/${we.exerciseId as ExerciseId}`} className="shrink-0">
          <PhotoThumb
            photoId={we.primaryPhotoId as ExercisePhotoId | null}
            className="h-11 w-11 rounded-lg"
            alt={String(we.exerciseName)}
          />
        </Link>
        <div className="min-w-0 flex-1">
          <Link
            to={`/library/${we.exerciseId as ExerciseId}`}
            className="block truncate text-base font-semibold text-gray-100"
          >
            {we.exerciseName}
          </Link>
          <div className="truncate text-xs text-gray-500">
            {previous
              ? `Last ${formatRelativeDay(previous.startedAt)}: ${previous.sets
                  .map((s) => formatSetSummary(s, type))
                  .join(', ')}`
              : 'First time logging this'}
          </div>
        </div>
        <button
          type="button"
          onClick={handleRemove}
          aria-label="Remove exercise"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-500 active:bg-gray-800"
        >
          <X size={18} />
        </button>
      </div>

      {best && (
        <div className="text-xs text-gray-500">
          Best: <span className="text-gray-300">{formatSetSummary(best, type)}</span>
        </div>
      )}

      {sets.length > 0 && (
        <div className="flex flex-col gap-1">
          {sets.map((set, i) => (
            <SetRow
              key={set.id}
              set={set}
              index={i}
              type={type}
              ghost={previous?.sets[i] ?? null}
              isPR={
                set.completedAt != null &&
                isPersonalRecord(set, history.filter((h) => h.id !== set.id), type)
              }
            />
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={handleAddSet}
        className="mt-1 flex items-center justify-center gap-1.5 rounded-lg border border-dashed border-gray-700 py-2 text-sm font-medium text-gray-400 active:bg-gray-800"
      >
        <Plus size={16} /> Add set
      </button>
    </Card>
  )
}
