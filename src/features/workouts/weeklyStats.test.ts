import { describe, expect, it } from 'vitest'
import {
  muscleSplit7Days,
  prsThisWeek,
  weekOverWeek,
  type WeekStatSet,
} from './weeklyStats'

// A fixed reference week: Wed 11 Jun 2025 (week of Mon 9 → Sun 15).
const NOW = new Date(2025, 5, 11, 14, 0, 0)

const set = (iso: string, over: Partial<WeekStatSet> = {}): WeekStatSet => ({
  weightKg: 100,
  reps: 5,
  addedWeightKg: null,
  assistanceWeightKg: null,
  durationSec: null,
  distanceMeters: null,
  elevationMeters: null,
  setType: null,
  exerciseId: 'ex1',
  exerciseType: 'strength',
  bodyPart: 'chest',
  sessionStartedAt: new Date(iso).toISOString(),
  ...over,
})

describe('weekOverWeek', () => {
  it('computes the percent change vs. the previous week', () => {
    const wow = weekOverWeek(
      [
        set('2025-06-03T08:00', { weightKg: 100, reps: 10 }), // last week → 1000
        set('2025-06-10T08:00', { weightKg: 100, reps: 12 }), // this week → 1200
      ],
      NOW,
    )
    expect(wow.lastWeekKg).toBe(1000)
    expect(wow.thisWeekKg).toBe(1200)
    expect(wow.pct).toBe(20)
  })

  it('returns a null pct when there is no previous-week baseline', () => {
    const wow = weekOverWeek([set('2025-06-10T08:00', { weightKg: 50, reps: 4 })], NOW)
    expect(wow.lastWeekKg).toBe(0)
    expect(wow.thisWeekKg).toBe(200)
    expect(wow.pct).toBeNull()
  })
})

describe('prsThisWeek', () => {
  it('counts an exercise whose this-week best beats every earlier session', () => {
    const count = prsThisWeek(
      [
        set('2025-06-02T08:00', { weightKg: 80, reps: 5 }), // prior week best
        set('2025-06-10T08:00', { weightKg: 90, reps: 5 }), // this week → PR
      ],
      NOW,
    )
    expect(count).toBe(1)
  })

  it('does not count when there is no prior session to beat', () => {
    expect(prsThisWeek([set('2025-06-10T08:00', { weightKg: 90, reps: 5 })], NOW)).toBe(0)
  })

  it('does not count when this week fails to beat the prior best', () => {
    const count = prsThisWeek(
      [
        set('2025-06-02T08:00', { weightKg: 100, reps: 5 }),
        set('2025-06-10T08:00', { weightKg: 90, reps: 5 }),
      ],
      NOW,
    )
    expect(count).toBe(0)
  })

  it('ignores warm-up sets when ranking', () => {
    const count = prsThisWeek(
      [
        set('2025-06-02T08:00', { weightKg: 100, reps: 5 }),
        set('2025-06-10T08:00', { weightKg: 200, reps: 5, setType: 'warmup' }),
        set('2025-06-10T09:00', { weightKg: 90, reps: 5 }),
      ],
      NOW,
    )
    expect(count).toBe(0)
  })
})

describe('muscleSplit7Days', () => {
  it('returns volume share by body part, highest first', () => {
    const split = muscleSplit7Days(
      [
        set('2025-06-10T08:00', { bodyPart: 'chest', weightKg: 100, reps: 6 }), // 600
        set('2025-06-10T09:00', { bodyPart: 'back', weightKg: 100, reps: 4 }), // 400
      ],
      NOW,
    )
    expect(split.map((s) => s.key)).toEqual(['chest', 'back'])
    expect(split[0].percent).toBe(60)
    expect(split[1].percent).toBe(40)
    expect(split[0].strong).toBe(true)
    expect(split[1].strong).toBe(false)
  })

  it('excludes sets older than 7 days', () => {
    const split = muscleSplit7Days(
      [set('2025-06-01T08:00', { bodyPart: 'chest' })],
      NOW,
    )
    expect(split).toEqual([])
  })

  it('caps the number of bars at the limit', () => {
    const parts = ['chest', 'back', 'legs', 'shoulders', 'arms', 'core', 'other']
    const sets = parts.map((bodyPart, i) =>
      set('2025-06-10T08:00', { bodyPart, weightKg: 100, reps: parts.length - i }),
    )
    expect(muscleSplit7Days(sets, NOW, 4)).toHaveLength(4)
  })
})
