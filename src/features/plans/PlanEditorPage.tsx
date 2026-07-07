import { useEffect, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@evolu/react'
import { Check, Plus } from 'lucide-react'
import { planById, planExercises } from '@/evolu/queries'
import { useBodyCacheMutations } from '@/evolu/mutations'
import type { PlanExerciseRow } from '@/evolu/rows'
import type { PlanExerciseId, PlanId } from '@/evolu/schema'
import { ActionPill, FloatingAction } from '@/shared/components/FloatingAction'
import { ConfirmSheet } from '@/shared/components/ConfirmSheet'
import { Overline } from '@/shared/components/Overline'
import { SupersetGroup } from '@/features/workouts/SupersetGroup'
import { groupExercises, newSupersetKey, supersetLabel } from '@/features/workouts/supersets'
import { PlanExerciseEditor } from './PlanExerciseEditor'
import { ClipboardList } from 'lucide-react'
import { PLAN_ICON_PRESETS } from './planIcon'

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
  const [removeTarget, setRemoveTarget] = useState<PlanExerciseRow | null>(null)

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

  // Icon is a discrete choice, committed immediately (the reactive plan query
  // reflects it). `null` clears back to the clipboard fallback.
  const currentIcon = (plan.icon as string | null) ?? null
  const chooseIcon = (next: string | null) => {
    if (next === currentIcon) return
    updatePlan(planId, { icon: next })
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
    setRemoveTarget(entry)
  }

  const confirmRemove = () => {
    if (!removeTarget) return
    removeExerciseFromPlan(removeTarget.id as PlanExerciseId)
    setRemoveTarget(null)
  }

  return (
    <>
      <div className="px-[22px] pb-[150px] pt-[14px]">
        <h1 className="mb-5 font-display text-[24px] font-semibold tracking-[-0.02em] text-white">
          Edit plan
        </h1>

        <Overline className="mb-2">Name</Overline>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={commitName}
          placeholder="e.g. Leg Day"
          className="mb-4 w-full rounded-[14px] bg-inset px-4 py-[13px] text-[16px] font-semibold text-white placeholder:text-faint focus:outline-none focus:ring-2 focus:ring-neon"
        />

        <Overline className="mb-2">Notes (optional)</Overline>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          onBlur={commitNotes}
          rows={2}
          placeholder="Focus, cues, anything to remember"
          className="mb-6 w-full resize-none rounded-[14px] bg-inset px-4 py-[12px] text-[14px] leading-relaxed text-soft placeholder:text-faint focus:outline-none focus:ring-2 focus:ring-neon"
        />

        <Overline className="mb-[10px]">Icon</Overline>
        <div className="mb-6 flex flex-wrap gap-2">
          <IconChoice selected={currentIcon == null} onClick={() => chooseIcon(null)}>
            <ClipboardList size={20} strokeWidth={1.75} className="text-[#8b90f7]" />
          </IconChoice>
          {PLAN_ICON_PRESETS.map((emoji) => (
            <IconChoice
              key={emoji}
              selected={currentIcon === emoji}
              onClick={() => chooseIcon(emoji)}
            >
              <span className="text-[20px] leading-none" aria-hidden="true">
                {emoji}
              </span>
            </IconChoice>
          ))}
          <EmojiInputChoice
            selected={
              currentIcon != null && !(PLAN_ICON_PRESETS as readonly string[]).includes(currentIcon)
            }
            value={currentIcon}
            onPick={chooseIcon}
          />
        </div>

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
                const editor = (
                  entry: PlanExerciseRow,
                  badge: string | null,
                  linkable: boolean,
                ) => (
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
          className="mt-[18px] flex min-h-[44px] w-full items-center gap-[13px] text-left transition-transform active:scale-[0.99]"
        >
          <span className="flex h-[42px] w-[42px] flex-none items-center justify-center rounded-[14px] border border-dashed border-white/[0.22] text-[#8b90f7]">
            <Plus size={20} strokeWidth={2} />
          </span>
          <span className="text-[14.5px] font-semibold text-[#8b90f7]">Add exercise</span>
        </button>
      </div>

      <FloatingAction>
        <ActionPill
          label="Done"
          icon={<Check size={19} strokeWidth={2} />}
          onClick={() => navigate(`/plans/${planId}`)}
        />
      </FloatingAction>
      <ConfirmSheet
        open={removeTarget !== null}
        title={removeTarget ? `Remove ${removeTarget.exerciseName} from this plan?` : ''}
        confirmLabel="Remove"
        confirmVariant="destructive"
        onConfirm={confirmRemove}
        onClose={() => setRemoveTarget(null)}
      />
    </>
  )
}

/** A 46px icon quick-pick tile; selected gets an accent tint + neon border. */
function IconChoice({
  selected,
  onClick,
  children,
}: {
  selected: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={[
        'flex h-[46px] w-[46px] flex-none items-center justify-center rounded-[14px] transition-colors active:scale-[0.96]',
        selected
          ? 'border-[1.5px] border-neon bg-neon/[0.16]'
          : 'border border-white/[0.08] bg-surface',
      ].join(' ')}
    >
      {children}
    </button>
  )
}

/**
 * A dashed "any emoji" tile: tapping focuses a 1-char input so the native emoji
 * keyboard opens; the typed glyph becomes the plan icon.
 */
function EmojiInputChoice({
  selected,
  value,
  onPick,
}: {
  selected: boolean
  value: string | null
  onPick: (emoji: string | null) => void
}) {
  return (
    <label
      className={[
        'flex h-[46px] w-[46px] flex-none cursor-text items-center justify-center rounded-[14px] transition-colors active:scale-[0.96]',
        selected
          ? 'border-[1.5px] border-neon bg-neon/[0.16]'
          : 'border-[1.5px] border-dashed border-white/[0.22]',
      ].join(' ')}
      aria-label="Pick any emoji"
    >
      {selected && value ? (
        <span className="text-[20px] leading-none" aria-hidden="true">
          {value}
        </span>
      ) : (
        <span className="text-[18px] leading-none text-faint" aria-hidden="true">
          +
        </span>
      )}
      <input
        type="text"
        inputMode="text"
        value=""
        onChange={(e) => {
          const glyphs = Array.from(e.target.value)
          const last = glyphs[glyphs.length - 1]
          if (last) onPick(last)
        }}
        className="h-0 w-0 opacity-0"
        aria-hidden="true"
      />
    </label>
  )
}
