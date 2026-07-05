import { workoutName } from '@/shared/utils/workoutStats'

/**
 * The structural subset of a completed set a summary reads. Joined columns are
 * typed nullable by Evolu even though an inner join guarantees a match, so the
 * inputs are permissive and coerced here.
 */
export interface SummarySetInput {
  readonly exerciseId: string | null
  readonly bodyPart: string | null
  readonly weightKg: number | null
  readonly reps: number | null
}

/** Derived recap of a session, computed from its completed sets. */
export interface SessionSummary {
  readonly exerciseCount: number
  readonly setCount: number
  readonly volumeKg: number
  readonly name: string
}

/** A completed set as the per-exercise recap reads it (name + top weight). */
export interface BreakdownSetInput {
  readonly exerciseId: string | null
  readonly exerciseName: string | null
  readonly weightKg: number | null
}

/** One exercise's line in the finish recap: its set count and heaviest set. */
export interface ExerciseBreakdownItem {
  readonly exerciseId: string
  readonly name: string
  readonly setCount: number
  /** Heaviest working weight logged (kg), or null for a weightless exercise. */
  readonly topWeightKg: number | null
}

/**
 * Per-exercise recap of a session's completed sets, in workout order (rows are
 * expected pre-sorted by exercise order). Each entry carries its set count and
 * top weight — the finish screen's "n sets · top weight" rows (TWEAK T7).
 */
export const exerciseBreakdown = (
  rows: readonly BreakdownSetInput[],
): ExerciseBreakdownItem[] => {
  const order: string[] = []
  const byId = new Map<string, { name: string; setCount: number; topWeightKg: number | null }>()
  for (const r of rows) {
    if (r.exerciseId == null) continue
    let item = byId.get(r.exerciseId)
    if (!item) {
      item = { name: r.exerciseName ?? 'Exercise', setCount: 0, topWeightKg: null }
      byId.set(r.exerciseId, item)
      order.push(r.exerciseId)
    }
    item.setCount += 1
    if (r.weightKg != null) {
      item.topWeightKg = item.topWeightKg == null ? r.weightKg : Math.max(item.topWeightKg, r.weightKg)
    }
  }
  return order.map((id) => ({ exerciseId: id, ...byId.get(id)! }))
}

/** Summarize a session's completed sets (counts, volume, derived name). */
export const summarizeSession = (rows: readonly SummarySetInput[]): SessionSummary => {
  const exerciseIds = new Set<string>()
  const bodyParts: (string | null)[] = []
  let volumeKg = 0
  for (const r of rows) {
    if (r.exerciseId != null) exerciseIds.add(r.exerciseId)
    bodyParts.push(r.bodyPart)
    if (r.weightKg != null && r.reps != null) volumeKg += r.weightKg * r.reps
  }
  return {
    exerciseCount: exerciseIds.size,
    setCount: rows.length,
    volumeKg,
    name: workoutName(bodyParts),
  }
}
