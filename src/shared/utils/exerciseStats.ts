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
  /** `null` = normal set; warm-ups are excluded from records (see `workingSets`). */
  readonly setType: string | null
}

const n = (v: number | null): number => v ?? 0

/** A set carrying a (possibly null) set type. */
interface TypedSet {
  readonly setType?: string | null
}

/** True for warm-up sets, which don't count toward bests, PRs or trends. */
export const isWarmupSet = (set: TypedSet): boolean => set.setType === 'warmup'

/** Drop warm-up sets, keeping the working sets that count toward records. */
export const workingSets = <T extends TypedSet>(sets: readonly T[]): T[] =>
  sets.filter((s) => !isWarmupSet(s))

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

/** A grouped session: its loggable sets in set order. */
export interface SessionGroup {
  readonly sessionId: string
  readonly startedAt: string
  readonly sets: HistorySet[]
}

/**
 * Group a flat history into sessions, newest first, each with its sets in set
 * order. Empty sets and an optionally-excluded session (the active workout)
 * are dropped.
 */
export const groupSessions = (
  history: readonly HistorySet[],
  excludeSessionId?: string,
): SessionGroup[] => {
  const map = new Map<string, { startedAt: string; sets: HistorySet[] }>()
  for (const s of history) {
    if (!hasMetrics(s) || s.sessionId === excludeSessionId) continue
    const g = map.get(s.sessionId) ?? { startedAt: s.sessionStartedAt, sets: [] }
    g.sets.push(s)
    map.set(s.sessionId, g)
  }
  return [...map.entries()]
    .map(([sessionId, g]) => ({
      sessionId,
      startedAt: g.startedAt,
      sets: g.sets.slice().sort((a, b) => a.orderIndex - b.orderIndex),
    }))
    .sort((a, b) => b.startedAt.localeCompare(a.startedAt))
}

/** The first ranking metric of a set for its type (weight, reps, sec or m). */
export const primaryMetric = (set: MetricSet, type: ExerciseType): number =>
  rankTuple(set, type)[0]

/** Which field the trend delta is expressed in, per exercise type. */
export type TrendField = 'weight' | 'reps' | 'duration' | 'distance'

const TREND_FIELD: Record<ExerciseType, TrendField> = {
  strength: 'weight',
  freeform: 'reps',
  bodyweight: 'reps',
  timed: 'duration',
  distance: 'distance',
}

export type TrendDir = 'up' | 'down' | 'flat' | 'new'

/** A direction + signed delta (in the type's primary metric's native unit). */
export interface Trend {
  readonly dir: TrendDir
  readonly delta: number
  readonly field: TrendField
}

/**
 * Compare the top set of the most recent session against the one before it.
 * `dir` is `'new'` when there isn't a prior session to compare to. Excludes the
 * in-progress session via `excludeSessionId` so logging today doesn't skew it.
 */
export const sessionTrend = (
  history: readonly HistorySet[],
  type: ExerciseType,
  excludeSessionId?: string,
): Trend => {
  const field = TREND_FIELD[type]
  const groups = groupSessions(history, excludeSessionId)
  if (groups.length < 2) return { dir: 'new', delta: 0, field }
  const a = bestSet(groups[0].sets, type)
  const b = bestSet(groups[1].sets, type)
  if (!a || !b) return { dir: 'new', delta: 0, field }
  const delta = Math.round((primaryMetric(a, type) - primaryMetric(b, type)) * 10) / 10
  const dir: TrendDir = delta > 0 ? 'up' : delta < 0 ? 'down' : 'flat'
  return { dir, delta, field }
}

/** Mean top-set weight (kg) across sessions, or null when none carry weight. */
export const averageTopWeightKg = (
  history: readonly HistorySet[],
  type: ExerciseType,
): number | null => {
  const tops = groupSessions(history)
    .map((g) => bestSet(g.sets, type)?.weightKg)
    .filter((w): w is number => w != null && w > 0)
  if (tops.length === 0) return null
  return tops.reduce((a, b) => a + b, 0) / tops.length
}
