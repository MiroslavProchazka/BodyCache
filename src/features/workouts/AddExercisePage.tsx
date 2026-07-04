import { useCallback, useMemo } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useQuery } from '@evolu/react'
import { ChevronLeft } from 'lucide-react'
import { activeWorkoutSession, allExercises, performedExercises } from '@/evolu/queries'
import type { ExerciseRow } from '@/evolu/rows'
import type { ExerciseId, ExerciseType } from '@/evolu/schema'
import { CircleButton } from '@/shared/components/CircleButton'
import { useUnits } from '@/shared/units/UnitsContext'
import { ExercisePickerList } from '@/features/exercises/ExercisePickerList'
import { useLastPerformanceIndex } from '@/features/exercises/useLastPerformanceIndex'
import { summaryLabel } from '@/features/exercises/lastPerformance'

/** Pick an existing exercise to log, or create a new one. Needs an active session. */
export function AddExercisePage() {
  const active = useQuery(activeWorkoutSession)[0]
  if (!active) return <Navigate to="/" replace />
  return <AddExerciseInner />
}

function AddExerciseInner() {
  const navigate = useNavigate()
  const active = useQuery(activeWorkoutSession)[0]
  const exercises = useQuery(allExercises)
  const performed = useQuery(performedExercises)
  // One aggregate query for every row's "last time" line — no per-row history join.
  const performanceIndex = useLastPerformanceIndex()
  const { unit } = useUnits()

  const favorites = useMemo(() => {
    const byId = new Map<string, ExerciseRow>(exercises.map((exercise) => [exercise.id, exercise]))
    const seen = new Set<string>()
    const result: ExerciseRow[] = []
    for (const row of performed) {
      if (seen.has(row.id)) continue
      seen.add(row.id)
      const exercise = byId.get(row.id)
      if (exercise) result.push(exercise)
    }
    return result
  }, [exercises, performed])

  const subtitleFor = useCallback(
    (exercise: ExerciseRow) =>
      summaryLabel(performanceIndex.get(exercise.id), exercise.type as ExerciseType, unit),
    [performanceIndex, unit],
  )

  const pick = useCallback(
    (exerciseId: ExerciseId) => navigate(`/workout/log/${exerciseId}`),
    [navigate],
  )

  return (
    <div className="px-[22px] pb-[130px] pt-[12px]">
      <header className="mb-6 flex items-center gap-3">
        <CircleButton onClick={() => navigate('/workout')} label="Back">
          <ChevronLeft size={18} strokeWidth={1.75} />
        </CircleButton>
        <div className="min-w-0 flex-1 text-center">
          <div className="truncate font-display text-[17px] font-semibold tracking-[-0.01em] text-white">
            Add exercise
          </div>
        </div>
        <button
          type="button"
          onClick={() => navigate(`/library/new?session=${active.id}`)}
          aria-label="Create new exercise"
          className="flex-none text-[13px] font-semibold text-[#8b90f7]"
        >
          New
        </button>
      </header>

      <ExercisePickerList
        exercises={exercises}
        favorites={favorites}
        onPick={pick}
        subtitleFor={subtitleFor}
      />
    </div>
  )
}
