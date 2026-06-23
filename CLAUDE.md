# BodyCache — Claude Code Instructions

## Product intent

BodyCache is a personal **gym memory aid**, not a coach. Mantra: *"BodyCache is
not your coach. It is your workout memory."* Optimize for fast logging and
remembering previous performance while standing next to a machine. Do not
overbuild.

The app must make logging a set **faster than a notes app**, and must answer —
for every exercise — three questions: *what is this, what did I do last time,
what is my best?*

**Plans (routines)** are self-authored memory aids, not coaching: the user
writes down the exercises (and optional target sets) they intend to do for a
given day so it's ready before they walk in. The app never prescribes or
auto-generates a program — it just remembers the one *you* set up.

## Architecture

- React + TypeScript + Vite + Tailwind CSS, PWA via `vite-plugin-pwa`.
- **Evolu** for local-first structured data (`@evolu/common`, `@evolu/react`,
  `@evolu/react-web`).
  - Schema lives in `src/evolu/schema.ts`.
  - Reusable reactive queries in `src/evolu/queries.ts`.
  - Mutations (insert/update/soft-delete) in `src/evolu/mutations.ts` via the
    `useBodyCacheMutations()` hook.
- Feature-first folders: `src/app`, `src/evolu`, `src/features/{exercises,
  workouts,settings}`, `src/shared/{components,utils}`.
- Prefer Evolu reactive queries + local component state. Avoid global state
  unless necessary.
- `useQuery` uses React **Suspense** and returns rows directly — keep a
  `<Suspense>` boundary above pages that query.

## Evolu specifics (learned, keep consistent)

- System columns (`createdAt`, `updatedAt`, `isDeleted`, `ownerId`) are added
  automatically — never declare them in the schema.
- Soft delete = `update(table, { id, isDeleted: 1 })`. Live rows have
  `isDeleted` `null`; filter with `.where('isDeleted', 'is', null)`.
- No multi-literal union Type yet: enum-like columns are stored as
  `NonEmptyString100` and narrowed to a TS union in the app layer. Allowed
  values are exported as `as const` arrays for dropdowns (see `EXERCISE_TYPES`,
  `BODY_PARTS`, `EQUIPMENT`, `WORKOUT_STATUSES`).

## Offline-first rules

- App loads offline after first visit. Workout logging works fully offline.
- Never require login. Never block saving on network/sync status.
- Relay sync is enabled in `src/evolu/evolu.ts` via a WebSocket transport
  (`VITE_EVOLU_RELAY_URL`, default `wss://free.evoluhq.com`; empty string =
  local-only). Evolu is end-to-end encrypted — the relay sees only ciphertext.
  Writes commit locally first and sync in the background, so saving never blocks
  on the network. Sync status is shown in the Settings card via connectivity
  (`useOnlineStatus`), since Evolu doesn't yet expose a live `SyncState`.

## Data & image rules

- Soft delete through Evolu conventions; treat sessions, workout-exercises and
  sets as separate entities.
- **Do not store images as base64 in Evolu.** Store only photo *metadata* +
  a local reference in Evolu (`exercisePhoto`); store the binary in the browser
  (IndexedDB) via `src/shared/utils/photos.ts`. Generate thumbnails for fast
  rendering. Cross-device image sync is out of scope for MVP.
- Keep stats **derived** where possible; avoid premature cached stats.

## UX rules (Hevy-inspired — see decisions below)

- Mobile-first, dark mode, one-handed use. Big buttons, big numeric inputs.
- Minimize typing during a workout.
- **Show last performance before the user logs today's set.** Pre-fill new sets
  from the previous set / previous workout ("Previous" column, ghost values).
- Tap-to-complete set rows.
- Inline **PR badge** when a logged set beats the stored best (cheap, motivating).
- **Photo-first** is our differentiator vs Hevy: machine photos lead the
  library cards and the exercise detail. Recognize the thing visually first.

## Explicitly out of scope (do NOT build)

Social feed/sharing, nutrition, AI trainer/coach, Apple Health / Google Fit,
user accounts (login/auth), AI-generated programs / periodization, cloud image
sync, paid tiers, multi-user.

Note: a self-authored **plan/routine builder** is now in scope (see Phase D
below) — but only as a memory aid. Routine *sharing*, folders/programs, and any
form of auto-generated or prescribed programming remain out of scope.

The former v2 items are now **built** (Phase C): rest timer (`shared/rest`),
set-types (warm-up/drop/failure on `exerciseSet.setType`; warm-ups excluded from
records via `workingSets`), estimated 1RM (`oneRepMax.ts`, Epley) and progress
charts (`progress.ts` + `ProgressChart`). A local **profile** (`profile` table,
synced) with a generated avatar and a **required first-run onboarding** gate
(`RootGate`) also ship here — note this is personal metadata, not a user
account: there is no login/auth.

## Code quality

- Strict TypeScript. Small components. No unrelated refactors.
- Add tests for pure stat-calculation functions; keep calculations independent
  from UI (`exerciseStats.ts`, `workoutStats.ts`).
- Clear naming over clever abstractions.

## Commands

- `npm run dev` — Vite dev server.
- `npm run build` — `tsc -b && vite build` (typecheck + production build).
- `npm run preview` — preview the production build.
- Install note: a peer-dependency mismatch (`@evolu/react` wants React ≥19,
  project is on React 18) currently requires `npm install --legacy-peer-deps`.

## Plans (Phase D)

A **plan** is a reusable, self-authored routine (Hevy-style): a named, ordered
list of exercises (`plan` → `planExercise` → `planSet`), each plan set carrying
prescribed target metrics + set type. Plans hold *only the recipe* — no logged
data. Starting a workout from a plan instantiates fresh
`workoutSession`/`workoutExercise`/`exerciseSet` rows, copying the target sets
as **incomplete "ghost" sets** the user confirms or edits in the normal logger
(`useStartWorkoutFromPlan` + the pure `planToSession.ts` helper). Plans live in
`src/features/plans` (`PlanLibraryPage`, `PlanDetailPage`, `PlanEditorPage`,
`PlanAddExercisePage`) and are reachable from the Plans tab. Plan tables are
included in backup/restore (backup format bumped to **v2**; v1 backups still
restore, treating plan tables as empty).

## Milestones (from the product spec)

1. App shell ✅ &nbsp; 2. Evolu schema ✅ &nbsp; 3. Exercise library ✅ &nbsp;
4. Workout logging ✅ &nbsp; 5. History & stats ✅ &nbsp; 6. Settings & polish ✅
&nbsp; 7. Sync (Phase B) ✅ &nbsp; 8. Profile + v2 features (Phase C) ✅ &nbsp;
9. Plans / routines (Phase D) ✅.
