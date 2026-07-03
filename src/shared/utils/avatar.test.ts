import { describe, it, expect } from 'vitest'
import { randomSeed } from './avatar'

describe('randomSeed', () => {
  it('produces a non-empty string within 100 chars', () => {
    const s = randomSeed()
    expect(s.length).toBeGreaterThan(0)
    expect(s.length).toBeLessThanOrEqual(100)
  })

  it('is practically unique across calls', () => {
    const seeds = new Set(Array.from({ length: 50 }, () => randomSeed()))
    expect(seeds.size).toBe(50)
  })
})
