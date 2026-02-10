import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  addExerciseToLocalWorkoutSession,
  finishLocalWorkoutSession,
  getActiveWorkoutSession,
  getRecentWorkoutSessions,
  renameLocalWorkoutSession,
  resetWorkoutSessionStorageForTests,
  startLocalWorkoutSession
} from '../domain/workoutSession'

describe('workout session local store', () => {
  beforeEach(() => {
    resetWorkoutSessionStorageForTests()
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-02-10T10:00:00.000Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('starts a session and stores it as active', () => {
    const session = startLocalWorkoutSession(' Push Day ')

    expect(session.name).toBe('Push Day')
    expect(session.exercises).toEqual([])
    expect(getActiveWorkoutSession()?.id).toBe(session.id)
    expect(getActiveWorkoutSession()?.endedAt).toBeNull()
  })

  it('renames the active session with autosave semantics', () => {
    startLocalWorkoutSession('Workout A')
    vi.setSystemTime(new Date('2026-02-10T10:05:00.000Z'))

    const renamed = renameLocalWorkoutSession('Leg Day')

    expect(renamed?.name).toBe('Leg Day')
    expect(renamed?.updatedAt).toBe('2026-02-10T10:05:00.000Z')
    expect(getActiveWorkoutSession()?.name).toBe('Leg Day')
  })

  it('adds exercises to the active session in order', () => {
    startLocalWorkoutSession('Push Day')
    vi.setSystemTime(new Date('2026-02-10T10:10:00.000Z'))

    const updated = addExerciseToLocalWorkoutSession('barbell-bench-press', 'Barbell Bench Press')

    expect(updated?.exercises).toHaveLength(1)
    expect(updated?.exercises[0]?.orderIndex).toBe(0)
    expect(updated?.exercises[0]?.name).toBe('Barbell Bench Press')
    expect(getActiveWorkoutSession()?.exercises[0]?.exerciseId).toBe('barbell-bench-press')
  })

  it('finishes the active session and keeps exercise history', () => {
    const started = startLocalWorkoutSession('Pull Day')
    addExerciseToLocalWorkoutSession('pull-up', 'Pull Up')
    vi.setSystemTime(new Date('2026-02-10T10:45:00.000Z'))

    const finished = finishLocalWorkoutSession()

    expect(finished?.id).toBe(started.id)
    expect(finished?.endedAt).toBe('2026-02-10T10:45:00.000Z')
    expect(finished?.exercises).toHaveLength(1)
    expect(getActiveWorkoutSession()).toBeNull()
    expect(getRecentWorkoutSessions()[0]?.id).toBe(started.id)
    expect(getRecentWorkoutSessions()[0]?.exercises[0]?.name).toBe('Pull Up')
  })
})
