import { describe, expect, it } from 'vitest'
import { tintFor, tileGradient, humanize, metaLine } from './bodyParts'

describe('tintFor', () => {
  it('returns the body part tint', () => {
    expect(tintFor('legs')).toBe('#F79D69')
    expect(tintFor('back')).toBe('#9E8EF1')
  })

  it('falls back to neon for unknown or missing parts', () => {
    expect(tintFor(null)).toBe('#60E198')
    expect(tintFor(undefined)).toBe('#60E198')
    expect(tintFor('nonsense')).toBe('#60E198')
  })
})

describe('tileGradient', () => {
  it('builds a linear gradient from the part tint', () => {
    const g = tileGradient('legs')
    expect(g).toContain('linear-gradient')
    expect(g).toContain('#F79D69')
  })
})

describe('humanize', () => {
  it('replaces underscores and capitalizes', () => {
    expect(humanize('full_body')).toBe('Full body')
    expect(humanize('chest')).toBe('Chest')
  })

  it('returns empty string for missing values', () => {
    expect(humanize(null)).toBe('')
    expect(humanize(undefined)).toBe('')
    expect(humanize('')).toBe('')
  })
})

describe('metaLine', () => {
  it('joins present parts with a middot', () => {
    expect(metaLine('chest', 'barbell')).toBe('Chest · Barbell')
  })

  it('omits missing parts', () => {
    expect(metaLine('chest', null)).toBe('Chest')
    expect(metaLine(null, 'cable')).toBe('Cable')
    expect(metaLine(null, null)).toBe('')
  })
})
