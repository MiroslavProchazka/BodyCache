import { describe, expect, it } from 'vitest'
import { sessionPersonalRecords, prBadgeLabel, type PrSetInput } from './sessionPrs'

const set = (over: Partial<PrSetInput>): PrSetInput => ({
  exerciseId: 'ex1',
  exerciseName: 'Bench Press',
  exerciseType: 'strength',
  setType: null,
  sessionId: 's1',
  weightKg: null,
  reps: null,
  addedWeightKg: null,
  assistanceWeightKg: null,
  durationSec: null,
  distanceMeters: null,
  ...over,
})

describe('sessionPersonalRecords', () => {
  it('flags an exercise whose current session beats its prior best', () => {
    const prs = sessionPersonalRecords('s2', [
      set({ sessionId: 's1', weightKg: 80, reps: 5 }),
      set({ sessionId: 's2', weightKg: 90, reps: 5 }),
    ])
    expect(prs).toEqual([{ exerciseId: 'ex1', name: 'Bench Press' }])
  })

  it('does not flag when the current session ties or trails the best', () => {
    expect(
      sessionPersonalRecords('s2', [
        set({ sessionId: 's1', weightKg: 90, reps: 5 }),
        set({ sessionId: 's2', weightKg: 90, reps: 5 }),
      ]),
    ).toEqual([])
  })

  it('never celebrates the first-ever session (nothing to beat)', () => {
    expect(
      sessionPersonalRecords('s1', [set({ sessionId: 's1', weightKg: 100, reps: 5 })]),
    ).toEqual([])
  })

  it('ignores warm-up sets when judging the record', () => {
    const prs = sessionPersonalRecords('s2', [
      set({ sessionId: 's1', weightKg: 80, reps: 5 }),
      set({ sessionId: 's2', weightKg: 120, reps: 1, setType: 'warmup' }), // warm-up, excluded
      set({ sessionId: 's2', weightKg: 85, reps: 5 }), // real PR
    ])
    expect(prs).toEqual([{ exerciseId: 'ex1', name: 'Bench Press' }])
  })

  it('skips unweighted exercises (weighted PRs only)', () => {
    expect(
      sessionPersonalRecords('s2', [
        set({ exerciseType: 'bodyweight', sessionId: 's1', weightKg: null, reps: 8 }),
        set({ exerciseType: 'bodyweight', sessionId: 's2', weightKg: null, reps: 12 }),
      ]),
    ).toEqual([])
  })
})

describe('prBadgeLabel', () => {
  it('returns null with no PRs', () => {
    expect(prBadgeLabel([])).toBeNull()
  })
  it('names the single PR', () => {
    expect(prBadgeLabel([{ exerciseId: 'a', name: 'Squat' }])).toBe('New PR · Squat')
  })
  it('counts multiple PRs', () => {
    expect(
      prBadgeLabel([
        { exerciseId: 'a', name: 'Squat' },
        { exerciseId: 'b', name: 'Bench' },
      ]),
    ).toBe('2 new personal records')
  })
})
