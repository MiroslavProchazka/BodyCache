import { describe, expect, it } from 'vitest'
import { cuesFor, stepsFromNotes, GENERIC_CUES } from './cues'

describe('stepsFromNotes', () => {
  it('splits an instruction blob into one step per sentence', () => {
    const steps = stepsFromNotes(
      'Adjust the machine to your desired weight. Place your hands on the bars. Pull your body up!',
    )
    expect(steps).toEqual([
      'Adjust the machine to your desired weight.',
      'Place your hands on the bars.',
      'Pull your body up!',
    ])
  })

  it('returns an empty array for blank input', () => {
    expect(stepsFromNotes('')).toEqual([])
    expect(stepsFromNotes('   ')).toEqual([])
  })
})

describe('cuesFor', () => {
  it('prefers the exercise notes, split into steps', () => {
    const cues = cuesFor({
      name: 'Assisted Parallel Close Grip Pull-up',
      notes: 'Grip the parallel bars. Pull your chin above the bars. Lower under control.',
    })
    expect(cues).toEqual([
      'Grip the parallel bars.',
      'Pull your chin above the bars.',
      'Lower under control.',
    ])
  })

  it('falls back to curated cues when notes are absent', () => {
    const cues = cuesFor({ name: 'Barbell Bench Press' })
    expect(cues).toHaveLength(5)
    expect(cues[0]).toMatch(/lie flat/i)
    // Matching is name-normalized, so spacing/case variations still hit.
    expect(cuesFor({ name: '  barbell   bench press ' })).toEqual(cues)
    // Blank notes are ignored, not treated as a single empty step.
    expect(cuesFor({ name: 'Barbell Bench Press', notes: '   ' })).toEqual(cues)
  })

  it('falls back to the generic list for user-created exercises', () => {
    expect(cuesFor({ name: 'My Custom Machine' })).toBe(GENERIC_CUES)
    expect(cuesFor({ name: '' })).toBe(GENERIC_CUES)
    expect(cuesFor({})).toBe(GENERIC_CUES)
  })
})
