import * as Evolu from '@evolu/common'
import { evolu } from './evolu'
import type {
  ExerciseId,
  ExercisePhotoId,
  WorkoutSessionId,
  WorkoutExerciseId,
  WorkoutStatus,
} from './schema'

/**
 * The `status` column is stored as the branded `NonEmptyString100` type, so
 * literal comparison values must carry the same brand. This narrows a known
 * `WorkoutStatus` to the branded column type for use in `where(...)`.
 */
const status = (value: WorkoutStatus): typeof Evolu.NonEmptyString100.Type =>
  value as typeof Evolu.NonEmptyString100.Type

/**
 * Reactive Evolu queries for BodyCache.
 *
 * Soft-deleted rows are excluded with `where('isDeleted', 'is', null)`, which
 * is Evolu's convention (the system `isDeleted` column is `null` for live rows
 * and `1` once soft-deleted).
 */

/** All non-deleted exercises, ordered by name. */
export const allExercises = evolu.createQuery((db) =>
  db
    .selectFrom('exercise')
    .selectAll()
    .where('isDeleted', 'is', null)
    .orderBy('name'),
)

/** A single exercise by id (non-deleted). */
export const exerciseById = (id: ExerciseId) =>
  evolu.createQuery((db) =>
    db
      .selectFrom('exercise')
      .selectAll()
      .where('id', '=', id)
      .where('isDeleted', 'is', null),
  )

/** A single photo by id (non-deleted). */
export const photoById = (id: ExercisePhotoId) =>
  evolu.createQuery((db) =>
    db
      .selectFrom('exercisePhoto')
      .selectAll()
      .where('id', '=', id)
      .where('isDeleted', 'is', null),
  )

/** All photos for an exercise, newest first. */
export const photosForExercise = (exerciseId: ExerciseId) =>
  evolu.createQuery((db) =>
    db
      .selectFrom('exercisePhoto')
      .selectAll()
      .where('isDeleted', 'is', null)
      .where('exerciseId', '=', exerciseId)
      .orderBy('createdAt', 'desc'),
  )

/** Most recent session with status 'active'. */
export const activeWorkoutSession = evolu.createQuery((db) =>
  db
    .selectFrom('workoutSession')
    .selectAll()
    .where('isDeleted', 'is', null)
    .where('status', '=', status('active'))
    .orderBy('startedAt', 'desc')
    .limit(1),
)

/** Exercises within a session, in order. */
export const workoutExercisesForSession = (sessionId: WorkoutSessionId) =>
  evolu.createQuery((db) =>
    db
      .selectFrom('workoutExercise')
      .selectAll()
      .where('isDeleted', 'is', null)
      .where('workoutSessionId', '=', sessionId)
      .orderBy('orderIndex'),
  )

/** Sets for a workout exercise, in order. */
export const setsForWorkoutExercise = (workoutExerciseId: WorkoutExerciseId) =>
  evolu.createQuery((db) =>
    db
      .selectFrom('exerciseSet')
      .selectAll()
      .where('isDeleted', 'is', null)
      .where('workoutExerciseId', '=', workoutExerciseId)
      .orderBy('orderIndex'),
  )
