import * as Evolu from '@evolu/common'
import { evolu } from './evolu'
import type {
  ExerciseId,
  ExercisePhotoId,
  PlanExerciseId,
  PlanId,
  PlanStatus,
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

/** As `status`, but for the plan `status` column. */
const planStatusValue = (value: PlanStatus): typeof Evolu.NonEmptyString100.Type =>
  value as typeof Evolu.NonEmptyString100.Type

/**
 * Reactive Evolu queries for BodyCache.
 *
 * Soft-deleted rows are excluded with `where('isDeleted', 'is', null)`, which
 * is Evolu's convention (the system `isDeleted` column is `null` for live rows
 * and `1` once soft-deleted).
 */

/**
 * The user's profile. Modelled as a singleton: there is one profile per owner,
 * so callers read the first row. Ordered by `createdAt` for a deterministic
 * pick if two devices ever created one before syncing.
 */
export const userProfile = evolu.createQuery((db) =>
  db
    .selectFrom('profile')
    .selectAll()
    .where('isDeleted', 'is', null)
    .orderBy('createdAt')
    .limit(1),
)

/** All non-deleted exercises, ordered by name. */
export const allExercises = evolu.createQuery((db) =>
  db
    .selectFrom('exercise')
    .selectAll()
    .where('isDeleted', 'is', null)
    .orderBy('name'),
)

/**
 * Whole-table "live rows" queries used by the backup/export feature in
 * Settings. They mirror `allExercises` for the remaining tables so a backup can
 * snapshot every non-deleted row the user still has. Soft-deleted rows are
 * intentionally excluded — a backup captures the data the user kept, not the
 * data they threw away.
 */
export const allExercisePhotos = evolu.createQuery((db) =>
  db.selectFrom('exercisePhoto').selectAll().where('isDeleted', 'is', null),
)

export const allWorkoutSessions = evolu.createQuery((db) =>
  db.selectFrom('workoutSession').selectAll().where('isDeleted', 'is', null),
)

export const allWorkoutExercises = evolu.createQuery((db) =>
  db.selectFrom('workoutExercise').selectAll().where('isDeleted', 'is', null),
)

export const allExerciseSets = evolu.createQuery((db) =>
  db.selectFrom('exerciseSet').selectAll().where('isDeleted', 'is', null),
)

export const allPlans = evolu.createQuery((db) =>
  db.selectFrom('plan').selectAll().where('isDeleted', 'is', null),
)

export const allPlanExercises = evolu.createQuery((db) =>
  db.selectFrom('planExercise').selectAll().where('isDeleted', 'is', null),
)

export const allPlanSets = evolu.createQuery((db) =>
  db.selectFrom('planSet').selectAll().where('isDeleted', 'is', null),
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

/**
 * Most recent in-progress session — either actively running or paused. Paused
 * sessions must still surface so the user can resume (or discard) them, so this
 * matches both statuses rather than 'active' alone.
 */
export const activeWorkoutSession = evolu.createQuery((db) =>
  db
    .selectFrom('workoutSession')
    .selectAll()
    .where('isDeleted', 'is', null)
    .where('status', 'in', [status('active'), status('paused')])
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
        'exercise.bodyPart as bodyPart',
        'exercise.equipment as equipment',
        'exercise.primaryPhotoId as primaryPhotoId',
      ])
      .orderBy('workoutExercise.orderIndex'),
  )

/**
 * All logged sets in a session, joined to their exercise's name and body part,
 * with weight/reps for volume. Unlike `completedSetsForExercise`, this does not
 * require `completedAt` — the live muscle-distribution map counts every set the
 * user has logged in the in-progress workout. Soft-deleted rows are excluded.
 */
export const sessionSetsForDistribution = (sessionId: WorkoutSessionId) =>
  evolu.createQuery((db) =>
    db
      .selectFrom('exerciseSet')
      .innerJoin('workoutExercise', 'workoutExercise.id', 'exerciseSet.workoutExerciseId')
      .innerJoin('exercise', 'exercise.id', 'workoutExercise.exerciseId')
      .where('exerciseSet.isDeleted', 'is', null)
      .where('workoutExercise.isDeleted', 'is', null)
      .where('workoutExercise.workoutSessionId', '=', sessionId)
      .select([
        'exerciseSet.id as id',
        'exerciseSet.weightKg as weightKg',
        'exerciseSet.reps as reps',
        'workoutExercise.exerciseId as exerciseId',
        'exercise.name as exerciseName',
        'exercise.bodyPart as bodyPart',
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
        'exerciseSet.setType as setType',
        'exerciseSet.rpe as rpe',
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

/**
 * Every completed set across all finished sessions, with its session id, body
 * part and the session's start time. One query feeds the whole History list
 * (per-session summaries, grouped in JS) and the all-time aggregate stats —
 * avoiding an N+1 query per session row.
 */
export const finishedSessionSets = evolu.createQuery((db) =>
  db
    .selectFrom('exerciseSet')
    .innerJoin('workoutExercise', 'workoutExercise.id', 'exerciseSet.workoutExerciseId')
    .innerJoin('workoutSession', 'workoutSession.id', 'workoutExercise.workoutSessionId')
    .innerJoin('exercise', 'exercise.id', 'workoutExercise.exerciseId')
    .where('exerciseSet.isDeleted', 'is', null)
    .where('exerciseSet.completedAt', 'is not', null)
    .where('workoutExercise.isDeleted', 'is', null)
    .where('workoutSession.isDeleted', 'is', null)
    .where('workoutSession.status', '=', status('finished'))
    .select([
      'exerciseSet.id as id',
      'exerciseSet.weightKg as weightKg',
      'exerciseSet.reps as reps',
      'exerciseSet.addedWeightKg as addedWeightKg',
      'exerciseSet.assistanceWeightKg as assistanceWeightKg',
      'exerciseSet.durationSec as durationSec',
      'exerciseSet.distanceMeters as distanceMeters',
      'exerciseSet.setType as setType',
      'workoutExercise.exerciseId as exerciseId',
      'workoutExercise.orderIndex as exerciseOrder',
      'exercise.name as exerciseName',
      'exercise.type as exerciseType',
      'exercise.bodyPart as bodyPart',
      'workoutExercise.workoutSessionId as sessionId',
      'workoutSession.startedAt as sessionStartedAt',
    ]),
)

/**
 * Completed sets within a single session, joined to their exercise, with the
 * full metric columns needed to render each set per its type. Ordered by
 * exercise then set; callers group by `workoutExerciseId` for the breakdown on
 * the session detail screen.
 */
export const sessionSetsDetailed = (sessionId: WorkoutSessionId) =>
  evolu.createQuery((db) =>
    db
      .selectFrom('exerciseSet')
      .innerJoin('workoutExercise', 'workoutExercise.id', 'exerciseSet.workoutExerciseId')
      .innerJoin('exercise', 'exercise.id', 'workoutExercise.exerciseId')
      .where('exerciseSet.isDeleted', 'is', null)
      .where('exerciseSet.completedAt', 'is not', null)
      .where('workoutExercise.isDeleted', 'is', null)
      .where('workoutExercise.workoutSessionId', '=', sessionId)
      .select([
        'exerciseSet.id as id',
        'exerciseSet.orderIndex as orderIndex',
        'exerciseSet.weightKg as weightKg',
        'exerciseSet.reps as reps',
        'exerciseSet.addedWeightKg as addedWeightKg',
        'exerciseSet.assistanceWeightKg as assistanceWeightKg',
        'exerciseSet.durationSec as durationSec',
        'exerciseSet.distanceMeters as distanceMeters',
        'exerciseSet.setType as setType',
        'workoutExercise.id as workoutExerciseId',
        'workoutExercise.orderIndex as exerciseOrder',
        'workoutExercise.exerciseId as exerciseId',
        'exercise.name as exerciseName',
        'exercise.type as exerciseType',
        'exercise.bodyPart as bodyPart',
        'exercise.primaryPhotoId as primaryPhotoId',
      ])
      .orderBy('workoutExercise.orderIndex')
      .orderBy('exerciseSet.orderIndex'),
  )

/**
 * Completed sets within a session, with every metric column plus the owning
 * `workoutExerciseId` and exercise order. Feeds "repeat this workout": each
 * completed set is copied verbatim into a fresh session as an incomplete ghost
 * the user confirms or edits. Grouped by `workoutExerciseId` in JS. Ordered by
 * exercise then set so the rebuilt session preserves the original order.
 */
export const sessionSetsForRepeat = (sessionId: WorkoutSessionId) =>
  evolu.createQuery((db) =>
    db
      .selectFrom('exerciseSet')
      .innerJoin('workoutExercise', 'workoutExercise.id', 'exerciseSet.workoutExerciseId')
      .where('exerciseSet.isDeleted', 'is', null)
      .where('exerciseSet.completedAt', 'is not', null)
      .where('workoutExercise.isDeleted', 'is', null)
      .where('workoutExercise.workoutSessionId', '=', sessionId)
      .select([
        'exerciseSet.id as id',
        'exerciseSet.orderIndex as orderIndex',
        'exerciseSet.weightKg as weightKg',
        'exerciseSet.reps as reps',
        'exerciseSet.addedWeightKg as addedWeightKg',
        'exerciseSet.assistanceWeightKg as assistanceWeightKg',
        'exerciseSet.durationSec as durationSec',
        'exerciseSet.distanceMeters as distanceMeters',
        'exerciseSet.inclinePercent as inclinePercent',
        'exerciseSet.speedKmh as speedKmh',
        'exerciseSet.resistanceLevel as resistanceLevel',
        'exerciseSet.rpe as rpe',
        'exerciseSet.setType as setType',
        'workoutExercise.id as workoutExerciseId',
        'workoutExercise.orderIndex as exerciseOrder',
      ])
      .orderBy('workoutExercise.orderIndex')
      .orderBy('exerciseSet.orderIndex'),
  )

/** A single session by id (any status, non-deleted). */
export const sessionById = (id: WorkoutSessionId) =>
  evolu.createQuery((db) =>
    db
      .selectFrom('workoutSession')
      .selectAll()
      .where('id', '=', id)
      .where('isDeleted', 'is', null),
  )

/**
 * Completed sets within a finished session, joined to their exercise (for
 * body part / volume / naming). Feeds the Home "last workout" card and the
 * Finish summary. Ordered by exercise then set.
 */
export const completedSetsForSession = (sessionId: WorkoutSessionId) =>
  evolu.createQuery((db) =>
    db
      .selectFrom('exerciseSet')
      .innerJoin('workoutExercise', 'workoutExercise.id', 'exerciseSet.workoutExerciseId')
      .innerJoin('exercise', 'exercise.id', 'workoutExercise.exerciseId')
      .where('exerciseSet.isDeleted', 'is', null)
      .where('exerciseSet.completedAt', 'is not', null)
      .where('workoutExercise.isDeleted', 'is', null)
      .where('workoutExercise.workoutSessionId', '=', sessionId)
      .select([
        'exerciseSet.id as id',
        'exerciseSet.weightKg as weightKg',
        'exerciseSet.reps as reps',
        'workoutExercise.exerciseId as exerciseId',
        'workoutExercise.orderIndex as exerciseOrder',
        'exercise.bodyPart as bodyPart',
      ])
      .orderBy('workoutExercise.orderIndex'),
  )

/**
 * Distinct exercises that have been performed in a finished session, each with
 * the most recent such session's start time, newest first. Rows repeat per
 * completed set; callers de-duplicate by `id` to get a recency-ordered list
 * for the Home "recent exercises" rail.
 */
export const performedExercises = evolu.createQuery((db) =>
  db
    .selectFrom('exerciseSet')
    .innerJoin('workoutExercise', 'workoutExercise.id', 'exerciseSet.workoutExerciseId')
    .innerJoin('workoutSession', 'workoutSession.id', 'workoutExercise.workoutSessionId')
    .innerJoin('exercise', 'exercise.id', 'workoutExercise.exerciseId')
    .where('exerciseSet.isDeleted', 'is', null)
    .where('exerciseSet.completedAt', 'is not', null)
    .where('workoutExercise.isDeleted', 'is', null)
    .where('workoutSession.isDeleted', 'is', null)
    .where('workoutSession.status', '=', status('finished'))
    .where('exercise.isDeleted', 'is', null)
    .select([
      'exercise.id as id',
      'exercise.name as name',
      'exercise.type as type',
      'exercise.bodyPart as bodyPart',
      'exercise.equipment as equipment',
      'exercise.primaryPhotoId as primaryPhotoId',
      'workoutSession.startedAt as startedAt',
    ])
    .orderBy('workoutSession.startedAt', 'desc'),
)

// --- Plans (routines) -----------------------------------------------------

/**
 * Active plans for the library, newest first. Archived plans are kept (not
 * deleted) but intentionally excluded here so the picker stays uncluttered.
 */
export const activePlans = evolu.createQuery((db) =>
  db
    .selectFrom('plan')
    .selectAll()
    .where('isDeleted', 'is', null)
    .where('status', '=', planStatusValue('active'))
    .orderBy('createdAt', 'desc'),
)

/** A single plan by id (any status, non-deleted). */
export const planById = (id: PlanId) =>
  evolu.createQuery((db) =>
    db.selectFrom('plan').selectAll().where('id', '=', id).where('isDeleted', 'is', null),
  )

/**
 * Exercises within a plan joined to their `exercise` for display (name, type,
 * body part, primary photo). As with `sessionExercises`, the exercise's own
 * `isDeleted` is not filtered so a plan keeps rendering if an exercise is
 * soft-deleted later.
 */
export const planExercises = (planId: PlanId) =>
  evolu.createQuery((db) =>
    db
      .selectFrom('planExercise')
      .innerJoin('exercise', 'exercise.id', 'planExercise.exerciseId')
      .where('planExercise.isDeleted', 'is', null)
      .where('planExercise.planId', '=', planId)
      .select([
        'planExercise.id as id',
        'planExercise.exerciseId as exerciseId',
        'planExercise.orderIndex as orderIndex',
        'planExercise.notes as notes',
        'exercise.name as exerciseName',
        'exercise.type as exerciseType',
        'exercise.bodyPart as bodyPart',
        'exercise.equipment as equipment',
        'exercise.primaryPhotoId as primaryPhotoId',
      ])
      .orderBy('planExercise.orderIndex'),
  )

/** Target sets for a plan exercise, in order. */
export const planSetsForPlanExercise = (planExerciseId: PlanExerciseId) =>
  evolu.createQuery((db) =>
    db
      .selectFrom('planSet')
      .selectAll()
      .where('isDeleted', 'is', null)
      .where('planExerciseId', '=', planExerciseId)
      .orderBy('orderIndex'),
  )

/**
 * Every target set across all exercises in a plan, with its owning
 * `planExerciseId`. One query feeds plan instantiation (grouped by exercise in
 * JS) — avoiding an N+1 query per plan exercise.
 */
export const planSetsForPlan = (planId: PlanId) =>
  evolu.createQuery((db) =>
    db
      .selectFrom('planSet')
      .innerJoin('planExercise', 'planExercise.id', 'planSet.planExerciseId')
      .where('planSet.isDeleted', 'is', null)
      .where('planExercise.isDeleted', 'is', null)
      .where('planExercise.planId', '=', planId)
      .select([
        'planSet.id as id',
        'planSet.planExerciseId as planExerciseId',
        'planSet.orderIndex as orderIndex',
        'planSet.weightKg as weightKg',
        'planSet.reps as reps',
        'planSet.addedWeightKg as addedWeightKg',
        'planSet.durationSec as durationSec',
        'planSet.distanceMeters as distanceMeters',
        'planSet.setType as setType',
      ])
      .orderBy('planSet.orderIndex'),
  )
