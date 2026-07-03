/**
 * Exercise-name normalisation, kept in its own tiny module so consumers can use
 * it **without** pulling in `starterCatalog.generated` (the ~1,088-entry array).
 * `cues.ts` — imported by `ExerciseDetailPage` — only needs this one function;
 * importing it from `starterCatalog.ts` used to drag the whole catalog into the
 * detail-page chunk. See `docs/exercise-library-performance.md` §W4.
 */

/** Normalise an exercise name for case/space-insensitive duplicate matching. */
export const normalizeExerciseName = (name: string): string =>
  name.trim().toLowerCase().replace(/\s+/g, ' ')
