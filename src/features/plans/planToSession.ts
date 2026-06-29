/**
 * Pure (DOM-free) helpers for turning a plan's target sets into the inputs used
 * to instantiate a live workout session. The orchestration (loading plan rows,
 * inserting the session/exercises/sets) lives in `useBodyCacheMutations`; this
 * file keeps the data-shaping testable in isolation.
 */
import type { AddSetInput } from '@/evolu/mutations'
import { narrowSetType } from '@/features/workouts/setTypes'

/** The plan-set fields needed to seed a session set (subset of `planSet`). */
export interface PlanSetSource {
  readonly orderIndex: number | null
  readonly weightKg: number | null
  readonly reps: number | null
  readonly addedWeightKg: number | null
  readonly durationSec: number | null
  readonly distanceMeters: number | null
  readonly setType: string | null
}

/**
 * Convert a plan's target set into a session set input. The set is left
 * incomplete (`completedAt: null`) so it shows up as a pre-filled "ghost"
 * target the user confirms or edits in the logger — a plan prescribes, it
 * doesn't log.
 */
export const planSetToSetInput = (s: PlanSetSource, orderIndex: number): AddSetInput => ({
  orderIndex,
  completedAt: null,
  weightKg: s.weightKg ?? null,
  reps: s.reps ?? null,
  addedWeightKg: s.addedWeightKg ?? null,
  durationSec: s.durationSec ?? null,
  distanceMeters: s.distanceMeters ?? null,
  setType: narrowSetType(s.setType),
})

/** Ascending by `orderIndex` (nulls treated as 0); stable copy, never mutates. */
export const byOrderIndex = <T extends { readonly orderIndex: number | null }>(
  rows: readonly T[],
): T[] => [...rows].sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0))

/**
 * The next free `orderIndex` to append at: one past the current maximum, or 0
 * when empty. Using the max (not the row count) keeps appends unique even after
 * a middle row was removed — row count could otherwise collide with an existing
 * index and break the editor's swap-based reorder.
 */
export const nextOrderIndex = (rows: readonly { readonly orderIndex: number | null }[]): number =>
  rows.reduce((max, r) => Math.max(max, (r.orderIndex ?? 0) + 1), 0)
