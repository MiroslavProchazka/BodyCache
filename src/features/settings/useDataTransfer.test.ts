// @vitest-environment happy-dom
import 'fake-indexeddb/auto'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import { readPhotoBlob } from '@/shared/utils/photos'
import { BACKUP_FORMAT, BACKUP_VERSION } from './backup'

// Mock the Evolu layer so the hook runs without the SQLite/WASM worker:
// `loadQuery` returns canned table rows, `upsert` records its calls.
const { upsertMock, loadQueryMock } = vi.hoisted(() => ({
  upsertMock: vi.fn(() => ({ ok: true, value: { id: 'x' } })),
  loadQueryMock: vi.fn(),
}))
vi.mock('@/evolu/evolu', () => ({
  evolu: { loadQuery: loadQueryMock },
  useEvolu: () => ({ upsert: upsertMock }),
}))
vi.mock('@/evolu/queries', () => ({
  allExercises: 'q:exercise',
  allExercisePhotos: 'q:exercisePhoto',
  allWorkoutSessions: 'q:workoutSession',
  allWorkoutExercises: 'q:workoutExercise',
  allExerciseSets: 'q:exerciseSet',
  allPlans: 'q:plan',
  allPlanExercises: 'q:planExercise',
  allPlanSets: 'q:planSet',
}))

import { useDataTransfer } from './useDataTransfer'

const sys = {
  createdAt: '2026-06-10T09:00:00.000Z',
  updatedAt: '2026-06-10T09:00:00.000Z',
  isDeleted: null,
  ownerId: 'owner1',
}

const sampleTables: Record<string, unknown[]> = {
  'q:exercise': [
    { id: 'ex1', name: 'Squat', type: 'strength', bodyPart: 'legs', equipment: 'barbell', primaryPhotoId: null, notes: 'depth', ...sys },
  ],
  'q:exercisePhoto': [],
  'q:workoutSession': [
    { id: 's1', startedAt: '2026-06-10T09:00:00.000Z', finishedAt: '2026-06-10T10:00:00.000Z', date: '2026-06-10T09:00:00.000Z', locationName: null, notes: null, status: 'finished', ...sys },
  ],
  'q:workoutExercise': [
    { id: 'we1', workoutSessionId: 's1', exerciseId: 'ex1', orderIndex: 0, notes: null, ...sys },
  ],
  'q:exerciseSet': [
    { id: 'set1', workoutExerciseId: 'we1', orderIndex: 0, completedAt: '2026-06-10T09:05:00.000Z', weightKg: 100, reps: 5, addedWeightKg: null, assistanceWeightKg: null, durationSec: null, distanceMeters: null, inclinePercent: null, speedKmh: null, resistanceLevel: null, rpe: 8, notes: null, ...sys },
  ],
}

/** Capture the text of the single Blob handed to URL.createObjectURL. */
const captureDownload = (): { read: () => Promise<string> } => {
  let blob: Blob | null = null
  vi.spyOn(URL, 'createObjectURL').mockImplementation((b: Blob | MediaSource) => {
    blob = b as Blob
    return 'blob:mock'
  })
  vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {})
  return { read: () => (blob ? blob.text() : Promise.resolve('')) }
}

const hook = () => renderHook(() => useDataTransfer()).result

beforeEach(() => {
  upsertMock.mockClear()
  loadQueryMock.mockReset()
  loadQueryMock.mockImplementation((q: string) => sampleTables[q] ?? [])
})

afterEach(() => vi.restoreAllMocks())

describe('exportBackup', () => {
  it('produces a valid backup document with every table', async () => {
    const dl = captureDownload()
    await hook().current.exportBackup()

    const file = JSON.parse(await dl.read())
    expect(file.format).toBe(BACKUP_FORMAT)
    expect(file.version).toBe(BACKUP_VERSION)
    expect(file.tables.exercise).toHaveLength(1)
    expect(file.tables.exercise[0]).toMatchObject({ id: 'ex1', name: 'Squat' })
    expect(file.tables.exerciseSet[0]).toMatchObject({ id: 'set1', weightKg: 100 })
    expect(file.photos).toEqual([])
  })
})

describe('importBackup', () => {
  const backupText = () =>
    JSON.stringify({
      format: BACKUP_FORMAT,
      version: BACKUP_VERSION,
      exportedAt: '2026-06-11T00:00:00.000Z',
      tables: {
        exercise: sampleTables['q:exercise'],
        exercisePhoto: [
          { id: 'p1row', exerciseId: 'ex1', localUri: 'idb://p1', thumbnailUri: 'idb://p1-thumb', caption: null, ...sys },
        ],
        workoutSession: sampleTables['q:workoutSession'],
        workoutExercise: sampleTables['q:workoutExercise'],
        exerciseSet: sampleTables['q:exerciseSet'],
      },
      photos: [{ ref: 'idb://p1', mime: 'image/png', base64: btoa('imagedata') }],
    })

  it('upserts every row with its id and key columns preserved', async () => {
    const summary = await hook().current.importBackup(
      new File([backupText()], 'backup.json', { type: 'application/json' }),
    )

    expect(summary.rows).toBe(5) // 1 exercise + 1 photo + 1 session + 1 we + 1 set
    expect(summary.photos).toBe(1)

    expect(upsertMock).toHaveBeenCalledWith(
      'exercise',
      expect.objectContaining({ id: 'ex1', name: 'Squat', type: 'strength', bodyPart: 'legs' }),
    )
    expect(upsertMock).toHaveBeenCalledWith(
      'workoutSession',
      expect.objectContaining({ id: 's1', status: 'finished', finishedAt: '2026-06-10T10:00:00.000Z' }),
    )
    expect(upsertMock).toHaveBeenCalledWith(
      'workoutExercise',
      expect.objectContaining({ id: 'we1', workoutSessionId: 's1', exerciseId: 'ex1', orderIndex: 0 }),
    )
    // A pre-supersets (v2) backup omits `supersetGroup` → restored as null (standalone).
    expect(upsertMock).toHaveBeenCalledWith(
      'workoutExercise',
      expect.objectContaining({ supersetGroup: null }),
    )
    expect(upsertMock).toHaveBeenCalledWith(
      'exerciseSet',
      expect.objectContaining({ id: 'set1', workoutExerciseId: 'we1', weightKg: 100, reps: 5, rpe: 8 }),
    )
    expect(upsertMock).toHaveBeenCalledTimes(5)
  })

  it('restores photo binaries to IndexedDB', async () => {
    await hook().current.importBackup(new File([backupText()], 'backup.json'))
    expect(await readPhotoBlob('idb://p1')).not.toBeNull()
  })

  it('rejects an invalid file with a user-facing message', async () => {
    await expect(
      hook().current.importBackup(new File(['not json {'], 'x.json')),
    ).rejects.toThrow(/JSON/)
    expect(upsertMock).not.toHaveBeenCalled()
  })
})

describe('round-trip', () => {
  it('export then import upserts the original rows', async () => {
    const dl = captureDownload()
    const result = hook()
    await result.current.exportBackup()
    const exported = await dl.read()

    upsertMock.mockClear()
    await result.current.importBackup(new File([exported], 'rt.json'))

    expect(upsertMock).toHaveBeenCalledWith(
      'exercise',
      expect.objectContaining({ id: 'ex1', name: 'Squat', notes: 'depth' }),
    )
    expect(upsertMock).toHaveBeenCalledTimes(4) // no photo rows in the sample
  })
})

describe('exportCsv', () => {
  it('writes a history CSV with a header and the completed set', async () => {
    const dl = captureDownload()
    await hook().current.exportCsv()

    const csv = await dl.read()
    const lines = csv.split('\r\n')
    expect(lines[0]).toContain('date,exercise,type,body_part,set,weight_kg,reps')
    expect(lines[1]).toBe('2026-06-10,Squat,strength,legs,1,100,5,,,,,8,')
  })
})
