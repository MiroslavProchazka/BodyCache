import type { ExerciseType } from '@/evolu/schema'

/** A numeric set column the UI can render an input for. */
export type SetFieldKey =
  | 'weightKg'
  | 'reps'
  | 'addedWeightKg'
  | 'durationSec'
  | 'distanceMeters'

export interface SetFieldDef {
  readonly key: SetFieldKey
  /** Short unit/label shown under the input. */
  readonly label: string
  /** Whole numbers only (reps, seconds). */
  readonly integer?: boolean
}

/**
 * Which inputs to show for each exercise type, in display order. Kept small
 * and focused — strength (weight × reps) is the common case; the rest map to
 * their single most relevant metric. Extra schema columns (RPE, incline,
 * speed, resistance) are intentionally not surfaced in the MVP logger.
 */
export const SET_FIELDS: Record<ExerciseType, readonly SetFieldDef[]> = {
  strength: [
    { key: 'weightKg', label: 'kg' },
    { key: 'reps', label: 'reps', integer: true },
  ],
  bodyweight: [
    { key: 'reps', label: 'reps', integer: true },
    { key: 'addedWeightKg', label: '+kg' },
  ],
  timed: [{ key: 'durationSec', label: 'sec', integer: true }],
  distance: [
    { key: 'distanceMeters', label: 'm' },
    { key: 'durationSec', label: 'sec', integer: true },
  ],
  freeform: [
    { key: 'weightKg', label: 'kg' },
    { key: 'reps', label: 'reps', integer: true },
  ],
}

/** Columns copied when pre-filling a new set from a previous one. */
export const PREFILL_KEYS: readonly SetFieldKey[] = [
  'weightKg',
  'reps',
  'addedWeightKg',
  'durationSec',
  'distanceMeters',
]
