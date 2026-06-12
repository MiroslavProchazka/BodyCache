import { describe, expect, it } from 'vitest'
import {
  toDisplayWeight,
  formatWeight,
  formatWeightReps,
  formatWeightRepsCompact,
  formatVolume,
  formatDuration,
  formatDistance,
  formatSetSummary,
} from './units'

describe('toDisplayWeight', () => {
  it('rounds kg to one decimal place', () => {
    expect(toDisplayWeight(80, 'kg')).toBe(80)
    expect(toDisplayWeight(80.04, 'kg')).toBe(80)
    expect(toDisplayWeight(80.05, 'kg')).toBe(80.1)
    expect(toDisplayWeight(82.5, 'kg')).toBe(82.5)
  })

  it('converts kg to whole pounds', () => {
    expect(toDisplayWeight(80, 'lb')).toBe(176) // 80 × 2.20462 = 176.37
    expect(toDisplayWeight(100, 'lb')).toBe(220)
    expect(toDisplayWeight(0, 'lb')).toBe(0)
  })
})

describe('formatWeight', () => {
  it('appends the unit and trims trailing zeros', () => {
    expect(formatWeight(80, 'kg')).toBe('80 kg')
    expect(formatWeight(82.5, 'kg')).toBe('82.5 kg')
    expect(formatWeight(80, 'lb')).toBe('176 lb')
  })
})

describe('formatWeightReps', () => {
  it('spaces weight, unit and reps with a multiplication sign', () => {
    expect(formatWeightReps(80, 8, 'kg')).toBe('80 kg × 8')
    expect(formatWeightReps(80, 8, 'lb')).toBe('176 lb × 8')
  })
})

describe('formatWeightRepsCompact', () => {
  it('drops the space between weight and unit', () => {
    expect(formatWeightRepsCompact(80, 8, 'kg')).toBe('80kg × 8')
    expect(formatWeightRepsCompact(82.5, 5, 'kg')).toBe('82.5kg × 5')
  })
})

describe('formatVolume', () => {
  it('rounds and localizes (kg rounds whole; lb converts)', () => {
    expect(formatVolume(950, 'kg')).toBe('950')
    // Assert against the runtime locale rather than hard-coding a separator.
    expect(formatVolume(1500, 'kg')).toBe((1500).toLocaleString())
    expect(formatVolume(1000, 'lb')).toBe((2205).toLocaleString())
  })
})

describe('formatDuration', () => {
  it('shows seconds under a minute', () => {
    expect(formatDuration(45)).toBe('45s')
    expect(formatDuration(0)).toBe('0s')
  })

  it('shows m:ss at or above a minute, zero-padding seconds', () => {
    expect(formatDuration(60)).toBe('1:00')
    expect(formatDuration(65)).toBe('1:05')
    expect(formatDuration(3661)).toBe('61:01')
  })
})

describe('formatDistance', () => {
  it('shows metres below a kilometre', () => {
    expect(formatDistance(850)).toBe('850 m')
    expect(formatDistance(999)).toBe('999 m')
  })

  it('shows kilometres at or above 1000 m, trimming zeros', () => {
    expect(formatDistance(1000)).toBe('1 km')
    expect(formatDistance(1600)).toBe('1.6 km')
    expect(formatDistance(1500)).toBe('1.5 km')
  })
})

describe('formatSetSummary', () => {
  const empty = {
    weightKg: null,
    reps: null,
    addedWeightKg: null,
    assistanceWeightKg: null,
    durationSec: null,
    distanceMeters: null,
  }

  it('formats strength as weight × reps, with fallbacks', () => {
    expect(formatSetSummary({ ...empty, weightKg: 80, reps: 8 }, 'strength', 'kg')).toBe(
      '80 kg × 8',
    )
    expect(formatSetSummary({ ...empty, reps: 8 }, 'strength', 'kg')).toBe('8 reps')
    expect(formatSetSummary({ ...empty, weightKg: 80 }, 'strength', 'kg')).toBe('80 kg')
    expect(formatSetSummary(empty, 'strength', 'kg')).toBe('—')
  })

  it('honours the compact flag for strength', () => {
    expect(
      formatSetSummary({ ...empty, weightKg: 80, reps: 8 }, 'strength', 'kg', true),
    ).toBe('80kg × 8')
  })

  it('formats bodyweight reps with added / assistance weight', () => {
    expect(formatSetSummary({ ...empty, reps: 12 }, 'bodyweight', 'kg')).toBe('12 reps')
    expect(
      formatSetSummary({ ...empty, reps: 12, addedWeightKg: 10 }, 'bodyweight', 'kg'),
    ).toBe('12 reps +10 kg')
    expect(
      formatSetSummary(
        { ...empty, reps: 8, assistanceWeightKg: 15 },
        'bodyweight',
        'kg',
      ),
    ).toBe('8 reps −15 kg')
    expect(formatSetSummary(empty, 'bodyweight', 'kg')).toBe('—')
  })

  it('formats timed and distance sets', () => {
    expect(formatSetSummary({ ...empty, durationSec: 65 }, 'timed', 'kg')).toBe('1:05')
    expect(formatSetSummary(empty, 'timed', 'kg')).toBe('—')
    expect(
      formatSetSummary({ ...empty, distanceMeters: 1600, durationSec: 600 }, 'distance', 'kg'),
    ).toBe('1.6 km · 10:00')
    expect(formatSetSummary({ ...empty, distanceMeters: 500 }, 'distance', 'kg')).toBe('500 m')
    expect(formatSetSummary(empty, 'distance', 'kg')).toBe('—')
  })
})
