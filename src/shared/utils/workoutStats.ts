/**
 * Pure session-level stat helpers (UI- and Evolu-free; see
 * `workoutStats.test.ts`). Kept derived rather than cached, per the product
 * rules.
 */

/** A set contributing to training volume. */
export interface VolumeSet {
  readonly weightKg: number | null
  readonly reps: number | null
}

/** Total volume (Σ weight × reps) for sets that have both, in kg. */
export const totalVolumeKg = (sets: readonly VolumeSet[]): number =>
  sets.reduce((sum, s) => {
    if (s.weightKg != null && s.reps != null) return sum + s.weightKg * s.reps
    return sum
  }, 0)

/** Count of sets marked complete. */
export const completedSetCount = (
  sets: readonly { completedAt: string | null }[],
): number => sets.reduce((c, s) => c + (s.completedAt != null ? 1 : 0), 0)

/**
 * Human-readable elapsed time between two ISO timestamps (defaults end to
 * now). "45s", "12m", or "1h 05m". Never negative.
 */
export const formatElapsed = (
  startIso: string,
  endIso: string = new Date().toISOString(),
): string => {
  const ms = Math.max(0, new Date(endIso).getTime() - new Date(startIso).getTime())
  const totalSec = Math.floor(ms / 1000)
  if (totalSec < 60) return `${totalSec}s`
  const totalMin = Math.floor(totalSec / 60)
  if (totalMin < 60) return `${totalMin}m`
  const h = Math.floor(totalMin / 60)
  const m = totalMin % 60
  return `${h}h ${String(m).padStart(2, '0')}m`
}
