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
import { PlanExerciseEditor } from './PlanExerciseEditor'

/** Build / edit a plan: name, notes, ordered exercises and their target sets. */
export function PlanEditorPage() {
  const { id } = useParams<{ id: string }>()
  if (!id) return <Navigate to="/plans" replace />
  return <PlanEditorInner planId={id as PlanId} />
}

function PlanEditorInner({ planId }: { planId: PlanId }) {
  const navigate = useNavigate()
  const { updatePlan, removeExerciseFromPlan, setPlanExerciseOrder } = useBodyCacheMutations()
  const plan = useQuery(planById(planId))[0]
  const exercises = useQuery(planExercises(planId))

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

  // Reorder by swapping the two rows' stored orderIndex values.
  const swap = (a: PlanExerciseRow, b: PlanExerciseRow) => {
    setPlanExerciseOrder(a.id as PlanExerciseId, b.orderIndex as number)
    setPlanExerciseOrder(b.id as PlanExerciseId, a.orderIndex as number)
  }

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
            {exercises.map((entry, i) => (
              <PlanExerciseEditor
                key={entry.id}
                entry={entry as PlanExerciseRow}
                index={i}
                total={exercises.length}
                onMoveUp={() => i > 0 && swap(entry as PlanExerciseRow, exercises[i - 1] as PlanExerciseRow)}
                onMoveDown={() =>
                  i < exercises.length - 1 &&
                  swap(entry as PlanExerciseRow, exercises[i + 1] as PlanExerciseRow)
                }
                onRemove={() => handleRemove(entry as PlanExerciseRow)}
              />
            ))}
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
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-neon py-[17px] text-base font-bold text-ink transition-transform active:scale-[0.99]"
        >
          <Check size={20} strokeWidth={2} />
          Done
        </button>
      </StickyAction>
    </>
  )
}
