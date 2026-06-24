import { describe, expect, it } from 'vitest'
import { weeklyMomentum, startOfWeek, type WeekSetInput } from './weeklyMomentum'

// A fixed reference week: Wed 11 Jun 2025 (week of Mon 9 → Sun 15).
const NOW = new Date(2025, 5, 11, 14, 0, 0)

const set = (iso: string, weightKg: number, reps: number): WeekSetInput => ({
  sessionStartedAt: new Date(iso).toISOString(),
  weightKg,
  reps,
})

describe('startOfWeek', () => {
  it('returns the Monday 00:00 of the containing week', () => {
    const s = startOfWeek(NOW)
    expect(s.getDay()).toBe(1) // Monday
    expect(s.getDate()).toBe(9)
    expect(s.getHours()).toBe(0)
  })

  it('treats Sunday as the last day of the same week', () => {
    const sunday = new Date(2025, 5, 15, 9, 0, 0)
    expect(startOfWeek(sunday).getDate()).toBe(9)
  })
})

describe('weeklyMomentum', () => {
  it('returns seven empty Mon→Sun days for no sets', () => {
    const w = weeklyMomentum([], NOW)
    expect(w.days).toHaveLength(7)
    expect(w.days.map((d) => d.label)).toEqual(['M', 'T', 'W', 'T', 'F', 'S', 'S'])
    expect(w.totalKg).toBe(0)
    expect(w.activeDays).toBe(0)
    expect(w.days.every((d) => !d.active)).toBe(true)
  })

  it('buckets volume into the right weekday and totals it', () => {
    const w = weeklyMomentum(
      [
        set('2025-06-09T08:00', 100, 5), // Mon → 500
        set('2025-06-11T08:00', 80, 8), // Wed → 640
        set('2025-06-11T09:00', 20, 10), // Wed → 200
      ],
      NOW,
    )
    expect(w.days[0].volumeKg).toBe(500)
    expect(w.days[2].volumeKg).toBe(840)
    expect(w.totalKg).toBe(1340)
    expect(w.activeDays).toBe(2)
  })

  it('marks today and ignores sets outside the current week', () => {
    const w = weeklyMomentum(
      [
        set('2025-06-02T08:00', 100, 5), // previous week → ignored
        set('2025-06-20T08:00', 100, 5), // next week → ignored
        set('2025-06-11T08:00', 50, 4), // this Wed
      ],
      NOW,
    )
    expect(w.totalKg).toBe(200)
    expect(w.days[2].isToday).toBe(true)
    expect(w.days.filter((d) => d.isToday)).toHaveLength(1)
  })

  it('skips sets missing weight, reps, or a date', () => {
    const w = weeklyMomentum(
      [
        { sessionStartedAt: null, weightKg: 100, reps: 5 },
        { sessionStartedAt: new Date('2025-06-11T08:00').toISOString(), weightKg: null, reps: 5 },
        { sessionStartedAt: new Date('2025-06-11T08:00').toISOString(), weightKg: 100, reps: null },
      ],
      NOW,
    )
    expect(w.totalKg).toBe(0)
  })
})
