import { useNavigate } from 'react-router-dom'
import { useQuery } from '@evolu/react'
import { ClipboardList, Plus, Play, ChevronRight } from 'lucide-react'
import { activePlans, planExercises } from '@/evolu/queries'
import { useBodyCacheMutations } from '@/evolu/mutations'
import type { PlanRow } from '@/evolu/rows'
import type { PlanId } from '@/evolu/schema'
import { useToast } from '@/shared/components/Toast'
import { useStartWorkoutFromPlan } from './useStartWorkoutFromPlan'

/**
 * The plan library: the saved routines the user builds before the gym. Each
 * card starts a workout in one tap or opens the plan to edit. Creating a plan
 * makes the row immediately and drops into the editor (Hevy-style build flow).
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
    <div className="px-5 pb-[130px] pt-[6px]">
      <div className="mb-5 flex items-center justify-between">
        <h1 className="font-display text-[26px] font-semibold tracking-tight text-white">Plans</h1>
        <button
          type="button"
          onClick={handleCreate}
          className="flex items-center gap-[6px] rounded-full bg-neon px-[14px] py-[9px] text-[13.5px] font-bold text-ink active:scale-[0.97]"
        >
          <Plus size={17} strokeWidth={2.2} />
          New
        </button>
      </div>

      {plans.length === 0 ? (
        <div className="mt-2 rounded-[22px] border-[1.5px] border-dashed border-white/[0.14] px-6 py-[40px] text-center">
          <div
            className="mx-auto mb-4 flex h-14 w-14 items-center justify-center bg-inset text-neon"
            style={{ borderRadius: '18px 18px 18px 5px' }}
          >
            <ClipboardList size={26} strokeWidth={1.75} />
          </div>
          <div className="mb-[6px] font-display text-lg font-semibold text-white">No plans yet</div>
          <div className="mb-5 text-sm leading-[1.45] text-muted">
            Build a routine — Leg Day, Push, Full Body — so it's ready before you walk in.
          </div>
          <button
            type="button"
            onClick={handleCreate}
            className="inline-flex items-center gap-2 rounded-2xl bg-neon px-5 py-[13px] text-[14.5px] font-bold text-ink"
          >
            <Plus size={18} strokeWidth={2.2} />
            Create a plan
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {plans.map((plan) => (
            <PlanCard key={plan.id} plan={plan as PlanRow} />
          ))}
        </div>
      )}
    </div>
  )
}

function PlanCard({ plan }: { plan: PlanRow }) {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const startFromPlan = useStartWorkoutFromPlan()
  const exercises = useQuery(planExercises(plan.id as PlanId))

  const handleStart = async () => {
    if (exercises.length === 0) {
      showToast('Add an exercise first')
      return
    }
    const sessionId = await startFromPlan(plan.id as PlanId)
    if (sessionId) navigate('/workout')
  }

  const summary =
    exercises.length === 0
      ? 'Empty — add exercises'
      : exercises
          .slice(0, 3)
          .map((e) => e.exerciseName)
          .join(' · ') + (exercises.length > 3 ? ` +${exercises.length - 3}` : '')

  return (
    <div className="overflow-hidden rounded-[20px] border border-white/[0.07] bg-surface">
      <button
        type="button"
        onClick={() => navigate(`/plans/${plan.id as PlanId}`)}
        className="flex w-full items-center gap-[13px] p-4 text-left active:bg-white/[0.02]"
      >
        <div
          className="flex h-[46px] w-[46px] flex-none items-center justify-center bg-inset text-neon"
          style={{ borderRadius: '14px 14px 14px 4px' }}
        >
          <ClipboardList size={23} strokeWidth={1.75} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-base font-semibold tracking-tight text-white">
            {plan.name}
          </div>
          <div className="mt-[2px] truncate text-[12.5px] text-muted">
            {exercises.length} {exercises.length === 1 ? 'exercise' : 'exercises'} · {summary}
          </div>
        </div>
        <ChevronRight size={18} strokeWidth={1.75} className="flex-none text-faint" />
      </button>
      <button
        type="button"
        onClick={handleStart}
        className="flex w-full items-center justify-center gap-2 border-t border-white/[0.06] bg-neon/[0.08] py-[12px] text-[14px] font-bold text-neon active:bg-neon/[0.14]"
      >
        <Play size={16} strokeWidth={2} fill="currentColor" stroke="none" />
        Start workout
      </button>
    </div>
  )
}
