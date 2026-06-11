import type { SessionSetRow } from '@/evolu/rows'
import { workoutName } from '@/shared/utils/workoutStats'

/** Derived recap of a session, computed from its completed sets. */
export interface SessionSummary {
  readonly exerciseCount: number
  readonly setCount: number
  readonly volumeKg: number
  readonly name: string
}

/** Summarize a session's completed sets (counts, volume, derived name). */
export const summarizeSession = (rows: readonly SessionSetRow[]): SessionSummary => {
  const exerciseIds = new Set<string>()
  const bodyParts: (string | null)[] = []
  let volumeKg = 0
  for (const r of rows) {
    exerciseIds.add(String(r.exerciseId))
    bodyParts.push(r.bodyPart as string | null)
    if (r.weightKg != null && r.reps != null) volumeKg += r.weightKg * r.reps
  }
  return {
    exerciseCount: exerciseIds.size,
    setCount: rows.length,
    volumeKg,
    name: workoutName(bodyParts),
  }
}
