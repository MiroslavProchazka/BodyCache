import { useCallback } from 'react'
import { evolu, useEvolu } from '@/evolu/evolu'
import {
  allExercises,
  allExercisePhotos,
  allWorkoutSessions,
  allWorkoutExercises,
  allExerciseSets,
} from '@/evolu/queries'
import type {
  ExerciseId,
  ExercisePhotoId,
  ExerciseSetId,
  WorkoutSessionId,
  WorkoutExerciseId,
} from '@/evolu/schema'
import { base64ToBlob, blobToBase64, readPhotoBlob, writePhotoBlob } from '@/shared/utils/photos'
import {
  buildBackupFile,
  countRows,
  parseBackupFile,
  toHistoryCsv,
  type BackupFile,
  type BackupPhoto,
  type SerializedRow,
} from './backup'

/** Trigger a browser download of `text` as a file. */
const download = (filename: string, mime: string, text: string): void => {
  const url = URL.createObjectURL(new Blob([text], { type: mime }))
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

const stamp = (): string => new Date().toISOString().slice(0, 10)

/** Distinct `idb://…` refs (full + thumbnail) referenced by photo rows. */
const photoRefs = (rows: readonly SerializedRow[]): string[] => {
  const refs = new Set<string>()
  for (const row of rows) {
    if (typeof row.localUri === 'string') refs.add(row.localUri)
    if (typeof row.thumbnailUri === 'string') refs.add(row.thumbnailUri)
  }
  return [...refs]
}

/** Read every referenced photo blob and encode it for the backup file. */
const collectPhotos = async (photoRows: readonly SerializedRow[]): Promise<BackupPhoto[]> => {
  const out: BackupPhoto[] = []
  for (const ref of photoRefs(photoRows)) {
    const blob = await readPhotoBlob(ref)
    if (!blob) continue
    out.push({
      ref,
      mime: blob.type || 'image/jpeg',
      base64: await blobToBase64(blob),
    })
  }
  return out
}

/** Summary returned by `importBackup` for a confirmation toast. */
export interface RestoreSummary {
  readonly rows: number
  readonly photos: number
}

/**
 * Imperative data export/import for Settings. Reading uses `evolu.loadQuery`
 * (promise-based, fine for event handlers); restoring uses `upsert` so rows
 * keep their original ids and relationships.
 */
export const useDataTransfer = () => {
  const { upsert } = useEvolu()

  const loadTables = useCallback(
    async () => ({
      exercise: await evolu.loadQuery(allExercises),
      exercisePhoto: await evolu.loadQuery(allExercisePhotos),
      workoutSession: await evolu.loadQuery(allWorkoutSessions),
      workoutExercise: await evolu.loadQuery(allWorkoutExercises),
      exerciseSet: await evolu.loadQuery(allExerciseSets),
    }),
    [],
  )

  /** Snapshot all data + photos into a downloadable JSON backup. */
  const exportBackup = useCallback(async (): Promise<void> => {
    const tables = await loadTables()
    const photos = await collectPhotos(tables.exercisePhoto)
    const file = buildBackupFile(
      {
        exercise: tables.exercise,
        exercisePhoto: tables.exercisePhoto,
        workoutSession: tables.workoutSession,
        workoutExercise: tables.workoutExercise,
        exerciseSet: tables.exerciseSet,
      },
      photos,
    )
    download(`bodycache-backup-${stamp()}.json`, 'application/json', JSON.stringify(file))
  }, [loadTables])

  /** Export finished-workout history as a spreadsheet-friendly CSV. */
  const exportCsv = useCallback(async (): Promise<void> => {
    const tables = await loadTables()
    const csv = toHistoryCsv({
      exercises: tables.exercise,
      sessions: tables.workoutSession,
      workoutExercises: tables.workoutExercise,
      sets: tables.exerciseSet,
    })
    download(`bodycache-history-${stamp()}.csv`, 'text/csv', csv)
  }, [loadTables])

  /**
   * Restore from a backup file. Upserts every row (preserving ids, so re-importing
   * merges rather than duplicates) and writes photo binaries back to IndexedDB.
   * Throws with a user-facing message if the file is invalid.
   */
  const importBackup = useCallback(
    async (file: File): Promise<RestoreSummary> => {
      const result = parseBackupFile(await file.text())
      if (!result.ok) throw new Error(result.error)
      const { tables, photos } = result.value

      for (const r of tables.exercise) {
        upsert('exercise', {
          id: r.id as ExerciseId,
          name: r.name as string,
          type: r.type as string,
          bodyPart: (r.bodyPart as string | null) ?? null,
          equipment: (r.equipment as string | null) ?? null,
          primaryPhotoId: (r.primaryPhotoId as ExercisePhotoId | null) ?? null,
          notes: (r.notes as string | null) ?? null,
        })
      }

      for (const r of tables.workoutSession) {
        upsert('workoutSession', {
          id: r.id as WorkoutSessionId,
          startedAt: r.startedAt as string,
          finishedAt: (r.finishedAt as string | null) ?? null,
          date: r.date as string,
          locationName: (r.locationName as string | null) ?? null,
          notes: (r.notes as string | null) ?? null,
          status: r.status as string,
        })
      }

      for (const r of tables.workoutExercise) {
        upsert('workoutExercise', {
          id: r.id as WorkoutExerciseId,
          workoutSessionId: r.workoutSessionId as WorkoutSessionId,
          exerciseId: r.exerciseId as ExerciseId,
          orderIndex: r.orderIndex as number,
          notes: (r.notes as string | null) ?? null,
        })
      }

      for (const r of tables.exercisePhoto) {
        upsert('exercisePhoto', {
          id: r.id as ExercisePhotoId,
          exerciseId: r.exerciseId as ExerciseId,
          localUri: r.localUri as string,
          thumbnailUri: (r.thumbnailUri as string | null) ?? null,
          caption: (r.caption as string | null) ?? null,
        })
      }

      for (const r of tables.exerciseSet) {
        upsert('exerciseSet', {
          id: r.id as ExerciseSetId,
          workoutExerciseId: r.workoutExerciseId as WorkoutExerciseId,
          orderIndex: r.orderIndex as number,
          completedAt: (r.completedAt as string | null) ?? null,
          weightKg: (r.weightKg as number | null) ?? null,
          reps: (r.reps as number | null) ?? null,
          addedWeightKg: (r.addedWeightKg as number | null) ?? null,
          assistanceWeightKg: (r.assistanceWeightKg as number | null) ?? null,
          durationSec: (r.durationSec as number | null) ?? null,
          distanceMeters: (r.distanceMeters as number | null) ?? null,
          inclinePercent: (r.inclinePercent as number | null) ?? null,
          speedKmh: (r.speedKmh as number | null) ?? null,
          resistanceLevel: (r.resistanceLevel as number | null) ?? null,
          rpe: (r.rpe as number | null) ?? null,
          notes: (r.notes as string | null) ?? null,
        })
      }

      for (const photo of photos) {
        await writePhotoBlob(photo.ref, base64ToBlob(photo.base64, photo.mime))
      }

      return { rows: countRows(tables), photos: photos.length }
    },
    [upsert],
  )

  return { exportBackup, exportCsv, importBackup }
}

export type DataTransfer = ReturnType<typeof useDataTransfer>

/** Re-export for callers that only need the file type. */
export type { BackupFile }
