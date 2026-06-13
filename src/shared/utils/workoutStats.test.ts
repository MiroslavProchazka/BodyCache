import { describe, it, expect } from 'vitest'
import {
  totalVolumeKg,
  completedSetCount,
  formatElapsed,
  formatDurationSec,
  activeElapsedSec,
  finishedDurationSec,
  isStaleAbandonedSession,
  STALE_SESSION_SECONDS,
  workoutName,
} from './workoutStats'

describe('totalVolumeKg', () => {
  it('sums weight × reps for complete sets only', () => {
    expect(
      totalVolumeKg([
        { weightKg: 100, reps: 5 },
        { weightKg: 80, reps: 10 },
        { weightKg: null, reps: 8 },
        { weightKg: 50, reps: null },
      ]),
    ).toBe(100 * 5 + 80 * 10)
  })
  it('is zero for no sets', () => {
    expect(totalVolumeKg([])).toBe(0)
  })
})

describe('completedSetCount', () => {
  it('counts only sets with a completedAt', () => {
    expect(
      completedSetCount([
        { completedAt: '2026-01-01T00:00:00.000Z' },
        { completedAt: null },
        { completedAt: '2026-01-01T00:01:00.000Z' },
      ]),
    ).toBe(2)
  })
})

describe('formatElapsed', () => {
  const start = '2026-01-01T00:00:00.000Z'
  it('formats seconds under a minute', () => {
    expect(formatElapsed(start, '2026-01-01T00:00:45.000Z')).toBe('45s')
  })
  it('formats whole minutes under an hour', () => {
    expect(formatElapsed(start, '2026-01-01T00:12:30.000Z')).toBe('12m')
  })
  it('formats hours and zero-padded minutes', () => {
    expect(formatElapsed(start, '2026-01-01T01:05:00.000Z')).toBe('1h 05m')
  })
  it('never goes negative', () => {
    expect(formatElapsed('2026-01-01T01:00:00.000Z', start)).toBe('0s')
  })
})

describe('formatDurationSec', () => {
  it('formats seconds, minutes, and zero-padded hours', () => {
    expect(formatDurationSec(45)).toBe('45s')
    expect(formatDurationSec(12 * 60)).toBe('12m')
    expect(formatDurationSec(60 * 60 + 5 * 60)).toBe('1h 05m')
  })
  it('clamps negatives to zero', () => {
    expect(formatDurationSec(-10)).toBe('0s')
  })
})

describe('activeElapsedSec', () => {
  const now = '2026-01-01T01:00:00.000Z' // one hour after start
  const start = '2026-01-01T00:00:00.000Z'

  it('counts startedAt → now for a never-paused session', () => {
    // Legacy row: resumedAt / pausedTotalSec null, falls back to startedAt.
    expect(
      activeElapsedSec(
        { startedAt: start, resumedAt: null, pausedTotalSec: null, status: 'active' },
        now,
      ),
    ).toBe(3600)
  })

  it('counts banked time plus the current interval when active', () => {
    // Resumed 10 minutes ago, with 20 minutes banked → 30 minutes.
    expect(
      activeElapsedSec(
        {
          startedAt: start,
          resumedAt: '2026-01-01T00:50:00.000Z',
          pausedTotalSec: 20 * 60,
          status: 'active',
        },
        now,
      ),
    ).toBe(30 * 60)
  })

  it('freezes at the banked total while paused (ignores now)', () => {
    expect(
      activeElapsedSec(
        { startedAt: start, resumedAt: null, pausedTotalSec: 15 * 60, status: 'paused' },
        now,
      ),
    ).toBe(15 * 60)
  })

  it('never goes negative if resumedAt is in the future', () => {
    expect(
      activeElapsedSec(
        {
          startedAt: start,
          resumedAt: '2026-01-01T02:00:00.000Z',
          pausedTotalSec: 0,
          status: 'active',
        },
        now,
      ),
    ).toBe(0)
  })
})

describe('finishedDurationSec', () => {
  it('prefers banked active seconds (excludes paused time)', () => {
    expect(
      finishedDurationSec({
        startedAt: '2026-01-01T00:00:00.000Z',
        finishedAt: '2026-01-01T02:00:00.000Z', // 2h wall clock
        pausedTotalSec: 45 * 60, // but only 45m worked
      }),
    ).toBe(45 * 60)
  })

  it('falls back to wall clock for legacy rows without banked time', () => {
    expect(
      finishedDurationSec({
        startedAt: '2026-01-01T00:00:00.000Z',
        finishedAt: '2026-01-01T00:50:00.000Z',
        pausedTotalSec: null,
      }),
    ).toBe(50 * 60)
  })

  it('is null when neither banked time nor both timestamps exist', () => {
    expect(
      finishedDurationSec({ startedAt: '2026-01-01T00:00:00.000Z', finishedAt: null, pausedTotalSec: null }),
    ).toBeNull()
  })
})

describe('isStaleAbandonedSession', () => {
  it('is stale only past the threshold with zero logged sets', () => {
    expect(isStaleAbandonedSession(STALE_SESSION_SECONDS, 0)).toBe(true)
    expect(isStaleAbandonedSession(STALE_SESSION_SECONDS - 1, 0)).toBe(false)
  })
  it('is never stale once a set is logged', () => {
    expect(isStaleAbandonedSession(STALE_SESSION_SECONDS * 2, 1)).toBe(false)
  })
})

describe('workoutName', () => {
  it('names a push day', () => {
    expect(workoutName(['chest', 'shoulders', 'arms'])).toBe('Push day')
  })
  it('names a pull day', () => {
    expect(workoutName(['back', 'arms'])).toBe('Pull day')
  })
  it('names a leg day', () => {
    expect(workoutName(['legs', 'legs'])).toBe('Leg day')
  })
  it('falls back to full body for a mix', () => {
    expect(workoutName(['chest', 'legs'])).toBe('Full body day')
  })
  it('ignores nulls and is "Workout" when empty', () => {
    expect(workoutName([null, null])).toBe('Workout')
  })
})
