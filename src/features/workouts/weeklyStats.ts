/**
 * Derived Home/Today figures layered on top of `finishedSessionSets` (the same
 * query the weekly bar chart reads): week-over-week volume delta, the count of
 * exercises that hit a personal record this week, and a 7-day muscle split.
 *
 * Pure — UI- and Evolu-free, so it can be unit-tested (see `weeklyStats.test.ts`).
 * Volume follows the app convention `weightKg × reps`; weights stay in kg.
 */
import type { ExerciseType } from '@/evolu/schema'
import {
  bestSet,
  isPersonalRecord,
  workingSets,
  type MetricSet,
} from '@/shared/utils/exerciseStats'
import { startOfWeek } from './weeklyMomentum'

/** A completed set with the metadata needed for the weekly derivations. */
export interface WeekStatSet extends MetricSet {
  readonly setType: string | null
  readonly exerciseId: string | null
  readonly exerciseType: string | null
  readonly bodyPart: string | null
  readonly sessionStartedAt: string | null
}

const volumeOf = (s: WeekStatSet): number =>
  s.weightKg != null && s.reps != null ? s.weightKg * s.reps : 0

/** Local-midnight date `n` days offset from `d` (DST-safe via date components). */
const addDays = (d: Date, n: number): Date =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate() + n)

/** Sum `weightKg × reps` for sets whose session started in `[start, end)`. */
const rangeVolumeKg = (sets: readonly WeekStatSet[], start: Date, end: Date): number => {
  let sum = 0
  for (const s of sets) {
    if (!s.sessionStartedAt) continue
    const t = new Date(s.sessionStartedAt).getTime()
    if (t >= start.getTime() && t < end.getTime()) sum += volumeOf(s)
  }
  return sum
}

export interface WeekOverWeek {
  /** This week's total volume, in kg. */
  readonly thisWeekKg: number
  /** Last week's total volume, in kg. */
  readonly lastWeekKg: number
  /** Rounded percent change vs. last week; `null` when there's no baseline. */
  readonly pct: number | null
}

/** This-week vs. previous-week training volume, for the trend chip. */
export const weekOverWeek = (sets: readonly WeekStatSet[], now: Date = new Date()): WeekOverWeek => {
  const thisStart = startOfWeek(now)
  const prevStart = startOfWeek(addDays(thisStart, -1))
  const thisWeekKg = rangeVolumeKg(sets, thisStart, addDays(thisStart, 7))
  const lastWeekKg = rangeVolumeKg(sets, prevStart, thisStart)
  const pct = lastWeekKg > 0 ? Math.round(((thisWeekKg - lastWeekKg) / lastWeekKg) * 100) : null
  return { thisWeekKg, lastWeekKg, pct }
}

/**
 * How many exercises set a (weighted) personal record this week: an exercise's
 * best working set from a session that started this week strictly beats its
 * best from every earlier session. Mirrors `sessionPersonalRecords`, scoped to
 * the current week rather than a single session.
 */
export const prsThisWeek = (sets: readonly WeekStatSet[], now: Date = new Date()): number => {
  const weekStart = startOfWeek(now).getTime()
  const byExercise = new Map<string, WeekStatSet[]>()
  for (const s of sets) {
    if (!s.exerciseId) continue
    const group = byExercise.get(s.exerciseId)
    if (group) group.push(s)
    else byExercise.set(s.exerciseId, [s])
  }

  let count = 0
  for (const [, group] of byExercise) {
    const type = (group.find((s) => s.exerciseType)?.exerciseType ?? 'strength') as ExerciseType
    const working = workingSets(group)
    const startedAt = (s: WeekStatSet) => (s.sessionStartedAt ? new Date(s.sessionStartedAt).getTime() : 0)
    const current = working.filter((s) => s.sessionStartedAt && startedAt(s) >= weekStart)
    const prior = working.filter((s) => s.sessionStartedAt && startedAt(s) < weekStart)
    if (current.length === 0 || prior.length === 0) continue

    const currentBest = bestSet(current, type)
    if (!currentBest || (currentBest.weightKg ?? 0) <= 0) continue // weighted PRs only
    if (isPersonalRecord(currentBest, prior, type)) count += 1
  }
  return count
}

export interface MuscleSplitItem {
  /** Body-part key (schema `BODY_PARTS` value). */
  readonly key: string
  /** Display label, e.g. "Chest". */
  readonly label: string
  /** Share of the window's volume, 0–100. */
  readonly percent: number
  /** Strongest bars (top half) render solid `neon`; the rest lighter `brand`. */
  readonly strong: boolean
}

const BODY_PART_LABELS: Record<string, string> = {
  chest: 'Chest',
  back: 'Back',
  legs: 'Legs',
  shoulders: 'Shoulders',
  arms: 'Arms',
  core: 'Core',
  cardio: 'Cardio',
  full_body: 'Full body',
  other: 'Other',
}

/**
 * Volume share by body part over the trailing 7 days (today inclusive),
 * highest first, capped at `limit` bars. Percentages are of the whole window's
 * volume, so a truncated tail reads honestly as "< 100%".
 */
export const muscleSplit7Days = (
  sets: readonly WeekStatSet[],
  now: Date = new Date(),
  limit = 6,
): MuscleSplitItem[] => {
  const since = addDays(new Date(now.getFullYear(), now.getMonth(), now.getDate()), -6).getTime()
  const totals = new Map<string, number>()
  for (const s of sets) {
    if (!s.sessionStartedAt) continue
    if (new Date(s.sessionStartedAt).getTime() < since) continue
    const key = s.bodyPart ?? 'other'
    totals.set(key, (totals.get(key) ?? 0) + volumeOf(s))
  }

  const entries = [...totals.entries()].filter(([, v]) => v > 0).sort((a, b) => b[1] - a[1])
  const total = entries.reduce((sum, [, v]) => sum + v, 0)
  if (total <= 0) return []

  const top = entries.slice(0, limit)
  const strongCount = Math.ceil(top.length / 2)
  return top.map(([key, v], i) => ({
    key,
    label: BODY_PART_LABELS[key] ?? key,
    percent: (v / total) * 100,
    strong: i < strongCount,
  }))
}
