/**
 * Pure presentation helpers for the user profile. UI- and Evolu-free so they
 * can be unit-tested in isolation (see `profile.test.ts`).
 */
import { GENDERS, type Gender } from '@/evolu/schema'
import { formatWeight, type Unit } from '@/shared/utils/units'
import { humanize } from '@/shared/utils/bodyParts'

/** Narrow a stored `NonEmptyString100` gender to the `Gender` union. */
export const narrowGender = (value: string | null | undefined): Gender =>
  GENDERS.includes(value as Gender) ? (value as Gender) : 'prefer_not_to_say'

/** "Prefer not to say" etc. — human label for a gender value. */
export const genderLabel = (value: string | null | undefined): string =>
  humanize(narrowGender(value))

/** The metric fields a profile summary reads (Evolu columns are nullable). */
export interface ProfileMeta {
  readonly age: number | null
  readonly heightCm: number | null
  readonly weightKg: number | null
}

/**
 * Compact one-line profile summary in the active unit, e.g.
 * "28 yrs · 178 cm · 72 kg". Drops any field that isn't a positive number.
 */
export const formatProfileMeta = (profile: ProfileMeta, unit: Unit): string =>
  [
    (profile.age ?? 0) > 0 ? `${profile.age} yrs` : null,
    (profile.heightCm ?? 0) > 0 ? `${profile.heightCm} cm` : null,
    (profile.weightKg ?? 0) > 0 ? formatWeight(profile.weightKg as number, unit) : null,
  ]
    .filter(Boolean)
    .join(' · ')
