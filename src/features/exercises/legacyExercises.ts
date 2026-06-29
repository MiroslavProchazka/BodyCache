import type { ExerciseRow } from '@/evolu/rows'

/**
 * "Legacy" (old-design) exercises: the ones the photo-first library renders
 * with the purple muscle-map placeholder because they carry no primary photo.
 *
 * The library card (`ExerciseCard` → `ExerciseTile`) only shows a captured
 * photo/GIF when `primaryPhotoId` is set; without it the `BodyMap` placeholder
 * is drawn. These entries predate the GIF-equipped starter catalog (or were
 * added while offline, when the best-effort animation download failed), so a
 * cleanup that drops them leaves only the GIF-style exercises.
 *
 * Soft-deleting them is safe for history: the history/detail queries join on
 * the exercise regardless of its `isDeleted` flag, so past workouts keep
 * rendering. The user can always re-add the exercise from the starter library
 * to get the animated version.
 */
export function legacyExercises(rows: readonly ExerciseRow[]): readonly ExerciseRow[] {
  return rows.filter((e) => !e.primaryPhotoId)
}
