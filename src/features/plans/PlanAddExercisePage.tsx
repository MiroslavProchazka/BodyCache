import { useCallback } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@evolu/react'
import { ChevronLeft, Plus } from 'lucide-react'
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
    <div className="px-5 pb-[130px] pt-[6px]">
      <header className="mb-[18px] flex items-center gap-3">
        <CircleButton onClick={() => navigate(`/plans/${planId}/edit`)} label="Back">
          <ChevronLeft size={18} strokeWidth={1.75} />
        </CircleButton>
        <h1 className="font-display text-[22px] font-semibold tracking-tight text-white">
          Add exercise
        </h1>
      </header>

      <ExercisePickerList
        exercises={exercises}
        onPick={add}
        subtitleFor={subtitleFor}
        header={
          <button
            type="button"
            onClick={() => navigate(`/library/new?plan=${planId}`)}
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
