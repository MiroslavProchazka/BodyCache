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
