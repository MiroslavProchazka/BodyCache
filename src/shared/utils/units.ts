/**
 * Unit formatting. Weights are stored canonically in **kilograms**; `lb` is a
 * display-only conversion (×2.20462). The set logger steps in kg even when
 * displaying pounds (see the design handoff "State Management" note).
 */
import type { ExerciseType } from '@/evolu/schema'

export type Unit = 'kg' | 'lb'

const LB_PER_KG = 2.20462

/** Drop insignificant trailing zeros from a number. */
const trim = (n: number): string => Number(n.toFixed(2)).toString()

/** Canonical kg → the number shown for the active unit (0.1 kg / whole lb). */
export const toDisplayWeight = (kg: number, unit: Unit): number =>
  unit === 'lb' ? Math.round(kg * LB_PER_KG) : Math.round(kg * 10) / 10

/** "80 kg" / "176 lb". */
export const formatWeight = (kg: number, unit: Unit): string =>
  `${trim(toDisplayWeight(kg, unit))} ${unit}`

/** "80 kg × 8" — spaced, for the "Last time" rows. */
export const formatWeightReps = (kg: number, reps: number, unit: Unit): string =>
  `${trim(toDisplayWeight(kg, unit))} ${unit} × ${reps}`

/** "80kg × 8" — compact, for set chips. */
export const formatWeightRepsCompact = (
  kg: number,
  reps: number,
  unit: Unit,
): string => `${trim(toDisplayWeight(kg, unit))}${unit} × ${reps}`

/** Total volume formatted with thousands separators, in the active unit. */
export const formatVolume = (kg: number, unit: Unit): string => {
  const v = unit === 'lb' ? Math.round(kg * LB_PER_KG) : Math.round(kg)
  return v.toLocaleString()
}

/** Seconds → "1:05" or "45s". */
export const formatDuration = (sec: number): string => {
  if (sec < 60) return `${sec}s`
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

/** Meters → "1.6 km" or "850 m". */
export const formatDistance = (meters: number): string =>
  meters >= 1000 ? `${trim(meters / 1000)} km` : `${trim(meters)} m`

/** Metrics a set summary may read (structural subset of a set row). */
interface SetSummaryInput {
  weightKg: number | null
  reps: number | null
  addedWeightKg: number | null
  assistanceWeightKg: number | null
  durationSec: number | null
  distanceMeters: number | null
}

/**
 * One-line summary of a set, formatted for its exercise type. `compact` drops
 * the space between weight and unit for tight chips ("80kg × 8" vs "80 kg × 8").
 */
export const formatSetSummary = (
  set: SetSummaryInput,
  type: ExerciseType,
  unit: Unit,
  compact = false,
): string => {
  const wr = (kg: number, reps: number) =>
    compact ? formatWeightRepsCompact(kg, reps, unit) : formatWeightReps(kg, reps, unit)
  switch (type) {
    case 'strength':
    case 'freeform':
      if (set.weightKg != null && set.reps != null) return wr(set.weightKg, set.reps)
      if (set.reps != null) return `${set.reps} reps`
      if (set.weightKg != null) return formatWeight(set.weightKg, unit)
      return '—'
    case 'bodyweight': {
      const reps = set.reps != null ? `${set.reps} reps` : null
      if (set.addedWeightKg != null && set.addedWeightKg > 0)
        return [reps ?? 'BW', `+${formatWeight(set.addedWeightKg, unit)}`].join(' ')
      if (set.assistanceWeightKg != null && set.assistanceWeightKg > 0)
        return [reps ?? 'BW', `−${formatWeight(set.assistanceWeightKg, unit)}`].join(' ')
      return reps ?? '—'
    }
    case 'timed':
      return set.durationSec != null ? formatDuration(set.durationSec) : '—'
    case 'distance': {
      const dist = set.distanceMeters != null ? formatDistance(set.distanceMeters) : null
      const dur = set.durationSec != null ? formatDuration(set.durationSec) : null
      return [dist, dur].filter(Boolean).join(' · ') || '—'
    }
  }
}
