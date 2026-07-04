# Exercise preview in the "Add exercise" pickers — design & implementation spec

**Status: agreed design, not yet implemented.** This is a planning artifact for
the implementing agent — code lands in a PR, not here.

## Problem

While a workout is active, the **Add exercise** screen
(`src/features/workouts/AddExercisePage.tsx`) shows each candidate exercise as
a 46 px thumbnail plus a name that truncates to one line. With ~1,000 starter
exercises whose names are long and similar ("Cable Lateral Pulldown With V…",
"Lever Seated Reverse Fly (Par…"), the user is often guessing which machine a
row refers to. There is **no way to open the exercise detail from the picker**:
the entire row is a single `<button>` whose only action is `onPick`
(`ExercisePickerList.tsx` → `PickerRow`), which immediately navigates to the
logger. This violates the product's own bar — every exercise must answer
"*what is this?*" — exactly at the moment the user is standing next to a
machine trying to identify it.

The same limitation exists in all three flows that share the picker:

| Flow | Page | `onPick` behavior |
| --- | --- | --- |
| Active workout | `src/features/workouts/AddExercisePage.tsx` | `navigate('/workout/log/:exerciseId')` |
| Edit finished session | `src/features/workouts/EditSessionAddExercisePage.tsx` | insert + `navigate` back to edit |
| Plan editor | `src/features/plans/PlanAddExercisePage.tsx` | insert + `navigate` back to plan editor |

## Decision

Add an **in-place preview bottom sheet** to the shared picker, not navigation
to `ExerciseDetailPage`. Rationale (agreed in review of the screenshot):

1. **No lost state.** Search text, body-part chip, and scroll position in the
   virtualized 1,000-row list survive a peek. A round trip to `/library/:id`
   would reset all of it or require state-restoration plumbing.
2. **Faster than a notes app.** Peek → confirm → add is two taps mid-workout.
3. **One fix, three flows.** The sheet lives inside `ExercisePickerList`, so
   workout, edit-session and plan pickers all get it with no per-caller work.
4. **Photo-first.** The sheet leads with the large photo/animation — the
   recognition signal the 46 px tile can't provide. For starter-catalog
   exercises the full-size image is the **animated GIF** already stored in
   IndexedDB (`localUri`; the thumbnail is its still first frame), so the
   preview literally shows the movement.

### New row interaction model

`PickerRow` is split into **two tap targets** (mirroring the pattern already
used by `WorkoutEntryCard`: tappable body + trailing control):

- **Row body** (tile + name + subtitle) → opens the preview sheet.
- **`+` button** (the existing trailing circle) → `onPick` immediately,
  exactly today's behavior. Zero added friction for the "I know what this is"
  case.

This is a deliberate change to the row-body tap (today it also picks). The `+`
affordance already reads as "add"; the body becoming "look at it" matches every
list in the app where the body opens a detail.

## UX spec — `ExercisePreviewSheet`

A modal bottom sheet rendered by `ExercisePickerList` (inline, **no portal** —
it must stay inside the page's DOM so the existing `useScrollParent` hook can
find the app's `<main>` scroll container; `position: fixed` works regardless).

### Layout (top to bottom)

- **Backdrop**: `fixed inset-0 z-40 bg-black/60` (below the toast's `z-50`,
  above `ResumeBar`'s `z-30`). Tap closes the sheet.
- **Panel**: anchored bottom, `mx-auto w-full max-w-md` (match `AppShell`'s
  column), `rounded-t-3xl bg-surface border-t border-white/[0.07]`,
  `max-h-[85dvh]`, inner content scrolls (`overflow-y-auto overscroll-contain`),
  bottom safe-area padding (`pb-[max(20px,env(safe-area-inset-bottom))]`).
- **Grabber + close**: small centered drag-handle bar (visual only) and a
  `CircleButton` with an `X` icon top-right.
- **Hero image**: `<ExerciseTile photoId={…} full fit="contain" />`, full
  panel width, fixed height ≈ `220px`, `radius="20px"`. `full` + `contain`
  are existing props — this is exactly how `ExerciseDetailPage` renders its
  hero, and for starter exercises it plays the GIF. No photo → the existing
  tinted-dumbbell/BodyMap placeholder.
- **Name**: full, untruncated, `font-display text-[20px] font-semibold`.
- **Meta line**: `metaLine(exercise.bodyPart, exercise.equipment)`
  (`src/shared/utils/bodyParts.ts`) in `text-[12.5px] text-muted`.
- **Last-performance line**: the row's `subtitle` (from the caller's
  `subtitleFor`). Render it **only when it differs from the meta line** — in
  the workout flow the subtitle is the last-performance summary (show it), in
  the plan/edit-session flows it *is* the meta line (skip the duplicate).
- **Form cues**: overline "How to" (use the existing `Overline` component),
  then `cuesFor(exercise)` (`src/features/exercises/cues.ts`) as a numbered
  list — same content the detail page's "How to" tab shows. For starter
  exercises this is the dataset's real instructions (stored in `notes`).
- **Actions** (sticky at the panel bottom, above the safe-area padding):
  - Primary: full-width `Button` — **"Add exercise"** → calls `onPick(id)`.
    Do **not** close the sheet first; all three callers navigate away on pick,
    which unmounts the picker and the sheet with it. (Still call `onClose`
    after `onPick` for safety — it's idempotent.)
  - Secondary: a plain text link — **"Full details"** → `/library/:id`
    (`ExerciseDetailPage`: charts, history, PRs, 1RM). Use react-router's
    `<Link>`, not `useNavigate`, so it's a real anchor. This loses picker
    state, which is acceptable for the rare deep-dive; do not build return
    plumbing for it.

### Behavior

- **Open**: tap a row body (favorites and virtualized rows both).
- **Close**: backdrop tap, `X` button, or `Escape` keydown (desktop nicety —
  add a `keydown` listener while mounted).
- **Scroll lock**: while open, set `overflow: hidden` on the app scroll
  container. Get it via the existing `useScrollParent(panelRef)` hook
  (`src/shared/utils/useScrollParent.ts`) and restore the previous value on
  unmount, in a `useEffect`. Panel content itself scrolls.
- **Animation**: keep it cheap — a single CSS transition, backdrop fade +
  panel `translate-y` slide-in (~180 ms ease-out). Mount-only animation is
  fine (animate in, no exit animation) — no animation library, no new deps.
- **Accessibility**: panel gets `role="dialog"`, `aria-modal="true"`,
  `aria-label={exercise.name}`. Focus the close button on open; restoring
  focus on close is a nice-to-have, not required.
- **Android back button / swipe-back** closing the sheet (history-entry
  push + `popstate` listener) is explicitly **out of scope for v1** — note it
  as a possible follow-up in the PR description, don't build it.

### Secondary fix: two-line names in rows

In `PickerRow`, change the name from `truncate` to `line-clamp-2` (built into
Tailwind ≥ 3.3; the project is on 3.4). The virtualizer already measures real
row heights (`measureElement`), so variable-height rows are supported;
`ROW_ESTIMATE` stays 72. Do the same in the favorites rows (same component).
Leave `StarterLibraryPage`/`StarterRow` and library cards untouched — this
spec covers only the shared picker.

## Component & code changes

### New file: `src/features/exercises/ExercisePreviewSheet.tsx`

```
interface ExercisePreviewSheetProps {
  exercise: ExerciseRow
  /** The row's subtitle (last-performance or meta line, caller-dependent). */
  subtitle: string
  /** Adds the exercise via the picker's onPick. */
  onAdd: () => void
  onClose: () => void
}
```

Pure presentational + the scroll-lock/Escape effects described above. Reuses:
`ExerciseTile`, `CircleButton`, `Button`, `Overline`, `metaLine`, `cuesFor`.
No queries of its own — everything renders from the `ExerciseRow` it receives
(`ExerciseTile` internally resolves the photo via `photoById` + `usePhotoUrl`,
with Suspense already handled inside `ExerciseTile`). Keep it small; do **not**
extract a generic `BottomSheet` shared component for a single consumer.

### Modified: `src/features/exercises/ExercisePickerList.tsx`

1. Add local state: `const [preview, setPreview] = useState<ExerciseRow | null>(null)`.
2. `PickerRow`: change the outer `<button>` to a `<div>` with the same card
   classes, containing:
   - a body `<button>` (tile + text block, `flex min-w-0 flex-1 items-center
     gap-[13px] text-left`) → `onPreview(exercise)`;
   - the trailing `+` as its own `<button>` (`aria-label` of the form
     `Add <name>`) → `onPick(exercise.id)`.
   New `onPreview` prop threaded to both favorites rows and
   `VirtualizedPickerRows`; keep it referentially stable (`useCallback`) so
   `memo` on `PickerRow`/`VirtualizedPickerRows` keeps paying off.
3. Name class: `truncate` → `line-clamp-2` (keep `min-w-0` on the text block).
4. Render the sheet after the list:
   `{preview && <ExercisePreviewSheet exercise={preview} subtitle={subtitleFor(preview)} onAdd={() => { onPick(preview.id as ExerciseId); setPreview(null) }} onClose={() => setPreview(null)} />}`

### Callers — no changes required

`AddExercisePage`, `EditSessionAddExercisePage`, `PlanAddExercisePage` keep
their existing props (`onPick` semantics unchanged: it both logs-immediately
and serves as the sheet's "Add"). This is the point of doing it inside the
shared component.

## Test plan

Follow the existing test conventions (`happy-dom`, Testing Library, virtualizer
and `ExerciseTile` mocked — see `ExercisePickerList.test.tsx`).

### Update `src/features/exercises/ExercisePickerList.test.tsx`

- **Router wrapper**: the sheet renders a `<Link>`, so wrap renders in
  `<MemoryRouter>` (add a small `renderPicker` helper).
- **Changed semantics**: the existing "calls onPick when a row is tapped" test
  must change — tapping the *name/body* now opens the sheet; tapping the
  **`+` button** (`getByRole('button', { name: /add bench press/i })`) calls
  `onPick('ex-9')`.
- **New cases**:
  - body tap opens a `role="dialog"` labelled with the exercise name;
  - sheet "Add exercise" calls `onPick` with the id and closes the dialog;
  - backdrop / `X` / Escape close without calling `onPick`;
  - "Full details" link has `href="/library/<id>"`.

### New `src/features/exercises/ExercisePreviewSheet.test.tsx`

- Renders name, meta line, and cue steps (exercise with `notes` → steps from
  `stepsFromNotes`; without → generic cues).
- Shows `subtitle` when it differs from the meta line; hides it when equal.
- `onAdd` / `onClose` fire from their buttons.

### Check `src/features/workouts/AddExercisePage.test.tsx`

If it simulates picking by clicking a row body, point it at the `+` button
instead. No behavioral change otherwise.

## Explicitly out of scope

- Android back-button dismissal of the sheet (follow-up candidate).
- A generic reusable `BottomSheet` component.
- Any change to `ExerciseDetailPage`, `StarterLibraryPage`, or library cards.
- "Best" stats / progress chart inside the sheet — that's what the
  "Full details" link is for; the sheet's job is *recognition*, and adding a
  `completedSetsForExercise` query per preview is avoidable weight.
- Long-press gestures.

## Acceptance criteria

1. In all three add-exercise flows, tapping a row's body opens the preview
   sheet showing the large photo/GIF, the full untruncated name, body part ·
   equipment, cues, and (workout flow only) the last-performance line.
2. Tapping `+` on a row behaves exactly as today (immediate pick).
3. "Add exercise" in the sheet is equivalent to tapping that row's `+`.
4. "Full details" opens `/library/:id`.
5. Closing the sheet returns to the picker with search text, chip filter and
   scroll position intact.
6. Row names wrap to at most two lines instead of truncating at one.
7. `npm run build` (typecheck + build) and `npx vitest run` pass.
   (Install with `npm install --legacy-peer-deps` if needed.)

## Suggested implementation order

1. `PickerRow` split + `line-clamp-2` + `onPreview` threading (picker still
   compiles with a no-op preview handler).
2. `ExercisePreviewSheet` component.
3. Wire sheet state into `ExercisePickerList`.
4. Update / add tests; run `npx vitest run` and `npm run build`.
5. Manual check via `npm run dev`: start a workout → Add exercise → peek a
   starter exercise (GIF plays), add from sheet, confirm search/scroll state
   survives closing the sheet.
