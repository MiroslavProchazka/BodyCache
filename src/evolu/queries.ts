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

/**
 * Exercises within a session joined to their `exercise` for display (name,
 * type, primary photo). We intentionally do not filter the exercise's
 * `isDeleted` here so a workout keeps rendering even if the underlying
 * exercise is soft-deleted later.
 */
export const sessionExercises = (sessionId: WorkoutSessionId) =>
  evolu.createQuery((db) =>
    db
      .selectFrom('workoutExercise')
      .innerJoin('exercise', 'exercise.id', 'workoutExercise.exerciseId')
      .where('workoutExercise.isDeleted', 'is', null)
      .where('workoutExercise.workoutSessionId', '=', sessionId)
      .select([
        'workoutExercise.id as id',
        'workoutExercise.exerciseId as exerciseId',
        'workoutExercise.orderIndex as orderIndex',
        'workoutExercise.notes as notes',
        'exercise.name as exerciseName',
        'exercise.type as exerciseType',
        'exercise.primaryPhotoId as primaryPhotoId',
      ])
      .orderBy('workoutExercise.orderIndex'),
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

/**
 * Every completed set ever logged for an exercise, across all sessions, with
 * the owning session's id and start time. Feeds "last performance" and "best
 * set" (PR) calculations. Newest session first, then set order.
 */
export const completedSetsForExercise = (exerciseId: ExerciseId) =>
  evolu.createQuery((db) =>
    db
      .selectFrom('exerciseSet')
      .innerJoin(
        'workoutExercise',
        'workoutExercise.id',
        'exerciseSet.workoutExerciseId',
      )
      .innerJoin(
        'workoutSession',
        'workoutSession.id',
        'workoutExercise.workoutSessionId',
      )
      .where('exerciseSet.isDeleted', 'is', null)
      .where('exerciseSet.completedAt', 'is not', null)
      .where('workoutExercise.isDeleted', 'is', null)
      .where('workoutSession.isDeleted', 'is', null)
      .where('workoutExercise.exerciseId', '=', exerciseId)
      .select([
        'exerciseSet.id as id',
        'exerciseSet.orderIndex as orderIndex',
        'exerciseSet.weightKg as weightKg',
        'exerciseSet.reps as reps',
        'exerciseSet.addedWeightKg as addedWeightKg',
        'exerciseSet.assistanceWeightKg as assistanceWeightKg',
        'exerciseSet.durationSec as durationSec',
        'exerciseSet.distanceMeters as distanceMeters',
        'workoutExercise.workoutSessionId as sessionId',
        'workoutSession.startedAt as sessionStartedAt',
      ])
      .orderBy('workoutSession.startedAt', 'desc')
      .orderBy('exerciseSet.orderIndex'),
  )

/** Finished sessions, newest first (workout history). */
export const finishedWorkoutSessions = evolu.createQuery((db) =>
  db
    .selectFrom('workoutSession')
    .selectAll()
    .where('isDeleted', 'is', null)
    .where('status', '=', status('finished'))
    .orderBy('startedAt', 'desc'),
)
