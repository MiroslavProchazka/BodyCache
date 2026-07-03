import type { CompletedSetIndexRow } from '@/evolu/rows'
import type { ExerciseType } from '@/evolu/schema'
import { groupSessions, sessionTrend, type HistorySet, type Trend } from '@/shared/utils/exerciseStats'
import { lastSummaryLabel } from './history'
import type { Unit } from '@/shared/utils/units'

/**
 * A per-exercise "last performance" summary, derived once from the whole-library
 * `completedSetsIndex` query. Cards and picker rows receive this as a prop and
 * run no query of their own — replacing the N per-row `completedSetsForExercise`
 * queries that used to freeze the library and workout picker.
 *
 * `lastSessionSets` / `previousSessionSets` are exactly what
 * `groupSessions(fullHistory)[0]`/`[1]` would yield for that exercise, so the
 * "last time" label and trend arrow match the old per-card behaviour verbatim.
 */
export interface ExercisePerformanceSummary {
  /** Loggable sets of the most recent session, in set order. */
  readonly lastSessionSets: HistorySet[]
  /** Loggable sets of the second-most-recent session (for the trend arrow). */
  readonly previousSessionSets: HistorySet[]
  /** Start time of the most recent session with loggable sets. */
  readonly lastPerformedAt: string
}

/**
 * Reduce all completed sets (from `completedSetsIndex`) into a per-exercise
 * last-performance summary. O(total sets): bucket by exercise, then reuse the
 * tested `groupSessions` so grouping/ordering/empty-set semantics stay identical
 * to the old per-exercise path. Exercises with no loggable history are omitted
 * (consumers treat a missing entry as "No history yet").
 */
export function buildLastPerformanceIndex(
  rows: readonly CompletedSetIndexRow[],
): ReadonlyMap<string, ExercisePerformanceSummary> {
  // The inner joins guarantee the join columns at runtime, but Evolu types them
  // nullable; drop any row missing them rather than fabricating a session.
  const byExercise = new Map<string, HistorySet[]>()
  for (const r of rows) {
    if (!r.exerciseId || !r.sessionId || !r.sessionStartedAt) continue
    const set: HistorySet = {
      id: r.id,
      orderIndex: r.orderIndex ?? 0,
      weightKg: r.weightKg,
      reps: r.reps,
      addedWeightKg: r.addedWeightKg,
      assistanceWeightKg: r.assistanceWeightKg,
      durationSec: r.durationSec,
      distanceMeters: r.distanceMeters,
      elevationMeters: r.elevationMeters,
      sessionId: r.sessionId,
      sessionStartedAt: r.sessionStartedAt,
      setType: r.setType,
      rpe: r.rpe ?? null,
    }
    const list = byExercise.get(r.exerciseId)
    if (list) list.push(set)
    else byExercise.set(r.exerciseId, [set])
  }

  const index = new Map<string, ExercisePerformanceSummary>()
  for (const [exerciseId, history] of byExercise) {
    const groups = groupSessions(history)
    if (groups.length === 0) continue
    index.set(exerciseId, {
      lastSessionSets: groups[0].sets,
      previousSessionSets: groups[1]?.sets ?? [],
      lastPerformedAt: groups[0].startedAt,
    })
  }
  return index
}

/**
 * The compact "last time" label for a card/row, from a precomputed summary.
 * Mirrors `lastSummaryLabel(fullHistory, …)`: the last session's sets form a
 * single group, so `lastSummaryLabel` picks that group's top set exactly as
 * before. A missing summary → "No history yet".
 */
export const summaryLabel = (
  summary: ExercisePerformanceSummary | undefined,
  type: ExerciseType,
  unit: Unit,
): string => lastSummaryLabel(summary?.lastSessionSets ?? [], type, unit)

/**
 * The session-over-session trend from a precomputed summary. Concatenating the
 * last two sessions' sets yields exactly the two groups `sessionTrend` compares,
 * so the arrow matches the old per-card computation.
 */
export const summaryTrend = (
  summary: ExercisePerformanceSummary | undefined,
  type: ExerciseType,
): Trend =>
  sessionTrend(
    summary ? [...summary.lastSessionSets, ...summary.previousSessionSets] : [],
    type,
  )
