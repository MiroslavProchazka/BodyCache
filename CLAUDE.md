# BodyCache — Claude Code Instructions

## Product intent

BodyCache is a personal **gym memory aid**, not a coach. Mantra: *"BodyCache is
not your coach. It is your workout memory."* Optimize for fast logging and
remembering previous performance while standing next to a machine. Do not
overbuild.

The app must make logging a set **faster than a notes app**, and must answer —
for every exercise — three questions: *what is this, what did I do last time,
what is my best?*

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
- Sync is currently local-only (`transports: []` in `src/evolu/evolu.ts`);
  relay sync is a later addition. Sync status should be visible but not blocking.

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

Social feed/sharing, routine/template builder, nutrition, AI trainer/coach,
Apple Health / Google Fit, user accounts, complex planning, cloud image sync,
paid tiers, multi-user. Rest timer, set-types (warm-up/drop/failure), 1RM and
progress charts are **v2** — leave room in the schema, don't build them now.

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

## Milestones (from the product spec)

1. App shell ✅ &nbsp; 2. Evolu schema ✅ &nbsp; 3. Exercise library ✅ &nbsp;
4. Workout logging &nbsp; 5. History & stats &nbsp; 6. Settings & polish.
