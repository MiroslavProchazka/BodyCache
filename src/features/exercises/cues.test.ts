import { describe, expect, it } from 'vitest'
import { cuesFor, GENERIC_CUES } from './cues'

describe('cuesFor', () => {
  it('returns specific cues for a seeded exercise (case/space-insensitive)', () => {
    const cues = cuesFor({ name: 'Barbell Bench Press' })
    expect(cues).toHaveLength(5)
    expect(cues[0]).toMatch(/lie flat/i)
    // Matching is name-normalized, so spacing/case variations still hit.
    expect(cuesFor({ name: '  barbell   bench press ' })).toEqual(cues)
  })

  it('falls back to the generic list for user-created exercises', () => {
    expect(cuesFor({ name: 'My Custom Machine' })).toBe(GENERIC_CUES)
    expect(cuesFor({ name: '' })).toBe(GENERIC_CUES)
    expect(cuesFor({})).toBe(GENERIC_CUES)
  })
})
