import type { ExerciseRow } from '@/evolu/rows'

/**
 * The library/picker search + body-part filter, extracted so every list shares
 * one predicate (it was copy-pasted across the library grid and three add-exercise
 * pages). Matches an exercise when its body part equals the selected `part` (or
 * no part is selected) and the trimmed, case-insensitive `search` is a substring
 * of its name, body part or equipment (or the search is empty).
 */
export const matchesExerciseFilter = (
  exercise: ExerciseRow,
  search: string,
  part: string | null,
): boolean => {
  if (part && exercise.bodyPart !== part) return false
  const q = search.trim().toLowerCase()
  if (!q) return true
  return [exercise.name, exercise.bodyPart, exercise.equipment]
    .filter(Boolean)
    .some((v) => String(v).toLowerCase().includes(q))
}
