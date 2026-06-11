import type { Query } from '@evolu/common'
import type {
  allExercises,
  workoutExercisesForSession,
  sessionExercises,
  setsForWorkoutExercise,
  completedSetsForExercise,
  finishedWorkoutSessions,
  photosForExercise,
} from './queries'

/** Extract the row shape from an Evolu `Query`. */
export type RowOf<Q> = Q extends Query<infer R> ? R : never

export type ExerciseRow = RowOf<typeof allExercises>
export type WorkoutExerciseRow = RowOf<ReturnType<typeof workoutExercisesForSession>>
export type SessionExerciseRow = RowOf<ReturnType<typeof sessionExercises>>
export type ExerciseSetRow = RowOf<ReturnType<typeof setsForWorkoutExercise>>
export type ExerciseHistorySetRow = RowOf<ReturnType<typeof completedSetsForExercise>>
export type WorkoutSessionRow = RowOf<typeof finishedWorkoutSessions>
export type ExercisePhotoRow = RowOf<ReturnType<typeof photosForExercise>>
