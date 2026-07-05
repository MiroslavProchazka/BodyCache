import { useCallback } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@evolu/react'
import { ChevronLeft } from 'lucide-react'
import { allExercises, sessionById, sessionExercises } from '@/evolu/queries'
import { useBodyCacheMutations } from '@/evolu/mutations'
import type { ExerciseRow, WorkoutSessionRow } from '@/evolu/rows'
import type { ExerciseId, WorkoutSessionId } from '@/evolu/schema'
import { CircleButton } from '@/shared/components/CircleButton'
import { metaLine } from '@/shared/utils/bodyParts'
import { ExercisePickerList } from '@/features/exercises/ExercisePickerList'

/** Pick an exercise to add to a finished workout being edited. */
export function EditSessionAddExercisePage() {
  const { id } = useParams<{ id: string }>()
  if (!id) return <Navigate to="/history" replace />
  return <EditSessionAddExerciseInner sessionId={id as WorkoutSessionId} />
}

function EditSessionAddExerciseInner({ sessionId }: { sessionId: WorkoutSessionId }) {
  const navigate = useNavigate()
  const { addExerciseToWorkout } = useBodyCacheMutations()
  const session = useQuery(sessionById(sessionId))[0] as WorkoutSessionRow | undefined
  const exercises = useQuery(allExercises)
  const inSession = useQuery(sessionExercises(sessionId))

  const backToEdit = `/history/${sessionId}/edit`

  const add = useCallback(
    (exerciseId: ExerciseId) => {
      // Append past the current max order index, not `inSession.length` — a prior
      // mid-list removal leaves indices sparse, and `sessionExercises` orders by
      // this column alone, so reusing the count could collide and shuffle order.
      const nextOrder = inSession.length
        ? Math.max(...inSession.map((e) => e.orderIndex as number)) + 1
        : 0
      addExerciseToWorkout(sessionId, exerciseId, nextOrder)
      navigate(backToEdit)
    },
    [addExerciseToWorkout, inSession, navigate, sessionId, backToEdit],
  )

  const subtitleFor = useCallback(
    (exercise: ExerciseRow) => metaLine(exercise.bodyPart, exercise.equipment) || '—',
    [],
  )

  if (!session || session.status !== 'finished') return <Navigate to="/history" replace />

  return (
    <div className="px-[22px] pb-[40px] pt-[14px]">
      <header className="mb-[22px] flex items-center gap-3">
        <CircleButton onClick={() => navigate(backToEdit)} label="Back">
          <ChevronLeft size={18} strokeWidth={1.75} />
        </CircleButton>
        <div className="min-w-0 flex-1 text-center">
          <div className="truncate font-display text-[17px] font-semibold tracking-[-0.01em] text-white">
            Add exercise
          </div>
        </div>
        <span className="w-10 flex-none" aria-hidden="true" />
      </header>

      <ExercisePickerList exercises={exercises} onPick={add} subtitleFor={subtitleFor} />
    </div>
  )
}
