import { describe, expect, it } from 'vitest'
import type { ExerciseHistorySetRow } from '@/evolu/rows'
import type { HistorySet } from '@/shared/utils/exerciseStats'
import { toHistorySets, lastSummaryLabel } from './history'

/** Build a loose history-set row, cast to the branded Evolu row type. */
const row = (over: Record<string, unknown>): ExerciseHistorySetRow =>
  ({
    id: 'set1',
    orderIndex: 0,
    weightKg: null,
    reps: null,
    addedWeightKg: null,
    assistanceWeightKg: null,
    durationSec: null,
    distanceMeters: null,
    sessionId: 's1',
    sessionStartedAt: '2026-06-10T09:00:00.000Z',
    ...over,
  }) as unknown as ExerciseHistorySetRow

const hist = (over: Partial<HistorySet>): HistorySet => ({
  id: 'h1',
  orderIndex: 0,
  weightKg: null,
  reps: null,
  addedWeightKg: null,
  assistanceWeightKg: null,
  durationSec: null,
  distanceMeters: null,
  sessionId: 's1',
  sessionStartedAt: '2026-06-10T09:00:00.000Z',
  ...over,
})

describe('toHistorySets', () => {
  it('maps rows and defaults a missing orderIndex to 0', () => {
    const out = toHistorySets([row({ id: 'a', weightKg: 80, reps: 8, orderIndex: null })])
    expect(out).toHaveLength(1)
    expect(out[0]).toMatchObject({ id: 'a', weightKg: 80, reps: 8, orderIndex: 0 })
  })

  it('drops rows missing their session join columns', () => {
    const out = toHistorySets([
      row({ id: 'keep' }),
      row({ id: 'no-session', sessionId: null }),
      row({ id: 'no-time', sessionStartedAt: null }),
    ])
    expect(out.map((s) => s.id)).toEqual(['keep'])
  })
})

describe('lastSummaryLabel', () => {
  it('returns a placeholder with no history', () => {
    expect(lastSummaryLabel([], 'strength', 'kg')).toBe('No history yet')
  })

  it('summarizes a strength session as setCount×reps · top weight', () => {
    const history = [
      hist({ id: '1', orderIndex: 0, weightKg: 80, reps: 8 }),
      hist({ id: '2', orderIndex: 1, weightKg: 90, reps: 5 }),
      hist({ id: '3', orderIndex: 2, weightKg: 85, reps: 6 }),
    ]
    expect(lastSummaryLabel(history, 'strength', 'kg')).toBe('3×5 · 90 kg')
  })

  it('summarizes a timed session as setCount sets · best duration', () => {
    const history = [
      hist({ id: '1', orderIndex: 0, durationSec: 60 }),
      hist({ id: '2', orderIndex: 1, durationSec: 65 }),
    ]
    expect(lastSummaryLabel(history, 'timed', 'kg')).toBe('2 sets · 1:05')
  })

  it('uses only the most recent session', () => {
    const history = [
      hist({ id: 'old', sessionId: 'old', sessionStartedAt: '2026-06-01T09:00:00.000Z', weightKg: 200, reps: 1 }),
      hist({ id: 'new', sessionId: 'new', sessionStartedAt: '2026-06-10T09:00:00.000Z', weightKg: 100, reps: 5 }),
    ]
    expect(lastSummaryLabel(history, 'strength', 'kg')).toBe('1×5 · 100 kg')
  })
})
