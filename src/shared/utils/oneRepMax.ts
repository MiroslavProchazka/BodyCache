/**
 * Estimated one-rep max (1RM) — a v2 stat for loaded exercises.
 *
 * Uses the Epley formula (`w × (1 + reps/30)`), the common gym-app default. A
 * single rep returns the lifted weight unchanged. This is an *estimate* to jog
 * memory and motivate, not a coaching prescription — BodyCache is a memory aid.
 */

/** Just the fields a 1RM estimate needs. */
export interface OneRepMaxInput {
  readonly weightKg: number | null
  readonly reps: number | null
}

/**
 * Epley estimate in kg, or null when the set isn't a loaded rep effort
 * (missing/zero weight or reps). Rounded to 0.1 kg.
 */
export const estimateOneRepMax = (set: OneRepMaxInput): number | null => {
  const weight = set.weightKg ?? 0
  const reps = set.reps ?? 0
  if (weight <= 0 || reps <= 0) return null
  if (reps === 1) return Math.round(weight * 10) / 10
  return Math.round(weight * (1 + reps / 30) * 10) / 10
}

/** The best (highest) estimated 1RM across a list of sets, or null if none qualify. */
export const bestOneRepMax = (sets: readonly OneRepMaxInput[]): number | null => {
  let best: number | null = null
  for (const set of sets) {
    const est = estimateOneRepMax(set)
    if (est != null && (best == null || est > best)) best = est
  }
  return best
}
