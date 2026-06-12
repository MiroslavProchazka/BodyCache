import { describe, it, expect } from 'vitest'
import {
  hasMetrics,
  compareSets,
  bestSet,
  isPersonalRecord,
  previousSession,
  groupSessions,
  sessionTrend,
  averageTopWeightKg,
  isWarmupSet,
  workingSets,
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
  setType: null,
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

const session = (
  id: string,
  startedAt: string,
  sets: Partial<MetricSet>[],
): HistorySet[] =>
  sets.map((over, i) =>
    hist({ id: `${id}-${i}`, sessionId: id, sessionStartedAt: startedAt, orderIndex: i, ...over }),
  )

describe('groupSessions', () => {
  it('groups by session, newest first, with sets ordered', () => {
    const history = [
      ...session('s2', '2026-03-02T10:00:00.000Z', [{ weightKg: 80, reps: 8 }, { weightKg: 80, reps: 6 }]),
      ...session('s1', '2026-02-01T10:00:00.000Z', [{ weightKg: 70, reps: 10 }]),
    ]
    const groups = groupSessions(history)
    expect(groups.map((g) => g.sessionId)).toEqual(['s2', 's1'])
    expect(groups[0].sets.map((s) => s.orderIndex)).toEqual([0, 1])
  })

  it('drops empty sets and the excluded session', () => {
    const history = [
      ...session('cur', '2026-03-10T10:00:00.000Z', [{ weightKg: 100, reps: 5 }]),
      ...session('old', '2026-02-01T10:00:00.000Z', [{}, { weightKg: 70, reps: 10 }]),
    ]
    const groups = groupSessions(history, 'cur')
    expect(groups.map((g) => g.sessionId)).toEqual(['old'])
    expect(groups[0].sets).toHaveLength(1)
  })
})

describe('sessionTrend', () => {
  it('is "new" with fewer than two sessions', () => {
    const history = session('s1', '2026-02-01T10:00:00.000Z', [{ weightKg: 70, reps: 10 }])
    expect(sessionTrend(history, 'strength').dir).toBe('new')
  })

  it('reports an upward weight delta against the prior session', () => {
    const history = [
      ...session('s2', '2026-03-02T10:00:00.000Z', [{ weightKg: 82.5, reps: 8 }]),
      ...session('s1', '2026-02-01T10:00:00.000Z', [{ weightKg: 80, reps: 8 }]),
    ]
    const trend = sessionTrend(history, 'strength')
    expect(trend.dir).toBe('up')
    expect(trend.delta).toBe(2.5)
    expect(trend.field).toBe('weight')
  })

  it('excludes the in-progress session when comparing', () => {
    const history = [
      ...session('cur', '2026-03-10T10:00:00.000Z', [{ weightKg: 100, reps: 5 }]),
      ...session('s2', '2026-03-02T10:00:00.000Z', [{ weightKg: 75, reps: 8 }]),
      ...session('s1', '2026-02-01T10:00:00.000Z', [{ weightKg: 80, reps: 8 }]),
    ]
    const trend = sessionTrend(history, 'strength', 'cur')
    expect(trend.dir).toBe('down')
    expect(trend.delta).toBe(-5)
  })
})

describe('averageTopWeightKg', () => {
  it('averages each session top-set weight', () => {
    const history = [
      ...session('s2', '2026-03-02T10:00:00.000Z', [{ weightKg: 80, reps: 8 }, { weightKg: 70, reps: 10 }]),
      ...session('s1', '2026-02-01T10:00:00.000Z', [{ weightKg: 60, reps: 10 }]),
    ]
    expect(averageTopWeightKg(history, 'strength')).toBe(70)
  })

  it('is null without weighted history', () => {
    expect(averageTopWeightKg([], 'strength')).toBeNull()
  })
})

describe('isWarmupSet / workingSets', () => {
  it('detects warm-up sets', () => {
    expect(isWarmupSet({ setType: 'warmup' })).toBe(true)
    expect(isWarmupSet({ setType: 'drop' })).toBe(false)
    expect(isWarmupSet({ setType: null })).toBe(false)
    expect(isWarmupSet({})).toBe(false)
  })

  it('drops warm-ups, keeping working sets', () => {
    const sets = [
      hist({ id: 'a', weightKg: 40, reps: 10, setType: 'warmup' }),
      hist({ id: 'b', weightKg: 80, reps: 8, setType: null }),
      hist({ id: 'c', weightKg: 90, reps: 6, setType: 'failure' }),
    ]
    expect(workingSets(sets).map((s) => s.id)).toEqual(['b', 'c'])
  })

  it('keeps a warm-up from beating the working best when filtered first', () => {
    const sets = [
      hist({ id: 'w', weightKg: 200, reps: 1, setType: 'warmup' }),
      hist({ id: 'r', weightKg: 100, reps: 5, setType: null }),
    ]
    expect(bestSet(workingSets(sets), 'strength')?.id).toBe('r')
  })
})
