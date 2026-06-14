/**
 * Aggregates an in-progress workout into a per-muscle intensity map for the
 * live distribution body map. Primary muscles get full credit per logged set;
 * secondary muscles get 40%. Four "points" on a muscle fills it to full neon.
 *
 * Pure — UI- and Evolu-free, so it can be unit-tested (see the test file).
 */
import type { MuscleLevels } from './BodyMap'
import { bodyFor, MUSCLE_LABELS, type Muscle } from './muscleMap'

/** One logged exercise: enough to map it to muscles and count its sets. */
export interface DistInput {
  name?: string | null
  bodyPart?: string | null
  /** Number of sets logged for this exercise so far. */
  sets: number
}

export interface MuscleDistribution {
  /** Capped 0..1 intensity per muscle — feeds `<BodyMap levels>`. */
  levels: MuscleLevels
  /** Set counts on *directly* (primary) worked muscles — feeds the legend. */
  direct: Partial<Record<Muscle, number>>
  /** Raw weighted points per muscle (primary 1×, secondary 0.4×). */
  pts: Partial<Record<Muscle, number>>
}

/** Points needed on a muscle to fill it to full neon. */
const FULL_AT = 4

const add = (acc: Partial<Record<Muscle, number>>, k: Muscle, n: number): void => {
  acc[k] = (acc[k] ?? 0) + n
}

/** Build the per-muscle distribution from the workout's logged exercises. */
export function muscleDistribution(entries: readonly DistInput[]): MuscleDistribution {
  const pts: Partial<Record<Muscle, number>> = {}
  const direct: Partial<Record<Muscle, number>> = {}

  for (const en of entries) {
    const b = bodyFor(en)
    const ns = en.sets
    if (ns <= 0) continue
    if (b.muscle) {
      add(pts, b.muscle, ns)
      add(direct, b.muscle, ns)
    }
    for (const m of b.secondaries) add(pts, m, ns * 0.4)
  }

  const levels: MuscleLevels = {}
  for (const k of Object.keys(pts) as Muscle[]) {
    levels[k] = Math.min(1, (pts[k] ?? 0) / FULL_AT)
  }

  return { levels, direct, pts }
}

export interface LegendItem {
  muscle: Muscle
  label: string
  sets: number
  /** 0..1 intensity, for the pill dot opacity. */
  intensity: number
}

/**
 * Legend pills for the distribution card: one per *directly* worked muscle,
 * sorted by set count desc. Intensity drives each pill dot's opacity.
 */
export function distributionLegend(dist: MuscleDistribution): LegendItem[] {
  return (Object.keys(dist.direct) as Muscle[])
    .sort((a, b) => (dist.direct[b] ?? 0) - (dist.direct[a] ?? 0))
    .map((muscle) => ({
      muscle,
      label: MUSCLE_LABELS[muscle],
      sets: dist.direct[muscle] ?? 0,
      intensity: Math.min(1, (dist.pts[muscle] ?? 0) / FULL_AT),
    }))
}
