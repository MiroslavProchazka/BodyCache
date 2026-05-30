import { useEvolu } from './evolu'
import type {
  BodyPart,
  Equipment,
  ExerciseId,
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
}

/** Numeric/text fields for a single set. */
export interface AddSetInput {
  readonly orderIndex: number
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

  return {
    createExercise,
    updateExercise,
    softDeleteExercise,
    startWorkoutSession,
    finishWorkoutSession,
    addExerciseToWorkout,
    addSet,
  }
}
