# Phase E follow-ups — design

This document is the agreed design for the three remaining Phase E follow-ups
named in `CLAUDE.md`:

1. **Surface RPE in the logger** — *in flight, PR #30*
2. **Reorder exercises mid-session**
3. **Supersets**

Each ships independently, cheapest first. The doc records the design **and the
product decisions already made**, so implementation needs no further guessing.
It is a planning artifact — code lands in the PRs below, not here.

## Codebase conventions these designs follow

- **Enum-like columns** = `NonEmptyString100` storage + an `as const` array + a
  narrow helper in the app layer. Canonical example: `SET_TYPES` / `narrowSetType`
  in `src/features/workouts/setTypes.ts`.
- **Reorder** = swap `orderIndex` values between two rows. Template: the inline
  `swap` helper + `setPlanExerciseOrder` in `src/features/plans/PlanEditorPage.tsx`
  and the up/down `IconBtn`s in `PlanExerciseEditor.tsx`. `byOrderIndex`
  (`src/features/plans/planToSession.ts`) sorts a copy ascending, nulls-as-0.
- **Two write models**: the logger (`LogExercisePage.tsx`) edits an in-memory
  `DraftRow[]` and writes all sets on Save; the plan editor writes straight to
  Evolu per interaction.
- **Pure helpers get unit tests** (`setFields.ts`, `setTypes.ts`,
  `planToSession.ts`, `sessionToSession.ts`, `backup.ts` all have `.test.ts`
  siblings). Keep grouping/clamping logic in pure modules so the React layer
  stays thin.
- **Backup** is format **v2** (`src/features/settings/backup.ts`). Adding a
  *column* (not a table) does not require a version bump; rows are spread/upserted
  by name on import.

---

## Feature 1 — RPE in the logger *(PR #30, implemented)*

### Decision
- RPE is an **optional integer 1–10**, captured per set, never required.
- **Not** pre-filled from history (perceived exertion is a felt value, not a
  target). "Copy last workout" copies it verbatim; editing real logged sets
  seeds it.
- **Show last time's RPE** in the logger's "Last time" panel.

### What already existed
`exerciseSet.rpe` (`schema.ts`, `nullOr(NonNegativeInt)`), `rpe` in `AddSetInput`
/ `UpdateSetPatch`, and verbatim copy by `repeatSetToSetInput`
(`sessionToSession.ts`). So this was UI-only plus surfacing the value.

### Shipped in PR #30
- `src/features/workouts/rpe.ts` (pure) — `RPE_VALUES`, `RPE_MIN`/`RPE_MAX`,
  `clampRpe`, `formatRpe`; mirrors `setTypes.ts`. RPE is deliberately **not** a
  `SET_FIELDS` stepper column.
- `LogExercisePage.tsx` — `DraftRow` gains `rpe`; a tap **chip** opens an inline
  1–10 picker (tap current value to clear); saved through the existing `addSet`
  `rpe` field.
- "Last time" panel shows a faint `@8`: `rpe` added to the
  `completedSetsForExercise` select, to `HistorySet`, and to `toHistorySets`.
- Tests: `rpe.test.ts` (7 cases) + updated `HistorySet` test factories.

### Migration / backup
None. Existing sets are `rpe: null` → empty chip. No version bump.

---

## Feature 2 — Reorder exercises mid-session

### Decision
- **Free reorder**: any exercise moves up/down independently via a plain
  `orderIndex` swap — *not* group-aware (see Feature 3: supersets auto-regroup by
  adjacency, so reorder needs no special handling).
- Affordance: **always-visible up/down chevrons** in a trailing control cluster
  (consistent with the plan editor; no drag-and-drop dependency, better
  one-handed).

### Design
**Mutation** (in `useBodyCacheMutations()`, `src/evolu/mutations.ts`), a direct
mirror of `setPlanExerciseOrder`:
```ts
const setWorkoutExerciseOrder = (id: WorkoutExerciseId, orderIndex: number) =>
  update('workoutExercise', { id, orderIndex })
```
`workoutExercise.orderIndex` already exists and `sessionExercises` already orders
by it, so the reactive list reorders live with no local state.

**UI** — the live list is in `ActiveWorkoutPage.tsx`, rendering `WorkoutEntryCard`
per entry. `WorkoutEntryCard` is currently a single `<button>` that navigates to
the logger, so chevrons can't nest inside it. **Restructure** the card into a
tappable body (photo + name → opens logger) plus a trailing control cluster
holding the up/down chevrons, matching `PlanExerciseEditor`'s header row. The
`swap` helper + disabled-at-ends logic copy verbatim from `PlanEditorPage.tsx`,
substituting `setWorkoutExerciseOrder` / `WorkoutExerciseId`.

> This card restructure is reused by Feature 3, so it happens once here.

### Edge cases
- Swap-by-value is robust to gaps/non-contiguous indices (what plans already do).
- No effect on stats/history: every set query orders by `orderIndex`; reordering
  changes only display/sort order, never logged data.

### Migration / backup
None — column already exists; no new column or table.

### Tests
The swap is a trivial index exchange already exercised by plans. Manual: reorder
mid-session, log a set on a moved exercise, finish, confirm history reflects the
new order.

### PR 2 scope
`mutations.ts` (one mutation) · `WorkoutEntryCard.tsx` (restructure) ·
`ActiveWorkoutPage.tsx` (pass neighbors + swap). No migration.

---

## Feature 3 — Supersets

A superset groups exercises performed back-to-back (A1/A2…). BodyCache is a
memory aid, so the requirement is to **record and display** the grouping — not to
enforce alternating-set timing or superset-aware rest.

### Decisions
- **Opaque auto-generated group key** — the app generates a hidden key; display
  labels (**A1/A2**) are derived from position. No typing.
- **Editing in the plan editor *and* mid-session.**
- **Free reorder, auto-regroup by adjacency** (see model below).
- **Keep backup format v2** — this is a column add, not a new table.

### Data model
Add a nullable **`supersetGroup: nullOr(NonEmptyString100)`** column to both
`workoutExercise` and `planExercise` (`src/evolu/schema.ts`). No new enum array —
keys are opaque, not a fixed value set.

A **superset block = a maximal run of consecutive exercises (by `orderIndex`)
sharing the same non-null `supersetGroup` key.** The key exists to distinguish two
*adjacent* supersets ([A1,A2] then [B1,B2] must not merge). `null` = standalone.

Grouping is **derived, never stored**: the UI computes blocks from
(order + key) on every render. This is what "auto-regroup by adjacency" means:
- Reorder is a plain `orderIndex` swap (Feature 2) — no group-aware logic.
- Moving an exercise out from between its same-key siblings breaks adjacency, so
  it visually leaves the group; moving it back rejoins. The key persists on the
  row but is inert while not adjacent to a same-key sibling.
- A run of length 1 (siblings moved away) renders as **standalone**.

### Pure helper (testable)
`src/features/workouts/supersets.ts` (UI-free; mirrors `setTypes.ts`):
- `groupExercises<T extends { orderIndex; supersetGroup }>(rows): Block<T>[]` —
  given `byOrderIndex`-sorted rows, fold consecutive same-key rows into
  `{ group: string | null; items: T[] }`; length-1 runs collapse to a standalone
  block. **Single source of truth the UI maps over.**
- `newSupersetKey(): string` — opaque key generator.
- `supersetLabel(blockIndex, memberIndex)` → `"A1"`, `"A2"`, `"B1"`… for display.

`src/features/workouts/supersets.test.ts` — fold of consecutive runs, two
adjacent groups stay distinct (key boundary), interleaved standalone splits a
run, length-1 collapse, label derivation.

### Mutations (`mutations.ts`)
Mirror the order/notes pattern:
- `setWorkoutExerciseSuperset(id: WorkoutExerciseId, supersetGroup: string | null)`
- `setPlanExerciseSuperset(id: PlanExerciseId, supersetGroup: string | null)`

"Link with next" assigns both rows a shared key (new key if neither has one, or
reuse the neighbor's). "Ungroup" clears the row's key.

### Queries (`queries.ts`) + rows
Add `supersetGroup` to the display selects so the UI can group:
- `sessionExercises` → `'workoutExercise.supersetGroup as supersetGroup'`
- `planExercises` → `'planExercise.supersetGroup as supersetGroup'`
- `sessionSetsForRepeat` / use `sessionExercises` for the per-exercise key on
  repeat (it must surface the group so repeat preserves it).
- `workoutExercisesForSession` / `allWorkoutExercises` / `allPlanExercises` use
  `selectAll()`, so they carry the column automatically.
- Row types in `src/evolu/rows.ts` update via `RowOf`.

### Instantiation (plan → session, repeat → session)
`supersetGroup` must be copied so grouping survives instantiation. `orderIndex`
is already copied verbatim, so adjacency (and thus grouping) is preserved.
- Extend `addExerciseToWorkout` (`mutations.ts`) signature with an optional
  `supersetGroup` arg (default `null`); add it to the insert.
- `useStartWorkoutFromPlan.ts` — pass `pe.supersetGroup` through.
- `useRepeatWorkout.ts` — pass the source exercise's `supersetGroup` through (read
  it from `sessionExercises`).
- `planToSession.ts` / `sessionToSession.ts` operate at the *set* level and need
  no change — grouping is an exercise-level property handled in the hooks.

### UI / UX
Mobile-first, dark, one-handed, minimal typing.

**Plan editor** (`PlanEditorPage.tsx` + `PlanExerciseEditor.tsx`): replace the flat
`exercises.map(...)` with `groupExercises(...)`, rendering a **superset container**
(bordered group with a small "Superset" overline / colored left rail) wrapping
member editors; standalone exercises render as today. Add a "link with next" /
"ungroup" action to each editor's control cluster (next to up/down/remove).

**Active logger** (`ActiveWorkoutPage.tsx` + `WorkoutEntryCard.tsx`): same grouping
container; `WorkoutEntryCard` gains an **A1/A2 badge**. Reuse the restructured
control cluster from Feature 2 to host the same link/unlink chip (mid-session
grouping). No drag.

**History** (`SessionDetailPage`): optional light-touch group bracket; defer if
scope is tight (would need `supersetGroup` added to `sessionSetsDetailed`).

### Migration / backup (keep v2)
- Existing rows have `supersetGroup = null` → standalone by construction. No
  migration step.
- `useDataTransfer.ts` upserts list columns explicitly on import — add
  `supersetGroup: row.supersetGroup ?? null` to the `workoutExercise` and
  `planExercise` upserts. Export is automatic (`selectAll`-based snapshots).
- Restoring a pre-supersets (v2) backup: the field is absent → `?? null` →
  standalone. **No version bump** (column-only); note this in `backup.ts`'s
  version comment.

### Tests
- `supersets.test.ts` (above).
- `backup.test.ts`: a v2 file restores cleanly with `supersetGroup` absent.
- Manual: build a plan with a superset → start it → confirm grouping; repeat a
  session with a superset → confirm grouping copied; reorder to break/rejoin a
  group; restore a pre-supersets backup → exercises render standalone.

### PR breakdown (multi-PR)
- **PR 3a — data layer**: schema column on both tables · query/row plumbing ·
  `supersets.ts` + tests · mutations · instantiation copy · backup import wiring.
  Inert because everything is `null`.
- **PR 3b — plan editor UI**: grouping containers + link/unlink.
- **PR 3c — logger UI**: group containers + A1/A2 badges + mid-session link/unlink
  (reusing Feature 2's card cluster); optional history brackets.

---

## Sequencing

1. **PR #30 — RPE** *(in flight)* — no schema, isolated UI.
2. **PR 2 — reorder mid-session** — one mutation + card restructure. Establishes
   `setWorkoutExerciseOrder` and the restructured `WorkoutEntryCard` control
   cluster that supersets reuse.
3. **PR 3a/3b/3c — supersets** — schema → plan editor → logger.

This order minimizes rework: the card restructure happens once (PR 2) and is
reused by supersets; free reorder means supersets need no group-aware reorder.

### Critical files
- `src/evolu/schema.ts`, `src/evolu/mutations.ts`, `src/evolu/queries.ts`,
  `src/evolu/rows.ts`
- `src/features/workouts/LogExercisePage.tsx`, `ActiveWorkoutPage.tsx`,
  `WorkoutEntryCard.tsx`, `rpe.ts`, `supersets.ts`
- `src/features/plans/PlanEditorPage.tsx`, `PlanExerciseEditor.tsx`,
  `useStartWorkoutFromPlan.ts`, `src/features/workouts/useRepeatWorkout.ts`
- `src/features/settings/backup.ts`, `useDataTransfer.ts`
