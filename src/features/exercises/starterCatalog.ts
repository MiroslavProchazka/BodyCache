import type { BodyPart, Equipment, ExerciseType } from '@/evolu/schema'
import { normalizeExerciseName } from './exerciseName'

/**
 * A single entry in the built-in starter library. Mirrors the `exercise`
 * schema's user-facing fields (name + the three "what is this" facets) so an
 * entry can be inserted verbatim via `createExercise`.
 *
 * Entries may also carry an `animation` (the dataset's demo GIF on GitHub) and
 * short form `cues`, both sourced from hasaneyldrm/exercises-dataset. When
 * present, adding the exercise streams the animation into IndexedDB via the
 * normal photo pipeline (its first frame becomes the still thumbnail) and
 * stores the cues as the exercise's notes — the user can still replace it with
 * a photo of their own machine.
 */
export interface StarterExercise {
  readonly name: string
  readonly type: ExerciseType
  readonly bodyPart: BodyPart
  readonly equipment: Equipment
  /** Source dataset id (provenance only; not stored on the exercise). */
  readonly datasetId?: string
  /**
   * URL of the demo GIF (the dataset's raw GIF on GitHub). Streamed into
   * IndexedDB via the photo pipeline on add; never bundled.
   */
  readonly animation?: string | null
  /** Short form cues, stored as the exercise's notes on add. */
  readonly cues?: string | null
}

/**
 * Lazily load the generated catalog (the whole gym-focused dataset, ~1,088
 * entries — a 739 kB / 84 kB-gzip JS module). Loading it via `import()` keeps
 * the array in its **own async chunk** fetched only when the starter page
 * actually needs it, instead of baking it into any route's synchronous parse
 * path. Regenerate the source with `node scripts/import-exercises.mjs`.
 */
export const loadStarterCatalog = (): Promise<readonly StarterExercise[]> =>
  import('./starterCatalog.generated').then((m) => m.STARTER_CATALOG)

/**
 * `normalizeExerciseName` moved to `./exerciseName` so `cues.ts` (and thus the
 * exercise-detail chunk) can normalise names without importing the catalog.
 * Re-exported here for the starter-page callers that already import it.
 */
export { normalizeExerciseName }

/**
 * Split the catalog into ordered body-part groups for the picker. The order
 * follows the `BODY_PARTS` enum (chest → back → legs → …) so it lines up with
 * the library's filter chips.
 */
export interface StarterGroup {
  readonly bodyPart: BodyPart
  readonly items: readonly StarterExercise[]
}

export function groupStarterCatalog(
  catalog: readonly StarterExercise[],
): readonly StarterGroup[] {
  const order: readonly BodyPart[] = [
    'chest',
    'back',
    'legs',
    'shoulders',
    'arms',
    'core',
    'cardio',
    'full_body',
    'other',
  ]
  return order
    .map((bodyPart) => ({
      bodyPart,
      items: catalog.filter((e) => e.bodyPart === bodyPart),
    }))
    .filter((g) => g.items.length > 0)
}

/**
 * A single rendered line in the (virtualized) starter picker: either a
 * body-part section header or one exercise. Flattening the grouped catalog into
 * one ordered list lets a single virtualizer window the whole 1,000+ entry
 * picker, headers included.
 */
export type StarterRowItem =
  | { readonly kind: 'header'; readonly bodyPart: BodyPart }
  | { readonly kind: 'item'; readonly exercise: StarterExercise }

/** Flatten ordered groups into a header-then-items row list for virtualization. */
export function flattenStarterGroups(groups: readonly StarterGroup[]): StarterRowItem[] {
  const rows: StarterRowItem[] = []
  for (const g of groups) {
    rows.push({ kind: 'header', bodyPart: g.bodyPart })
    for (const exercise of g.items) rows.push({ kind: 'item', exercise })
  }
  return rows
}
