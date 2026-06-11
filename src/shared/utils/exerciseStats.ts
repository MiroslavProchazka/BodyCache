/**
 * Pure stat helpers for an exercise's logged history.
 *
 * These answer two of BodyCache's three core questions — *what did I do last
 * time?* and *what is my best?* — and are deliberately UI- and Evolu-free so
 * they can be unit-tested in isolation (see `exerciseStats.test.ts`).
 *
 * "Better" is comparator-based and type-specific. The comparisons are simple
 * and documented rather than clever: this is a memory aid, not a 1RM model.
 */
import type { ExerciseType } from '@/evolu/schema'

/** The numeric metrics a set can carry. */
export interface MetricSet {
  readonly weightKg: number | null
  readonly reps: number | null
  readonly addedWeightKg: number | null
  readonly assistanceWeightKg: number | null
  readonly durationSec: number | null
  readonly distanceMeters: number | null
}

/** A completed set with the session it belongs to (from `completedSetsForExercise`). */
export interface HistorySet extends MetricSet {
  readonly id: string
  readonly orderIndex: number
  readonly sessionId: string
  readonly sessionStartedAt: string
}

const n = (v: number | null): number => v ?? 0

/** True when a set carries at least one positive, loggable metric. */
export const hasMetrics = (set: MetricSet): boolean =>
  n(set.weightKg) > 0 ||
  n(set.reps) > 0 ||
  n(set.addedWeightKg) > 0 ||
  n(set.assistanceWeightKg) > 0 ||
  n(set.durationSec) > 0 ||
  n(set.distanceMeters) > 0

/**
 * Ordered metric tuple for ranking sets of a given type; higher is better and
 * earlier entries dominate (lexicographic). Tuned per exercise type:
 * - strength: heaviest weight, then most reps
 * - bodyweight: most reps, then most added weight
 * - timed: longest duration
 * - distance: longest distance
 * - freeform: reps, then weight, then duration, then distance
 */
const rankTuple = (set: MetricSet, type: ExerciseType): number[] => {
  switch (type) {
    case 'strength':
      return [n(set.weightKg), n(set.reps)]
    case 'bodyweight':
      return [n(set.reps), n(set.addedWeightKg)]
    case 'timed':
      return [n(set.durationSec)]
    case 'distance':
      return [n(set.distanceMeters)]
    case 'freeform':
      return [n(set.reps), n(set.weightKg), n(set.durationSec), n(set.distanceMeters)]
  }
}

/** Lexicographic comparison: >0 if `a` is the better set, <0 if worse, 0 if equal. */
export const compareSets = (a: MetricSet, b: MetricSet, type: ExerciseType): number => {
  const ta = rankTuple(a, type)
  const tb = rankTuple(b, type)
  for (let i = 0; i < ta.length; i++) {
    if (ta[i] !== tb[i]) return ta[i] - tb[i]
  }
  return 0
}

/** The single best set among `sets` (by `compareSets`), ignoring empty ones. */
export const bestSet = <T extends MetricSet>(
  sets: readonly T[],
  type: ExerciseType,
): T | null => {
  let best: T | null = null
  for (const set of sets) {
    if (!hasMetrics(set)) continue
    if (best === null || compareSets(set, best, type) > 0) best = set
  }
  return best
}

/**
 * Whether `set` is a personal record relative to `others` (typically every
 * other completed set for the exercise). The first-ever completed set counts
 * as a PR; thereafter the set must strictly beat the previous best.
 */
export const isPersonalRecord = (
  set: MetricSet,
  others: readonly MetricSet[],
  type: ExerciseType,
): boolean => {
  if (!hasMetrics(set)) return false
  const best = bestSet(others, type)
  return best === null || compareSets(set, best, type) > 0
}

/** The most recent session's sets, ordered, for showing "last time". */
export interface PreviousSession {
  readonly sessionId: string
  readonly startedAt: string
  readonly sets: HistorySet[]
}

/**
 * The previous session for this exercise — the most recent one excluding
 * `excludeSessionId` (the workout being logged now). Returns its loggable sets
 * in set order, or null when there is no prior history.
 */
export const previousSession = (
  history: readonly HistorySet[],
  excludeSessionId?: string,
): PreviousSession | null => {
  const candidates = history.filter(
    (s) => hasMetrics(s) && s.sessionId !== excludeSessionId,
  )
  if (candidates.length === 0) return null

  let latest = candidates[0]
  for (const s of candidates) {
    if (s.sessionStartedAt > latest.sessionStartedAt) latest = s
  }

  const sets = candidates
    .filter((s) => s.sessionId === latest.sessionId)
    .sort((a, b) => a.orderIndex - b.orderIndex)

  return { sessionId: latest.sessionId, startedAt: latest.sessionStartedAt, sets }
}
