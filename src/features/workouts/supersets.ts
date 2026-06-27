/**
 * Superset grouping — pure (DOM-free) helpers. A superset groups exercises
 * performed back-to-back (A1/A2…). BodyCache is a memory aid, so this only
 * *records and displays* the grouping; it never enforces alternating-set timing
 * or superset-aware rest.
 *
 * A **superset block = a maximal run of consecutive exercises (by `orderIndex`)
 * sharing the same non-null `supersetGroup` key.** The key is opaque and exists
 * only to keep two *adjacent* supersets distinct ([A1,A2] then [B1,B2] must not
 * merge); `null` = standalone. Grouping is **derived, never stored**: the UI
 * folds (order + key) on every render, so reorder is a plain `orderIndex` swap
 * and groups auto-regroup by adjacency. Tested in `supersets.test.ts`.
 */

/** One rendered row of the exercise list: a superset (`group` set) or a standalone. */
export interface SupersetBlock<T> {
  /** The shared key, or `null` for a standalone block (incl. length-1 runs). */
  readonly group: string | null
  /** Members in order; length ≥ 2 for a superset, exactly 1 for a standalone. */
  readonly items: readonly T[]
}

/**
 * Fold an already `orderIndex`-sorted list into display blocks. Consecutive rows
 * sharing the same non-null key collapse into one superset block; a run of
 * length 1 (siblings moved away) renders as a standalone, even though the row
 * keeps its inert key. The single source of truth the UI maps over.
 */
export const groupExercises = <T extends { readonly supersetGroup: string | null }>(
  rows: readonly T[],
): SupersetBlock<T>[] => {
  const blocks: SupersetBlock<T>[] = []
  let i = 0
  while (i < rows.length) {
    const key = rows[i].supersetGroup
    if (key == null) {
      blocks.push({ group: null, items: [rows[i]] })
      i += 1
      continue
    }
    let j = i + 1
    while (j < rows.length && rows[j].supersetGroup === key) j += 1
    const run = rows.slice(i, j)
    // A non-null key with no adjacent same-key sibling is inert → standalone.
    blocks.push(run.length >= 2 ? { group: key, items: run } : { group: null, items: run })
    i = j
  }
  return blocks
}

/**
 * Opaque key generator. The value is never shown — display labels (A1/A2) are
 * derived from position — so any unique non-empty string works.
 */
export const newSupersetKey = (): string => {
  const uuid = globalThis.crypto?.randomUUID?.()
  return uuid ?? `ss-${Math.random().toString(36).slice(2)}${Math.random().toString(36).slice(2)}`
}

/**
 * Display label for a superset member: letter by the superset's position among
 * supersets (0 → "A", 1 → "B"…), number by the member's position in the block
 * (0 → "1"). e.g. `supersetLabel(0, 1)` → "A2".
 */
export const supersetLabel = (supersetIndex: number, memberIndex: number): string =>
  `${String.fromCharCode(65 + supersetIndex)}${memberIndex + 1}`
