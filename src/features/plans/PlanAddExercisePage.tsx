import { useCallback } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@evolu/react'
import { ChevronLeft } from 'lucide-react'
import { allExercises, planById, planExercises } from '@/evolu/queries'
import { useBodyCacheMutations } from '@/evolu/mutations'
import type { ExerciseRow } from '@/evolu/rows'
import type { ExerciseId, PlanId } from '@/evolu/schema'
import { CircleButton } from '@/shared/components/CircleButton'
import { metaLine } from '@/shared/utils/bodyParts'
import { ExercisePickerList } from '@/features/exercises/ExercisePickerList'
import { nextOrderIndex } from './planToSession'

/** Pick an exercise to add to a plan, or create a new one. */
export function PlanAddExercisePage() {
  const { id } = useParams<{ id: string }>()
  if (!id) return <Navigate to="/plans" replace />
  return <PlanAddExerciseInner planId={id as PlanId} />
}

function PlanAddExerciseInner({ planId }: { planId: PlanId }) {
  const navigate = useNavigate()
  const { addExerciseToPlan } = useBodyCacheMutations()
  const plan = useQuery(planById(planId))[0]
  const exercises = useQuery(allExercises)
  const inPlan = useQuery(planExercises(planId))

  const add = useCallback(
    (exerciseId: ExerciseId) => {
      addExerciseToPlan(planId, exerciseId, nextOrderIndex(inPlan))
      navigate(`/plans/${planId}/edit`)
    },
    [addExerciseToPlan, inPlan, navigate, planId],
  )

  const subtitleFor = useCallback(
    (exercise: ExerciseRow) => metaLine(exercise.bodyPart, exercise.equipment) || '—',
    [],
  )

  if (!plan) return <Navigate to="/plans" replace />

  return (
    <div className="px-[22px] pb-[40px] pt-[14px]">
      <header className="mb-[22px] flex items-center gap-3">
        <CircleButton onClick={() => navigate(`/plans/${planId}/edit`)} label="Back">
          <ChevronLeft size={18} strokeWidth={1.75} />
        </CircleButton>
        <div className="min-w-0 flex-1 text-center">
          <div className="truncate font-display text-[17px] font-semibold tracking-[-0.01em] text-white">
            Add exercise
          </div>
        </div>
        <button
          type="button"
          onClick={() => navigate(`/library/new?plan=${planId}`)}
          className="flex-none text-[13px] font-semibold text-[#8b90f7]"
        >
          New
        </button>
      </header>

      <ExercisePickerList exercises={exercises} onPick={add} subtitleFor={subtitleFor} />
    </div>
  )
}
