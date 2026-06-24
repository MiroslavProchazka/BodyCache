import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@evolu/react'
import { ChevronLeft, Pencil, Play, Archive, Trash2 } from 'lucide-react'
import { planById, planExercises, planSetsForPlanExercise } from '@/evolu/queries'
import { useBodyCacheMutations } from '@/evolu/mutations'
import type { PlanExerciseRow } from '@/evolu/rows'
import type { ExerciseType, ExercisePhotoId, PlanExerciseId, PlanId } from '@/evolu/schema'
import { CircleButton } from '@/shared/components/CircleButton'
import { StickyAction } from '@/shared/components/StickyAction'
import { Overline } from '@/shared/components/Overline'
import { useToast } from '@/shared/components/Toast'
import { useUnits } from '@/shared/units/UnitsContext'
import { metaLine } from '@/shared/utils/bodyParts'
import { formatSetSummary } from '@/shared/utils/units'
import { ExerciseTile } from '@/features/exercises/ExerciseTile'
import { SetTypeTag } from '@/features/workouts/SetTypeTag'
import { useStartWorkoutFromPlan } from './useStartWorkoutFromPlan'

/** A saved plan, read-only: its exercises and target sets, with a start CTA. */
export function PlanDetailPage() {
  const { id } = useParams<{ id: string }>()
  if (!id) return <Navigate to="/plans" replace />
  return <PlanDetailInner planId={id as PlanId} />
}

function PlanDetailInner({ planId }: { planId: PlanId }) {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const startFromPlan = useStartWorkoutFromPlan()
  const { archivePlan, softDeletePlan } = useBodyCacheMutations()
  const plan = useQuery(planById(planId))[0]
  const exercises = useQuery(planExercises(planId))

  if (!plan) {
    return (
      <div className="px-5 py-16 text-center text-muted">
        <p>Plan not found.</p>
        <button type="button" onClick={() => navigate('/plans')} className="mt-3 font-semibold text-neon">
          Back to plans
        </button>
      </div>
    )
  }

  const handleStart = async () => {
    if (exercises.length === 0) {
      showToast('Add an exercise first')
      return
    }
    const sessionId = await startFromPlan(planId)
    if (sessionId) navigate('/workout')
  }

  const handleArchive = () => {
    if (!window.confirm('Archive this plan? It will be hidden from your library.')) return
    archivePlan(planId)
    navigate('/plans')
  }

  const handleDelete = () => {
    if (!window.confirm('Delete this plan? This can’t be undone.')) return
    softDeletePlan(planId)
    navigate('/plans')
  }

  return (
    <>
      <div className="px-5 pb-[150px] pt-[6px]">
        <header className="mb-[18px] flex items-center gap-3">
          <CircleButton onClick={() => navigate('/plans')} label="Back">
            <ChevronLeft size={18} strokeWidth={1.75} />
          </CircleButton>
          <h1 className="min-w-0 flex-1 truncate font-display text-[22px] font-semibold tracking-tight text-white">
            {plan.name}
          </h1>
          <CircleButton onClick={() => navigate(`/plans/${planId}/edit`)} label="Edit plan">
            <Pencil size={17} strokeWidth={1.85} />
          </CircleButton>
        </header>

        {plan.notes && (
          <p className="mb-[18px] rounded-[16px] border border-white/[0.07] bg-surface p-4 text-sm leading-relaxed text-muted">
            {plan.notes}
          </p>
        )}

        {exercises.length === 0 ? (
          <p className="py-10 text-center text-sm text-faint">
            This plan is empty. Edit it to add exercises.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {exercises.map((entry) => (
              <PlanExerciseRowView key={entry.id} entry={entry as PlanExerciseRow} />
            ))}
          </div>
        )}

        <div className="mt-7 flex gap-2">
          <button
            type="button"
            onClick={handleArchive}
            className="flex flex-1 items-center justify-center gap-[7px] rounded-[14px] border border-white/[0.08] bg-inset py-[12px] text-[13.5px] font-semibold text-soft"
          >
            <Archive size={16} strokeWidth={1.85} />
            Archive
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="flex flex-1 items-center justify-center gap-[7px] rounded-[14px] border border-white/[0.08] bg-inset py-[12px] text-[13.5px] font-semibold text-faint"
          >
            <Trash2 size={16} strokeWidth={1.85} />
            Delete
          </button>
        </div>
      </div>

      <StickyAction>
        <button
          type="button"
          onClick={handleStart}
          disabled={exercises.length === 0}
          className={[
            'flex w-full items-center justify-center gap-2 rounded-2xl py-[17px] text-base font-bold',
            exercises.length === 0
              ? 'border border-white/[0.08] bg-surface text-faint opacity-60'
              : 'bg-white text-ink',
          ].join(' ')}
        >
          <Play size={19} strokeWidth={2} fill="currentColor" stroke="none" />
          Start workout
        </button>
      </StickyAction>
    </>
  )
}

/** One exercise in the read-only plan view, with its target sets listed. */
function PlanExerciseRowView({ entry }: { entry: PlanExerciseRow }) {
  const { unit } = useUnits()
  const type = entry.exerciseType as ExerciseType
  const sets = useQuery(planSetsForPlanExercise(entry.id as PlanExerciseId))

  return (
    <div className="rounded-[20px] border border-white/[0.07] bg-surface p-4">
      <div className="mb-3 flex items-center gap-[13px]">
        <ExerciseTile
          photoId={entry.primaryPhotoId as ExercisePhotoId | null}
          bodyPart={entry.bodyPart as string | null}
          radius="14px"
          className="h-[46px] w-[46px] flex-none"
          glyphSize={23}
        />
        <div className="min-w-0 flex-1">
          <div className="truncate text-base font-semibold tracking-tight text-white">
            {entry.exerciseName}
          </div>
          <div className="mt-[2px] truncate text-[12.5px] text-muted">
            {metaLine(entry.bodyPart as string | null, entry.equipment as string | null) ||
              `${sets.length} ${sets.length === 1 ? 'set' : 'sets'}`}
          </div>
        </div>
      </div>
      {sets.length === 0 ? (
        <Overline>No target sets</Overline>
      ) : (
        <div className="flex flex-col gap-[6px]">
          {sets.map((s, i) => (
            <div key={s.id} className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2">
                <span className="font-medium text-muted">Set {i + 1}</span>
                <SetTypeTag value={s.setType} />
              </span>
              <span className="font-semibold tnum text-white">
                {formatSetSummary(
                  {
                    weightKg: s.weightKg,
                    reps: s.reps,
                    addedWeightKg: s.addedWeightKg,
                    assistanceWeightKg: null,
                    durationSec: s.durationSec,
                    distanceMeters: s.distanceMeters,
                  },
                  type,
                  unit,
                )}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
