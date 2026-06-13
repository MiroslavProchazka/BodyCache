/**
 * Maps an exercise to the muscle group its BodyMap should highlight. The app's
 * `bodyPart` is broad (chest, back, legs, …); we refine it with the exercise
 * name (e.g. "Triceps Pushdown" under Arms → triceps, "Leg Curl" → hamstrings).
 *
 * Pure, name-aware mapping — kept independent from the UI so it can be tested.
 */
import { humanize } from '@/shared/utils/bodyParts'
import type { BodyView, MuscleKey } from './BodyMap'

export interface BodyTarget {
  /** Muscle to highlight on the map (`''` = no highlight). */
  muscle: MuscleKey
  /** Which figure best shows that muscle. */
  view: BodyView
  /** Human label for the "Targets · …" pill. */
  label: string
}

/** Derive the muscle highlight + label for an exercise. */
export function bodyFor(ex: { name?: string | null; bodyPart?: string | null }): BodyTarget {
  const n = (ex.name ?? '').toLowerCase()
  const p = ex.bodyPart

  switch (p) {
    case 'chest':
      return { muscle: 'chest', view: 'front', label: 'Chest' }
    case 'shoulders':
      return { muscle: 'shoulders', view: 'front', label: 'Shoulders' }
    case 'core':
      return { muscle: 'abs', view: 'front', label: 'Core' }
    case 'back':
      return { muscle: 'back', view: 'back', label: 'Back & lats' }
    case 'arms':
      if (/tricep|pushdown|dip|skull|extension/.test(n))
        return { muscle: 'triceps', view: 'back', label: 'Triceps' }
      return { muscle: 'biceps', view: 'front', label: 'Biceps' }
    case 'legs':
      if (/calf|calve/.test(n)) return { muscle: 'calves', view: 'back', label: 'Calves' }
      if (/curl|ham/.test(n)) return { muscle: 'hamstrings', view: 'back', label: 'Hamstrings' }
      if (/glute|hip|abduct|thrust/.test(n))
        return { muscle: 'glutes', view: 'back', label: 'Glutes' }
      return { muscle: 'quads', view: 'front', label: 'Quads' }
    default:
      // cardio / full_body / other / unset — no specific highlight.
      return { muscle: '', view: 'front', label: humanize(p) }
  }
}
