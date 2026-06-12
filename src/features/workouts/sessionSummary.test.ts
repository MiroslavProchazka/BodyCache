import { describe, expect, it } from 'vitest'
import { summarizeSession, type SummarySetInput } from './sessionSummary'

const set = (over: Partial<SummarySetInput>): SummarySetInput => ({
  exerciseId: 'ex1',
  bodyPart: 'legs',
  weightKg: null,
  reps: null,
  ...over,
})

describe('summarizeSession', () => {
  it('returns zeroed totals for an empty session', () => {
    const s = summarizeSession([])
    expect(s.exerciseCount).toBe(0)
    expect(s.setCount).toBe(0)
    expect(s.volumeKg).toBe(0)
    expect(typeof s.name).toBe('string')
  })

  it('counts distinct exercises and all set rows', () => {
    const s = summarizeSession([
      set({ exerciseId: 'a' }),
      set({ exerciseId: 'a' }),
      set({ exerciseId: 'b' }),
    ])
    expect(s.exerciseCount).toBe(2)
    expect(s.setCount).toBe(3)
  })

  it('sums weight × reps only when both are present', () => {
    const s = summarizeSession([
      set({ weightKg: 80, reps: 8 }), // 640
      set({ weightKg: 100, reps: 5 }), // 500
      set({ weightKg: 60, reps: null }), // ignored
      set({ weightKg: null, reps: 10 }), // ignored
    ])
    expect(s.volumeKg).toBe(1140)
  })

  it('derives the workout name from trained body parts', () => {
    const s = summarizeSession([set({ bodyPart: 'legs' }), set({ bodyPart: 'legs' })])
    expect(s.name).toBe('Leg day')
  })
})
