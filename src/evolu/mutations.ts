import { useEvolu } from './evolu'
import type {
  BodyPart,
  Equipment,
  ExerciseId,
  ExercisePhotoId,
  ExerciseSetId,
  ExerciseType,
  Gender,
  PlanExerciseId,
  PlanId,
  PlanSetId,
  ProfileId,
  SetType,
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
  readonly setType?: SetType | null
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
  readonly setType?: SetType | null
  readonly notes?: string | null
}

/**
 * Patch for editing a finished session's timestamps (all fields optional).
 * Timestamps are passed as ISO strings, which Evolu's `DateIso` accepts.
 */
export interface UpdateWorkoutSessionPatch {
  readonly startedAt?: string
  readonly finishedAt?: string | null
  readonly date?: string
}

/** Input for creating the user's profile. */
export interface CreateProfileInput {
  readonly name: string
  readonly gender: Gender
  readonly weightKg: number
  readonly heightCm: number
  readonly age: number
  readonly avatarSeed: string
}

/** Patch for updating the profile (all fields optional). */
export interface UpdateProfilePatch {
  readonly name?: string
  readonly gender?: Gender
  readonly weightKg?: number
  readonly heightCm?: number
  readonly age?: number
  readonly avatarSeed?: string
}

/** Input for creating a plan. */
export interface CreatePlanInput {
  readonly name: string
  readonly notes?: string | null
}

/** Patch for updating a plan (all fields optional). */
export interface UpdatePlanPatch {
  readonly name?: string
  readonly notes?: string | null
}

/** Target metric/text fields for a single plan set. */
export interface AddPlanSetInput {
  readonly orderIndex: number
  readonly weightKg?: number | null
  readonly reps?: number | null
  readonly addedWeightKg?: number | null
  readonly durationSec?: number | null
  readonly distanceMeters?: number | null
  readonly setType?: SetType | null
}

/** Patch for updating a plan set (all fields optional). */
export interface UpdatePlanSetPatch {
  readonly weightKg?: number | null
  readonly reps?: number | null
  readonly addedWeightKg?: number | null
  readonly durationSec?: number | null
  readonly distanceMeters?: number | null
  readonly setType?: SetType | null
}

/**
 * BodyCache mutation helpers.
 *
 * Mutations require Evolu's `insert`/`update` from `useEvolu()`, so they are
 * exposed as a hook. Each returns Evolu's `Result` (`{ ok, value }` on success).
 */
export const useBodyCacheMutations = () => {
  const { insert, update } = useEvolu()

  const createProfile = (input: CreateProfileInput) =>
    insert('profile', {
      name: input.name,
      gender: input.gender,
      weightKg: input.weightKg,
      heightCm: input.heightCm,
      age: input.age,
      avatarSeed: input.avatarSeed,
    })

  const updateProfile = (id: ProfileId, patch: UpdateProfilePatch) =>
    update('profile', { id, ...patch })

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
      // The first active interval begins at start; no time banked yet.
      resumedAt: now,
      pausedTotalSec: 0,
    })
  }

  /**
   * Pause a live session. `activeSec` is the active time accumulated so far
   * (from `activeElapsedSec`); banking it and clearing `resumedAt` freezes the
   * timer until the session resumes.
   */
  const pauseWorkoutSession = (id: WorkoutSessionId, activeSec: number) =>
    update('workoutSession', {
      id,
      status: 'paused',
      pausedTotalSec: Math.max(0, Math.floor(activeSec)),
      resumedAt: null,
    })

  /** Resume a paused session: start a fresh active interval from now. */
  const resumeWorkoutSession = (id: WorkoutSessionId) =>
    update('workoutSession', {
      id,
      status: 'active',
      resumedAt: new Date().toISOString(),
    })

  /**
   * Finish a session. `activeSec` is the total active time (from
   * `activeElapsedSec`); storing it as `pausedTotalSec` lets recaps show the
   * worked duration excluding any paused stretches.
   */
  const finishWorkoutSession = (id: WorkoutSessionId, activeSec: number) =>
    update('workoutSession', {
      id,
      status: 'finished',
      finishedAt: new Date().toISOString(),
      pausedTotalSec: Math.max(0, Math.floor(activeSec)),
      resumedAt: null,
    })

  const addExerciseToWorkout = (
    sessionId: WorkoutSessionId,
    exerciseId: ExerciseId,
    orderIndex: number,
    supersetGroup: string | null = null,
  ) =>
    insert('workoutExercise', {
      workoutSessionId: sessionId,
      exerciseId,
      orderIndex,
      supersetGroup,
    })

  /** Move a workout exercise within its session (reorder, mirrors plans). */
  const setWorkoutExerciseOrder = (id: WorkoutExerciseId, orderIndex: number) =>
    update('workoutExercise', { id, orderIndex })

  /** Assign or clear a workout exercise's opaque superset key. */
  const setWorkoutExerciseSuperset = (id: WorkoutExerciseId, supersetGroup: string | null) =>
    update('workoutExercise', { id, supersetGroup })

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
      setType: setData.setType ?? null,
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

  // --- Plans (routines) ---------------------------------------------------

  const createPlan = (input: CreatePlanInput) =>
    insert('plan', {
      name: input.name,
      status: 'active',
      notes: input.notes ?? null,
    })

  const updatePlan = (id: PlanId, patch: UpdatePlanPatch) => update('plan', { id, ...patch })

  /** Hide a plan from the library without losing it. */
  const archivePlan = (id: PlanId) => update('plan', { id, status: 'archived' })

  /** Bring an archived plan back into the active library. */
  const restorePlan = (id: PlanId) => update('plan', { id, status: 'active' })

  const softDeletePlan = (id: PlanId) => update('plan', { id, isDeleted: 1 })

  const addExerciseToPlan = (planId: PlanId, exerciseId: ExerciseId, orderIndex: number) =>
    insert('planExercise', { planId, exerciseId, orderIndex })

  const removeExerciseFromPlan = (id: PlanExerciseId) =>
    update('planExercise', { id, isDeleted: 1 })

  /** Move a plan exercise within its plan (reorder). */
  const setPlanExerciseOrder = (id: PlanExerciseId, orderIndex: number) =>
    update('planExercise', { id, orderIndex })

  /** Assign or clear a plan exercise's opaque superset key. */
  const setPlanExerciseSuperset = (id: PlanExerciseId, supersetGroup: string | null) =>
    update('planExercise', { id, supersetGroup })

  const addPlanSet = (planExerciseId: PlanExerciseId, setData: AddPlanSetInput) =>
    insert('planSet', {
      planExerciseId,
      orderIndex: setData.orderIndex,
      weightKg: setData.weightKg ?? null,
      reps: setData.reps ?? null,
      addedWeightKg: setData.addedWeightKg ?? null,
      durationSec: setData.durationSec ?? null,
      distanceMeters: setData.distanceMeters ?? null,
      setType: setData.setType ?? null,
    })

  const updatePlanSet = (id: PlanSetId, patch: UpdatePlanSetPatch) =>
    update('planSet', { id, ...patch })

  const removePlanSet = (id: PlanSetId) => update('planSet', { id, isDeleted: 1 })

  /**
   * Soft-delete a finished session from history. Child rows (exercises, sets)
   * stay in place but are excluded everywhere by the session join + isDeleted
   * filter, so they never resurface.
   */
  const deleteWorkoutSession = (id: WorkoutSessionId) =>
    update('workoutSession', { id, isDeleted: 1 })

  /**
   * Edit a finished session's timestamps (used by the history editor to change
   * a workout's date). The caller shifts `startedAt`/`finishedAt`/`date`
   * together so the recorded duration is preserved.
   */
  const updateWorkoutSession = (id: WorkoutSessionId, patch: UpdateWorkoutSessionPatch) =>
    update('workoutSession', { id, ...patch })

  return {
    createProfile,
    updateProfile,
    createExercise,
    updateExercise,
    softDeleteExercise,
    addExercisePhoto,
    setPrimaryPhoto,
    startWorkoutSession,
    pauseWorkoutSession,
    resumeWorkoutSession,
    finishWorkoutSession,
    discardWorkoutSession,
    deleteWorkoutSession,
    updateWorkoutSession,
    addExerciseToWorkout,
    setWorkoutExerciseOrder,
    setWorkoutExerciseSuperset,
    removeExerciseFromWorkout,
    addSet,
    updateSet,
    setSetCompleted,
    removeSet,
    createPlan,
    updatePlan,
    archivePlan,
    restorePlan,
    softDeletePlan,
    addExerciseToPlan,
    removeExerciseFromPlan,
    setPlanExerciseOrder,
    setPlanExerciseSuperset,
    addPlanSet,
    updatePlanSet,
    removePlanSet,
  }
}
