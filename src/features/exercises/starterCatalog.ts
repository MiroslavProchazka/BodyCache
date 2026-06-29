import type { BodyPart, Equipment, ExerciseType } from '@/evolu/schema'
import { STARTER_CATALOG } from './starterCatalog.generated'

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
 * The starter catalog is generated from the exercises-dataset by
 * `scripts/import-exercises.mjs` and lives in `./starterCatalog.generated.ts`
 * (the whole gym-focused dataset, with demo animations streamed from the repo +
 * form cues). It is re-exported here so the rest of the app keeps importing it
 * from one place. Regenerate with `node scripts/import-exercises.mjs`.
 */
export { STARTER_CATALOG }

/** Normalise an exercise name for case/space-insensitive duplicate matching. */
export const normalizeExerciseName = (name: string): string =>
  name.trim().toLowerCase().replace(/\s+/g, ' ')

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
  catalog: readonly StarterExercise[] = STARTER_CATALOG,
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
