import { describe, it, expect } from 'vitest'
import { narrowGender, genderLabel, formatProfileMeta } from './profile'

describe('narrowGender', () => {
  it('passes through valid genders', () => {
    expect(narrowGender('male')).toBe('male')
    expect(narrowGender('female')).toBe('female')
    expect(narrowGender('other')).toBe('other')
  })

  it('falls back to prefer_not_to_say for unknown/empty values', () => {
    expect(narrowGender('alien')).toBe('prefer_not_to_say')
    expect(narrowGender(null)).toBe('prefer_not_to_say')
    expect(narrowGender(undefined)).toBe('prefer_not_to_say')
  })
})

describe('genderLabel', () => {
  it('humanizes the value', () => {
    expect(genderLabel('male')).toBe('Male')
    expect(genderLabel('prefer_not_to_say')).toBe('Prefer not to say')
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
