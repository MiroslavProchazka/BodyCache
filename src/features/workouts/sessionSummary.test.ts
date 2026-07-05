import { describe, expect, it } from 'vitest'
import {
  exerciseBreakdown,
  summarizeSession,
  type BreakdownSetInput,
  type SummarySetInput,
} from './sessionSummary'

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

const bset = (over: Partial<BreakdownSetInput>): BreakdownSetInput => ({
  exerciseId: 'a',
  exerciseName: 'Bench press',
  weightKg: null,
  ...over,
})

describe('exerciseBreakdown', () => {
  it('is empty for no sets', () => {
    expect(exerciseBreakdown([])).toEqual([])
  })

  it('groups sets per exercise in first-seen order with set counts and top weight', () => {
    const result = exerciseBreakdown([
      bset({ exerciseId: 'a', exerciseName: 'Bench press', weightKg: 70 }),
      bset({ exerciseId: 'a', exerciseName: 'Bench press', weightKg: 72.5 }),
      bset({ exerciseId: 'b', exerciseName: 'Squat', weightKg: 100 }),
      bset({ exerciseId: 'a', exerciseName: 'Bench press', weightKg: 60 }),
    ])
    expect(result).toEqual([
      { exerciseId: 'a', name: 'Bench press', setCount: 3, topWeightKg: 72.5 },
      { exerciseId: 'b', name: 'Squat', setCount: 1, topWeightKg: 100 },
    ])
  })

  it('leaves top weight null for a weightless exercise and ignores id-less rows', () => {
    const result = exerciseBreakdown([
      bset({ exerciseId: 'p', exerciseName: 'Plank', weightKg: null }),
      bset({ exerciseId: null }),
    ])
    expect(result).toEqual([{ exerciseId: 'p', name: 'Plank', setCount: 1, topWeightKg: null }])
  })
})
