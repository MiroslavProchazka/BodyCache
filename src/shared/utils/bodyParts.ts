/**
 * Body-part presentation helpers. Each body part has a signature tint used for
 * the photo placeholder "shape mask" tiles (see design tokens). The tile fill
 * is a soft gradient of the tint; the glyph uses the solid tint.
 */
import type { BodyPart } from '@/evolu/schema'

const TINTS: Record<BodyPart, string> = {
  chest: '#494fdf',
  back: '#00a87e',
  legs: '#ec7e00',
  shoulders: '#007bc2',
  arms: '#e61e49',
  core: '#428619',
  cardio: '#007bc2',
  full_body: '#494fdf',
  other: '#5c5e60',
}

/** Solid tint for a body part (defaults to neon). */
export const tintFor = (part?: string | null): string =>
  (part && TINTS[part as BodyPart]) || '#494fdf'

/** Soft gradient fill used behind the glyph on placeholder tiles. */
export const tileGradient = (part?: string | null): string => {
  const t = tintFor(part)
  return `linear-gradient(135deg, ${t}33, ${t}0D)`
}

/** "full_body" → "Full body" for labels. */
export const humanize = (value?: string | null): string => {
  if (!value) return ''
  const s = value.replace(/_/g, ' ')
  return s.charAt(0).toUpperCase() + s.slice(1)
}

/** "chest · barbell"-style meta line; omits missing parts. */
export const metaLine = (
  bodyPart?: string | null,
  equipment?: string | null,
): string => [humanize(bodyPart), humanize(equipment)].filter(Boolean).join(' · ')
