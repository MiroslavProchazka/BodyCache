import { useCallback, useEffect, useMemo, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useQuery } from '@evolu/react'
import { ChevronLeft, Dumbbell } from 'lucide-react'
import { activeWorkoutSession, allExercises, performedExercises } from '@/evolu/queries'
import type { ExerciseRow, WorkoutSessionRow } from '@/evolu/rows'
import type { ExerciseId, ExerciseType } from '@/evolu/schema'
import { CircleButton } from '@/shared/components/CircleButton'
import { useUnits } from '@/shared/units/UnitsContext'
import { activeElapsedSec, formatDurationSec } from '@/shared/utils/workoutStats'
import { ExercisePickerList } from '@/features/exercises/ExercisePickerList'
import { useLastPerformanceIndex } from '@/features/exercises/useLastPerformanceIndex'
import { summaryLabel } from '@/features/exercises/lastPerformance'

/**
 * In-workout exercise picker (TWEAK T3): the full library browsing experience
 * (search, chips, grid/list, Favorites) in selection mode. A trailing plus logs
 * the pick immediately; tapping a card body opens the exercise detail in
 * selection mode. A live session chip keeps the workout context. Needs an
 * active session.
 */
export function AddExercisePage() {
  const active = useQuery(activeWorkoutSession)[0]
  if (!active) return <Navigate to="/" replace />
  return <AddExerciseInner session={active as WorkoutSessionRow} />
}

function AddExerciseInner({ session }: { session: WorkoutSessionRow }) {
  const navigate = useNavigate()
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

  // Plus → log the pick immediately (existing behavior). Body → open detail in
  // selection mode. Both keep the active session alive (Evolu row untouched).
  const pick = useCallback(
    (exerciseId: ExerciseId) => navigate(`/workout/log/${exerciseId}`),
    [navigate],
  )
  const open = useCallback(
    (exerciseId: ExerciseId) => navigate(`/workout/add/${exerciseId}`),
    [navigate],
  )

  return (
    <div className="px-[22px] pb-[40px] pt-[14px]">
      <header className="mb-[14px] flex items-center gap-3">
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
          onClick={() => navigate(`/library/new?session=${session.id}`)}
          className="flex-none text-[13px] font-semibold text-[#8b90f7]"
        >
          New
        </button>
      </header>

      <div className="mb-[14px] flex justify-center">
        <SessionChip session={session} />
      </div>

      <ExercisePickerList
        exercises={exercises}
        favorites={favorites}
        onPick={pick}
        onOpen={open}
        subtitleFor={subtitleFor}
      />
    </div>
  )
}

/** Accent chip with the live elapsed time, so the workout context stays visible. */
export function SessionChip({ session }: { session: WorkoutSessionRow }) {
  const [now, setNow] = useState(() => new Date().toISOString())
  useEffect(() => {
    const t = setInterval(() => setNow(new Date().toISOString()), 1000)
    return () => clearInterval(t)
  }, [])
  return (
    <span className="inline-flex items-center gap-[6px] whitespace-nowrap rounded-full bg-neon/[0.16] px-[12px] py-[6px] text-[12px] font-bold text-[#8b90f7]">
      <Dumbbell size={13} strokeWidth={2} />
      Adding to workout · <span className="tnum">{formatDurationSec(activeElapsedSec(session, now))}</span>
    </span>
  )
}
