/**
 * SQLite indexes for BodyCache, kept as plain data so they're unit-testable and
 * reviewable in one place. Evolu only auto-indexes primary keys, so every query
 * that filters or orders on a non-PK column (all the set/session/plan joins and
 * the library's `name` ordering) would otherwise run a full table scan inside
 * SQLite-WASM. With a year of training and the aggregate `completedSetsIndex`
 * scan, that's the difference between an indexed lookup and millions of row
 * visits per page open.
 *
 * Evolu creates any missing index on init (additive + idempotent — no migration
 * needed). `buildIndexes` maps these into the `indexes` config in `evolu.ts`.
 */
export interface IndexDefinition {
  /** Index name (unique across the DB). */
  readonly name: string
  /** Table the index is created on. */
  readonly table: string
  /** Indexed column. */
  readonly column: string
}

/**
 * The indexes, ordered by the workstream that motivated each. Names are stable
 * (renaming would create a new index and orphan the old one). Table/column
 * names are untyped by Evolu (Kysely limitation), so keep them in sync with
 * `schema.ts` by hand.
 */
export const INDEX_DEFINITIONS: readonly IndexDefinition[] = [
  // Set → workoutExercise joins (every history query, `setsForWorkoutExercise`).
  {
    name: 'exerciseSetWorkoutExerciseId',
    table: 'exerciseSet',
    column: 'workoutExerciseId',
  },
  // workoutExercise → session (session detail, repeat, distribution).
  {
    name: 'workoutExerciseSessionId',
    table: 'workoutExercise',
    column: 'workoutSessionId',
  },
  // workoutExercise → exercise (`completedSetsForExercise`, `completedSetsIndex`).
  {
    name: 'workoutExerciseExerciseId',
    table: 'workoutExercise',
    column: 'exerciseId',
  },
  // Session ordering (history list) + active-session lookup.
  {
    name: 'workoutSessionStartedAt',
    table: 'workoutSession',
    column: 'startedAt',
  },
  // Active / finished status filters.
  {
    name: 'workoutSessionStatus',
    table: 'workoutSession',
    column: 'status',
  },
  // Photos for an exercise (`photosForExercise`, `photoById` lists).
  {
    name: 'exercisePhotoExerciseId',
    table: 'exercisePhoto',
    column: 'exerciseId',
  },
  // Library `allExercises` order-by name.
  {
    name: 'exerciseName',
    table: 'exercise',
    column: 'name',
  },
  // Plan editor: exercises within a plan.
  {
    name: 'planExercisePlanId',
    table: 'planExercise',
    column: 'planId',
  },
  // Plan sets for a plan exercise.
  {
    name: 'planSetPlanExerciseId',
    table: 'planSet',
    column: 'planExerciseId',
  },
]

/**
 * Map the definitions onto Evolu's index `create` builder. Structurally typed on
 * the builder so `indexes.ts` needn't import Kysely internals; the concrete
 * builder type flows in from the `indexes: (create) => …` callback in `evolu.ts`.
 */
export const buildIndexes = <B>(
  create: (name: string) => { on: (table: string) => { column: (column: string) => B } },
): B[] => INDEX_DEFINITIONS.map((d) => create(d.name).on(d.table).column(d.column))
