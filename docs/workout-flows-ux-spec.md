# Workout flows UX — detailed specs

This document turns the workout-flows UX review (Start workout → Add exercise →
Log sets → Edit mid-session → Finish) into implementable specs. Like
`phase-e-design.md`, it records the design **and the product decisions**, so
implementation needs no further guessing. It is a planning artifact — code
lands in PRs, not here.

Every spec keeps the product mantra in view: *BodyCache is not your coach, it
is your workout memory.* Nothing here adds coaching, programs, or prescriptions
— only faster logging, safer data, and clearer recall.

## Index & priorities

| ID | Spec | Journey | Priority | Effort |
|----|------|---------|----------|--------|
| P0 | Shared primitives: `ConfirmSheet` + action `Toast` | (foundation) | P1 | M |
| B1 | Per-set commit in the logger (tap-to-complete) | Log sets | P1 | L |
| B2 | Auto-start rest timer on set completion | Log sets | P1 | S |
| A1 | Active-session guard for plan start / repeat | Start workout | P1 | M |
| C1 | Instant add + multi-add in the in-workout picker | Add exercise | P1 | M |
| D1 | Plan targets visible on workout entry cards | Start / mid-session | P1 | S |
| B3 | "Last time" panel above the entry area | Log sets | P2 | S |
| A2 | Start-from-plan next to the Start pill on Today | Start workout | P2 | S |
| A3 | Quick-start from plan library rows | Start workout | P2 | S |
| A4 | Explain the disabled Finish (and unify disabled-pill behavior) | Start workout | P2 | S |
| D2 | Undo-toast removals instead of `window.confirm` | Edit mid-session | P2 | M |
| D3 | Move Discard off the workout header | Edit mid-session | P2 | S |
| E1 | Finish confirmation sheet | Finish | P2 | S |
| B4 | "Copy last workout" becomes undoable | Log sets | P2 | S |
| B5 | Kill the "Save 0 sets" label | Log sets | P2 | S |
| D4 | Superset: link-next from a group's last member | Edit mid-session | P3 | S |
| E2 | Trim implausible durations at finish | Finish | P3 | M |
| F1 | "Starting…" state instead of a blank flash | Start workout | P3 | S |
| F2 | FinishPage deep-link guard | Finish | P3 | S |
| F3 | Reorder by drag — considered, deferred | Edit mid-session | — | — |

**Ship order** (each PR independently shippable):

1. **PR 1 — Foundations:** P0 (ConfirmSheet + action Toast), then the cheap
   swaps that use them: D3, E1, B5.
2. **PR 2 — Session integrity:** A1, F1, F2.
3. **PR 3 — Logger rework:** B1 + B2 + B3 + B4 together (they touch the same
   screen and B1 changes its write model).
4. **PR 4 — Picker rework:** C1 (+ its `EditSessionAddExercisePage` /
   `PlanAddExercisePage` variants), D1.
5. **PR 5 — Start-flow polish:** A2, A3, A4, D2, D4.
6. **Backlog:** E2, F3.

---

## P0 — Shared primitives: `ConfirmSheet` and action `Toast`

### Problem

Destructive and confirm flows currently use `window.confirm`
(`ActiveWorkoutPage.tsx`, `EditSessionPage.tsx`, `SessionDetailPage.tsx`,
`PlanDetailPage.tsx`, `ExerciseDetailPage.tsx`, `TodayPage.tsx`). Native
dialogs look alien inside an installed PWA (they show the origin URL, ignore
dark mode, block the thread) and offer no room for context like a workout
summary. Several specs below (A1, D2, E1, E2) need a richer confirm/undo
vocabulary than `window.confirm` can express.

### Decision

- Add **`ConfirmSheet`** — a bottom action sheet — as the app's one confirm
  primitive, and migrate every `window.confirm` call to it.
- Extend the existing **`Toast`** (`src/shared/components/Toast.tsx`) with an
  optional **action button** (used for "Undo" in D2/B4 and "Log now" in C1).
- No new dependencies; both are plain fixed-position React components in the
  existing visual language (surface panel, rounded 20px+, cobalt accent,
  `#fa757e` for destructive).

### Design

**`ConfirmSheet`** (`src/shared/components/ConfirmSheet.tsx`):

```ts
interface ConfirmSheetProps {
  open: boolean
  title: string                    // "Discard this workout?"
  body?: ReactNode                 // supporting copy or a mini summary
  confirmLabel: string             // "Discard"
  confirmVariant?: 'primary' | 'destructive'   // destructive = #fa757e fill
  cancelLabel?: string             // default "Cancel"
  onConfirm: () => void
  onClose: () => void              // backdrop tap, cancel, Escape
  /** Optional second affirmative action (used by A1 and E2). */
  secondaryLabel?: string
  onSecondary?: () => void
}
```

- Renders in a portal: dimmed backdrop (`bg-black/60`), sheet slides up from
  the bottom inside the `max-w-md` column, safe-area padded.
- Buttons are full-width stacked (primary/destructive on top, secondary below
  it, cancel last as a text button) — big targets, one-handed.
- Focus is trapped while open; `Escape` and backdrop tap close. The trigger
  button regains focus on close.
- State lives in the calling page (`useState<null | 'discard' | …>`), no global
  store — consistent with "prefer local component state".

**Toast action** (`src/shared/components/Toast.tsx`):

```ts
showToast(message: string, options?: {
  action?: { label: string; onClick: () => void }
  durationMs?: number              // default stays as-is; undo toasts use 5000
})
```

- The action renders as a bold cobalt text button on the toast's trailing edge.
- Invoking the action dismisses the toast immediately.
- Only one toast at a time (current behavior kept); a new toast replaces the
  old one **after firing the old toast's pending-commit callback if any**
  (see D2's grace-period pattern).

### Acceptance criteria

- No `window.confirm` call remains under `src/`.
- Every existing confirm keeps its exact copy (e.g. "Discard this workout?
  Everything you logged will be lost. This can't be undone.").
- Sheet is dismissible by backdrop, cancel, and Escape; confirm fires exactly
  once.
- `showToast('x', { action })` renders a tappable action that dismisses the
  toast.

### Edge cases

- Two sheets never stack: opening logic is per-page state, and pages only have
  one sheet mounted.
- Rapid double-tap on confirm must not double-fire (disable on first tap).

---

## Journey A — Start workout

### A1 — Active-session guard for plan start / repeat *(P1)*

#### Problem

`useStartWorkoutFromPlan.ts:24` and `useRepeatWorkout.ts:24` call
`startWorkoutSession()` unconditionally. `activeWorkoutSession`
(`src/evolu/queries.ts:128`) selects only the **newest** active/paused session,
so starting a plan (or repeating a workout) while another session is live
creates a second active session and orphans the first — it keeps existing in
the DB, invisible and un-discardable through any UI. `TodayPage` avoids this
only by hiding its Start pill when `active` exists; `PlanDetailPage` and
`SessionDetailPage` have no such guard. (`ExerciseDetailPage.handleLogToday`
already checks — it's the model to generalize.)

#### Decision

- **Never create a second active session.** Every entry point that can start a
  session checks for an existing one first.
- When a session is already active the user chooses, via `ConfirmSheet`:
  **Resume current workout** (primary) or **Discard it and start this one**
  (destructive secondary). No silent discard, no auto-merge of the plan into
  the running session.
- Also **self-heal existing zombies**: when discarding, discard *all* live
  active/paused sessions, not just the newest.

#### Design

1. New pure-ish hook `useGuardedStart` (`src/features/workouts/useGuardedStart.ts`):

   ```ts
   type StartGate =
     | { ok: true }
     | { ok: false; active: WorkoutSessionRow }

   const checkCanStart = async (): Promise<StartGate> => {
     const rows = await evolu.loadQuery(activeWorkoutSession)
     return rows[0] ? { ok: false, active: rows[0] } : { ok: true }
   }
   ```

2. New query `allLiveWorkoutSessions` (same predicate as
   `activeWorkoutSession`, **no** `limit(1)`), used only by the discard path:
   discard iterates and calls `discardWorkoutSession` per row.

3. Call sites:
   - `PlanDetailPage.handleStart` — gate before `startFromPlan`; on `ok: false`
     open the sheet. "Resume" → `navigate('/workout')`. "Discard & start" →
     discard all live sessions, then `startFromPlan(planId)`.
   - `SessionDetailPage.handleRepeat` — same, wrapping `repeatWorkout`.
   - `ExerciseDetailPage.handleLogToday` — keep its behavior (it resumes
     implicitly by logging into the active session); no sheet needed.
   - `TodayPage.handleStart` — unchanged (button already hidden when active),
     but add the same gate defensively since the query renders async.

4. Sheet copy: title **"Workout in progress"**, body
   "You have a workout running (2 exercises · 0:41:12). Starting another will
   discard it." Buttons: **Resume workout** / **Discard and start new** /
   Cancel.

#### Acceptance criteria

- With an active session, starting a plan or repeating a workout never yields
  two rows matching the active-session predicate.
- "Resume" lands on `/workout` with the original session intact.
- "Discard and start new" leaves exactly one live session — the new one — even
  if zombie sessions already existed from before this fix.
- With no active session, both flows behave exactly as today (no extra sheet).

#### Edge cases

- The active session may be **paused** — the sheet must still fire (the query
  predicate already covers `paused`).
- Discard path must also work when the active session has completed sets (copy
  already warns data is lost).

---

### A2 — Start-from-plan next to the Start pill on Today *(P2)*

#### Problem

"Start from a plan" is a quiet `ListRow` at the very bottom of Today
(`TodayPage.tsx:147-161`), below the momentum card, last workout, muscle split
and six recent-exercise cards. The user standing in the gym doorway has to
scroll past the whole dashboard to reach their routine.

#### Decision

- Promote plan start into the **floating action area**: the existing
  `FloatingAction` gets a `SecondaryPill` ("Plan", clipboard icon) beside the
  primary "Start workout" `ActionPill` — the same two-pill layout
  `ActiveWorkoutPage` already uses for Pause/Finish.
- The secondary pill **navigates to `/plans`** (it does not start anything
  itself — picking which plan is the Plans page's job).
- **Remove** the bottom "Start from a plan" `ListRow` (now redundant).
- The secondary pill renders **only when at least one non-archived plan
  exists** — a user who never made a plan keeps the single clean pill.

#### Design

- `TodayPage` adds `const plans = useQuery(activePlans)` and renders:

  ```tsx
  <FloatingAction raised>
    {plans.length > 0 && (
      <SecondaryPill label="Plan" icon={<ClipboardList …/>} onClick={() => navigate('/plans')} />
    )}
    <ActionPill label="Start workout" … />
  </FloatingAction>
  ```

- Check `FloatingAction` supports mixed children the way `ActiveWorkoutPage`
  uses it (it does — same composition).

#### Acceptance criteria

- With ≥1 plan: Today shows Plan + Start workout pills side by side; the
  bottom list row is gone.
- With 0 plans: single Start pill, no dead space.
- With an active session: neither pill (the resume pill takes over, as today).

---

### A3 — Quick-start from plan library rows *(P2)*

#### Problem

Starting a routine is always Plans tab → row → `PlanDetailPage` → scroll →
"Start this workout". For the everyday case ("it's Push day, go") the detail
page is a detour.

#### Decision

- Each plan row in `PlanLibraryPage` gets a **trailing play button** that
  starts that plan directly (through the A1 gate).
- Row body keeps opening the detail page (inspect/edit stays one level down).
- An **empty plan's** play button is visually muted and toasts
  "Add an exercise first" (mirrors `PlanDetailPage.handleStart`).

#### Design

- `PlanRowView` stops using the whole-row `ListRow` click and renders the
  sibling-buttons pattern from `ExercisePickerList.PickerItem` (body button +
  trailing icon button — buttons can't nest).
- Trailing control: 34px circle, `bg-neon/[0.16]`, cobalt `Play` icon —
  same visual family as the picker's plus.
- On tap: A1 gate → `startFromPlan(plan.id)` → `navigate('/workout')`.
- While instantiating (the `loadQuery` + inserts are async), disable the button
  to prevent double-start.

#### Acceptance criteria

- Tapping play on a non-empty plan lands on `/workout` with the plan's
  exercises and ghost sets loaded — two taps total from app open.
- Tapping the row body still opens `/plans/:id`.
- Double-tapping play creates exactly one session.
- Empty plan: toast, no session created.

---

### A4 — Explain the disabled Finish; unify disabled-pill behavior *(P2)*

#### Problem

Two different "disabled pill" behaviors exist for the same visual weight:

- `ActiveWorkoutPage` Finish uses a real `disabled` (`ActiveWorkoutPage.tsx:245`)
  — greyed, dead to the touch, **no explanation**. After starting from a plan
  (ghost sets only), the user sees a full workout listed and a Finish that
  simply won't press. Nothing says why.
- `PlanDetailPage`'s Start pill only *looks* disabled
  (`opacity-60 grayscale`, `PlanDetailPage.tsx:139`) but is tappable and
  toasts.

#### Decision

- Standardize on the **PlanDetail pattern**: visually-disabled pills stay
  tappable and **explain themselves via toast**, with `aria-disabled="true"`.
- Finish, when `!canFinish`, toasts: **"Complete a set to finish this
  workout."**
- Additionally, when the session came from a plan and has only ghost sets, the
  empty-state hint under "Exercises" isn't shown (the list isn't empty) — so
  the toast is the only teaching moment. No extra inline copy needed.

#### Design

- `ActiveWorkoutPage`: replace `disabled={!canFinish}` with
  `aria-disabled={!canFinish}` + conditional class
  (`opacity-60 grayscale pointer-events-auto`) and an early-return toast in
  `handleFinish` (the guard clause at `ActiveWorkoutPage.tsx:118` already
  exists — add the toast before `return`).
- Audit for other truly-`disabled` primary CTAs and align (the logger's "Copy
  last workout" `disabled={!prev}` is fine to leave — it's a tertiary button
  whose absence of data is self-evident from the "Last time · —" panel).

#### Acceptance criteria

- Tapping greyed Finish shows the toast; a completed set immediately un-greys
  it (reactive query already drives `canFinish`).
- Screen readers announce the button as disabled (`aria-disabled`).

---

## Journey B — Logging sets (the core loop)

### B1 — Per-set commit in the logger (tap-to-complete) *(P1)*

#### Problem

`LogExercisePage` is a **batch editor**: every set lives in the in-memory
`draft` array (`LogExercisePage.tsx:126`) until "Save N sets" deletes all
persisted sets and re-inserts the drafts (`LogExercisePage.tsx:209-241`).
Consequences:

1. **Data loss.** The back chevron (`LogExercisePage.tsx:261`) discards
   silently. A PWA evicted while the phone is locked between sets — which at
   the gym is the *normal* state — loses everything typed.
2. **No tap-to-complete.** CLAUDE.md's UX rules call for tap-to-complete set
   rows; the logger has no per-set completion at all.
3. **No per-set timestamps.** All sets share one `completedAt`
   (`LogExercisePage.tsx:229-237`), so per-set timing (future rest stats) is
   unrecoverable.
4. **No rest automation hook** (see B2) — there is no "set done" moment to
   hang it on.

Meanwhile the codebase already has the alternative write model working:
`WorkoutExerciseEditor` (edit-finished-session) writes straight to Evolu per
interaction, and plan instantiation already creates **ghost sets**
(`completedAt: null`) that the recap/stat queries correctly ignore.

#### Decision

- The logger adopts the **write-through model**: set rows are persisted
  `exerciseSet` rows from the moment they exist. Uncommitted rows are **ghost
  sets** (`completedAt: null`) — the exact representation plans already use.
- Each set row gets a trailing **complete button** (check circle). Tapping it
  stamps `completedAt` (tap-to-complete); tapping a completed set's check
  **un-completes** it (back to ghost) for fat-finger recovery.
- Editing values (steppers, typed commit, set type, RPE) writes immediately
  via `updateSet` — **editing never auto-completes a set**; only the check
  does. (Contrast with `WorkoutExerciseEditor.stampIfGhost`, which exists
  because *finished* sessions must not hold invisible edits; a live session
  has no such constraint.)
- Opening the logger for an exercise **not yet in the session** creates the
  `workoutExercise` row immediately (at `nextOrderIndex(entries)`), plus one
  ghost set seeded from the previous session's top working set (today's
  seeding rule, unchanged). This also makes C1's "instant add" and the logger
  converge on one model.
- The primary button becomes **"Done"** — it only navigates back. Nothing is
  "saved" at the end because everything already is.
- "Save N sets" semantics disappear; so does the delete-and-reinsert dance.
- PR badge logic is unchanged in spirit: computed per row against
  `priorSets`, shown for non-warm-up rows whose current values beat the
  stored best (`LogExercisePage.tsx:309-310`) — now reading persisted values.

#### Design

**State model.** `DraftRow[]` and its reducer-style helpers go away. The rows
render directly from `useQuery(setsForWorkoutExercise(workoutExerciseId))`,
ordered by `orderIndex`. Local state shrinks to UI-only concerns
(`rpePickerRow`, focused-input text — `StepperField` already owns its text
locally).

**Row lifecycle.**

| Action | Mutation |
|---|---|
| Open logger, exercise not in session | `addExerciseToWorkout(sessionId, exerciseId, nextOrderIndex(entries))` then `addSet(weId, { orderIndex: 0, completedAt: null, …seededFields })` |
| Open logger, exercise in session | none — render its sets (ghosts and completed alike) |
| "Add set" | `addSet(weId, { orderIndex: max+1, completedAt: null, …cloneOfLastRowFields })` — clone metrics, `setType: null`, `rpe: null` (RPE stays per-set-felt, as in Phase E) |
| Stepper / typed commit / set-type cycle / RPE pick | `updateSet(setId, patch)` |
| Check (ghost → done) | `updateSet(setId, { completedAt: new Date().toISOString() })` → B2 hook |
| Check (done → ghost) | `updateSet(setId, { completedAt: null })` |
| Row × (remove) | `removeSet(setId)` (existing soft delete) |
| "Done" | `navigate('/workout')` — no writes |

**Validity.** The current `isValid` gate (`reps > 0`, or primary metric > 0
for repless types — `LogExercisePage.tsx:204-206`) moves to the **check
button**: an invalid row's check is visually muted and toasts "Enter reps
first" on tap. Ghost rows with zero values are fine to leave behind — they're
invisible to every stat/recap query and get cleaned up by the same rules that
already handle unconfirmed plan targets.

**`orderIndex`** for new sets = `max(existing) + 1`, mirroring the comment and
fix in `WorkoutExerciseEditor.tsx:67-72` (not `sets.length`, which collides
after a mid-list removal).

**Visual.** The check is a 34–40px trailing circle per set header row (next to
the existing type/RPE chips): ghost = outlined circle; completed = filled
cobalt with white check. Completed rows keep full editability but their set
chip ("Set 2") switches to the completed accent so a glance shows progress.

**Ghost seeds from plans** flow through untouched: the plan's target sets
*are* the initial rows, values pre-filled, check empty — confirm-or-edit is
now literally one tap per set.

**What this deletes:** `draft` state, `metricOf` on drafts (recompute from row
values), `handleSave`'s delete-and-reinsert, the "Save N sets" label logic —
and the entire draft-loss problem class (no interim `sessionStorage`
mitigation needed).

**Testing.** Extract the pure bits — `seedFieldsFrom(source, fields)`,
`isRowCompletable(row, fields)` — into `setFields.ts` or a new
`loggerRows.ts` with unit tests, keeping the React layer thin per repo
convention.

#### Acceptance criteria

- Kill the app mid-exercise: reopening shows every row exactly as left,
  completed sets still completed, ghost values still typed-in.
- Tapping check on a valid ghost completes it; `ActiveWorkoutPage`'s set count
  and volume chips update live; warm-up completions don't move records.
- Tapping check on a completed set reverts it to ghost, and recap/stat queries
  stop counting it.
- Back chevron and "Done" never lose data and never show a confirm.
- Editing a value never changes completion state.
- Two sets completed 3 minutes apart carry distinct `completedAt` values.
- The PR badge appears/disappears live as values cross the stored best, and
  never on warm-up rows.
- No duplicate `orderIndex` after add → remove-middle → add.

#### Edge cases

- **Exercise-creation race:** `addExerciseToWorkout` must run once even under
  React strict-mode double-effects — guard with a ref or derive from
  `existing` before creating.
- **Same exercise opened twice** (picker allows it): `existing` lookup by
  `exerciseId` (`LogExercisePage.tsx:99`) already dedupes — keep it.
- **Removing the only set** leaves zero rows: render one fresh seeded ghost
  (the screen never shows an empty list).
- **Backup/restore:** no format change — ghost sets already exist in v2
  backups via plans.
- **Repeat-workout ghosts** (`repeatSetToSetInput` resets `completedAt`) work
  identically to plan ghosts here — one confirm tap per remembered set.

---

### B2 — Auto-start rest timer on set completion *(P1)*

#### Problem

The natural loop is *do set → mark done → rest*. Today rest is a separate
manual button (`LogExercisePage.tsx:371-379`) — one extra deliberate tap per
set, on the app's hottest path.

#### Decision

- Completing a set (B1's ghost → done transition) **auto-starts the rest
  timer** with the user's default duration.
- Governed by a **Settings toggle** in the existing rest card: "Start rest
  after each set", **default ON**. Persisted next to the rest default.
- Fires for **every** set type including warm-ups (rest between warm-ups is
  real; one rule, no surprises).
- It does **not** fire on un-complete → re-complete of the *same already-timed
  moment*? It does — re-completing is a new "set done" event; the timer simply
  restarts (`start()` already restarts). Simplicity wins.
- The manual "Rest" button in the logger **stays** (for off-cycle rests and
  users who toggle auto off).

#### Design

- `RestTimerContext` gains `autoStart: boolean` + `setAutoStart`, persisted in
  the same localStorage envelope (new key `bodycache:rest:auto`, read like
  `readDefault()`; absent = `true`).
- B1's complete handler: `if (rest.autoStart) rest.start()`.
- `SettingsPage` rest card adds the toggle row beneath the presets.
- Never blocks or delays the write — timer start is fire-and-forget after the
  mutation.

#### Acceptance criteria

- Toggle ON: checking a set starts a countdown at `defaultSec`; the
  `RestTimerBar` appears (it's global, so it survives navigating back to
  `/workout`).
- Toggle OFF: checking a set starts nothing; manual button still works.
- Preference survives reload; a fresh install has it ON.
- Un-completing a set does not start a timer.

---

### B3 — "Last time" panel above the entry area *(P2)*

#### Problem

The mantra says show last performance **before** the user logs, but the "Last
time" panel renders *below* the Save button (`LogExercisePage.tsx:398-431`) —
off-screen once two or three set rows exist. The pre-filled values help but
encode only the single top set; the set-by-set memory (60×8, 60×8, 55×10 @8)
is what the user actually recalls against.

#### Decision

- Move the panel **above the set rows**, directly under the header, as a
  **compact strip**: overline `LAST TIME · FRI` + trend badge, then the
  previous session's sets in the existing tabular row format.
- Cap at **4 rows**; more collapses into `+2 more` which expands on tap
  (state resets per exercise).
- First-time exercises show the strip's empty copy one line tall ("First time
  — no previous data yet.") — same copy as today, relocated.
- The bottom of the screen (after "Done") keeps nothing — the duplicated
  panel is removed, not copied.

#### Design

- Pure relocation of existing JSX + a `collapsed` boolean; row rendering,
  `SetTypeTag`, `@rpe` suffix, and `TrendBadge` reuse as-is.
- Divider below the strip separates memory from entry.
- "History" header link stays (deep recall lives in `ExerciseDetailPage`).

#### Acceptance criteria

- On open, with a 3-set history, the user sees all previous sets **and** the
  first entry row without scrolling on a 667pt-class viewport.
- 6-set history shows 4 + "+2 more"; tapping expands in place.
- Trend badge renders in the strip exactly as it did below.

---

### B4 — "Copy last workout" becomes undoable *(P2)*

#### Problem

`copyPrevious` (`LogExercisePage.tsx:190-200`) replaces every row with last
session's sets, silently clobbering anything already typed or completed. The
toast confirms the action but offers no way back.

#### Decision

- Copy stays one tap (no confirm — it's the memory-aid hero action), but the
  toast becomes **"Copied last workout — Undo"** using the P0 action toast.
- Undo restores the exact pre-copy rows, including completion states.
- Under B1's write-through model, copy is a mutation batch: snapshot current
  rows → `removeSet` all → `addSet` last-session clones **as ghosts**
  (completion is per-today, never copied). Undo replays the snapshot
  (re-inserts with original values, set types, RPE, and `completedAt`s).

#### Design

- `const snapshot = sets.map(pickRowFields)` kept in a ref; cleared when the
  toast expires or a new copy fires.
- Undo re-inserts via `addSet` preserving `orderIndex` and `completedAt` from
  the snapshot. (New row ids are fine — nothing references set ids across
  screens.)
- Guard: copy while `!prev` stays disabled as today.

#### Acceptance criteria

- Copy → Undo returns the screen to a state indistinguishable from pre-copy
  (values, types, RPE, completion, order).
- Copy → toast expires → Undo unavailable (action gone with the toast).
- Copied rows are all ghosts (nothing auto-completes, no rest timer fires).

---

### B5 — Kill the "Save 0 sets" label *(P2)*

#### Problem

With no valid row, the primary button reads **"Save 0 sets"** and actually
just navigates back (`LogExercisePage.tsx:211-214,395`).

#### Decision

- Subsumed by B1: the primary button is always **"Done"**.
- If B1 ships later than expected, the standalone interim fix is: label
  switches to "Done" whenever `validCount === 0`.

#### Acceptance criteria

- No state of the logger ever renders a button offering to save zero of
  anything.

---

## Journey C — Adding exercises from the library

### C1 — Instant add + multi-add in the in-workout picker *(P1)*

#### Problem

In `AddExercisePage` the trailing **plus doesn't add** — it navigates to the
logger (`AddExercisePage.tsx:57-60`). If the user backs out of the logger,
nothing was added (pre-B1, `addExerciseToWorkout` only ran inside save). And
building a session up front ("add these 5, then lift") costs a full
pick → logger → save round trip per exercise. The `aria-label` already says
"Add {name}" — the code just doesn't do it. There's also no signal that an
exercise is already in today's session.

#### Decision

- **Plus = add, instantly, staying in the picker.** Tapping plus inserts the
  `workoutExercise` (plus one seeded ghost set, matching B1's open-logger
  behavior) and shows an action toast **"Added Bench Press — Log now"**.
  "Log now" jumps to the logger for it.
- Rows already in the session render the trailing control as a **filled
  check** instead of a plus; tapping the check **opens the logger** for that
  exercise (it's in — the next intent is logging it). Removal stays on the
  workout screen; the picker never removes.
- Row **body** tap keeps opening the exercise detail in selection mode
  (unchanged, TWEAK T3).
- Multi-add is therefore just plus-plus-plus-back — no separate multi-select
  mode, no sticky counter bar. (Considered and rejected: a Hevy-style
  selection mode adds a mode switch and a second confirm step for the common
  single-add case.)
- The same model applies to **`EditSessionAddExercisePage`** (adds to a
  finished session; seeded set stamped `completedAt` per that page's existing
  convention) and **`PlanAddExercisePage`** (adds a plan exercise; already
  add-in-place today — align its added-state check styling).

#### Design

- `AddExercisePage.pick` becomes:

  ```ts
  const pick = (exerciseId) => {
    const idx = nextOrderIndex(entries)
    const we = addExerciseToWorkout(session.id, exerciseId, idx)
    if (!we.ok) return
    addSet(we.value.id, { orderIndex: 0, completedAt: null, ...seedFrom(history) })
    showToast(`Added ${name}`, { action: { label: 'Log now',
      onClick: () => navigate(`/workout/log/${exerciseId}`) } })
  }
  ```

  It needs `sessionExercises(session.id)` (already-in-session detection +
  `nextOrderIndex`) — one extra reactive query on a page that already runs
  three.

- `ExercisePickerList` gains an optional prop:

  ```ts
  /** Ids already added; their trailing control renders as a check. */
  addedIds?: ReadonlySet<string>
  /** Tap handler for an added row's check (e.g. open the logger). */
  onPickAdded?: (id: ExerciseId) => void
  ```

  `PickerItem` renders check vs plus off membership. Classic pickers that
  omit the prop are pixel-identical to today (the component is shared with
  plan/edit-session flows and tested — `ExercisePickerList.test.tsx` gets the
  new cases).

- Seeding "last top working set" for the ghost requires the exercise's
  history; reuse `useLastPerformanceIndex` data if sufficient, else fall back
  to zero-default ghost (seeding here is nice-to-have; the logger re-seeds
  properly on open anyway — **decision:** zero-default ghost in the picker,
  correct seed on first logger open — keeps the picker free of per-exercise
  history queries).

  > Implementation note: on logger open, if the exercise's only set is an
  > untouched zero-default ghost, replace its values with the proper seed.
  > "Untouched" = all fields equal `DEFAULT_VALUES`.

#### Acceptance criteria

- Tapping plus on five rows then back shows five exercises on
  `/workout`, in tap order, each "0 of 1 sets" (per D1's meta), none counted
  as logged.
- Rows for in-session exercises show the check on entry to the picker (not
  just after tapping) — including exercises added via plan instantiation.
- "Log now" on the toast opens the logger for the right exercise.
- Tapping an added row's check opens its logger with its ghost set(s).
- Backing out of a logger opened this way keeps the exercise in the session.
- Plan and edit-session pickers behave equivalently in their contexts.

#### Edge cases

- Double-tap on plus must not create two `workoutExercise` rows: after the
  first tap the row flips to check via the reactive query — but flip is
  async, so also guard the handler (ignore pick when id already in
  `addedIds`).
- Grid view: the absolute-positioned plus (`ExercisePickerList.tsx:266-273`)
  gets the same check treatment.

---

## Journey D — Editing the ongoing workout

### D1 — Plan targets visible on workout entry cards *(P1)*

#### Problem

`WorkoutEntryCard` counts only completed sets (`WorkoutEntryCard.tsx:44`), so
a freshly-started plan renders every card as "Chest" / "No sets yet" — the
plan doesn't look loaded, and mid-workout there's no sense of progress against
it.

#### Decision

- The card meta encodes **progress against planned sets** whenever ghost sets
  exist:

  | State | Meta line |
  |---|---|
  | 0 completed, N ghosts | `0 of 3 sets · target 60 kg × 8` |
  | k completed, more ghosts | `2 of 4 sets · top 80 kg × 5` |
  | all completed (or no ghosts ever) | `3 sets · top 80 kg × 5` *(today's format)* |
  | 0 completed, 0 ghosts | body part / "No sets yet" *(today's fallback)* |

- "Target" shows the **first ghost's** summary (the set the user will do
  next), formatted with the existing `formatSetSummary`.
- No hero-level "2/5 exercises done" chip for now — the per-card lines carry
  it. (Rejected as redundant with the sets chip; revisit if users ask.)

#### Design

- The card already queries all sets and filters in JS — keep the single query,
  derive `completed` / `ghosts` from one pass.
- New pure helper `entryMetaLine({ completed, ghosts, type, unit, bodyPart })`
  in `src/features/workouts/` with unit tests for the four states (repo
  convention: calculations out of the UI).
- Warm-up ghosts count in "of N" (they're planned work) but never in `top`
  (existing `workingSets` rule).

#### Acceptance criteria

- Start a 3-exercise plan: every card immediately reads `0 of N sets ·
  target …`.
- Complete one set: that card ticks to `1 of N` live.
- Confirm-all then finish: recap unchanged (queries already ignore ghosts).
- Hand-built workouts (no ghosts) render exactly as today.

---

### D2 — Undo-toast removals instead of `window.confirm` *(P2)*

#### Problem

Removing an exercise mid-workout throws a blocking native confirm
(`ActiveWorkoutPage.tsx:112-115`; same in `EditSessionPage.tsx:101-104`). For
an easily-reversible action that's the wrong weight — and mid-set, a modal is
hostile.

#### Decision

- Removing an exercise from a workout (live or finished-session edit) happens
  **immediately, no confirm**, with an action toast: **"Removed Bench Press —
  Undo"** (5s).
- Implementation is **grace-period commit**, not soft-delete-then-restore:
  the row hides instantly in the UI, but `removeExerciseFromWorkout` fires
  only when the toast expires (or is replaced, or the page unmounts). Undo
  cancels the pending commit — nothing was ever written.
  *Why:* restoring a soft delete means writing `isDeleted` back to null and
  relying on Evolu semantics we haven't verified in 7.x; the grace period
  avoids the question entirely and is the standard pattern for undo toasts.
- **Keep real confirms (ConfirmSheet)** for the heavyweight irreversibles:
  discard workout, delete workout from history, delete plan, delete exercise.
  Those genuinely destroy logged data or library entries.

#### Design

- Small hook `usePendingRemoval` (shared by both pages):

  ```ts
  const { pendingIds, remove } = usePendingRemoval({
    commit: (id) => removeExerciseFromWorkout(id),
    toastLabel: (name) => `Removed ${name}`,
  })
  ```

  - `remove(id, name)` adds to `pendingIds`, shows the action toast, arms a
    5s timer.
  - Undo: clears timer, drops from `pendingIds`.
  - Expiry / page unmount (`useEffect` cleanup) / a second `remove`: commits
    the pending one first (P0's toast-replacement rule).
- Pages filter `entries` through `pendingIds` before grouping — supersets
  regroup around the hidden row automatically (adjacency-derived, per Phase E
  design).

#### Acceptance criteria

- Remove → Undo: the exercise and **all its sets** are intact (no mutation
  ever fired — verify no `isDeleted` write occurred).
- Remove → wait 5s: row is gone after reload too.
- Remove A, then immediately remove B: A commits, B's toast shows, B still
  undoable.
- Remove → navigate away before expiry: removal commits (never silently
  resurrects later).
- Volume/set chips on the workout hero reflect the removal only after commit
  (acceptable 5s lag) — or filter chips through `pendingIds` too if trivial.

---

### D3 — Move Discard off the workout header *(P2)*

#### Problem

"Discard" is the lone top-right header action on the live workout
(`ActiveWorkoutPage.tsx:156-163`) — the position every other screen uses for a
*safe* action (Edit, History, New). It's a recurring near-miss placed at
maximum reachability.

#### Decision

- Remove it from the header. Discard becomes a **red text action at the bottom
  of the page** (below `MuscleDistributionCard`) — exactly the pattern
  `SessionDetailPage` ("Delete workout") and `PlanDetailPage` ("Delete plan")
  already use.
- It opens the P0 `ConfirmSheet` with today's copy.
- The header right side becomes empty. (The empty-stale-session discard on
  Today, `TodayPage.tsx:199-235`, keeps its inline button — that flow exists
  *specifically* to offer discard.)

#### Acceptance criteria

- No destructive control above the fold on `/workout`.
- Discard is still reachable in ≤2 gestures (scroll + tap) and always behind
  the sheet.

---

### D4 — Superset: link-next from a group's last member *(P3)*

#### Problem

`onLinkNext` is offered only to standalone rows
(`ActiveWorkoutPage.tsx:198-199,208`; same in `EditSessionPage`). Extending an
existing A+B superset with C requires ungrouping and relinking both.

#### Decision

- The **last member of a group** also shows "Superset with next" — **iff** the
  next exercise exists and is standalone. Linking assigns the *group's* key to
  the next row (`setWorkoutExerciseSuperset(next.id, entry.supersetGroup)`).
- Merging two existing groups stays unsupported (button hidden when the next
  row already has a key) — ungroup one first. Keeps the interaction one-key
  simple.

#### Design

- In both pages' block renderers, compute for a group's final item:
  `const next = entries[indexOf(last) + 1]`; linkable =
  `next && next.supersetGroup == null`. Pass `onLinkNext` accordingly into the
  card/editor (both already accept it; only the gating changes).
- `groupExercises()` is untouched — adjacency + shared key already yields the
  grown block next render.

#### Acceptance criteria

- A+B group, C standalone below: B's row offers link-next; tapping yields an
  A+B+C block labeled as one group.
- A+B group followed by C+D group: B offers nothing.
- Works identically in `ActiveWorkoutPage` and `EditSessionPage`; plan editor
  (`PlanEditorPage`) gets the same gating if it shares the pattern.

---

## Journey E — Finishing

### E1 — Finish confirmation sheet *(P2)*

#### Problem

Finish is a one-tap, irreversible commit (`ActiveWorkoutPage.tsx:117-121`) on
the biggest button on the screen. There is no un-finish; an accidental tap
ends the session (the only recovery is Repeat-workout reconstruction).

#### Decision

- Finish opens a **ConfirmSheet**: title "Finish workout?", body = the mini
  summary the user is about to bank — `3 exercises · 9 sets · 0:48:12`
  (+ `2 PRs` when applicable, data already computed for the hero chips).
  Confirm label **"Finish workout"** (primary, not destructive), cancel
  returns to the session untouched.
- **Un-finish is explicitly rejected** for now: reopening a finished session
  means unwinding `finishedAt`/`durationSec` and restarting pause bookkeeping
  (`resumedAt`/`pausedTotalSec`) — cost outweighs the residual risk once the
  sheet exists.
- If a session has **ghost sets remaining** (unconfirmed plan targets), the
  sheet body appends one line: "2 planned sets weren't logged — they'll be
  dropped." (They aren't literally deleted; they're just invisible to history
  — copy says what the user experiences.)

#### Acceptance criteria

- Finish always shows the sheet; confirm proceeds exactly as today
  (`finishWorkoutSession` + navigate to recap with state).
- Cancel/backdrop: session still active, timer still running.
- Sheet numbers match the hero chips at the moment of opening.

---

### E2 — Trim implausible durations at finish *(P3)*

#### Problem

The stale-session prompt only covers **empty** sessions
(`isStaleAbandonedSession` takes the completed-set count). A workout *with*
sets left open overnight shows a 16-hour resume pill, and finishing it banks a
16-hour duration into history and weekly stats.

#### Decision

- At finish time (inside E1's flow), if `elapsedSec > 3h` **and** the last
  completed set is `> 30 min` old, the confirm sheet swaps in a **dual-choice**
  body: "This workout ran 16:04:12, but your last set was at 18:42."
  - **Primary:** "End at last set (1:12:33)" → duration =
    `lastSet.completedAt − startedAt − pausedTotalSec`, `finishedAt` =
    `lastSet.completedAt`.
  - **Secondary:** "Keep full time" → today's behavior.
- Thresholds are constants in a pure helper, unit-tested:
  `suggestTrim(elapsedSec, lastCompletedAt, now)` in `workoutStats.ts`.
- Depends on B1's real per-set timestamps to be meaningful (batch stamps are
  one shared time — still usable, just coarser; ship after B1).

#### Design

- `finishWorkoutSession(id, elapsedSec)` gains an optional `finishedAt`
  override (or a sibling mutation) so the trimmed timestamp is stored, not
  just the duration — recap "time" line and history rows then agree.
- `ConfirmSheet`'s `secondaryLabel`/`onSecondary` (P0) carries the second
  affirmative.

#### Acceptance criteria

- 16h-open session, last set 14h ago: sheet offers trim; choosing it stores
  the short duration and `finishedAt` at the last set; history and weekly
  volume reflect it.
- 45-minute normal session: plain E1 sheet, no trim option.
- Session with zero completed sets can't reach Finish anyway (A4/canFinish).

---

## F — Smaller fixes

### F1 — "Starting…" state instead of a blank flash *(P3)*

`ActiveWorkoutPage` renders `null` and arms a 500 ms redirect-home while the
just-inserted session row propagates from Evolu's worker
(`ActiveWorkoutPage.tsx:29-38`). On a slow device that's a blank screen that
may bounce.

**Decision:** render a centered `Starting workout…` (`text-faint`, matching
`PageFallback`) instead of `null`, and lengthen the give-up redirect to
1500 ms. No spinner dependency.

**Acceptance:** tapping Start never shows a fully blank screen; the give-up
path still lands on Today if the row truly never arrives.

### F2 — FinishPage deep-link guard *(P3)*

`FinishPage` falls back to `finished[0]` when opened without router state
(`FinishPage.tsx:32-34`) — deep-linking `/workout/finish` (or reloading the
recap) presents an old workout as just-completed.

**Decision:** require `location.state.sessionId`; without it,
`<Navigate to="/" replace />`. Reload-after-finish landing on Today is
acceptable (the workout is in History).

**Acceptance:** visiting `/workout/finish` cold redirects home; the normal
finish flow is unchanged.

### F3 — Reorder by drag — considered, deferred

Chevron reordering (`ActiveWorkoutPage.tsx:82-93`) moves one position per tap
and renumbers up to n rows per move; slot 7 → slot 1 is six taps. The Phase E
decision (always-visible chevrons, no drag dependency, better one-handed) still
holds for MVP, and mid-session lists are short. **Deferred, not designed
here.** Revisit trigger: plan editor lists regularly exceeding ~8 exercises,
or user feedback. Any future drag must keep chevrons as the accessible
fallback.

---

## Cross-cutting notes

- **Schema / backup:** nothing in this document adds a table or column. Ghost
  sets, `supersetGroup`, per-set `completedAt`, `setType`, and `rpe` all
  already exist. Backup stays **v2**; no migration.
- **Offline:** every spec writes through the existing local-first mutations —
  no network dependency is introduced anywhere, including the rest-timer
  preference (localStorage).
- **Out of scope (unchanged from CLAUDE.md):** routine sharing, folders,
  auto-programming, coaching cues on top of these flows, workout naming /
  notes prompts at finish (typing during a workout stays minimized).
- **Testing convention:** each spec that introduces logic names its pure
  helper and expects a `.test.ts` sibling (`entryMetaLine`, `suggestTrim`,
  `seedFieldsFrom`, `usePendingRemoval`'s reducer, gate logic in A1). UI
  wiring stays thin and is covered by the existing page tests where they
  exist (`AddExercisePage.test.tsx`, `ExercisePickerList.test.tsx`).
