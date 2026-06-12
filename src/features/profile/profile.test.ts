import { describe, it, expect } from 'vitest'
import { narrowGender, genderLabel, formatProfileMeta } from './profile'

describe('narrowGender', () => {
  it('passes through valid genders', () => {
    expect(narrowGender('male')).toBe('male')
    expect(narrowGender('female')).toBe('female')
    expect(narrowGender('other')).toBe('other')
  })

  it('falls back to other for unknown/empty values', () => {
    expect(narrowGender('alien')).toBe('other')
    expect(narrowGender(null)).toBe('other')
    expect(narrowGender(undefined)).toBe('other')
    // Legacy rows from before the option was removed narrow to "other".
    expect(narrowGender('prefer_not_to_say')).toBe('other')
  })
})

describe('genderLabel', () => {
  it('labels the stored values as Men / Women / Other', () => {
    expect(genderLabel('male')).toBe('Men')
    expect(genderLabel('female')).toBe('Women')
    expect(genderLabel('other')).toBe('Other')
  })
})

describe('formatProfileMeta', () => {
  it('joins age, height and weight in the active unit', () => {
    expect(formatProfileMeta({ age: 28, heightCm: 178, weightKg: 72 }, 'kg')).toBe(
      '28 yrs · 178 cm · 72 kg',
    )
  })

  it('converts weight to pounds', () => {
    expect(formatProfileMeta({ age: 30, heightCm: 180, weightKg: 100 }, 'lb')).toBe(
      '30 yrs · 180 cm · 220 lb',
    )
  })

  it('drops non-positive fields', () => {
    expect(formatProfileMeta({ age: 0, heightCm: 0, weightKg: 72 }, 'kg')).toBe('72 kg')
  })
})
