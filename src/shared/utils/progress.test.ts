import { describe, it, expect } from 'vitest'
import { progressSeries, scalePoints, linePath } from './progress'
import type { HistorySet } from './exerciseStats'

const hist = (over: Partial<HistorySet>): HistorySet => ({
  id: 'h',
  orderIndex: 0,
  weightKg: null,
  reps: null,
  addedWeightKg: null,
  assistanceWeightKg: null,
  durationSec: null,
  distanceMeters: null,
  sessionId: 's',
  sessionStartedAt: '2026-01-01T00:00:00.000Z',
  setType: null,
  rpe: null,
  ...over,
})

const session = (id: string, startedAt: string, sets: Partial<HistorySet>[]): HistorySet[] =>
  sets.map((s, i) => hist({ id: `${id}-${i}`, sessionId: id, sessionStartedAt: startedAt, ...s }))

describe('progressSeries', () => {
  it('returns one oldest-first point per session using the top working set', () => {
    const history = [
      ...session('s2', '2026-03-01T10:00:00.000Z', [{ weightKg: 90, reps: 5 }]),
      ...session('s1', '2026-02-01T10:00:00.000Z', [{ weightKg: 80, reps: 8 }, { weightKg: 70, reps: 10 }]),
    ]
    const series = progressSeries(history, 'strength')
    expect(series.map((p) => p.value)).toEqual([80, 90]) // oldest → newest, top weight
    expect(series.map((p) => p.sessionId)).toEqual(['s1', 's2'])
  })

  it('excludes warm-ups from the plotted top set', () => {
    const history = session('s1', '2026-02-01T10:00:00.000Z', [
      { weightKg: 200, reps: 1, setType: 'warmup' },
      { weightKg: 100, reps: 5 },
    ])
    expect(progressSeries(history, 'strength').map((p) => p.value)).toEqual([100])
  })

  it('is empty without loggable history', () => {
    expect(progressSeries([], 'strength')).toEqual([])
  })
})

describe('scalePoints', () => {
  it('spaces x evenly and inverts y (max on top)', () => {
    expect(scalePoints([10, 20, 30], 100, 100, 0)).toEqual([
      { x: 0, y: 100 },
      { x: 50, y: 50 },
      { x: 100, y: 0 },
    ])
  })

  it('centres a single point and all-equal series vertically', () => {
    expect(scalePoints([5], 100, 100, 0)).toEqual([{ x: 50, y: 50 }])
    expect(scalePoints([5, 5], 100, 100, 0)).toEqual([
      { x: 0, y: 50 },
      { x: 100, y: 50 },
    ])
  })

  it('respects padding', () => {
    expect(scalePoints([0, 10], 100, 100, 10)).toEqual([
      { x: 10, y: 90 },
      { x: 90, y: 10 },
    ])
  })
})

describe('linePath', () => {
  it('builds an M/L path string', () => {
    expect(
      linePath([
        { x: 0, y: 100 },
        { x: 50, y: 50 },
      ]),
    ).toBe('M0 100 L50 50')
  })
})
