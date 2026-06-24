/**
 * Detects which exercises hit a personal record in a just-finished session,
 * for the Finish-screen celebration. A PR = the session's best working set for
 * an exercise strictly beats that exercise's best from every *earlier* session
 * (the first-ever session is not celebrated — there's nothing to beat yet).
 *
 * Scoped to **weighted** records (the headline case): exercises whose session
 * best carries no weight are skipped, so we never show a false "PR" for a type
 * we can't fully rank from this data. Pure — UI- and Evolu-free (see the test).
 */
import type { ExerciseType } from '@/evolu/schema'
import {
  bestSet,
  isPersonalRecord,
  workingSets,
  type MetricSet,
} from '@/shared/utils/exerciseStats'

/** A completed set across finished sessions, tagged with its exercise + session. */
export interface PrSetInput extends MetricSet {
  readonly exerciseId: string | null
  readonly exerciseName: string | null
  readonly exerciseType: string | null
  readonly setType: string | null
  readonly sessionId: string | null
}

export interface PersonalRecord {
  readonly exerciseId: string
  readonly name: string
}

/** Personal records set in `currentSessionId`, given all finished-session sets. */
export const sessionPersonalRecords = (
  currentSessionId: string,
  allSets: readonly PrSetInput[],
): PersonalRecord[] => {
  const byExercise = new Map<string, PrSetInput[]>()
  for (const s of allSets) {
    if (!s.exerciseId) continue
    const group = byExercise.get(s.exerciseId)
    if (group) group.push(s)
    else byExercise.set(s.exerciseId, [s])
  }

  const prs: PersonalRecord[] = []
  for (const [exerciseId, sets] of byExercise) {
    const type = (sets.find((s) => s.exerciseType)?.exerciseType ?? 'strength') as ExerciseType
    const working = workingSets(sets)
    const current = working.filter((s) => s.sessionId === currentSessionId)
    const prior = working.filter((s) => s.sessionId !== currentSessionId)
    if (current.length === 0 || prior.length === 0) continue // nothing to beat yet

    const currentBest = bestSet(current, type)
    if (!currentBest || (currentBest.weightKg ?? 0) <= 0) continue // weighted PRs only

    if (isPersonalRecord(currentBest, prior, type)) {
      const name = sets.find((s) => s.exerciseName)?.exerciseName ?? 'Exercise'
      prs.push({ exerciseId, name })
    }
  }
  return prs
}

/** Pill copy for the Finish PR badge, or null when no PRs were set. */
export const prBadgeLabel = (prs: readonly PersonalRecord[]): string | null => {
  if (prs.length === 0) return null
  if (prs.length === 1) return `New PR · ${prs[0].name}`
  return `${prs.length} new personal records`
}
