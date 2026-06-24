/**
 * Aggregates finished-session sets into the Home "This week" momentum card:
 * per-weekday training volume (Mon→Sun), the week's total volume, and how many
 * days were trained (the streak figure). Pure — UI- and Evolu-free, so it can
 * be unit-tested (see `weeklyMomentum.test.ts`). Weights stay in kg; the unit
 * conversion is the caller's job.
 */

/** One completed set, with the start time of the session it belongs to. */
export interface WeekSetInput {
  readonly sessionStartedAt: string | null
  readonly weightKg: number | null
  readonly reps: number | null
}

/** A single day column in the weekly bar chart (Monday-first). */
export interface WeekDay {
  /** Single-letter weekday label: M T W T F S S. */
  readonly label: string
  /** Training volume on that day, in kg. */
  readonly volumeKg: number
  /** Whether anything was logged that day. */
  readonly active: boolean
  /** Whether the column is today. */
  readonly isToday: boolean
}

export interface WeeklyMomentum {
  /** Seven day columns, Monday → Sunday. */
  readonly days: WeekDay[]
  /** Total volume across the week, in kg. */
  readonly totalKg: number
  /** Count of days trained this week (the streak figure). */
  readonly activeDays: number
}

/** Mon-first single-letter labels. */
const LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'] as const
const DAY_MS = 86_400_000

/** Monday 00:00 (local) of the week containing `now`. */
export const startOfWeek = (now: Date): Date => {
  const d = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const mondayIndex = (d.getDay() + 6) % 7 // Sun=6, Mon=0
  d.setDate(d.getDate() - mondayIndex)
  return d
}

/** Build the weekly momentum summary from this week's completed sets. */
export const weeklyMomentum = (
  sets: readonly WeekSetInput[],
  now: Date = new Date(),
): WeeklyMomentum => {
  const weekStart = startOfWeek(now)
  const vols = [0, 0, 0, 0, 0, 0, 0]

  for (const s of sets) {
    if (!s.sessionStartedAt || s.weightKg == null || s.reps == null) continue
    const at = new Date(s.sessionStartedAt)
    const day = new Date(at.getFullYear(), at.getMonth(), at.getDate())
    const idx = Math.round((day.getTime() - weekStart.getTime()) / DAY_MS)
    if (idx < 0 || idx > 6) continue
    vols[idx] += s.weightKg * s.reps
  }

  const todayIdx = (now.getDay() + 6) % 7
  const days: WeekDay[] = vols.map((v, i) => ({
    label: LABELS[i],
    volumeKg: v,
    active: v > 0,
    isToday: i === todayIdx,
  }))

  return {
    days,
    totalKg: vols.reduce((a, b) => a + b, 0),
    activeDays: vols.filter((v) => v > 0).length,
  }
}
