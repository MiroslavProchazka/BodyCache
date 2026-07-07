import { useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@evolu/react'
import { ChevronLeft, Pencil, Play } from 'lucide-react'
import { planById, planExercises, planSetsForPlanExercise } from '@/evolu/queries'
import { useBodyCacheMutations } from '@/evolu/mutations'
import type { PlanExerciseRow } from '@/evolu/rows'
import type {
  ExerciseId,
  ExerciseType,
  ExercisePhotoId,
  PlanExerciseId,
  PlanId,
} from '@/evolu/schema'
import { CircleButton } from '@/shared/components/CircleButton'
import { ConfirmSheet } from '@/shared/components/ConfirmSheet'
import { Divider } from '@/shared/components/Divider'
import { HeroStat } from '@/shared/components/HeroStat'
import { Overline } from '@/shared/components/Overline'
import { ActionPill, FloatingAction } from '@/shared/components/FloatingAction'
import { useToast } from '@/shared/components/Toast'
import { useUnits } from '@/shared/units/UnitsContext'
import { metaLine } from '@/shared/utils/bodyParts'
import { formatSetSummary } from '@/shared/utils/units'
import { ExerciseTile } from '@/features/exercises/ExerciseTile'
import { SetTypeTag } from '@/features/workouts/SetTypeTag'
import { PlanIconTile } from './planIcon'
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
  const [confirm, setConfirm] = useState<null | 'archive' | 'delete'>(null)
  const plan = useQuery(planById(planId))[0]
  const exercises = useQuery(planExercises(planId))

  if (!plan) {
    return (
      <div className="px-[22px] py-16 text-center text-muted">
        <p>Plan not found.</p>
        <button
          type="button"
          onClick={() => navigate('/plans')}
          className="mt-3 font-semibold text-[#8b90f7]"
        >
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
    setConfirm('archive')
  }

  const handleDelete = () => {
    setConfirm('delete')
  }

  const confirmPlanAction = () => {
    if (confirm === 'archive') {
      archivePlan(planId)
      setConfirm(null)
      navigate('/plans')
      return
    }
    if (confirm === 'delete') {
      softDeletePlan(planId)
      setConfirm(null)
      navigate('/plans')
    }
  }

  return (
    <>
      <div className="px-[22px] pb-[150px] pt-[14px]">
        <header className="mb-[22px] flex items-center justify-between">
          <CircleButton onClick={() => navigate('/plans')} label="Back">
            <ChevronLeft size={18} strokeWidth={1.75} />
          </CircleButton>
          <CircleButton onClick={() => navigate(`/plans/${planId}/edit`)} label="Edit plan">
            <Pencil size={17} strokeWidth={1.85} />
          </CircleButton>
        </header>

        <div className="mb-4">
          <PlanIconTile icon={plan.icon as string | null} />
        </div>
        <Overline className="mb-[10px]">Plan</Overline>
        <h1 className="mb-4 font-display text-[26px] font-bold leading-[1.1] tracking-[-0.02em] text-white">
          {plan.name}
        </h1>
        <HeroStat
          value={exercises.length}
          unit={exercises.length === 1 ? 'exercise' : 'exercises'}
          size={44}
        />

        {plan.notes && <p className="mt-4 text-[13.5px] leading-[1.5] text-muted">{plan.notes}</p>}

        {exercises.length === 0 ? (
          <>
            <Divider className="my-6" />
            <p className="text-[13.5px] text-muted">
              This plan is empty. Edit it to add exercises.
            </p>
          </>
        ) : (
          exercises.map((entry) => (
            <PlanExerciseRowView
              key={entry.id}
              entry={entry as PlanExerciseRow}
              onOpen={() =>
                entry.exerciseId && navigate(`/library/${entry.exerciseId as ExerciseId}`)
              }
            />
          ))
        )}

        <Divider className="my-6" />
        <div className="flex gap-5">
          <button
            type="button"
            onClick={handleArchive}
            className="text-[13.5px] font-semibold text-muted active:scale-[0.99]"
          >
            Archive plan
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="text-[13.5px] font-semibold text-[#fa757e] active:scale-[0.99]"
          >
            Delete plan
          </button>
        </div>
      </div>

      <FloatingAction>
        <ActionPill
          label="Start this workout"
          icon={
            <Play
              size={18}
              strokeWidth={2}
              fill="currentColor"
              stroke="none"
              className="ml-[2px]"
            />
          }
          onClick={handleStart}
          className={exercises.length === 0 ? 'opacity-60 grayscale' : ''}
        />
      </FloatingAction>
      <ConfirmSheet
        open={confirm !== null}
        title={confirm === 'archive' ? 'Archive this plan?' : 'Delete this plan?'}
        body={
          confirm === 'archive' ? 'It will be hidden from your library.' : 'This can’t be undone.'
        }
        confirmLabel={confirm === 'archive' ? 'Archive plan' : 'Delete plan'}
        confirmVariant={confirm === 'delete' ? 'destructive' : 'primary'}
        onConfirm={confirmPlanAction}
        onClose={() => setConfirm(null)}
      />
    </>
  )
}

/** One exercise in the read-only plan view: name overline (→ detail) + target sets. */
function PlanExerciseRowView({ entry, onOpen }: { entry: PlanExerciseRow; onOpen: () => void }) {
  const { unit } = useUnits()
  const type = entry.exerciseType as ExerciseType
  const sets = useQuery(planSetsForPlanExercise(entry.id as PlanExerciseId))

  return (
    <div>
      <Divider className="my-6" />
      <button
        type="button"
        onClick={onOpen}
        className="mb-3 flex w-full items-center gap-[13px] text-left"
      >
        <ExerciseTile
          photoId={entry.primaryPhotoId as ExercisePhotoId | null}
          bodyPart={entry.bodyPart as string | null}
          radius="14px"
          className="h-[42px] w-[42px] flex-none"
          glyphSize={20}
        />
        <div className="min-w-0 flex-1">
          <div className="truncate text-[15px] font-semibold text-white">{entry.exerciseName}</div>
          <div className="mt-[2px] truncate text-[12.5px] text-muted">
            {metaLine(entry.bodyPart as string | null, entry.equipment as string | null) ||
              `${sets.length} ${sets.length === 1 ? 'set' : 'sets'}`}
          </div>
        </div>
      </button>
      {sets.length === 0 ? (
        <Overline>No target sets</Overline>
      ) : (
        <div className="flex flex-col gap-[10px]">
          {sets.map((s, i) => (
            <div key={s.id} className="flex items-center gap-[13px]">
              <span className="w-[44px] flex-none text-[11px] font-semibold uppercase tracking-[0.06em] text-faint">
                Set {i + 1}
              </span>
              <SetTypeTag value={s.setType} />
              <span className="flex-1 text-right text-[14.5px] font-semibold tnum text-white">
                {formatSetSummary(
                  {
                    weightKg: s.weightKg,
                    reps: s.reps,
                    addedWeightKg: s.addedWeightKg,
                    assistanceWeightKg: null,
                    durationSec: s.durationSec,
                    distanceMeters: s.distanceMeters,
                    elevationMeters: s.elevationMeters,
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
