import { Fragment } from 'react'
import { useQuery } from '@evolu/react'
import { ChevronUp, ChevronDown, Plus, Minus, X, Trash2 } from 'lucide-react'
import { setsForWorkoutExercise } from '@/evolu/queries'
import { useBodyCacheMutations } from '@/evolu/mutations'
import type { SessionExerciseRow } from '@/evolu/rows'
import type {
  ExerciseType,
  ExercisePhotoId,
  ExerciseSetId,
  WorkoutExerciseId,
} from '@/evolu/schema'
import { useUnits } from '@/shared/units/UnitsContext'
import { toDisplayWeight } from '@/shared/utils/units'
import { ExerciseTile } from '@/features/exercises/ExerciseTile'
import { SET_FIELDS, DEFAULT_VALUES, type SetFieldDef, type SetFieldKey } from './setFields'
import { nextSetType, setTypeLabel, narrowSetType } from './setTypes'
import { LinkNextButton, SupersetBadge } from './SupersetGroup'

/**
 * Edit one exercise within a finished session: its logged sets (stepper inputs
 * + set type), plus reorder/remove controls. The history-side twin of
 * `PlanExerciseEditor` — mutations write straight to Evolu so the session stays
 * the single source of truth (no local draft). New sets are stamped
 * `completedAt` with the session's start so they count toward the recap, stats
 * and records exactly like sets logged live. Optionally wears an A1/A2 superset
 * badge and a "Superset with next" link (standalone only).
 */
export function WorkoutExerciseEditor({
  entry,
  index,
  total,
  completedAt,
  onMoveUp,
  onMoveDown,
  onRemove,
  badge = null,
  onLinkNext,
}: {
  entry: SessionExerciseRow
  index: number
  total: number
  /** ISO timestamp stamped on newly-added sets (the session's start). */
  completedAt: string
  onMoveUp: () => void
  onMoveDown: () => void
  onRemove: () => void
  badge?: string | null
  onLinkNext?: () => void
}) {
  const { unit } = useUnits()
  const { addSet, updateSet, removeSet } = useBodyCacheMutations()
  const type = entry.exerciseType as ExerciseType
  const fields = SET_FIELDS[type]
  const sets = useQuery(setsForWorkoutExercise(entry.id as WorkoutExerciseId))

  const clamp = (value: number, f: SetFieldDef) =>
    Math.max(0, f.integer ? Math.round(value) : Math.round(value * 10) / 10)

  const step = (setId: ExerciseSetId, current: number, f: SetFieldDef, dir: 1 | -1) =>
    updateSet(setId, { [f.key]: clamp(current + dir * f.step, f) })

  const handleAddSet = () => {
    // Seed a new set from the last one's values (or type defaults), but only the
    // fields this exercise type uses — so a strength set never stores a stray
    // distance/duration value. Stamp `completedAt` so it counts as logged.
    const last = sets[sets.length - 1]
    const seeded: Partial<Record<SetFieldKey, number>> = {}
    for (const f of fields) {
      seeded[f.key] = (last?.[f.key] as number | null) ?? DEFAULT_VALUES[f.key]
    }
    addSet(entry.id as WorkoutExerciseId, { orderIndex: sets.length, completedAt, ...seeded })
  }

  return (
    <div className="rounded-[20px] border border-white/[0.07] bg-surface p-4">
      <div className="mb-[14px] flex items-center gap-[12px]">
        {badge && <SupersetBadge label={badge} />}
        <ExerciseTile
          photoId={entry.primaryPhotoId as ExercisePhotoId | null}
          bodyPart={entry.bodyPart as string | null}
          radius="14px"
          className="h-[42px] w-[42px] flex-none"
          glyphSize={21}
        />
        <div className="min-w-0 flex-1">
          <div className="truncate text-[15px] font-semibold tracking-tight text-white">
            {entry.exerciseName}
          </div>
          <div className="mt-[2px] text-[12px] text-muted">
            {sets.length} {sets.length === 1 ? 'set' : 'sets'}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <IconBtn onClick={onMoveUp} disabled={index === 0} label="Move up">
            <ChevronUp size={17} strokeWidth={2} />
          </IconBtn>
          <IconBtn onClick={onMoveDown} disabled={index === total - 1} label="Move down">
            <ChevronDown size={17} strokeWidth={2} />
          </IconBtn>
          <IconBtn onClick={onRemove} label="Remove exercise">
            <Trash2 size={16} strokeWidth={1.85} />
          </IconBtn>
        </div>
      </div>

      <div className="flex flex-col gap-[10px]">
        {sets.map((s, i) => (
          <div key={s.id} className="rounded-[16px] border border-white/[0.06] bg-inset px-3 pb-3 pt-[11px]">
            <div className="mb-[10px] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="rounded-lg bg-neon/[0.12] px-[9px] py-[3px] text-[12px] font-semibold text-neon">
                  Set {i + 1}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    updateSet(s.id as ExerciseSetId, {
                      setType: nextSetType(narrowSetType(s.setType)),
                    })
                  }
                  className="rounded-lg border border-white/10 px-[9px] py-[3px] text-[11.5px] font-semibold text-muted active:scale-[0.97]"
                >
                  {setTypeLabel(s.setType)}
                </button>
              </div>
              <button
                type="button"
                onClick={() => removeSet(s.id as ExerciseSetId)}
                aria-label={`Remove set ${i + 1}`}
                className="flex h-7 w-7 items-center justify-center rounded-full text-faint"
              >
                <X size={16} strokeWidth={1.9} />
              </button>
            </div>
            <div className="flex gap-2">
              {fields.map((f, idx) => {
                const value = (s[f.key] as number | null) ?? 0
                return (
                  <Fragment key={f.key}>
                    {idx > 0 && <div className="w-px self-stretch bg-white/[0.07]" />}
                    <div className="min-w-0 flex-1 text-center">
                      <div className="mb-[7px] text-[10px] font-semibold uppercase tracking-[0.07em] text-faint">
                        {f.isWeight ? `${f.label} (${unit})` : f.label}
                      </div>
                      <div className="flex items-center justify-between gap-1">
                        <StepButton onClick={() => step(s.id as ExerciseSetId, value, f, -1)} label={`Decrease ${f.label}`}>
                          <Minus size={17} strokeWidth={2} />
                        </StepButton>
                        <span className="font-display text-[22px] font-semibold tnum text-white">
                          {f.isWeight ? toDisplayWeight(value, unit) : value}
                        </span>
                        <StepButton onClick={() => step(s.id as ExerciseSetId, value, f, 1)} label={`Increase ${f.label}`}>
                          <Plus size={17} strokeWidth={2} />
                        </StepButton>
                      </div>
                    </div>
                  </Fragment>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={handleAddSet}
        className="mt-[10px] flex w-full items-center justify-center gap-2 rounded-[14px] border-[1.5px] border-dashed border-white/[0.16] p-[11px] text-[13.5px] font-semibold text-muted"
      >
        <Plus size={16} strokeWidth={2} />
        Add set
      </button>

      {onLinkNext && <LinkNextButton onClick={onLinkNext} />}
    </div>
  )
}

function IconBtn({
  onClick,
  disabled = false,
  label,
  children,
}: {
  onClick: () => void
  disabled?: boolean
  label: string
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-inset text-soft disabled:opacity-30"
    >
      {children}
    </button>
  )
}

function StepButton({
  onClick,
  label,
  children,
}: {
  onClick: () => void
  label: string
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex h-9 w-9 flex-none items-center justify-center rounded-full border border-white/10 bg-surface text-neon transition-transform active:scale-[0.94]"
    >
      {children}
    </button>
  )
}
