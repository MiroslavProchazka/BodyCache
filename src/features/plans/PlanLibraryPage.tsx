import { useNavigate } from 'react-router-dom'
import { useQuery } from '@evolu/react'
import { ClipboardList, Plus } from 'lucide-react'
import { activePlans, planExercises } from '@/evolu/queries'
import { useBodyCacheMutations } from '@/evolu/mutations'
import type { PlanRow } from '@/evolu/rows'
import type { PlanId } from '@/evolu/schema'
import { IconTile } from '@/shared/components/IconTile'
import { ListRow } from '@/shared/components/ListRow'
import { Overline } from '@/shared/components/Overline'
import { ActionPill, FloatingAction } from '@/shared/components/FloatingAction'

/**
 * The plan library: the saved routines the user builds before the gym, as flat
 * rows that open to the plan. Creating a plan makes the row immediately and
 * drops into the editor (Hevy-style build flow); the primary action is a
 * floating "New plan" pill.
 */
export function PlanLibraryPage() {
  const navigate = useNavigate()
  const plans = useQuery(activePlans)
  const { createPlan } = useBodyCacheMutations()

  const handleCreate = () => {
    const created = createPlan({ name: 'New plan' })
    if (created.ok) navigate(`/plans/${created.value.id}/edit`)
  }

  return (
    <>
      <div className="px-[22px] pb-[130px] pt-[14px]">
        <h1 className="mb-5 font-display text-[24px] font-semibold tracking-[-0.02em] text-white">
          Plans
        </h1>

        {plans.length === 0 ? (
          <div className="mt-2">
            <Overline className="mb-[10px]">No plans yet</Overline>
            <p className="text-[13.5px] leading-[1.5] text-muted">
              Build a routine — Leg Day, Push, Full Body — so it’s ready before you walk in. Tap New
              plan to start.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-[18px]">
            {plans.map((plan) => (
              <PlanRowView key={plan.id} plan={plan as PlanRow} />
            ))}
          </div>
        )}
      </div>

      <FloatingAction raised>
        <ActionPill
          label="New plan"
          icon={<Plus size={19} strokeWidth={2} />}
          onClick={handleCreate}
        />
      </FloatingAction>
    </>
  )
}

/** One saved plan as a flat row: clipboard tile, name, exercise recall, chevron. */
function PlanRowView({ plan }: { plan: PlanRow }) {
  const navigate = useNavigate()
  const exercises = useQuery(planExercises(plan.id as PlanId))

  const summary =
    exercises.length === 0
      ? 'Empty — add exercises'
      : exercises
          .slice(0, 3)
          .map((e) => e.exerciseName)
          .join(' · ') + (exercises.length > 3 ? ` +${exercises.length - 3}` : '')

  return (
    <ListRow
      onClick={() => navigate(`/plans/${plan.id as PlanId}`)}
      titleClassName="text-[15px]"
      leading={
        <IconTile>
          <ClipboardList size={20} strokeWidth={1.75} />
        </IconTile>
      }
      title={plan.name}
      meta={`${exercises.length} ${exercises.length === 1 ? 'exercise' : 'exercises'} · ${summary}`}
    />
  )
}
