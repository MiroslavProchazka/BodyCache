import * as Evolu from '@evolu/common'

/**
 * BodyCache Evolu schema.
 *
 * System columns (`createdAt`, `updatedAt`, `isDeleted`, `ownerId`) are added
 * automatically by Evolu and must NOT be declared here. Optional columns are
 * wrapped in `Evolu.nullOr(...)`; everything else is required.
 *
 * Evolu currently exposes a single-`literal` Type but no multi-literal `union`
 * helper, so enum-like columns use `NonEmptyString100` for storage and a
 * separate exported TypeScript union type for the app layer. The allowed values
 * are also exported as `as const` arrays for dropdowns.
 */

// --- Branded IDs ----------------------------------------------------------

export const ExerciseId = Evolu.id('Exercise')
export type ExerciseId = typeof ExerciseId.Type

export const ExercisePhotoId = Evolu.id('ExercisePhoto')
export type ExercisePhotoId = typeof ExercisePhotoId.Type

export const WorkoutSessionId = Evolu.id('WorkoutSession')
export type WorkoutSessionId = typeof WorkoutSessionId.Type

export const WorkoutExerciseId = Evolu.id('WorkoutExercise')
export type WorkoutExerciseId = typeof WorkoutExerciseId.Type

export const ExerciseSetId = Evolu.id('ExerciseSet')
export type ExerciseSetId = typeof ExerciseSetId.Type

export const ProfileId = Evolu.id('Profile')
export type ProfileId = typeof ProfileId.Type

// --- Enum-like value sets -------------------------------------------------

export const EXERCISE_TYPES = [
  'strength',
  'bodyweight',
  'timed',
  'distance',
  'freeform',
] as const
export type ExerciseType = (typeof EXERCISE_TYPES)[number]

export const BODY_PARTS = [
  'chest',
  'back',
  'legs',
  'shoulders',
  'arms',
  'core',
  'cardio',
  'full_body',
  'other',
] as const
export type BodyPart = (typeof BODY_PARTS)[number]

export const EQUIPMENT = [
  'machine',
  'dumbbell',
  'barbell',
  'cable',
  'bodyweight',
  'treadmill',
  'bike',
  'rower',
  'other',
] as const
export type Equipment = (typeof EQUIPMENT)[number]

export const WORKOUT_STATUSES = ['active', 'finished'] as const
export type WorkoutStatus = (typeof WORKOUT_STATUSES)[number]

/**
 * Optional per-set annotation. A `null` set type is a normal working set; the
 * named types let the app exclude warm-ups from records and tint set chips.
 */
export const SET_TYPES = ['warmup', 'drop', 'failure'] as const
export type SetType = (typeof SET_TYPES)[number]

export const GENDERS = ['male', 'female', 'other'] as const
export type Gender = (typeof GENDERS)[number]

// --- Schema ---------------------------------------------------------------

export const Schema = {
  exercise: {
    id: ExerciseId,
    name: Evolu.NonEmptyString1000,
    // Stored as NonEmptyString100; constrained to `ExerciseType` in the app layer.
    type: Evolu.NonEmptyString100,
    bodyPart: Evolu.nullOr(Evolu.NonEmptyString100),
    equipment: Evolu.nullOr(Evolu.NonEmptyString100),
    primaryPhotoId: Evolu.nullOr(ExercisePhotoId),
    notes: Evolu.nullOr(Evolu.NonEmptyString1000),
  },

  exercisePhoto: {
    id: ExercisePhotoId,
    exerciseId: ExerciseId,
    localUri: Evolu.NonEmptyString1000,
    thumbnailUri: Evolu.nullOr(Evolu.NonEmptyString1000),
    caption: Evolu.nullOr(Evolu.NonEmptyString1000),
  },

  workoutSession: {
    id: WorkoutSessionId,
    startedAt: Evolu.DateIso,
    finishedAt: Evolu.nullOr(Evolu.DateIso),
    date: Evolu.DateIso,
    locationName: Evolu.nullOr(Evolu.NonEmptyString1000),
    notes: Evolu.nullOr(Evolu.NonEmptyString1000),
    // Stored as NonEmptyString100; constrained to `WorkoutStatus` in the app layer.
    status: Evolu.NonEmptyString100,
  },

  workoutExercise: {
    id: WorkoutExerciseId,
    workoutSessionId: WorkoutSessionId,
    exerciseId: ExerciseId,
    orderIndex: Evolu.NonNegativeInt,
    notes: Evolu.nullOr(Evolu.NonEmptyString1000),
  },

  exerciseSet: {
    id: ExerciseSetId,
    workoutExerciseId: WorkoutExerciseId,
    orderIndex: Evolu.NonNegativeInt,
    // Set null while a row is still being entered; stamped when the user
    // taps the set complete. Drives the tap-to-complete UX and lets the app
    // ignore half-entered rows when computing last performance / PRs.
    completedAt: Evolu.nullOr(Evolu.DateIso),
    weightKg: Evolu.nullOr(Evolu.NonNegativeNumber),
    reps: Evolu.nullOr(Evolu.NonNegativeInt),
    addedWeightKg: Evolu.nullOr(Evolu.NonNegativeNumber),
    assistanceWeightKg: Evolu.nullOr(Evolu.NonNegativeNumber),
    durationSec: Evolu.nullOr(Evolu.NonNegativeInt),
    distanceMeters: Evolu.nullOr(Evolu.NonNegativeNumber),
    inclinePercent: Evolu.nullOr(Evolu.FiniteNumber),
    speedKmh: Evolu.nullOr(Evolu.NonNegativeNumber),
    resistanceLevel: Evolu.nullOr(Evolu.NonNegativeInt),
    rpe: Evolu.nullOr(Evolu.NonNegativeInt),
    // Stored as NonEmptyString100; null = normal set, else narrowed to `SetType`.
    setType: Evolu.nullOr(Evolu.NonEmptyString100),
    notes: Evolu.nullOr(Evolu.NonEmptyString1000),
  },

  /**
   * The user's profile. A singleton in practice (one row per owner); the app
   * reads the first live row. `weightKg`/`heightCm` are canonical metric units
   * (weight displayed in the active kg/lb unit). `avatarSeed` is a short string
   * the app turns into a generated SVG avatar — never an image binary, per the
   * photo rules.
   */
  profile: {
    id: ProfileId,
    name: Evolu.NonEmptyString100,
    // Stored as NonEmptyString100; constrained to `Gender` in the app layer.
    gender: Evolu.NonEmptyString100,
    weightKg: Evolu.NonNegativeNumber,
    heightCm: Evolu.NonNegativeInt,
    age: Evolu.NonNegativeInt,
    avatarSeed: Evolu.NonEmptyString100,
  },
}
