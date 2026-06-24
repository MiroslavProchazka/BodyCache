/**
 * Set-type presentation + cycling. A `null` type is a normal working set; the
 * named types annotate warm-ups, drop sets and sets taken to failure. Pure and
 * UI-free (the tag/colors map is data); tested in `setTypes.test.ts`.
 */
import { SET_TYPES, type SetType } from '@/evolu/schema'

/** Narrow a stored `NonEmptyString100` (or null) to a `SetType` or null. */
export const narrowSetType = (value: string | null | undefined): SetType | null =>
  SET_TYPES.includes(value as SetType) ? (value as SetType) : null

/** Full label for menus/rows. */
export const SET_TYPE_LABEL: Record<SetType, string> = {
  warmup: 'Warm-up',
  drop: 'Drop set',
  failure: 'To failure',
}

/** Single-letter badge shown on compact set chips. */
export const SET_TYPE_SHORT: Record<SetType, string> = {
  warmup: 'W',
  drop: 'D',
  failure: 'F',
}

/** Tailwind classes for a set-type chip, tuned to the app palette. */
export const SET_TYPE_CLASS: Record<SetType, string> = {
  warmup: 'bg-[#007bc2]/20 text-[#7db8e6]',
  drop: 'bg-[#ec7e00]/18 text-[#f2a24e]',
  failure: 'bg-[#e61e49]/18 text-[#f2718f]',
}

/** Label for a normal (null) set, used by the cycling selector. */
export const NORMAL_LABEL = 'Normal'

/** Display label for any value, including the normal (null) set. */
export const setTypeLabel = (value: string | null | undefined): string => {
  const t = narrowSetType(value)
  return t ? SET_TYPE_LABEL[t] : NORMAL_LABEL
}

/**
 * Next type in the cycle used by the logger's tap selector:
 * Normal → Warm-up → Drop set → To failure → Normal.
 */
export const nextSetType = (current: SetType | null): SetType | null => {
  if (current === null) return SET_TYPES[0]
  const i = SET_TYPES.indexOf(current)
  return i === SET_TYPES.length - 1 ? null : SET_TYPES[i + 1]
}
