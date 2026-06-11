import { useEvolu } from './evolu'
import type {
  BodyPart,
  Equipment,
  ExerciseId,
  ExercisePhotoId,
  ExerciseSetId,
  ExerciseType,
  WorkoutExerciseId,
  WorkoutSessionId,
} from './schema'

/** Input for creating an exercise. */
export interface CreateExerciseInput {
  readonly name: string
  readonly type: ExerciseType
  readonly bodyPart?: BodyPart | null
  readonly equipment?: Equipment | null
  readonly notes?: string | null
}

/** Patch for updating an exercise (all fields optional). */
export interface UpdateExercisePatch {
  readonly name?: string
  readonly type?: ExerciseType
  readonly bodyPart?: BodyPart | null
  readonly equipment?: Equipment | null
  readonly notes?: string | null
  readonly primaryPhotoId?: ExercisePhotoId | null
}

/** Input for attaching a stored photo's metadata to an exercise. */
export interface AddPhotoInput {
  readonly localUri: string
  readonly thumbnailUri?: string | null
  readonly caption?: string | null
}

/** Numeric/text fields for a single set. */
export interface AddSetInput {
  readonly orderIndex: number
  readonly completedAt?: string | null
  readonly weightKg?: number | null
  readonly reps?: number | null
  readonly addedWeightKg?: number | null
  readonly assistanceWeightKg?: number | null
  readonly durationSec?: number | null
  readonly distanceMeters?: number | null
  readonly inclinePercent?: number | null
  readonly speedKmh?: number | null
  readonly resistanceLevel?: number | null
  readonly rpe?: number | null
  readonly notes?: string | null
}

/** Patch for updating a logged set (all fields optional). */
export interface UpdateSetPatch {
  readonly weightKg?: number | null
  readonly reps?: number | null
  readonly addedWeightKg?: number | null
  readonly assistanceWeightKg?: number | null
  readonly durationSec?: number | null
  readonly distanceMeters?: number | null
  readonly inclinePercent?: number | null
  readonly speedKmh?: number | null
  readonly resistanceLevel?: number | null
  readonly rpe?: number | null
  readonly notes?: string | null
}

/**
 * BodyCache mutation helpers.
 *
 * Mutations require Evolu's `insert`/`update` from `useEvolu()`, so they are
 * exposed as a hook. Each returns Evolu's `Result` (`{ ok, value }` on success).
 */
export const useBodyCacheMutations = () => {
  const { insert, update } = useEvolu()

  const createExercise = (input: CreateExerciseInput) =>
    insert('exercise', {
      name: input.name,
      type: input.type,
      bodyPart: input.bodyPart ?? null,
      equipment: input.equipment ?? null,
      notes: input.notes ?? null,
    })

  const updateExercise = (id: ExerciseId, patch: UpdateExercisePatch) =>
    update('exercise', { id, ...patch })

  /** Soft-delete via Evolu's `isDeleted` system column. */
  const softDeleteExercise = (id: ExerciseId) =>
    update('exercise', { id, isDeleted: 1 })

  /**
   * Insert photo metadata for an exercise. The binary itself lives in
   * IndexedDB (see `shared/utils/photos.ts`); `localUri`/`thumbnailUri` are
   * the `idb://` references, never the image data.
   */
  const addExercisePhoto = (exerciseId: ExerciseId, input: AddPhotoInput) =>
    insert('exercisePhoto', {
      exerciseId,
      localUri: input.localUri,
      thumbnailUri: input.thumbnailUri ?? null,
      caption: input.caption ?? null,
    })

  /** Point an exercise at its primary photo. */
  const setPrimaryPhoto = (id: ExerciseId, primaryPhotoId: ExercisePhotoId) =>
    update('exercise', { id, primaryPhotoId })

  const startWorkoutSession = () => {
    const now = new Date().toISOString()
    return insert('workoutSession', {
      startedAt: now,
      date: now,
      status: 'active',
    })
  }

  const finishWorkoutSession = (id: WorkoutSessionId) =>
    update('workoutSession', {
      id,
      status: 'finished',
      finishedAt: new Date().toISOString(),
    })

  const addExerciseToWorkout = (
    sessionId: WorkoutSessionId,
    exerciseId: ExerciseId,
    orderIndex: number,
  ) =>
    insert('workoutExercise', {
      workoutSessionId: sessionId,
      exerciseId,
      orderIndex,
    })

  const addSet = (workoutExerciseId: WorkoutExerciseId, setData: AddSetInput) =>
    insert('exerciseSet', {
      workoutExerciseId,
      orderIndex: setData.orderIndex,
      completedAt: setData.completedAt ?? null,
      weightKg: setData.weightKg ?? null,
      reps: setData.reps ?? null,
      addedWeightKg: setData.addedWeightKg ?? null,
      assistanceWeightKg: setData.assistanceWeightKg ?? null,
      durationSec: setData.durationSec ?? null,
      distanceMeters: setData.distanceMeters ?? null,
      inclinePercent: setData.inclinePercent ?? null,
      speedKmh: setData.speedKmh ?? null,
      resistanceLevel: setData.resistanceLevel ?? null,
      rpe: setData.rpe ?? null,
      notes: setData.notes ?? null,
    })

  const updateSet = (id: ExerciseSetId, patch: UpdateSetPatch) =>
    update('exerciseSet', { id, ...patch })

  /** Toggle a set's completion. Stamps `completedAt` (now) or clears it. */
  const setSetCompleted = (id: ExerciseSetId, completed: boolean) =>
    update('exerciseSet', {
      id,
      completedAt: completed ? new Date().toISOString() : null,
    })

  const removeSet = (id: ExerciseSetId) =>
    update('exerciseSet', { id, isDeleted: 1 })

  const removeExerciseFromWorkout = (id: WorkoutExerciseId) =>
    update('workoutExercise', { id, isDeleted: 1 })

  /** Discard an in-progress session (e.g. started by mistake). */
  const discardWorkoutSession = (id: WorkoutSessionId) =>
    update('workoutSession', { id, isDeleted: 1 })

  /**
   * Soft-delete a finished session from history. Child rows (exercises, sets)
   * stay in place but are excluded everywhere by the session join + isDeleted
   * filter, so they never resurface.
   */
  const deleteWorkoutSession = (id: WorkoutSessionId) =>
    update('workoutSession', { id, isDeleted: 1 })

  return {
    createExercise,
    updateExercise,
    softDeleteExercise,
    addExercisePhoto,
    setPrimaryPhoto,
    startWorkoutSession,
    finishWorkoutSession,
    discardWorkoutSession,
    deleteWorkoutSession,
    addExerciseToWorkout,
    removeExerciseFromWorkout,
    addSet,
    updateSet,
    setSetCompleted,
    removeSet,
  }
}
