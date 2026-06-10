import type { Query } from '@evolu/common'
import type {
  allExercises,
  workoutExercisesForSession,
  setsForWorkoutExercise,
  photosForExercise,
} from './queries'

/** Extract the row shape from an Evolu `Query`. */
export type RowOf<Q> = Q extends Query<infer R> ? R : never

export type ExerciseRow = RowOf<typeof allExercises>
export type WorkoutExerciseRow = RowOf<ReturnType<typeof workoutExercisesForSession>>
export type ExerciseSetRow = RowOf<ReturnType<typeof setsForWorkoutExercise>>
export type ExercisePhotoRow = RowOf<ReturnType<typeof photosForExercise>>
