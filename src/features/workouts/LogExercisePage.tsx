import { Fragment, useState } from 'react'
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
  ExercisePhotoId,
  ExerciseType,
  SetType,
  WorkoutExerciseId,
  WorkoutSessionId,
} from '@/evolu/schema'
import { CircleButton } from '@/shared/components/CircleButton'
import { StickyAction } from '@/shared/components/StickyAction'
import { Overline } from '@/shared/components/Overline'
import { useToast } from '@/shared/components/Toast'
import { useUnits } from '@/shared/units/UnitsContext'
import { useRestTimer } from '@/shared/rest/RestTimerContext'
import { metaLine } from '@/shared/utils/bodyParts'
import { formatRelativeDay } from '@/shared/utils/dates'
import { toDisplayWeight, formatSetSummary } from '@/shared/utils/units'
import {
  previousSession,
  sessionTrend,
  bestSet,
  isPersonalRecord,
  workingSets,
  type MetricSet,
} from '@/shared/utils/exerciseStats'
import { ExerciseTile } from '@/features/exercises/ExerciseTile'
import { TrendBadge } from '@/features/exercises/TrendBadge'
import { PrBadge } from '@/features/exercises/PrBadge'
import { toHistorySets } from '@/features/exercises/history'
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
})

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

  const clampValue = (value: number, f: SetFieldDef) =>
    Math.max(0, f.integer ? Math.round(value) : Math.round(value * 10) / 10)

  const step = (index: number, f: SetFieldDef, dir: 1 | -1) =>
    setDraft((ds) =>
      ds.map((row, j) =>
        j === index
          ? {
              ...row,
              fields: {
                ...row.fields,
                [f.key]: clampValue((row.fields[f.key] ?? 0) + dir * f.step, f),
              },
            }
          : row,
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
      const created = addExerciseToWorkout(sessionId, exerciseId, entries.length)
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
      <div className="px-5 py-16 text-center text-muted">
        <p>Exercise not found.</p>
        <button
          type="button"
          onClick={() => navigate('/workout')}
          className="mt-3 font-semibold text-neon"
        >
          Back to workout
        </button>
      </div>
    )
  }

  return (
    <>
      <div className="px-5 pb-[160px] pt-[6px]">
        <header className="mb-[18px] flex items-center gap-3">
          <CircleButton onClick={() => navigate('/workout')} label="Back">
            <ChevronLeft size={18} strokeWidth={1.75} />
          </CircleButton>
          <div className="min-w-0 flex-1">
            <div className="truncate font-display text-[20px] font-semibold leading-[1.1] tracking-tight text-white">
              {exercise.name}
            </div>
            <div className="mt-[2px] truncate text-[12.5px] text-muted">
              {metaLine(exercise.bodyPart, exercise.equipment) || humanizeType(type)}
            </div>
          </div>
          <ExerciseTile
            photoId={exercise.primaryPhotoId as ExercisePhotoId | null}
            bodyPart={exercise.bodyPart}
            radius="14px"
            className="h-[44px] w-[44px] flex-none"
          />
        </header>

        {/* Previous performance */}
        <div className="mb-[18px] rounded-[18px] border border-white/[0.07] bg-surface p-[15px]">
          <div className="mb-3 flex items-center justify-between">
            <Overline className="whitespace-nowrap">
              Last time · {prev ? formatRelativeDay(prev.startedAt) : '—'}
            </Overline>
            {(trend.dir === 'up' || trend.dir === 'down') && (
              <TrendBadge trend={trend} unit={unit} size={15} />
            )}
          </div>
          {prev ? (
            <div className="flex flex-col gap-2">
              {prev.sets.map((s, i) => (
                <div key={s.id} className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <span className="whitespace-nowrap font-medium text-muted">Set {i + 1}</span>
                    <SetTypeTag value={s.setType} />
                  </span>
                  <span className="flex items-center gap-2 whitespace-nowrap">
                    {s.rpe != null && (
                      <span className="text-[12px] font-medium tnum text-faint">@{s.rpe}</span>
                    )}
                    <span className="font-semibold tnum text-white">
                      {formatSetSummary(s, type, unit)}
                    </span>
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm leading-[1.45] text-muted">
              First time logging this — no previous data yet. Lift away.
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={copyPrevious}
          disabled={!prev}
          className="mb-[18px] flex w-full items-center justify-center gap-2 rounded-2xl border border-white/[0.08] bg-inset p-[13px] text-sm font-semibold text-soft disabled:opacity-40"
        >
          <Copy size={17} strokeWidth={1.75} />
          Copy last workout
        </button>

        <Overline className="mb-3">Today's sets</Overline>
        <div className="mb-[14px] flex flex-col gap-3">
          {draft.map((row, i) => (
            <div
              key={i}
              className="rounded-[20px] border border-white/[0.07] bg-surface px-[14px] pb-4 pt-[14px]"
            >
              <div className="mb-[14px] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="whitespace-nowrap rounded-lg bg-neon/[0.12] px-[10px] py-1 text-[12.5px] font-semibold text-neon">
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
                        ? 'border-neon/40 bg-neon/[0.12] text-neon'
                        : 'border-white/10 text-muted'
                    }`}
                  >
                    {formatRpe(row.rpe)}
                  </button>
                  {row.setType !== 'warmup' &&
                    isPersonalRecord(metricOf(row.fields), priorSets, type) && <PrBadge />}
                </div>
                {draft.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeDraftSet(i)}
                    aria-label={`Remove set ${i + 1}`}
                    className="flex h-[30px] w-[30px] items-center justify-center rounded-full text-faint"
                  >
                    <X size={17} strokeWidth={1.9} />
                  </button>
                )}
              </div>
              {rpePickerRow === i && (
                <div
                  role="group"
                  aria-label={`Set ${i + 1} RPE`}
                  className="mb-[14px] flex flex-wrap gap-2"
                >
                  {RPE_VALUES.map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setRpe(i, v)}
                      aria-pressed={row.rpe === v}
                      className={`h-9 min-w-9 flex-1 rounded-lg border text-[14px] font-semibold tnum active:scale-[0.95] ${
                        row.rpe === v
                          ? 'border-neon/50 bg-neon/[0.16] text-neon'
                          : 'border-white/10 bg-inset text-soft'
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              )}
              <div className="flex gap-2">
                {fields.map((f, idx) => (
                  <Fragment key={f.key}>
                    {idx > 0 && <div className="w-px self-stretch bg-white/[0.08]" />}
                    <div className="min-w-0 flex-1 text-center">
                      <div className="mb-[9px] text-[10.5px] font-semibold uppercase tracking-[0.08em] text-faint">
                        {f.isWeight ? `${f.label} (${unit})` : f.label}
                      </div>
                      <div className="flex items-center justify-between gap-1">
                        <StepButton onClick={() => step(i, f, -1)} label={`Decrease ${f.label}`}>
                          <Minus size={20} strokeWidth={2} />
                        </StepButton>
                        <span
                          className="font-display text-[28px] font-semibold tnum text-white"
                          style={{ minWidth: f.isWeight ? 44 : 32 }}
                        >
                          {f.isWeight
                            ? toDisplayWeight(row.fields[f.key] ?? 0, unit)
                            : (row.fields[f.key] ?? 0)}
                        </span>
                        <StepButton onClick={() => step(i, f, 1)} label={`Increase ${f.label}`}>
                          <Plus size={20} strokeWidth={2} />
                        </StepButton>
                      </div>
                    </div>
                  </Fragment>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={addDraftSet}
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl border-[1.5px] border-dashed border-white/[0.16] p-[14px] text-[14.5px] font-semibold text-muted"
          >
            <Plus size={18} strokeWidth={2} />
            Add set
          </button>
          <button
            type="button"
            onClick={() => rest.start()}
            aria-label="Start rest timer"
            className="flex items-center justify-center gap-2 rounded-2xl border border-white/[0.08] bg-inset px-[18px] text-[14.5px] font-semibold text-soft active:scale-[0.98]"
          >
            <Timer size={18} strokeWidth={2} />
            Rest
          </button>
        </div>
      </div>

      <StickyAction>
        <button
          type="button"
          onClick={handleSave}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white py-[17px] text-base font-bold text-ink transition-transform active:scale-[0.99]"
        >
          <Check size={20} strokeWidth={2} />
          Save {validCount} {validCount === 1 ? 'set' : 'sets'}
        </button>
      </StickyAction>
    </>
  )
}

/** 44px circular stepper button (− / +). */
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
      className="flex h-11 w-11 flex-none items-center justify-center rounded-full border border-white/10 bg-inset text-neon transition-transform active:scale-[0.94]"
    >
      {children}
    </button>
  )
}

const humanizeType = (type: ExerciseType): string =>
  type.charAt(0).toUpperCase() + type.slice(1)
