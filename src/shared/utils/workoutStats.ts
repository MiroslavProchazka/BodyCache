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
 * Human-readable duration from a count of seconds. "45s", "12m", or "1h 05m".
 * Never negative.
 */
export const formatDurationSec = (totalSec: number): string => {
  const s = Math.max(0, Math.floor(totalSec))
  if (s < 60) return `${s}s`
  const totalMin = Math.floor(s / 60)
  if (totalMin < 60) return `${totalMin}m`
  const h = Math.floor(totalMin / 60)
  const m = totalMin % 60
  return `${h}h ${String(m).padStart(2, '0')}m`
}

/**
 * Human-readable elapsed time between two ISO timestamps (defaults end to
 * now). "45s", "12m", or "1h 05m". Never negative.
 */
export const formatElapsed = (
  startIso: string,
  endIso: string = new Date().toISOString(),
): string => {
  const ms = Math.max(0, new Date(endIso).getTime() - new Date(startIso).getTime())
  return formatDurationSec(Math.floor(ms / 1000))
}

/**
 * Structural view of a session for elapsed-time math. A live session banks
 * `pausedTotalSec` whenever it is paused and stamps `resumedAt` when the
 * current active interval began (equal to `startedAt` for a never-paused
 * session, `null` while paused). Legacy rows predating pause have both `null`
 * and fall back to plain `startedAt → now`.
 */
export interface ElapsableSession {
  readonly startedAt: string | null
  readonly resumedAt: string | null
  readonly pausedTotalSec: number | null
  readonly status: string | null
}

/**
 * Active (non-paused) seconds a live session has accumulated: banked time plus
 * the current running interval. While paused, this is frozen at the banked
 * total so the timer stops ticking.
 */
export const activeElapsedSec = (
  s: ElapsableSession,
  nowIso: string = new Date().toISOString(),
): number => {
  const banked = s.pausedTotalSec ?? 0
  if (s.status === 'paused') return banked
  const start = s.resumedAt ?? s.startedAt
  if (!start) return banked
  const ms = Math.max(0, new Date(nowIso).getTime() - new Date(start).getTime())
  return banked + Math.floor(ms / 1000)
}

/** Structural view of a finished session for duration display. */
export interface DurableSession {
  readonly startedAt: string | null
  readonly finishedAt: string | null
  readonly pausedTotalSec: number | null
}

/**
 * Duration of a finished session in seconds. Prefers the active time banked at
 * finish (excludes paused stretches); falls back to wall-clock
 * `startedAt → finishedAt` for legacy rows that never banked it. `null` when
 * neither is available.
 */
export const finishedDurationSec = (s: DurableSession): number | null => {
  if (s.pausedTotalSec != null) return s.pausedTotalSec
  if (s.startedAt && s.finishedAt) {
    const ms = Math.max(0, new Date(s.finishedAt).getTime() - new Date(s.startedAt).getTime())
    return Math.floor(ms / 1000)
  }
  return null
}

/**
 * A live session is "stale" (left open and abandoned) once it has run a long
 * time with nothing logged — the case where an empty workout would otherwise
 * tick on indefinitely. Six hours is comfortably longer than any real session.
 */
export const STALE_SESSION_SECONDS = 6 * 60 * 60

/** True when a live session has run past the stale threshold with zero sets. */
export const isStaleAbandonedSession = (
  elapsedSec: number,
  completedSetCount: number,
): boolean => completedSetCount === 0 && elapsedSec >= STALE_SESSION_SECONDS

/**
 * Derive a workout's name from the body parts trained, mirroring the design
 * prototype's split logic:
 * - Push day — all of chest / shoulders / arms / core
 * - Pull day — all of back / arms
 * - Leg day — all legs
 * - otherwise Full body day
 */
export const workoutName = (bodyParts: readonly (string | null)[]): string => {
  const parts = [...new Set(bodyParts.filter((p): p is string => Boolean(p)))]
  if (parts.length === 0) return 'Workout'
  const all = (allowed: string[]) => parts.every((p) => allowed.includes(p))
  if (all(['chest', 'shoulders', 'arms', 'core'])) return 'Push day'
  if (all(['back', 'arms'])) return 'Pull day'
  if (all(['legs'])) return 'Leg day'
  return 'Full body day'
}
