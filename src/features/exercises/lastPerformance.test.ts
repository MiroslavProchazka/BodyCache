import { describe, expect, it } from 'vitest'
import type { CompletedSetIndexRow } from '@/evolu/rows'
import type { ExerciseType } from '@/evolu/schema'
import { sessionTrend, type HistorySet } from '@/shared/utils/exerciseStats'
import { lastSummaryLabel } from './history'
import {
  buildLastPerformanceIndex,
  summaryLabel,
  summaryTrend,
} from './lastPerformance'

/** Build one index row; only the fields under test need to be meaningful. */
const row = (over: Record<string, unknown>): CompletedSetIndexRow =>
  ({
    orderIndex: 0,
    weightKg: null,
    reps: null,
    addedWeightKg: null,
    assistanceWeightKg: null,
    durationSec: null,
    distanceMeters: null,
    setType: null,
    rpe: null,
    ...over,
  }) as CompletedSetIndexRow

/** The old per-exercise path: full history for one exercise → HistorySet[]. */
const fullHistory = (rows: readonly CompletedSetIndexRow[], exerciseId: string): HistorySet[] =>
  rows
    .filter((r) => r.exerciseId === exerciseId)
    .map((r) => ({
      id: r.id,
      orderIndex: r.orderIndex ?? 0,
      weightKg: r.weightKg,
      reps: r.reps,
      addedWeightKg: r.addedWeightKg,
      assistanceWeightKg: r.assistanceWeightKg,
      durationSec: r.durationSec,
      distanceMeters: r.distanceMeters,
      sessionId: r.sessionId as string,
      sessionStartedAt: r.sessionStartedAt as string,
      setType: r.setType,
      rpe: r.rpe ?? null,
    }))

const UNIT = 'kg' as const

/** Assert the summary-based label/trend equal the full-history computation. */
const expectParity = (rows: readonly CompletedSetIndexRow[], exerciseId: string, type: ExerciseType) => {
  const index = buildLastPerformanceIndex(rows)
  const history = fullHistory(rows, exerciseId)
  expect(summaryLabel(index.get(exerciseId), type, UNIT)).toBe(
    lastSummaryLabel(history, type, UNIT),
  )
  expect(summaryTrend(index.get(exerciseId), type)).toEqual(sessionTrend(history, type))
}

describe('buildLastPerformanceIndex', () => {
  it('omits exercises with no loggable history (parity → "No history yet"/new)', () => {
    const rows: CompletedSetIndexRow[] = []
    const index = buildLastPerformanceIndex(rows)
    expect(index.has('ex-1')).toBe(false)
    expectParity(rows, 'ex-1', 'strength')
  })

  it('treats a session with only empty sets as no history', () => {
    const rows = [
      row({ id: 's1', exerciseId: 'ex-1', sessionId: 'sess-1', sessionStartedAt: '2026-01-01T00:00:00Z' }),
    ]
    expect(buildLastPerformanceIndex(rows).has('ex-1')).toBe(false)
    expectParity(rows, 'ex-1', 'strength')
  })

  it('single session: label reflects that session, trend is new', () => {
    const rows = [
      row({ id: 'a', exerciseId: 'ex-1', sessionId: 'sess-1', sessionStartedAt: '2026-01-01T10:00:00Z', orderIndex: 0, weightKg: 80, reps: 8 }),
      row({ id: 'b', exerciseId: 'ex-1', sessionId: 'sess-1', sessionStartedAt: '2026-01-01T10:00:00Z', orderIndex: 1, weightKg: 80, reps: 6 }),
    ]
    const index = buildLastPerformanceIndex(rows)
    expect(index.get('ex-1')?.previousSessionSets).toEqual([])
    expect(summaryTrend(index.get('ex-1'), 'strength').dir).toBe('new')
    expectParity(rows, 'ex-1', 'strength')
  })

  it('two sessions: uses newest as last, previous for the trend', () => {
    const rows = [
      // Newest session first (query order), heavier top set → trend up.
      row({ id: 'n1', exerciseId: 'ex-1', sessionId: 'new', sessionStartedAt: '2026-02-01T10:00:00Z', orderIndex: 0, weightKg: 90, reps: 5 }),
      row({ id: 'o1', exerciseId: 'ex-1', sessionId: 'old', sessionStartedAt: '2026-01-01T10:00:00Z', orderIndex: 0, weightKg: 80, reps: 5 }),
      row({ id: 'o2', exerciseId: 'ex-1', sessionId: 'old', sessionStartedAt: '2026-01-01T10:00:00Z', orderIndex: 1, weightKg: 82, reps: 4 }),
    ]
    const index = buildLastPerformanceIndex(rows)
    expect(index.get('ex-1')?.lastPerformedAt).toBe('2026-02-01T10:00:00Z')
    expect(summaryTrend(index.get('ex-1'), 'strength').dir).toBe('up')
    expectParity(rows, 'ex-1', 'strength')
  })

  it('parity holds for timed and distance (cardio) types', () => {
    const rows = [
      row({ id: 't1', exerciseId: 'plank', sessionId: 'p2', sessionStartedAt: '2026-02-01T00:00:00Z', durationSec: 75 }),
      row({ id: 't2', exerciseId: 'plank', sessionId: 'p1', sessionStartedAt: '2026-01-01T00:00:00Z', durationSec: 60 }),
      row({ id: 'd1', exerciseId: 'row', sessionId: 'r2', sessionStartedAt: '2026-02-01T00:00:00Z', distanceMeters: 2000 }),
      row({ id: 'd2', exerciseId: 'row', sessionId: 'r1', sessionStartedAt: '2026-01-01T00:00:00Z', distanceMeters: 1800 }),
    ]
    expectParity(rows, 'plank', 'timed')
    expectParity(rows, 'row', 'distance')
  })

  it('counts sets from an active (unfinished) session — matches completedSetsForExercise semantics', () => {
    // The query already filters status-agnostically; here both rows carry
    // metrics and the newest belongs to a still-open session.
    const rows = [
      row({ id: 'active', exerciseId: 'ex-1', sessionId: 'live', sessionStartedAt: '2026-03-01T00:00:00Z', weightKg: 100, reps: 3 }),
      row({ id: 'past', exerciseId: 'ex-1', sessionId: 'done', sessionStartedAt: '2026-02-01T00:00:00Z', weightKg: 90, reps: 5 }),
    ]
    const index = buildLastPerformanceIndex(rows)
    expect(index.get('ex-1')?.lastPerformedAt).toBe('2026-03-01T00:00:00Z')
    expectParity(rows, 'ex-1', 'strength')
  })

  it('keeps exercises independent', () => {
    const rows = [
      row({ id: 'a', exerciseId: 'ex-1', sessionId: 's1', sessionStartedAt: '2026-01-01T00:00:00Z', weightKg: 50, reps: 10 }),
      row({ id: 'b', exerciseId: 'ex-2', sessionId: 's2', sessionStartedAt: '2026-01-02T00:00:00Z', weightKg: 60, reps: 8 }),
    ]
    const index = buildLastPerformanceIndex(rows)
    expect(index.size).toBe(2)
    expectParity(rows, 'ex-1', 'strength')
    expectParity(rows, 'ex-2', 'strength')
  })

  it('drops rows missing join columns', () => {
    const rows = [
      row({ id: 'x', exerciseId: null as unknown as string, sessionId: 's1', sessionStartedAt: '2026-01-01T00:00:00Z', weightKg: 50, reps: 10 }),
    ]
    expect(buildLastPerformanceIndex(rows).size).toBe(0)
  })
})
