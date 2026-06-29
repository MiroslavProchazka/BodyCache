import { describe, expect, it } from 'vitest'
import {
  BACKUP_FORMAT,
  BACKUP_VERSION,
  buildBackupFile,
  countRows,
  csvEscape,
  parseBackupFile,
  toHistoryCsv,
  type BackupTables,
  type CsvSource,
} from './backup'

const emptyTables: BackupTables = {
  exercise: [],
  exercisePhoto: [],
  workoutSession: [],
  workoutExercise: [],
  exerciseSet: [],
  plan: [],
  planExercise: [],
  planSet: [],
}

describe('buildBackupFile', () => {
  it('stamps format, version and the provided timestamp', () => {
    const file = buildBackupFile(emptyTables, [], '2026-06-11T00:00:00.000Z')
    expect(file.format).toBe(BACKUP_FORMAT)
    expect(file.version).toBe(BACKUP_VERSION)
    expect(file.exportedAt).toBe('2026-06-11T00:00:00.000Z')
  })

  it('round-trips through JSON back into a valid backup', () => {
    const file = buildBackupFile(
      { ...emptyTables, exercise: [{ id: 'e1', name: 'Squat' }] },
      [{ ref: 'idb://a', mime: 'image/jpeg', base64: 'AAAA' }],
    )
    const result = parseBackupFile(JSON.stringify(file))
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.value.tables.exercise).toHaveLength(1)
      expect(result.value.photos[0].ref).toBe('idb://a')
    }
  })
})

describe('parseBackupFile', () => {
  it('rejects invalid JSON', () => {
    expect(parseBackupFile('not json {').ok).toBe(false)
  })

  it('rejects files with the wrong format marker', () => {
    const result = parseBackupFile(JSON.stringify({ format: 'something-else' }))
    expect(result.ok).toBe(false)
  })

  it('rejects backups from a newer version', () => {
    const file = { ...buildBackupFile(emptyTables, []), version: BACKUP_VERSION + 1 }
    expect(parseBackupFile(JSON.stringify(file)).ok).toBe(false)
  })

  it('rejects when a table is missing', () => {
    const broken = { ...buildBackupFile(emptyTables, []) } as Record<string, unknown>
    delete (broken.tables as Record<string, unknown>).exerciseSet
    expect(parseBackupFile(JSON.stringify(broken)).ok).toBe(false)
  })

  it('rejects when photos is not an array', () => {
    const broken = { ...buildBackupFile(emptyTables, []), photos: 'nope' }
    expect(parseBackupFile(JSON.stringify(broken)).ok).toBe(false)
  })

  it('restores a v1 backup (no plan tables) and treats them as empty', () => {
    const v1 = {
      format: BACKUP_FORMAT,
      version: 1,
      exportedAt: '2026-06-11T00:00:00.000Z',
      tables: {
        exercise: [{ id: 'e1', name: 'Squat' }],
        exercisePhoto: [],
        workoutSession: [],
        workoutExercise: [],
        exerciseSet: [],
      },
      photos: [],
    }
    const result = parseBackupFile(JSON.stringify(v1))
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.value.tables.exercise).toHaveLength(1)
      expect(result.value.tables.plan).toEqual([])
      expect(result.value.tables.planExercise).toEqual([])
      expect(result.value.tables.planSet).toEqual([])
    }
  })

  it('rejects a v2 backup that is missing a plan table', () => {
    // A current-version backup must carry plan tables; tolerating their absence
    // would silently drop saved routines while reporting a clean restore. Build
    // a fresh, self-contained tables object (don't share `emptyTables`, which
    // other tests mutate) and drop just the plan-set table.
    const tables: Record<string, unknown> = {
      exercise: [],
      exercisePhoto: [],
      workoutSession: [],
      workoutExercise: [],
      exerciseSet: [],
      plan: [],
      planExercise: [],
    }
    const v2 = { format: BACKUP_FORMAT, version: 2, exportedAt: '2026-06-11T00:00:00.000Z', tables, photos: [] }
    const result = parseBackupFile(JSON.stringify(v2))
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.error).toMatch(/planSet/)
  })
})

describe('countRows', () => {
  it('sums rows across every table', () => {
    expect(
      countRows({
        exercise: [{}, {}],
        exercisePhoto: [{}],
        workoutSession: [{}],
        workoutExercise: [],
        exerciseSet: [{}, {}, {}],
        plan: [],
        planExercise: [],
        planSet: [],
      }),
    ).toBe(7)
  })
})

describe('csvEscape', () => {
  it('leaves plain values untouched', () => {
    expect(csvEscape('Squat')).toBe('Squat')
    expect(csvEscape(80)).toBe('80')
  })

  it('renders null/undefined as empty', () => {
    expect(csvEscape(null)).toBe('')
    expect(csvEscape(undefined)).toBe('')
  })

  it('quotes and doubles quotes when commas or quotes are present', () => {
    expect(csvEscape('a,b')).toBe('"a,b"')
    expect(csvEscape('say "hi"')).toBe('"say ""hi"""')
    expect(csvEscape('line\nbreak')).toBe('"line\nbreak"')
  })
})

describe('toHistoryCsv', () => {
  const source: CsvSource = {
    exercises: [
      { id: 'ex1', name: 'Squat', type: 'strength', bodyPart: 'legs' },
      { id: 'ex2', name: 'Plank', type: 'timed', bodyPart: 'core' },
    ],
    sessions: [
      { id: 's1', date: '2026-06-10T09:00:00.000Z', startedAt: '2026-06-10T09:00:00.000Z', status: 'finished' },
      { id: 's2', date: '2026-06-11T09:00:00.000Z', startedAt: '2026-06-11T09:00:00.000Z', status: 'finished' },
      { id: 's3', date: '2026-06-12T09:00:00.000Z', startedAt: '2026-06-12T09:00:00.000Z', status: 'active' },
    ],
    workoutExercises: [
      { id: 'we1', workoutSessionId: 's1', exerciseId: 'ex1', orderIndex: 0 },
      { id: 'we2', workoutSessionId: 's2', exerciseId: 'ex2', orderIndex: 0 },
      { id: 'we3', workoutSessionId: 's3', exerciseId: 'ex1', orderIndex: 0 },
    ],
    sets: [
      base({ workoutExerciseId: 'we1', orderIndex: 0, completedAt: 'x', weightKg: 100, reps: 5 }),
      base({ workoutExerciseId: 'we2', orderIndex: 0, completedAt: 'x', durationSec: 60 }),
      // Incomplete set — excluded.
      base({ workoutExerciseId: 'we1', orderIndex: 1, completedAt: null, weightKg: 110, reps: 3 }),
      // Belongs to an active session — excluded.
      base({ workoutExerciseId: 'we3', orderIndex: 0, completedAt: 'x', weightKg: 90, reps: 8 }),
    ],
  }

  it('emits a header plus one row per completed finished-session set', () => {
    const lines = toHistoryCsv(source).split('\r\n')
    expect(lines[0]).toContain('date,exercise,type,body_part,set,weight_kg,reps')
    expect(lines).toHaveLength(3) // header + 2 valid rows
  })

  it('sorts newest workout first and one-indexes the set number', () => {
    const lines = toHistoryCsv(source).split('\r\n')
    // s2 (Jun 11) before s1 (Jun 10); set column is orderIndex + 1.
    expect(lines[1]).toBe('2026-06-11,Plank,timed,core,1,,,,,60,,,')
    expect(lines[2]).toBe('2026-06-10,Squat,strength,legs,1,100,5,,,,,,')
  })

  it('excludes incomplete sets and non-finished sessions', () => {
    const csv = toHistoryCsv(source)
    expect(csv).not.toContain('110') // incomplete set
    expect(csv).not.toContain('90') // active session
  })
})

/** Build a CSV set row with sensible nulls, overriding only what a test needs. */
function base(
  over: Partial<CsvSource['sets'][number]>,
): CsvSource['sets'][number] {
  return {
    workoutExerciseId: '',
    orderIndex: 0,
    completedAt: null,
    weightKg: null,
    reps: null,
    addedWeightKg: null,
    assistanceWeightKg: null,
    durationSec: null,
    distanceMeters: null,
    rpe: null,
    notes: null,
    ...over,
  }
}
