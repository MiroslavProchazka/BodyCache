/**
 * Pure (DOM-free) helpers for "repeat this workout" — turning a finished
 * session's completed sets into the inputs used to instantiate a fresh live
 * session. The orchestration (loading rows, inserting the session/exercises/
 * sets) lives in `useRepeatWorkout`; this file keeps the data-shaping testable
 * in isolation, mirroring `plans/planToSession.ts`.
 */
import type { AddSetInput } from '@/evolu/mutations'
import { narrowSetType } from './setTypes'

/** The completed-set fields needed to seed a repeated set (subset of `exerciseSet`). */
export interface RepeatSetSource {
  readonly orderIndex: number | null
  readonly weightKg: number | null
  readonly reps: number | null
  readonly addedWeightKg: number | null
  readonly assistanceWeightKg: number | null
  readonly durationSec: number | null
  readonly distanceMeters: number | null
  readonly inclinePercent: number | null
  readonly speedKmh: number | null
  readonly resistanceLevel: number | null
  readonly rpe: number | null
  readonly setType: string | null
}

/**
 * Convert a finished session's completed set into a fresh session-set input.
 * Every metric is copied verbatim, but the set is left incomplete
 * (`completedAt: null`) so it shows up as a pre-filled "ghost" the user
 * confirms or edits in the logger — repeating recalls what you did, it doesn't
 * re-log it for you.
 */
export const repeatSetToSetInput = (s: RepeatSetSource, orderIndex: number): AddSetInput => ({
  orderIndex,
  completedAt: null,
  weightKg: s.weightKg ?? null,
  reps: s.reps ?? null,
  addedWeightKg: s.addedWeightKg ?? null,
  assistanceWeightKg: s.assistanceWeightKg ?? null,
  durationSec: s.durationSec ?? null,
  distanceMeters: s.distanceMeters ?? null,
  inclinePercent: s.inclinePercent ?? null,
  speedKmh: s.speedKmh ?? null,
  resistanceLevel: s.resistanceLevel ?? null,
  rpe: s.rpe ?? null,
  setType: narrowSetType(s.setType),
})
