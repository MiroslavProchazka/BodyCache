import { describe, it, expect } from 'vitest'
import { hashSeed, avatarHue, avatarCells, randomSeed } from './avatar'

describe('hashSeed', () => {
  it('is deterministic for the same input', () => {
    expect(hashSeed('alex')).toBe(hashSeed('alex'))
  })

  it('differs for different inputs', () => {
    expect(hashSeed('alex')).not.toBe(hashSeed('sam'))
  })

  it('returns an unsigned 32-bit integer', () => {
    const h = hashSeed('whatever')
    expect(h).toBeGreaterThanOrEqual(0)
    expect(h).toBeLessThanOrEqual(0xffffffff)
    expect(Number.isInteger(h)).toBe(true)
  })
})

describe('avatarHue', () => {
  it('is within 0–359 and stable per seed', () => {
    const hue = avatarHue('alex')
    expect(hue).toBeGreaterThanOrEqual(0)
    expect(hue).toBeLessThan(360)
    expect(avatarHue('alex')).toBe(hue)
  })
})

describe('avatarCells', () => {
  it('returns a 25-cell grid', () => {
    expect(avatarCells('alex')).toHaveLength(25)
  })

  it('is the same for the same seed and changes with the seed', () => {
    expect(avatarCells('alex')).toEqual(avatarCells('alex'))
    expect(avatarCells('alex')).not.toEqual(avatarCells('sam'))
  })

  it('is mirrored across the vertical axis', () => {
    const cells = avatarCells('mirror-me')
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 5; col++) {
        expect(cells[row * 5 + col]).toBe(cells[row * 5 + (4 - col)])
      }
    }
  })
})

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
