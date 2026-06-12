import { describe, it, expect } from 'vitest'
import {
  sessionSummaries,
  historyTotals,
  groupExerciseSets,
  type SessionTaggedSet,
  type DetailRow,
} from './historyStats'

const set = (over: Partial<SessionTaggedSet>): SessionTaggedSet => ({
  sessionId: 's1',
  exerciseId: 'e1',
  bodyPart: 'chest',
  weightKg: 100,
  reps: 5,
  ...over,
})

describe('sessionSummaries', () => {
  it('groups sets by session and derives each summary', () => {
    const summaries = sessionSummaries([
      set({ sessionId: 's1', exerciseId: 'e1', bodyPart: 'chest', weightKg: 100, reps: 5 }),
      set({ sessionId: 's1', exerciseId: 'e2', bodyPart: 'shoulders', weightKg: 40, reps: 10 }),
      set({ sessionId: 's2', exerciseId: 'e3', bodyPart: 'legs', weightKg: 120, reps: 8 }),
    ])
    expect(summaries.size).toBe(2)
    const s1 = summaries.get('s1')!
    expect(s1.exerciseCount).toBe(2)
    expect(s1.setCount).toBe(2)
    expect(s1.volumeKg).toBe(100 * 5 + 40 * 10)
    expect(s1.name).toBe('Push day')
    expect(summaries.get('s2')!.name).toBe('Leg day')
  })

  it('is empty for no rows', () => {
    expect(sessionSummaries([]).size).toBe(0)
  })
})

describe('historyTotals', () => {
  const now = new Date('2026-06-11T12:00:00.000Z')

  it('counts workouts, this-month workouts, sets and volume', () => {
    const totals = historyTotals(
      [
        { startedAt: '2026-06-02T08:00:00.000Z' },
        { startedAt: '2026-06-10T08:00:00.000Z' },
        { startedAt: '2026-05-30T08:00:00.000Z' },
      ],
      [
        { weightKg: 100, reps: 5 },
        { weightKg: 80, reps: 10 },
        { weightKg: null, reps: 8 },
      ],
      now,
    )
    expect(totals.workouts).toBe(3)
    expect(totals.thisMonth).toBe(2)
    expect(totals.sets).toBe(3)
    expect(totals.volumeKg).toBe(100 * 5 + 80 * 10)
  })

  it('ignores sessions without a start time for the month count', () => {
    const totals = historyTotals([{ startedAt: null }], [], now)
    expect(totals.workouts).toBe(1)
    expect(totals.thisMonth).toBe(0)
  })
})

describe('groupExerciseSets', () => {
  const row = (over: Partial<DetailRow>): DetailRow => ({
    id: 'set',
    orderIndex: 0,
    weightKg: 100,
    reps: 5,
    addedWeightKg: null,
    assistanceWeightKg: null,
    durationSec: null,
    distanceMeters: null,
    setType: null,
    workoutExerciseId: 'we1',
    exerciseId: 'e1',
    exerciseName: 'Bench Press',
    exerciseType: 'strength',
    bodyPart: 'chest',
    primaryPhotoId: null,
    ...over,
  })

  it('groups by workout exercise, preserving order and set lists', () => {
    const groups = groupExerciseSets([
      row({ id: 'a', workoutExerciseId: 'we1', orderIndex: 0 }),
      row({ id: 'b', workoutExerciseId: 'we1', orderIndex: 1 }),
      row({ id: 'c', workoutExerciseId: 'we2', exerciseName: 'Squat', orderIndex: 0 }),
    ])
    expect(groups.map((g) => g.workoutExerciseId)).toEqual(['we1', 'we2'])
    expect(groups[0].sets.map((s) => s.id)).toEqual(['a', 'b'])
    expect(groups[0].name).toBe('Bench Press')
    expect(groups[0].type).toBe('strength')
    expect(groups[1].name).toBe('Squat')
    expect(groups[1].sets).toHaveLength(1)
  })

  it('is empty for no rows', () => {
    expect(groupExerciseSets([])).toEqual([])
  })
})
