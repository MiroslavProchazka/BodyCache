import { useCallback } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useQuery } from '@evolu/react'
import { ChevronLeft, Plus } from 'lucide-react'
import { activeWorkoutSession, allExercises } from '@/evolu/queries'
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
  // One aggregate query for every row's "last time" line — no per-row history join.
  const performanceIndex = useLastPerformanceIndex()
  const { unit } = useUnits()

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
    <div className="px-5 pb-[130px] pt-[6px]">
      <header className="mb-[18px] flex items-center gap-3">
        <CircleButton onClick={() => navigate('/workout')} label="Back">
          <ChevronLeft size={18} strokeWidth={1.75} />
        </CircleButton>
        <h1 className="font-display text-[22px] font-semibold tracking-tight text-white">
          Add exercise
        </h1>
      </header>

      <ExercisePickerList
        exercises={exercises}
        onPick={pick}
        subtitleFor={subtitleFor}
        header={
          <button
            type="button"
            onClick={() => navigate(`/library/new?session=${active.id}`)}
            className="mb-[18px] flex w-full items-center gap-[13px] rounded-2xl border border-neon/30 bg-gradient-to-br from-neon/[0.16] to-neon/[0.05] p-[15px] text-left"
          >
            <div
              className="flex h-[42px] w-[42px] flex-none items-center justify-center bg-neon text-white"
              style={{ borderRadius: '14px' }}
            >
              <Plus size={22} strokeWidth={2} />
            </div>
            <div>
              <div className="text-[15px] font-semibold text-white">Create new exercise</div>
              <div className="mt-[2px] text-[12.5px] text-muted">Snap a photo of the machine</div>
            </div>
          </button>
        }
      />
    </div>
  )
}
