/**
 * Maps an exercise to the muscle group(s) its BodyMap should highlight. The
 * app's `bodyPart` is broad (chest, back, legs, …); we refine it with the
 * exercise name (e.g. "Triceps Pushdown" under Arms → triceps, "Leg Curl" →
 * hamstrings). Each mapping also names the *secondary* muscles a movement
 * recruits so the detail hero and live distribution can light them up dimmer.
 *
 * Pure, name-aware mapping — kept independent from the UI so it can be tested.
 */
import { humanize } from '@/shared/utils/bodyParts'
import type { BodyView, MuscleKey } from './BodyMap'

/** A non-empty muscle key (everything except the `''` "no highlight" value). */
export type Muscle = Exclude<MuscleKey, ''>

/** Human labels for each muscle key (legend pills, etc.). */
export const MUSCLE_LABELS: Record<Muscle, string> = {
  chest: 'Chest',
  shoulders: 'Shoulders',
  back: 'Back',
  biceps: 'Biceps',
  triceps: 'Triceps',
  abs: 'Core',
  glutes: 'Glutes',
  quads: 'Quads',
  hamstrings: 'Hamstrings',
  calves: 'Calves',
}

export interface BodyTarget {
  /** Primary muscle to highlight on the map (`''` = no highlight). */
  muscle: MuscleKey
  /** Which figure best shows that muscle. */
  view: BodyView
  /** Human label for the "Primary · …" pill. */
  label: string
  /** Secondary muscles, highlighted dimmer (and credited 40% in the live map). */
  secondaries: Muscle[]
  /** Human label for the "Also · …" pill. Empty when there are no secondaries. */
  secondaryLabel: string
}

const mk = (
  muscle: MuscleKey,
  view: BodyView,
  label: string,
  secondaries: Muscle[] = [],
  secondaryLabel = '',
): BodyTarget => ({ muscle, view, label, secondaries, secondaryLabel })

/** Derive the muscle highlight + label(s) for an exercise. */
export function bodyFor(ex: { name?: string | null; bodyPart?: string | null }): BodyTarget {
  const n = (ex.name ?? '').toLowerCase()
  const p = ex.bodyPart

  switch (p) {
    case 'chest':
      return mk('chest', 'front', 'Chest', ['shoulders', 'triceps'], 'Front delts · triceps')
    case 'shoulders':
      return mk('shoulders', 'front', 'Shoulders', ['triceps'], 'Triceps')
    case 'core':
      return mk('abs', 'front', 'Core')
    case 'back':
      return mk('back', 'back', 'Back & lats', ['biceps'], 'Biceps · forearms')
    case 'arms':
      if (/tricep|pushdown|dip|skull|extension/.test(n)) return mk('triceps', 'back', 'Triceps')
      return mk('biceps', 'front', 'Biceps', [], 'Forearms')
    case 'legs':
      if (/calf|calve/.test(n)) return mk('calves', 'back', 'Calves')
      if (/curl|ham/.test(n))
        return mk('hamstrings', 'back', 'Hamstrings', ['glutes', 'calves'], 'Glutes · calves')
      if (/glute|hip|abduct|thrust/.test(n))
        return mk('glutes', 'back', 'Glutes', ['hamstrings'], 'Hamstrings')
      return mk('quads', 'front', 'Quads', ['glutes'], 'Glutes')
    default:
      // cardio / full_body / other / unset — no specific highlight.
      return mk('', 'front', humanize(p))
  }
}
