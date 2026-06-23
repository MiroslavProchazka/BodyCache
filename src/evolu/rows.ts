import type { Query } from '@evolu/common'
import type {
  userProfile,
  allExercises,
  workoutExercisesForSession,
  sessionExercises,
  setsForWorkoutExercise,
  completedSetsForExercise,
  completedSetsForSession,
  finishedSessionSets,
  sessionSetsDetailed,
  performedExercises,
  finishedWorkoutSessions,
  photosForExercise,
  activePlans,
  planExercises,
  planSetsForPlanExercise,
} from './queries'

/** Extract the row shape from an Evolu `Query`. */
export type RowOf<Q> = Q extends Query<infer R> ? R : never

export type ProfileRow = RowOf<typeof userProfile>
export type ExerciseRow = RowOf<typeof allExercises>
export type WorkoutExerciseRow = RowOf<ReturnType<typeof workoutExercisesForSession>>
export type SessionExerciseRow = RowOf<ReturnType<typeof sessionExercises>>
export type ExerciseSetRow = RowOf<ReturnType<typeof setsForWorkoutExercise>>
export type ExerciseHistorySetRow = RowOf<ReturnType<typeof completedSetsForExercise>>
export type WorkoutSessionRow = RowOf<typeof finishedWorkoutSessions>
export type ExercisePhotoRow = RowOf<ReturnType<typeof photosForExercise>>
export type SessionSetRow = RowOf<ReturnType<typeof completedSetsForSession>>
export type FinishedSessionSetRow = RowOf<typeof finishedSessionSets>
export type SessionDetailSetRow = RowOf<ReturnType<typeof sessionSetsDetailed>>
export type PerformedExerciseRow = RowOf<typeof performedExercises>
export type PlanRow = RowOf<typeof activePlans>
export type PlanExerciseRow = RowOf<ReturnType<typeof planExercises>>
export type PlanSetRow = RowOf<ReturnType<typeof planSetsForPlanExercise>>
