import { useEffect, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@evolu/react'
import { Check, Plus } from 'lucide-react'
import { planById, planExercises } from '@/evolu/queries'
import { useBodyCacheMutations } from '@/evolu/mutations'
import type { PlanExerciseRow } from '@/evolu/rows'
import type { PlanExerciseId, PlanId } from '@/evolu/schema'
import { StickyAction } from '@/shared/components/StickyAction'
import { Overline } from '@/shared/components/Overline'
import { SupersetGroup } from '@/features/workouts/SupersetGroup'
import { groupExercises, newSupersetKey, supersetLabel } from '@/features/workouts/supersets'
import { PlanExerciseEditor } from './PlanExerciseEditor'

/** Build / edit a plan: name, notes, ordered exercises and their target sets. */
export function PlanEditorPage() {
  const { id } = useParams<{ id: string }>()
  if (!id) return <Navigate to="/plans" replace />
  return <PlanEditorInner planId={id as PlanId} />
}

function PlanEditorInner({ planId }: { planId: PlanId }) {
  const navigate = useNavigate()
  const { updatePlan, removeExerciseFromPlan, setPlanExerciseOrder, setPlanExerciseSuperset } =
    useBodyCacheMutations()
  const plan = useQuery(planById(planId))[0]
  // Ordered by `orderIndex` (the query sorts), so grouping folds live.
  const exercises = useQuery(planExercises(planId)) as PlanExerciseRow[]

  // Name/notes are edited locally and committed on blur (avoids a write per
  // keystroke). Seeded once the plan row resolves.
  const [name, setName] = useState('')
  const [notes, setNotes] = useState('')
  const [seeded, setSeeded] = useState(false)
  useEffect(() => {
    if (plan && !seeded) {
      setName(plan.name ?? '')
      setNotes((plan.notes as string | null) ?? '')
      setSeeded(true)
    }
  }, [plan, seeded])

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

  const commitName = () => {
    const trimmed = name.trim()
    if (trimmed && trimmed !== plan.name) updatePlan(planId, { name: trimmed })
    else if (!trimmed) setName(plan.name ?? '')
  }

  const commitNotes = () => {
    const trimmed = notes.trim()
    if (trimmed !== ((plan.notes as string | null) ?? '')) {
      updatePlan(planId, { notes: trimmed || null })
    }
  }

  const blocks = groupExercises(exercises)
  const indexOf = (entry: PlanExerciseRow) =>
    exercises.findIndex((e) => String(e.id) === String(entry.id))

  // Reorder by swapping the two rows' stored orderIndex values.
  const move = (entry: PlanExerciseRow, dir: -1 | 1) => {
    const i = indexOf(entry)
    const other = exercises[i + dir]
    if (!other) return
    setPlanExerciseOrder(entry.id as PlanExerciseId, other.orderIndex as number)
    setPlanExerciseOrder(other.id as PlanExerciseId, entry.orderIndex as number)
  }

  // Link a standalone exercise with the next one (see ActiveWorkoutPage).
  const linkNext = (entry: PlanExerciseRow) => {
    const next = exercises[indexOf(entry) + 1]
    if (!next) return
    const key = next.supersetGroup ?? entry.supersetGroup ?? newSupersetKey()
    setPlanExerciseSuperset(entry.id as PlanExerciseId, key)
    setPlanExerciseSuperset(next.id as PlanExerciseId, key)
  }

  const ungroup = (items: readonly PlanExerciseRow[]) =>
    items.forEach((it) => setPlanExerciseSuperset(it.id as PlanExerciseId, null))

  const handleRemove = (entry: PlanExerciseRow) => {
    if (!window.confirm(`Remove ${entry.exerciseName} from this plan?`)) return
    removeExerciseFromPlan(entry.id as PlanExerciseId)
  }

  return (
    <>
      <div className="px-5 pb-[150px] pt-[6px]">
        <h1 className="mb-4 font-display text-[22px] font-semibold tracking-tight text-white">
          Edit plan
        </h1>

        <Overline className="mb-2">Name</Overline>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={commitName}
          placeholder="e.g. Leg Day"
          className="mb-4 w-full rounded-[14px] border border-white/[0.08] bg-surface px-4 py-[13px] text-[16px] font-semibold text-white placeholder:text-faint focus:outline-none focus:ring-1 focus:ring-neon/40"
        />

        <Overline className="mb-2">Notes (optional)</Overline>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          onBlur={commitNotes}
          rows={2}
          placeholder="Focus, cues, anything to remember"
          className="mb-6 w-full resize-none rounded-[14px] border border-white/[0.08] bg-surface px-4 py-[12px] text-[14px] leading-relaxed text-soft placeholder:text-faint focus:outline-none focus:ring-1 focus:ring-neon/40"
        />

        <Overline className="mb-3">Exercises</Overline>
        {exercises.length === 0 ? (
          <p className="mb-3 rounded-[16px] border-[1.5px] border-dashed border-white/[0.14] px-5 py-7 text-center text-sm text-muted">
            No exercises yet. Add the ones you'll do in this routine.
          </p>
        ) : (
          <div className="mb-3 flex flex-col gap-3">
            {(() => {
              let supersetIndex = 0
              return blocks.map((block) => {
                const editor = (entry: PlanExerciseRow, badge: string | null, linkable: boolean) => (
                  <PlanExerciseEditor
                    key={entry.id}
                    entry={entry}
                    index={indexOf(entry)}
                    total={exercises.length}
                    onMoveUp={() => move(entry, -1)}
                    onMoveDown={() => move(entry, 1)}
                    onRemove={() => handleRemove(entry)}
                    badge={badge}
                    onLinkNext={linkable ? () => linkNext(entry) : undefined}
                  />
                )
                if (block.group === null) {
                  const entry = block.items[0]
                  const hasNext = indexOf(entry) < exercises.length - 1
                  return editor(entry, null, hasNext)
                }
                const sIdx = supersetIndex++
                return (
                  <SupersetGroup
                    key={block.items[0].id}
                    label={String.fromCharCode(65 + sIdx)}
                    onUngroup={() => ungroup(block.items)}
                  >
                    {block.items.map((entry, mi) => editor(entry, supersetLabel(sIdx, mi), false))}
                  </SupersetGroup>
                )
              })
            })()}
          </div>
        )}

        <button
          type="button"
          onClick={() => navigate(`/plans/${planId}/add-exercise`)}
          className="flex w-full items-center justify-center gap-2 rounded-[18px] border-[1.5px] border-neon/35 bg-neon/10 p-4 text-[15.5px] font-semibold text-neon"
        >
          <Plus size={20} strokeWidth={2} />
          Add exercise
        </button>
      </div>

      <StickyAction>
        <button
          type="button"
          onClick={() => navigate(`/plans/${planId}`)}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white py-[17px] text-base font-bold text-ink transition-transform active:scale-[0.99]"
        >
          <Check size={20} strokeWidth={2} />
          Done
        </button>
      </StickyAction>
    </>
  )
}
