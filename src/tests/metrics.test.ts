import { describe, expect, it } from 'vitest'
import { calcSessionVolume, weeklyBuckets } from '../domain/metrics'

describe('metrics', () => {
  it('calculates session volume in kg', () => {
    const volume = calcSessionVolume([
      { reps: 5, weight: 100, unit: 'kg' },
      { reps: 8, weight: 225, unit: 'lb' }
    ])

    expect(Math.round(volume)).toBe(1316)
  })

  it('groups weekly volume buckets', () => {
    const result = weeklyBuckets([
      { weekStart: '2026-02-02', volume: 1000 },
      { weekStart: '2026-02-02', volume: 200 },
      { weekStart: '2026-01-26', volume: 400 }
    ])

    expect(result).toEqual([
      { weekStart: '2026-02-02', volume: 1200 },
      { weekStart: '2026-01-26', volume: 400 }
    ])
  })
})
