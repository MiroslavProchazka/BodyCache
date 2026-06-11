import { describe, it, expect } from 'vitest'
import { totalVolumeKg, completedSetCount, formatElapsed } from './workoutStats'

describe('totalVolumeKg', () => {
  it('sums weight × reps for complete sets only', () => {
    expect(
      totalVolumeKg([
        { weightKg: 100, reps: 5 },
        { weightKg: 80, reps: 10 },
        { weightKg: null, reps: 8 },
        { weightKg: 50, reps: null },
      ]),
    ).toBe(100 * 5 + 80 * 10)
  })
  it('is zero for no sets', () => {
    expect(totalVolumeKg([])).toBe(0)
  })
})

describe('completedSetCount', () => {
  it('counts only sets with a completedAt', () => {
    expect(
      completedSetCount([
        { completedAt: '2026-01-01T00:00:00.000Z' },
        { completedAt: null },
        { completedAt: '2026-01-01T00:01:00.000Z' },
      ]),
    ).toBe(2)
  })
})

describe('formatElapsed', () => {
  const start = '2026-01-01T00:00:00.000Z'
  it('formats seconds under a minute', () => {
    expect(formatElapsed(start, '2026-01-01T00:00:45.000Z')).toBe('45s')
  })
  it('formats whole minutes under an hour', () => {
    expect(formatElapsed(start, '2026-01-01T00:12:30.000Z')).toBe('12m')
  })
  it('formats hours and zero-padded minutes', () => {
    expect(formatElapsed(start, '2026-01-01T01:05:00.000Z')).toBe('1h 05m')
  })
  it('never goes negative', () => {
    expect(formatElapsed('2026-01-01T01:00:00.000Z', start)).toBe('0s')
  })
})
