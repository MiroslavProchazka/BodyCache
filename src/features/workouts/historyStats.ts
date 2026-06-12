/**
 * Pure helpers for the History screen — UI- and Evolu-free (see
 * `historyStats.test.ts`). They reshape the flat `finishedSessionSets` /
 * `sessionSetsDetailed` query results into per-session summaries, all-time
 * totals, and a per-exercise breakdown. Stats stay derived, never cached.
 */
import type { ExerciseType } from '@/evolu/schema'
import { totalVolumeKg } from '@/shared/utils/workoutStats'
import { monthKey } from '@/shared/utils/dates'
import { summarizeSession, type SessionSummary, type SummarySetInput } from './sessionSummary'

/** A completed set tagged with the session it belongs to. */
export interface SessionTaggedSet extends SummarySetInput {
  readonly sessionId: string | null
}

/** Per-session `SessionSummary`, keyed by session id. */
export const sessionSummaries = (
  rows: readonly SessionTaggedSet[],
): Map<string, SessionSummary> => {
  const bySession = new Map<string, SessionTaggedSet[]>()
  for (const r of rows) {
    if (r.sessionId == null) continue
    const group = bySession.get(r.sessionId)
    if (group) group.push(r)
    else bySession.set(r.sessionId, [r])
  }
  const summaries = new Map<string, SessionSummary>()
  for (const [sessionId, group] of bySession) {
    summaries.set(sessionId, summarizeSession(group))
  }
  return summaries
}

/** A finished session with the start time we group/count by. */
export interface DatedSession {
  readonly startedAt: string | null
}

/** All-time aggregate stats for the History header. */
export interface HistoryTotals {
  readonly workouts: number
  readonly thisMonth: number
  readonly volumeKg: number
  readonly sets: number
}

/**
 * Roll up history into header stats. `sessions` is authoritative for the
 * workout / this-month counts (a session with no completed sets still counts);
 * `rows` drives total volume and set count. `now` is injectable for testing.
 */
export const historyTotals = (
  sessions: readonly DatedSession[],
  rows: readonly { readonly weightKg: number | null; readonly reps: number | null }[],
  now: Date = new Date(),
): HistoryTotals => {
  const currentMonth = monthKey(now)
  const thisMonth = sessions.filter(
    (s) => s.startedAt != null && monthKey(s.startedAt) === currentMonth,
  ).length
  return {
    workouts: sessions.length,
    thisMonth,
    volumeKg: totalVolumeKg(rows),
    sets: rows.length,
  }
}

/** A set as rendered in the session detail breakdown. */
export interface DetailSet {
  readonly id: string
  readonly orderIndex: number | null
  readonly weightKg: number | null
  readonly reps: number | null
  readonly addedWeightKg: number | null
  readonly assistanceWeightKg: number | null
  readonly durationSec: number | null
  readonly distanceMeters: number | null
  readonly setType: string | null
}

/**
 * An exercise within a session detail row, with the exercise it belongs to.
 * Joined `exercise` columns are nullable per Evolu's join typing.
 */
export interface DetailRow extends DetailSet {
  readonly workoutExerciseId: string
  readonly exerciseId: string | null
  readonly exerciseName: string | null
  readonly exerciseType: string | null
  readonly bodyPart: string | null
  readonly primaryPhotoId: string | null
}

/** One exercise's contribution to a session: its sets, in order. */
export interface SessionExerciseGroup {
  readonly workoutExerciseId: string
  readonly exerciseId: string | null
  readonly name: string
  readonly type: ExerciseType
  readonly bodyPart: string | null
  readonly primaryPhotoId: string | null
  readonly sets: DetailSet[]
}

/**
 * Group a session's completed sets by exercise, preserving the query's exercise
 * order (rows arrive ordered by exercise then set). Each group keeps its sets in
 * set order.
 */
export const groupExerciseSets = (rows: readonly DetailRow[]): SessionExerciseGroup[] => {
  const groups: SessionExerciseGroup[] = []
  const byId = new Map<string, SessionExerciseGroup>()
  for (const r of rows) {
    let group = byId.get(r.workoutExerciseId)
    if (!group) {
      group = {
        workoutExerciseId: r.workoutExerciseId,
        exerciseId: r.exerciseId,
        name: r.exerciseName ?? 'Exercise',
        type: (r.exerciseType ?? 'strength') as ExerciseType,
        bodyPart: r.bodyPart,
        primaryPhotoId: r.primaryPhotoId,
        sets: [],
      }
      byId.set(r.workoutExerciseId, group)
      groups.push(group)
    }
    group.sets.push(r)
  }
  return groups
}
