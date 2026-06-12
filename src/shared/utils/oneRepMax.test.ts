import { describe, it, expect } from 'vitest'
import { estimateOneRepMax, bestOneRepMax } from './oneRepMax'

describe('estimateOneRepMax', () => {
  it('returns the weight unchanged for a single rep', () => {
    expect(estimateOneRepMax({ weightKg: 100, reps: 1 })).toBe(100)
  })

  it('applies the Epley formula for multiple reps', () => {
    // 100 × (1 + 5/30) = 116.666… → 116.7
    expect(estimateOneRepMax({ weightKg: 100, reps: 5 })).toBe(116.7)
    // 80 × (1 + 10/30) = 106.666… → 106.7
    expect(estimateOneRepMax({ weightKg: 80, reps: 10 })).toBe(106.7)
  })

  it('is null without a loaded rep effort', () => {
    expect(estimateOneRepMax({ weightKg: 0, reps: 5 })).toBeNull()
    expect(estimateOneRepMax({ weightKg: 100, reps: 0 })).toBeNull()
    expect(estimateOneRepMax({ weightKg: null, reps: null })).toBeNull()
  })
})

describe('bestOneRepMax', () => {
  it('picks the highest estimate across sets', () => {
    // 100×1 = 100 ; 90×5 = 105 ; 80×8 = 101.3 → best 105
    expect(
      bestOneRepMax([
        { weightKg: 100, reps: 1 },
        { weightKg: 90, reps: 5 },
        { weightKg: 80, reps: 8 },
      ]),
    ).toBe(105)
  })

  it('ignores non-loaded sets and returns null when none qualify', () => {
    expect(bestOneRepMax([{ weightKg: null, reps: 12 }, { weightKg: 0, reps: 0 }])).toBeNull()
  })
})
