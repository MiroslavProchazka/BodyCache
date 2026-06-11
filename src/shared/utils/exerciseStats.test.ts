import { describe, it, expect } from 'vitest'
import {
  hasMetrics,
  compareSets,
  bestSet,
  isPersonalRecord,
  previousSession,
  type HistorySet,
  type MetricSet,
} from './exerciseStats'

const empty: MetricSet = {
  weightKg: null,
  reps: null,
  addedWeightKg: null,
  assistanceWeightKg: null,
  durationSec: null,
  distanceMeters: null,
}

const set = (over: Partial<MetricSet>): MetricSet => ({ ...empty, ...over })

const hist = (over: Partial<HistorySet>): HistorySet => ({
  ...empty,
  id: 'x',
  orderIndex: 0,
  sessionId: 's',
  sessionStartedAt: '2026-01-01T00:00:00.000Z',
  ...over,
})

describe('hasMetrics', () => {
  it('is false for an empty set', () => {
    expect(hasMetrics(empty)).toBe(false)
  })
  it('is true when any positive metric is present', () => {
    expect(hasMetrics(set({ reps: 5 }))).toBe(true)
    expect(hasMetrics(set({ durationSec: 30 }))).toBe(true)
  })
  it('ignores zero values', () => {
    expect(hasMetrics(set({ weightKg: 0, reps: 0 }))).toBe(false)
  })
})

describe('compareSets (strength)', () => {
  it('ranks heavier weight as better', () => {
    expect(
      compareSets(set({ weightKg: 100, reps: 5 }), set({ weightKg: 90, reps: 12 }), 'strength'),
    ).toBeGreaterThan(0)
  })
  it('breaks weight ties on reps', () => {
    expect(
      compareSets(set({ weightKg: 100, reps: 8 }), set({ weightKg: 100, reps: 5 }), 'strength'),
    ).toBeGreaterThan(0)
  })
  it('is symmetric (0 when equal)', () => {
    expect(
      compareSets(set({ weightKg: 80, reps: 10 }), set({ weightKg: 80, reps: 10 }), 'strength'),
    ).toBe(0)
  })
})

describe('compareSets (other types)', () => {
  it('bodyweight ranks more reps as better, then added weight', () => {
    expect(compareSets(set({ reps: 12 }), set({ reps: 10 }), 'bodyweight')).toBeGreaterThan(0)
    expect(
      compareSets(set({ reps: 10, addedWeightKg: 20 }), set({ reps: 10, addedWeightKg: 10 }), 'bodyweight'),
    ).toBeGreaterThan(0)
  })
  it('timed ranks longer duration as better', () => {
    expect(compareSets(set({ durationSec: 90 }), set({ durationSec: 60 }), 'timed')).toBeGreaterThan(0)
  })
  it('distance ranks longer distance as better', () => {
    expect(
      compareSets(set({ distanceMeters: 2000 }), set({ distanceMeters: 1500 }), 'distance'),
    ).toBeGreaterThan(0)
  })
})

describe('bestSet', () => {
  it('returns null with no loggable sets', () => {
    expect(bestSet([empty], 'strength')).toBeNull()
  })
  it('finds the heaviest strength set', () => {
    const sets = [set({ weightKg: 60, reps: 10 }), set({ weightKg: 100, reps: 3 }), set({ weightKg: 80, reps: 8 })]
    expect(bestSet(sets, 'strength')).toBe(sets[1])
  })
})

describe('isPersonalRecord', () => {
  it('treats the first-ever set as a PR', () => {
    expect(isPersonalRecord(set({ weightKg: 50, reps: 5 }), [], 'strength')).toBe(true)
  })
  it('is true only when strictly beating the prior best', () => {
    const others = [set({ weightKg: 100, reps: 5 })]
    expect(isPersonalRecord(set({ weightKg: 105, reps: 1 }), others, 'strength')).toBe(true)
    expect(isPersonalRecord(set({ weightKg: 100, reps: 5 }), others, 'strength')).toBe(false)
    expect(isPersonalRecord(set({ weightKg: 95, reps: 12 }), others, 'strength')).toBe(false)
  })
  it('is false for an empty set', () => {
    expect(isPersonalRecord(empty, [], 'strength')).toBe(false)
  })
})

describe('previousSession', () => {
  it('returns null when there is no history', () => {
    expect(previousSession([])).toBeNull()
  })

  it('picks the most recent session and orders its sets', () => {
    const history: HistorySet[] = [
      hist({ id: 'b1', sessionId: 'new', sessionStartedAt: '2026-03-02T10:00:00.000Z', orderIndex: 1, weightKg: 80, reps: 8 }),
      hist({ id: 'b0', sessionId: 'new', sessionStartedAt: '2026-03-02T10:00:00.000Z', orderIndex: 0, weightKg: 80, reps: 10 }),
      hist({ id: 'a0', sessionId: 'old', sessionStartedAt: '2026-02-01T10:00:00.000Z', orderIndex: 0, weightKg: 70, reps: 10 }),
    ]
    const prev = previousSession(history)
    expect(prev?.sessionId).toBe('new')
    expect(prev?.sets.map((s) => s.id)).toEqual(['b0', 'b1'])
  })

  it('excludes the in-progress session', () => {
    const history: HistorySet[] = [
      hist({ id: 'cur', sessionId: 'current', sessionStartedAt: '2026-03-10T10:00:00.000Z', weightKg: 90, reps: 5 }),
      hist({ id: 'old', sessionId: 'old', sessionStartedAt: '2026-02-01T10:00:00.000Z', weightKg: 70, reps: 10 }),
    ]
    const prev = previousSession(history, 'current')
    expect(prev?.sessionId).toBe('old')
    expect(prev?.sets.map((s) => s.id)).toEqual(['old'])
  })
})
