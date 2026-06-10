/** Unit formatting helpers. MVP is metric (kg, km, min). */

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

/** Drop insignificant trailing zeros from a number. */
const trim = (n: number): string => Number(n.toFixed(2)).toString()
