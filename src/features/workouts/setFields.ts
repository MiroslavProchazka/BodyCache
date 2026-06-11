import type { ExerciseType } from '@/evolu/schema'

/** A numeric set column the logger renders a stepper for. */
export type SetFieldKey =
  | 'weightKg'
  | 'reps'
  | 'addedWeightKg'
  | 'durationSec'
  | 'distanceMeters'

export interface SetFieldDef {
  readonly key: SetFieldKey
  /** Column header (the unit is appended for weight fields). */
  readonly label: string
  /** Stepper increment (kg for weight fields; native units otherwise). */
  readonly step: number
  /** Whole numbers only (reps, seconds). */
  readonly integer?: boolean
  /** Stored in kg and shown in the active display unit. */
  readonly isWeight?: boolean
}

/**
 * Which stepper columns to show per exercise type, in display order. Strength
 * (weight × reps) is the common case; the rest map to their most relevant
 * metric(s). Extra schema columns (RPE, incline, speed, resistance) are not
 * surfaced in the MVP logger.
 */
export const SET_FIELDS: Record<ExerciseType, readonly SetFieldDef[]> = {
  strength: [
    { key: 'weightKg', label: 'Weight', step: 2.5, isWeight: true },
    { key: 'reps', label: 'Reps', step: 1, integer: true },
  ],
  bodyweight: [
    { key: 'reps', label: 'Reps', step: 1, integer: true },
    { key: 'addedWeightKg', label: 'Added', step: 2.5, isWeight: true },
  ],
  timed: [{ key: 'durationSec', label: 'Seconds', step: 5, integer: true }],
  distance: [
    { key: 'distanceMeters', label: 'Meters', step: 50 },
    { key: 'durationSec', label: 'Seconds', step: 5, integer: true },
  ],
  freeform: [
    { key: 'weightKg', label: 'Weight', step: 2.5, isWeight: true },
    { key: 'reps', label: 'Reps', step: 1, integer: true },
  ],
}

/** Sensible starting value for a field when there's no history to seed from. */
export const DEFAULT_VALUES: Record<SetFieldKey, number> = {
  weightKg: 20,
  reps: 10,
  addedWeightKg: 0,
  durationSec: 30,
  distanceMeters: 1000,
}

/** Columns copied when pre-filling / cloning a set. */
export const PREFILL_KEYS: readonly SetFieldKey[] = [
  'weightKg',
  'reps',
  'addedWeightKg',
  'durationSec',
  'distanceMeters',
]
