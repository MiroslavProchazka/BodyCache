import type { ExerciseHistorySetRow } from '@/evolu/rows'
import { groupSessions, bestSet, type HistorySet } from '@/shared/utils/exerciseStats'
import { formatWeight, formatSetSummary, type Unit } from '@/shared/utils/units'
import type { ExerciseType } from '@/evolu/schema'

/**
 * Normalize `completedSetsForExercise` rows into clean `HistorySet`s. The join
 * columns are typed nullable by Evolu though the inner joins guarantee the
 * session columns at runtime; rows missing them are dropped.
 */
export const toHistorySets = (rows: readonly ExerciseHistorySetRow[]): HistorySet[] =>
  rows.flatMap((r) =>
    r.sessionId && r.sessionStartedAt
      ? [
          {
            id: r.id,
            orderIndex: r.orderIndex ?? 0,
            weightKg: r.weightKg,
            reps: r.reps,
            addedWeightKg: r.addedWeightKg,
            assistanceWeightKg: r.assistanceWeightKg,
            durationSec: r.durationSec,
            distanceMeters: r.distanceMeters,
            sessionId: r.sessionId,
            sessionStartedAt: r.sessionStartedAt,
            setType: r.setType,
          },
        ]
      : [],
  )

/**
 * Compact "last time" label for cards, e.g. "3×8 · 80 kg" for strength, or
 * "2 sets · 1:05" for timed. Falls back to "No history yet".
 */
export const lastSummaryLabel = (
  history: readonly HistorySet[],
  type: ExerciseType,
  unit: Unit,
): string => {
  const groups = groupSessions(history)
  if (groups.length === 0) return 'No history yet'
  const group = groups[0]
  const top = bestSet(group.sets, type)
  if (!top) return 'No history yet'
  if ((type === 'strength' || type === 'freeform') && top.weightKg != null && top.reps != null) {
    return `${group.sets.length}×${top.reps} · ${formatWeight(top.weightKg, unit)}`
  }
  return `${group.sets.length} sets · ${formatSetSummary(top, type, unit)}`
}
