/** Unit formatting helpers. MVP is metric (kg, km, min). */
import type { ExerciseType } from '@/evolu/schema'

/** "35 kg" — trims trailing zeros (35, not 35.0). */
export const formatWeight = (kg: number): string => `${trim(kg)} kg`

/** Format a strength set as "35 kg × 10". */
export const formatStrengthSet = (
  weightKg: number | null,
  reps: number | null,
): string => {
  if (weightKg != null && reps != null) return `${trim(weightKg)} kg × ${reps}`
  if (reps != null) return `${reps} reps`
  if (weightKg != null) return formatWeight(weightKg)
  return '—'
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
 * One-line summary of a set, formatted for its exercise type — used for the
 * "Previous" and "Best" reference labels. Returns "—" when nothing is logged.
 */
export const formatSetSummary = (set: SetSummaryInput, type: ExerciseType): string => {
  switch (type) {
    case 'strength':
      return formatStrengthSet(set.weightKg, set.reps)
    case 'bodyweight': {
      const reps = set.reps != null ? `${set.reps} reps` : null
      if (set.addedWeightKg != null && set.addedWeightKg > 0)
        return [reps ?? 'BW', `+${trim(set.addedWeightKg)} kg`].join(' ')
      if (set.assistanceWeightKg != null && set.assistanceWeightKg > 0)
        return [reps ?? 'BW', `−${trim(set.assistanceWeightKg)} kg`].join(' ')
      return reps ?? '—'
    }
    case 'timed':
      return set.durationSec != null ? formatDuration(set.durationSec) : '—'
    case 'distance': {
      const dist = set.distanceMeters != null ? formatDistance(set.distanceMeters) : null
      const dur = set.durationSec != null ? formatDuration(set.durationSec) : null
      return [dist, dur].filter(Boolean).join(' · ') || '—'
    }
    case 'freeform':
      return formatStrengthSet(set.weightKg, set.reps)
  }
}

/** Drop insignificant trailing zeros from a number. */
const trim = (n: number): string => Number(n.toFixed(2)).toString()
