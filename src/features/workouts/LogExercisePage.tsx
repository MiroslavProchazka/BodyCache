import { useEffect, useRef, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@evolu/react'
import { ChevronLeft, Copy, Plus, Minus, X, Check, Timer } from 'lucide-react'
import {
  activeWorkoutSession,
  exerciseById,
  sessionExercises,
  setsForWorkoutExercise,
  completedSetsForExercise,
} from '@/evolu/queries'
import { useBodyCacheMutations } from '@/evolu/mutations'
import type {
  ExerciseId,
  ExerciseType,
  SetType,
  WorkoutExerciseId,
  WorkoutSessionId,
} from '@/evolu/schema'
import { CircleButton } from '@/shared/components/CircleButton'
import { Button } from '@/shared/components/Button'
import { Divider } from '@/shared/components/Divider'
import { Overline } from '@/shared/components/Overline'
import { useToast } from '@/shared/components/Toast'
import { useUnits } from '@/shared/units/UnitsContext'
import { useRestTimer } from '@/shared/rest/RestTimerContext'
import { formatRelativeDay } from '@/shared/utils/dates'
import {
  toDisplayWeight,
  fromDisplayWeight,
  formatSetSummary,
  type Unit,
} from '@/shared/utils/units'
import {
  previousSession,
  sessionTrend,
  bestSet,
  isPersonalRecord,
  workingSets,
  type MetricSet,
} from '@/shared/utils/exerciseStats'
import { TrendBadge } from '@/features/exercises/TrendBadge'
import { PrBadge } from '@/features/exercises/PrBadge'
import { toHistorySets } from '@/features/exercises/history'
import { nextOrderIndex } from '@/features/plans/planToSession'
import { SET_FIELDS, DEFAULT_VALUES, type SetFieldDef, type SetFieldKey } from './setFields'
import { SetTypeTag } from './SetTypeTag'
import { narrowSetType, nextSetType, setTypeLabel } from './setTypes'
import { RPE_VALUES, clampRpe, formatRpe } from './rpe'

/** A set being edited: the active values for its type's fields, in kg/native units. */
type DraftSet = Partial<Record<SetFieldKey, number>>

/** A draft set row: its metric values, an optional set type and optional RPE. */
interface DraftRow {
  fields: DraftSet
  setType: SetType | null
  rpe: number | null
}

/** A draft as a `MetricSet` for PR comparison; metrics it doesn't carry are null. */
const metricOf = (d: DraftSet): MetricSet => ({
  weightKg: d.weightKg ?? null,
  reps: d.reps ?? null,
  addedWeightKg: d.addedWeightKg ?? null,
  assistanceWeightKg: null,
  durationSec: d.durationSec ?? null,
  distanceMeters: d.distanceMeters ?? null,
  elevationMeters: d.elevationMeters ?? null,
})

/** Clamp a canonical field value: ≥0, whole numbers for integer fields, else 0.1. */
const clampFieldValue = (value: number, f: SetFieldDef): number =>
  Math.max(0, f.integer ? Math.round(value) : Math.round(value * 10) / 10)

export function LogExercisePage() {
  const active = useQuery(activeWorkoutSession)[0]
  const { exerciseId } = useParams<{ exerciseId: string }>()
  if (!active) return <Navigate to="/" replace />
  if (!exerciseId) return <Navigate to="/workout" replace />
  return <LogInner sessionId={active.id} exerciseId={exerciseId as ExerciseId} />
}

function LogInner({
  sessionId,
  exerciseId,
}: {
  sessionId: WorkoutSessionId
  exerciseId: ExerciseId
}) {
  const navigate = useNavigate()
  const { unit } = useUnits()
  const { showToast } = useToast()
  const rest = useRestTimer()
  const { addExerciseToWorkout, addSet, removeSet } = useBodyCacheMutations()

  const exercise = useQuery(exerciseById(exerciseId))[0]
  const entries = useQuery(sessionExercises(sessionId))
  const existing = entries.find((e) => String(e.exerciseId) === String(exerciseId))
  const existingSets = useQuery(
    setsForWorkoutExercise((existing?.id ?? '') as WorkoutExerciseId),
  )
  const history = toHistorySets(useQuery(completedSetsForExercise(exerciseId)))

  const type = (exercise?.type as ExerciseType) ?? 'strength'
  const fields = SET_FIELDS[type]
  const prev = previousSession(history, sessionId)
  const trend = sessionTrend(history, type, sessionId)
  // The "stored best" to beat: every working (non-warm-up) completed set from
  // prior sessions. We exclude the in-progress session so today's own sets
  // never count as the record a set has to beat, and warm-ups never count.
  const priorSets = workingSets(
    history.filter((s) => String(s.sessionId) !== String(sessionId)),
  )

  /** Read the type's fields off a source row, falling back to defaults. */
  const fieldsOf = (source: Partial<Record<SetFieldKey, number | null>> | null): DraftSet => {
    const d: DraftSet = {}
    for (const f of fields) d[f.key] = source?.[f.key] ?? DEFAULT_VALUES[f.key]
    return d
  }

  // Seed once: existing sets (editing) → previous top working set → defaults.
  // RPE is a felt value, not a target, so it's only seeded when editing real
  // logged sets — never pre-filled from history the way metrics are.
  const [draft, setDraft] = useState<DraftRow[]>(() => {
    if (existing && existingSets.length > 0)
      return existingSets.map((s) => ({
        fields: fieldsOf(s),
        setType: narrowSetType(s.setType),
        rpe: clampRpe(s.rpe),
      }))
    const top = prev ? bestSet(workingSets(prev.sets), type) : null
    return [{ fields: fieldsOf(top), setType: null, rpe: null }]
  })

  // Which row's RPE picker is expanded (only one open at a time), or null.
  const [rpePickerRow, setRpePickerRow] = useState<number | null>(null)

  const step = (index: number, f: SetFieldDef, dir: 1 | -1) =>
    setDraft((ds) =>
      ds.map((row, j) =>
        j === index
          ? {
              ...row,
              fields: {
                ...row.fields,
                [f.key]: clampFieldValue((row.fields[f.key] ?? 0) + dir * f.step, f),
              },
            }
          : row,
      ),
    )

  /** Commit a typed value (already parsed to canonical units) for a field. */
  const setValue = (index: number, f: SetFieldDef, value: number) =>
    setDraft((ds) =>
      ds.map((row, j) =>
        j === index ? { ...row, fields: { ...row.fields, [f.key]: value } } : row,
      ),
    )

  /** Cycle a row's set type: Normal → Warm-up → Drop → Failure → Normal. */
  const cycleType = (index: number) =>
    setDraft((ds) =>
      ds.map((row, j) => (j === index ? { ...row, setType: nextSetType(row.setType) } : row)),
    )

  /** Set a row's RPE, or clear it when the current value is tapped again. */
  const setRpe = (index: number, value: number) => {
    setDraft((ds) =>
      ds.map((row, j) =>
        j === index ? { ...row, rpe: row.rpe === value ? null : value } : row,
      ),
    )
    setRpePickerRow(null)
  }

  // New sets clone the last row's values but start as a normal working set with
  // no RPE (perceived exertion is logged fresh per set, not carried forward).
  const addDraftSet = () =>
    setDraft((ds) => [
      ...ds,
      { fields: { ...(ds[ds.length - 1]?.fields ?? fieldsOf(null)) }, setType: null, rpe: null },
    ])

  const removeDraftSet = (index: number) =>
    setDraft((ds) => ds.filter((_, j) => j !== index))

  const copyPrevious = () => {
    if (!prev || prev.sets.length === 0) return
    setDraft(
      prev.sets.map((s) => ({
        fields: fieldsOf(s),
        setType: narrowSetType(s.setType),
        rpe: clampRpe(s.rpe),
      })),
    )
    showToast('Copied last workout')
  }

  // A draft counts when its rep count (or, for repless types, its primary
  // metric) is positive — mirrors the prototype's "reps > 0" rule.
  const repsField = fields.find((f) => f.key === 'reps')
  const isValid = (d: DraftSet) =>
    repsField ? (d.reps ?? 0) > 0 : (d[fields[0].key] ?? 0) > 0
  const validCount = draft.filter((row) => isValid(row.fields)).length

  const handleSave = () => {
    const valid = draft.filter((row) => isValid(row.fields))
    if (valid.length === 0) {
      navigate('/workout')
      return
    }
    let workoutExerciseId = existing?.id
    if (!workoutExerciseId) {
      // Append one past the current max index — not `entries.length`, which
      // collides with an existing index whenever the list has gaps (a plan
      // whose exercises aren't contiguously indexed, or after a removal). A
      // collision gives two exercises the same `orderIndex`, and the
      // swap-based reorder can't move them apart. Mirrors the edit-session add.
      const created = addExerciseToWorkout(sessionId, exerciseId, nextOrderIndex(entries))
      if (!created.ok) return
      workoutExerciseId = created.value.id
    } else {
      // Replace the entry's sets with the freshly-edited draft.
      for (const s of existingSets) removeSet(s.id)
    }
    const now = new Date().toISOString()
    valid.forEach((row, i) => {
      addSet(workoutExerciseId, {
        orderIndex: i,
        completedAt: now,
        setType: row.setType,
        rpe: row.rpe,
        ...row.fields,
      })
    })
    showToast('Set saved')
    navigate('/workout')
  }

  if (!exercise) {
    return (
      <div className="px-[22px] py-16 text-center text-muted">
        <p>Exercise not found.</p>
        <button
          type="button"
          onClick={() => navigate('/workout')}
          className="mt-3 font-semibold text-[#8b90f7]"
        >
          Back to workout
        </button>
      </div>
    )
  }

  return (
    <div className="px-[22px] pb-[40px] pt-[14px]">
      <header className="mb-[22px] flex items-center gap-3">
        <CircleButton onClick={() => navigate('/workout')} label="Back">
          <ChevronLeft size={18} strokeWidth={1.75} />
        </CircleButton>
        <div className="min-w-0 flex-1 text-center">
          <div className="truncate font-display text-[17px] font-semibold tracking-[-0.01em] text-white">
            {exercise.name}
          </div>
        </div>
        <button
          type="button"
          onClick={() => navigate(`/library/${exerciseId}`)}
          className="flex-none text-[13px] font-semibold text-[#8b90f7]"
        >
          History
        </button>
      </header>

      {/* Draft sets — each a flat editor block. */}
      {draft.map((row, i) => (
        <div key={i}>
          {i > 0 && <Divider className="my-5" />}
          <div className="mb-[14px] flex items-center gap-2">
            <span className="whitespace-nowrap rounded-lg bg-neon/[0.16] px-[10px] py-1 text-[12.5px] font-semibold text-[#8b90f7]">
              Set {i + 1}
            </span>
            {/* Tap to cycle the set type (Normal → Warm-up → Drop → Failure). */}
            <button
              type="button"
              onClick={() => cycleType(i)}
              aria-label={`Set ${i + 1} type: ${setTypeLabel(row.setType)}`}
              className="whitespace-nowrap rounded-lg border border-white/10 px-[10px] py-1 text-[12px] font-semibold text-muted active:scale-[0.97]"
            >
              {setTypeLabel(row.setType)}
            </button>
            {/* Optional perceived exertion: tap to open a 1–10 picker. */}
            <button
              type="button"
              onClick={() => setRpePickerRow((r) => (r === i ? null : i))}
              aria-label={`Set ${i + 1} RPE: ${row.rpe ?? 'not set'}`}
              aria-expanded={rpePickerRow === i}
              className={`whitespace-nowrap rounded-lg border px-[10px] py-1 text-[12px] font-semibold active:scale-[0.97] ${
                row.rpe != null
                  ? 'border-neon/40 bg-neon/[0.16] text-[#8b90f7]'
                  : 'border-white/10 text-muted'
              }`}
            >
              {formatRpe(row.rpe)}
            </button>
            {row.setType !== 'warmup' &&
              isPersonalRecord(metricOf(row.fields), priorSets, type) && <PrBadge />}
            <span className="flex-1" />
            {draft.length > 1 && (
              <button
                type="button"
                onClick={() => removeDraftSet(i)}
                aria-label={`Remove set ${i + 1}`}
                className="flex h-[30px] w-[30px] flex-none items-center justify-center rounded-full text-faint active:scale-[0.94]"
              >
                <X size={17} strokeWidth={1.9} />
              </button>
            )}
          </div>
          {rpePickerRow === i && (
            <div
              role="group"
              aria-label={`Set ${i + 1} RPE`}
              className="mb-[18px] flex flex-wrap gap-2"
            >
              {RPE_VALUES.map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setRpe(i, v)}
                  aria-pressed={row.rpe === v}
                  className={`h-9 min-w-9 flex-1 rounded-lg border text-[14px] font-semibold tnum active:scale-[0.95] ${
                    row.rpe === v
                      ? 'border-neon/50 bg-neon/[0.16] text-[#8b90f7]'
                      : 'border-white/10 bg-inset text-soft'
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          )}
          <div className="mb-2 flex flex-col gap-[14px]">
            {fields.map((f, idx) => (
              <StepperField
                key={f.key}
                field={f}
                value={row.fields[f.key] ?? 0}
                unit={unit}
                large={idx === 0}
                onStep={(dir) => step(i, f, dir)}
                onCommit={(v) => setValue(i, f, v)}
              />
            ))}
          </div>
        </div>
      ))}

      <div className="mb-[22px] mt-[18px] flex gap-2">
        <button
          type="button"
          onClick={addDraftSet}
          className="flex flex-1 items-center justify-center gap-2 rounded-full border-[1.5px] border-dashed border-white/[0.16] py-[13px] text-[14.5px] font-semibold text-muted active:scale-[0.99]"
        >
          <Plus size={18} strokeWidth={2} />
          Add set
        </button>
        <button
          type="button"
          onClick={() => rest.start()}
          aria-label="Start rest timer"
          className="flex items-center justify-center gap-2 rounded-full border border-white/[0.08] bg-inset px-[18px] text-[14.5px] font-semibold text-soft active:scale-[0.98]"
        >
          <Timer size={18} strokeWidth={2} />
          Rest
        </button>
      </div>

      <Button
        variant="primary"
        fullWidth
        onClick={copyPrevious}
        disabled={!prev}
        className="mb-[18px] !border !border-white/[0.08] !bg-inset !bg-none !py-[13px] !text-[14px] !text-soft !shadow-none"
      >
        <Copy size={17} strokeWidth={1.75} />
        Copy last workout
      </Button>

      <Button variant="primary" fullWidth onClick={handleSave}>
        <Check size={19} strokeWidth={2} />
        Save {validCount} {validCount === 1 ? 'set' : 'sets'}
      </Button>

      {/* Previous performance — the memory aid, recalled below the entry area. */}
      <Divider className="my-6" />
      <div className="mb-3 flex items-center justify-between">
        <Overline className="whitespace-nowrap">
          Last time · {prev ? formatRelativeDay(prev.startedAt) : '—'}
        </Overline>
        {(trend.dir === 'up' || trend.dir === 'down') && (
          <TrendBadge trend={trend} unit={unit} size={15} />
        )}
      </div>
      {prev ? (
        <div className="flex flex-col gap-[10px]">
          {prev.sets.map((s, i) => (
            <div key={s.id} className="flex items-center gap-[13px]">
              <span className="w-[44px] flex-none text-[11px] font-semibold uppercase tracking-[0.06em] text-faint">
                Set {i + 1}
              </span>
              <SetTypeTag value={s.setType} />
              <span className="flex-1 text-right text-[15px] font-semibold tnum text-white">
                {formatSetSummary(s, type, unit)}
              </span>
              {s.rpe != null && (
                <span className="w-[32px] flex-none text-right text-[12px] font-medium tnum text-faint">
                  @{s.rpe}
                </span>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-[13.5px] leading-[1.5] text-muted">
          First time logging this — no previous data yet. Lift away.
        </p>
      )}
    </div>
  )
}

/**
 * A single set-field control (SPEC steppers + TWEAK T6 typed entry): a −/+
 * stepper on either side of a big, editable value. The value is a real input
 * (`inputmode` decimal/numeric) that selects on focus, shows a neon-outlined
 * inset box while focused, and commits on blur — clamped to ≥0, floored for
 * integer fields, reverting to the previous value when left empty. Weight is
 * typed in the active unit and stored back in kg; minutes are typed as minutes.
 */
function StepperField({
  field,
  value,
  unit,
  large,
  onStep,
  onCommit,
}: {
  field: SetFieldDef
  /** Canonical stored value (kg for weight, seconds for minute fields). */
  value: number
  unit: Unit
  large: boolean
  onStep: (dir: 1 | -1) => void
  onCommit: (canonical: number) => void
}) {
  /** Canonical value → the string shown in the active unit. */
  const toDisplay = (v: number): string => {
    if (field.isWeight) return String(toDisplayWeight(v, unit))
    if (field.displayAsMinutes) return String(Number((v / 60).toFixed(2)))
    return String(v)
  }

  const [text, setText] = useState(() => toDisplay(value))
  const [focused, setFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Keep the field in sync with stepper changes while the user isn't typing.
  useEffect(() => {
    if (!focused) setText(toDisplay(value))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, unit, focused])

  const commit = () => {
    setFocused(false)
    const t = text.trim()
    const n = Number(t)
    if (t === '' || !Number.isFinite(n)) {
      setText(toDisplay(value)) // empty / invalid → revert to previous value
      return
    }
    const canonical = field.isWeight
      ? fromDisplayWeight(n, unit)
      : field.displayAsMinutes
        ? n * 60
        : n
    onCommit(clampFieldValue(canonical, field))
  }

  const label = field.isWeight ? `${field.label} (${unit})` : field.label
  const stepPx = large ? 48 : 40
  const iconPx = large ? 20 : 17

  return (
    <div className="flex items-center gap-3">
      <StepButton onClick={() => onStep(-1)} label={`Decrease ${field.label}`} size={stepPx}>
        <Minus size={iconPx} strokeWidth={2} />
      </StepButton>
      <div className="flex min-w-0 flex-1 flex-col items-center">
        <input
          ref={inputRef}
          type="text"
          inputMode={field.integer && !field.displayAsMinutes ? 'numeric' : 'decimal'}
          value={text}
          aria-label={label}
          onFocus={(e) => {
            setFocused(true)
            e.currentTarget.select()
          }}
          onChange={(e) => setText(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') inputRef.current?.blur()
          }}
          className={`w-full max-w-[160px] rounded-[14px] bg-transparent text-center font-display font-extrabold tracking-[-0.03em] tnum text-white outline-none transition-colors focus:bg-inset focus:ring-2 focus:ring-neon ${
            large ? 'text-[44px] leading-[1.1]' : 'text-[30px] leading-none'
          }`}
        />
        <div className="mt-1 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-faint">
          {label}
        </div>
      </div>
      <StepButton onClick={() => onStep(1)} label={`Increase ${field.label}`} size={stepPx}>
        <Plus size={iconPx} strokeWidth={2} />
      </StepButton>
    </div>
  )
}

/** Round inset stepper button (− / +), sized to its field's prominence. */
function StepButton({
  onClick,
  label,
  size,
  children,
}: {
  onClick: () => void
  label: string
  size: number
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      style={{ width: size, height: size }}
      className="flex flex-none items-center justify-center rounded-full bg-inset text-white transition-transform active:scale-[0.94]"
    >
      {children}
    </button>
  )
}
