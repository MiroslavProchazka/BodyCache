# Exercise Library & Picker Performance — Specification and Implementation Plan

**Status:** approved for implementation · **Owner:** hand-off to implementing agents
**Scope:** `/library`, `/library/starter`, `/library/:id`, `/workout/add-exercise`,
`/history/:id/add-exercise`, `/plans/:id/add-exercise`, and the cross-cutting
data/photo/bundle layers they share. Online **and** offline.

---

## 1. Problem statement

Reported symptoms (real device, library seeded from the starter catalog, i.e.
hundreds to ~1,088 exercises):

1. The Exercise library takes a long time to load.
2. Tapping **Add exercise** (during a workout) sometimes appears to do nothing —
   the user taps 2–3 times and waits up to ~20 s before the picker appears.
3. General sluggishness both online and offline.

These are not one bug. The investigation below found **six independent causes**
that compound. Each is fixable in isolation; they are grouped into phased
workstreams so the worst user pain is fixed first.

---

## 2. Evidence (measured in this repo, commit `d3b70b5`)

### 2.1 Production build output

```
dist/assets/index-*.js               523 kB │ gzip 153 kB   (main bundle)
dist/assets/starterCatalog-*.js      739 kB │ gzip  84 kB   (generated catalog)
dist/assets/AddExercisePage-*.js       3 kB
...
PWA precache: 67 entries, 3.4 MB
```

`starterCatalog-*.js` is a **static dependency of three chunks**:
`StarterLibraryPage` (expected), **`ExerciseDetailPage`** (not expected), and it
is referenced from `index` as a preload. The detail page pulls it in through an
import chain: `ExerciseDetailPage.tsx` → `cues.ts` → `starterCatalog.ts`
(for the one-line `normalizeExerciseName`) → `starterCatalog.generated.ts`
(a 1,088-object array literal). Opening **any** exercise detail therefore
downloads (first time) and parses/executes ~739 kB of JS and materialises the
whole catalog array — on a mid-range phone this alone is several hundred ms of
main-thread work.

### 2.2 The workout "Add exercise" picker (`AddExercisePage.tsx`)

- Renders **every** library exercise as a `PickerRow` — **no virtualization**
  (unlike `ExerciseLibraryPage`, which was virtualized in PR #41).
- Every `PickerRow` calls `useQuery(completedSetsForExercise(exercise.id))` —
  a **3-table join** (`exerciseSet ⋈ workoutExercise ⋈ workoutSession`)
  returning that exercise's **entire set history**, just to print one
  "last time: 3×8 · 80 kg" line.
- Every `PickerRow` also mounts an `ExerciseTile` → `useQuery(photoById)` +
  an IndexedDB blob read + `URL.createObjectURL`.
- With a 1,000-exercise library that is **~1,000 SQL join queries + ~1,000
  IndexedDB reads fired on mount**, all inside the **single app-root
  `<Suspense>` boundary** (`App.tsx`), so *nothing* paints until every query
  resolves. This is the observed 20 s freeze; taps during it appear ignored.
- The search box is **not debounced** here and `PickerRow` is not memoized, so
  every keystroke re-renders (and re-creates query objects for) all rows.

`EditSessionAddExercisePage.tsx` and `PlanAddExercisePage.tsx` have the same
unvirtualized full-list + per-row-photo pattern (no per-row history query, so
they degrade less badly, but still render 1,000+ rows and fire 1,000+ photo
reads at once).

### 2.3 No SQLite indexes

`src/evolu/evolu.ts` passes no `indexes` config to `createEvolu`, and Evolu
only auto-indexes primary keys. Every query in `queries.ts` that filters on
`workoutExerciseId`, `exerciseId`, `workoutSessionId`, `status`, `planId`,
`planExerciseId` or orders by `name`/`startedAt` runs as a **full table scan**
inside SQLite-WASM. A year of training ≈ 3,000 `exerciseSet` rows; multiplied
by ~1,000 per-row picker queries this is millions of row visits per page open.
Evolu supports indexes natively:

```ts
createEvolu(deps)(Schema, {
  indexes: (create) => [create('indexName').on('table').column('col'), ...],
})
```

### 2.4 The library grid (`ExerciseLibraryPage.tsx`)

- The main grid **is** virtualized (good), but:
- Each mounted `ExerciseCard` still runs `completedSetsForExercise` — the
  exercise's **unbounded full history** — to derive a one-line summary + trend
  (which only needs the last two sessions).
- The **Favourites section is not virtualized**: every favourite (can be
  dozens–hundreds for a long-time user) mounts at once, each with its own
  history query + photo read.
- `performedExercises` (favourites source) returns **one row per completed set
  ever logged** (unbounded, grows forever) and is de-duplicated in JS on every
  visit.

### 2.5 Starter library bulk add (`StarterLibraryPage.tsx`)

`handleAdd` runs a **sequential** loop: for each selected exercise it awaits
`fetch(<GIF on raw.githubusercontent.com>)` (GIFs are hundreds of kB each),
decodes it, generates a thumbnail on the main thread, performs two IndexedDB
writes — **before creating the next exercise**, and only navigates away after
the last one. There is **no timeout / AbortController**: on flaky gym Wi-Fi a
single stalled fetch blocks the whole "Adding…" state indefinitely. Selecting
30 exercises online = 30 serial downloads before the user can proceed. (Offline
the fetches fail fast, so ironically offline adds are quicker.)

### 2.6 Service-worker update race ("the button does nothing")

`vite-plugin-pwa` is configured with `registerType: 'autoUpdate'`,
`skipWaiting`, `clientsClaim`, `cleanupOutdatedCaches`. Sequence: user has the
PWA open → a new deploy happens → the new SW activates immediately and
**deletes the old build's hashed chunks from cache** → the still-open old page
taps "Add exercise" → `import('./AddExercisePage-<oldhash>.js')` fails (offline
or 404) → `React.lazy` throws → there is **no error boundary** in `App.tsx` →
the route silently never renders. To the user: taps do nothing until a manual
reload. This exactly matches "I have to click three times".

### 2.7 Suspense granularity & photo churn

- One app-root `<Suspense>` means any suspending query blanks the entire page
  (`PageFallback`), including the already-typed search field.
- `usePhotoUrl` re-reads IndexedDB and re-creates an object URL on **every
  mount**; the virtualizer constantly unmounts/remounts cards while scrolling,
  so scrolling the library re-reads the same blobs over and over (visible as
  placeholder flicker + jank).

---

## 3. Performance targets (acceptance budgets)

Measured on a production build (`npm run build && npm run preview`), Chromium
with **4× CPU throttle** (CDP `Emulation.setCPUThrottlingRate`), library seeded
with **1,000 exercises / 30 finished sessions / ~2,000 completed sets**:

| # | Flow | Budget |
|---|------|--------|
| B1 | `/library` cold navigation → first cards visible | ≤ 1.5 s |
| B2 | `/workout/add-exercise` tap → search field + first rows visible | ≤ 1.0 s |
| B3 | Typing in any library/picker search → filtered results | ≤ 250 ms after debounce settle |
| B4 | Starter add: tap **Add N exercises** (any N) → back on `/library`, rows present | ≤ 1.5 s (media continues in background) |
| B5 | `/library/:id` detail route JS (beyond shared chunks) | ≤ 25 kB gzip; **must not** include the catalog chunk |
| B6 | All of B1–B4 with the network fully offline (SW-served) | same budgets |
| B7 | Logging a set while the picker/library is subscribed | no visible frame drop > 200 ms |

These budgets become assertions in the Playwright perf suite (§7.4).

---

## 4. Design

Six workstreams. W1–W3 remove the architectural O(N)-queries problem (the 20 s
freeze); W4–W6 fix bundle, media pipeline, and resilience.

### W1 — One aggregate "last performance" query (replaces N per-row queries)

**New pure module** `src/features/exercises/lastPerformance.ts`:

```ts
export interface ExercisePerformanceSummary {
  readonly lastSessionSets: HistorySet[]     // sets of the most recent session
  readonly previousSessionSets: HistorySet[] // second most recent (for trend)
  readonly lastPerformedAt: string
}
export function buildLastPerformanceIndex(
  rows: readonly CompletedSetIndexRow[],
): ReadonlyMap<string /* ExerciseId */, ExercisePerformanceSummary>
```

**New query** in `queries.ts` — `completedSetsIndex`: one SQL statement over
`exerciseSet ⋈ workoutExercise ⋈ workoutSession` selecting
`exerciseId, sessionId, sessionStartedAt, orderIndex, weightKg, reps,
addedWeightKg, assistanceWeightKg, durationSec, distanceMeters, setType, rpe`
for all completed, non-deleted sets, ordered by `sessionStartedAt desc,
orderIndex`. **Semantics must match `completedSetsForExercise`** (any session
status, `completedAt is not null`) — *not* `finishedSessionSets` (which filters
`status = 'finished'`) — so card labels don't change behavior.

**New hook** `useLastPerformanceIndex()` = `useQuery(completedSetsIndex)` +
`useMemo(buildLastPerformanceIndex)`. Called **once per page**; cards/rows
receive their summary **as a prop** and run no queries of their own.

Consumers to convert:
- `ExerciseCard` (library grid + favourites) — takes `summary?: ExercisePerformanceSummary`,
  computes label via existing `lastSummaryLabel`/`sessionTrend` from the
  summary's sets. Drop its internal `useQuery`.
- `AddExercisePage` `PickerRow` — same.
- `RecentExerciseCard` (Today rail) — same, if it queries per row today.

`ExerciseDetailPage` keeps `completedSetsForExercise(id)` (single exercise,
full history is genuinely needed there).

**Scale note (recorded decision):** JS aggregation over one query is O(total
sets) and fine to ~50k sets. If that's ever exceeded, move the "last two
sessions per exercise" reduction into SQL window functions. Do **not** build
that now (per CLAUDE.md: no premature caching).

### W2 — Virtualize all exercise pickers via one shared component

**New** `src/features/exercises/ExercisePickerList.tsx`:
- Props: `exercises: ExerciseRow[]`, a row renderer (or row-extras) prop,
  `onPick(id)`, optional `header` slot (the "Create new exercise" CTA).
- Owns: debounced search (`useDebouncedValue`, existing), body-part chips,
  filtering (extract one shared `matchesExerciseFilter(search, part)` predicate —
  currently copy-pasted in four pages), and a `useVirtualizer` flat list using
  the existing `useScrollParent` + `useListScrollMargin` helpers (same pattern
  as `StarterLibraryPage`). Wrap filter-state updates in `startTransition`.
- Rows are `memo`ized; row height ~70 px, `overscan: 6`.

Adopt in `AddExercisePage`, `EditSessionAddExercisePage`,
`PlanAddExercisePage`. The three pages keep their own headers/CTAs and pick
handlers; the list, search, chips, virtualization and row rendering unify.

### W3 — SQLite indexes in Evolu

`src/evolu/indexes.ts` (pure, unit-testable) exporting the `indexes` config,
wired into `createEvolu` in `evolu.ts`:

| Index | Table | Column(s) | Serves |
|---|---|---|---|
| `exerciseSetWorkoutExerciseId` | exerciseSet | workoutExerciseId | all set joins, `setsForWorkoutExercise` |
| `workoutExerciseSessionId` | workoutExercise | workoutSessionId | session detail/repeat/distribution |
| `workoutExerciseExerciseId` | workoutExercise | exerciseId | `completedSetsForExercise`, index query |
| `workoutSessionStartedAt` | workoutSession | startedAt | history ordering, active-session lookup |
| `workoutSessionStatus` | workoutSession | status | active/finished filters |
| `exercisePhotoExerciseId` | exercisePhoto | exerciseId | `photosForExercise` |
| `exerciseName` | exercise | name | `allExercises` order-by |
| `planExercisePlanId` | planExercise | planId | plan editor |
| `planSetPlanExerciseId` | planSet | planExerciseId | plan sets |

(Evolu creates missing indexes on init; no migration needed. Verify no
startup-time regression on a seeded DB in the perf suite.)

### W4 — Bundle: quarantine the starter catalog

1. **Move `normalizeExerciseName`** (and nothing else) to a new tiny module
   `src/features/exercises/exerciseName.ts`. Update imports in `cues.ts`,
   `StarterLibraryPage.tsx`, `starterCatalog.ts`, tests. After this, the only
   importer of `starterCatalog.generated.ts` is the starter page graph.
2. **Load the catalog lazily inside `StarterLibraryPage`**: replace the static
   `STARTER_CATALOG` import with a dynamic `import('./starterCatalog.generated')`
   resolved behind the page's own Suspense/loading state — or convert the
   generated artifact to JSON (`public/starter-catalog.json`, fetched on page
   open and precached by Workbox so it works offline). Implementer's choice;
   JSON parses ~3–5× faster than an equivalent JS object literal and keeps the
   array off every JS parse path. If the JSON route is chosen, update
   `scripts/import-exercises.mjs` and `starterCatalog.ts` typing accordingly.
3. **CI chunk guard**: enable `build.manifest` in `vite.config.ts` and add
   `scripts/check-chunks.mjs` (run in CI after build) asserting:
   - no chunk except the starter-page graph statically imports the catalog;
   - `ExerciseDetailPage`'s transitive static imports exclude it;
   - the main `index` chunk stays under a recorded byte ceiling (fail on +10 %
     regressions).

### W5 — Starter add: instant commit, background media

Rework `handleAdd` so the user-blocking part is **only the Evolu inserts**
(synchronous local writes — this is exactly Evolu's design):

1. Loop selected entries → `createExercise(...)` for all of them (no awaits).
2. `navigate('/library')` immediately. Budget B4: ≤ 1.5 s for any N.
3. Enqueue `{ exerciseId, animationUrl }` jobs into a **new pure module**
   `src/features/exercises/starterMedia.ts`:
   - concurrency-limited queue (3–4 parallel downloads),
   - per-job `AbortController` with a 15 s timeout, one retry,
   - **skip immediately when `navigator.onLine === false`** (exercise stays
     photo-less, exactly today's offline behavior),
   - on success: `storePhoto` → `addExercisePhoto` → `setPrimaryPhoto`
     (the photo appears reactively in the already-rendered library card),
   - fire-and-forget semantics survive route changes (module-level queue, not
     component state); jobs are **not** persisted across app restarts (recorded
     decision: media is best-effort by spec; a persistent retry queue is out of
     scope).
4. Surface progress via the existing `Toast` ("Adding demo animations… 12/30",
   then "Done" / "Some animations couldn't be downloaded — exercises were
   added"). Keep copy factual; adds never fail because of media.

### W6 — Resilience & perceived performance

1. **`lazyWithRetry`** in `routes.lazy.tsx`: on dynamic-import failure, if
   `sessionStorage.chunkReloadedOnce` is unset → set it and
   `location.reload()` (picks up the new SW's precache); else rethrow.
2. **Route error boundary** wrapping the app `<Suspense>` (new
   `RouteErrorBoundary` component): friendly "Something went wrong — Reload"
   fallback so a failed chunk/query never leaves a dead screen again. Reset the
   boundary on navigation.
3. **Nested Suspense**: each picker/library page renders its static header +
   search shell immediately and suspends only the list region (move
   `useQuery` calls below a page-internal `<Suspense>` where trivially
   possible). Combined with W1/W2 the fallback window should be barely visible,
   but the shell must paint on the first frame of navigation.
4. Add `loading="lazy"` + `decoding="async"` to the `ExerciseTile` `<img>`.
5. **Photo object-URL cache** `src/shared/utils/photoUrlCache.ts`: module-level
   `Map<ref, { url, refs }>` with acquire/release; `usePhotoUrl` acquires on
   mount, releases on unmount, and an idle sweeper revokes URLs with zero refs
   after ~30 s. Scrolling stops re-reading IndexedDB for blobs already
   resolved. (Blobs are ≤ 400 px thumbnails; a few hundred cached URLs are
   fine. Full-size images — the `full` prop — bypass the cache.)

---

## 5. Implementation plan (phased; each phase independently shippable)

> Conventions for every task: strict TS, small components, tests colocated
> (`*.test.ts[x]`), no unrelated refactors, `npm run build` + `npm test` +
> `npm run lint` green. Behavior-parity tasks must keep existing unit tests
> passing unmodified unless the test itself encoded the defect.

### Phase 1 — kill the 20 s picker freeze *(highest impact)*

| Task | Description | Files (indicative) | Done when |
|---|---|---|---|
| 1.1 | `completedSetsIndex` query + `buildLastPerformanceIndex` + `useLastPerformanceIndex` | `evolu/queries.ts`, `features/exercises/lastPerformance.ts` (+test) | Unit tests prove parity: for seeded rows, per-exercise label/trend equals today's `lastSummaryLabel`/`sessionTrend` output incl. edge cases (no history, single session, cardio/timed types, sets from an *active* session count) |
| 1.2 | Convert `ExerciseCard` + Favourites to summary props; delete per-card queries | `ExerciseCard.tsx`, `ExerciseLibraryPage.tsx` (+tests) | Existing `ExerciseLibraryPage.test.tsx` passes (mocks updated); no `useQuery` inside `ExerciseCard` |
| 1.3 | Shared `ExercisePickerList` (virtualized) + shared filter predicate | new `ExercisePickerList.tsx`, `exerciseFilter.ts` (+tests) | Component test (virtualizer mocked, as in the existing library test) covers search debounce, chip filter, empty states, row pick callback |
| 1.4 | Adopt in `AddExercisePage` (rows use the W1 index; memoized rows; debounced search) | `AddExercisePage.tsx` (+test) | Page mounts exactly **2** Evolu queries (`allExercises`, `completedSetsIndex`) + 1 per *visible* photo; component test asserts rows render from the index map |
| 1.5 | Adopt in `EditSessionAddExercisePage`, `PlanAddExercisePage` | both pages (+tests) | Same picker behavior; page-specific pick handlers unchanged |
| 1.6 | Evolu indexes | `evolu/indexes.ts` (+test), `evolu/evolu.ts` | Unit test snapshot of index definitions; e2e suite still boots (index creation on an existing DB is exercised by the perf test's persistent context) |

### Phase 2 — bundle & detail page

| Task | Description | Done when |
|---|---|---|
| 2.1 | Extract `exerciseName.ts`; re-point `cues.ts` etc. | `npm run build`: `ExerciseDetailPage` chunk no longer references the catalog chunk |
| 2.2 | Lazy/JSON catalog load in `StarterLibraryPage` (+ regenerate script if JSON) | Starter page still lists/searches/adds correctly (existing `starterCatalog.test.ts` adapted); catalog bytes load only on `/library/starter` |
| 2.3 | `build.manifest` + `scripts/check-chunks.mjs` in CI | Script fails the build if the catalog leaks into another chunk or `index` grows > 10 % over the recorded baseline |

### Phase 3 — starter add pipeline

| Task | Description | Done when |
|---|---|---|
| 3.1 | `starterMedia.ts` queue (concurrency, timeout+retry, offline gate, progress callback) | Unit tests with mocked `fetch`/fake timers: concurrency cap, abort on timeout, single retry, offline short-circuit, completion callback ordering |
| 3.2 | Rewire `handleAdd`: sync inserts → navigate → enqueue; progress Toast | Component test: `handleAdd` with 3 selected calls `createExercise` 3× and navigates without awaiting any fetch; e2e (B4) below |
| 3.3 | Photo appears reactively post-add | e2e: add with the GIF route stubbed to a small fixture GIF; card shows the image without reload |

### Phase 4 — resilience & polish

| Task | Description | Done when |
|---|---|---|
| 4.1 | `lazyWithRetry` + `RouteErrorBoundary` | Unit test: failing importer triggers exactly one reload then error UI; boundary renders fallback and recovers on retry/navigation |
| 4.2 | Nested Suspense shells for library + pickers | e2e: search field visible before the first row on a CPU-throttled run |
| 4.3 | `photoUrlCache` + `usePhotoUrl` rewrite; `loading="lazy"`/`decoding="async"` | Unit tests (fake-indexeddb): second acquire of the same ref hits cache (no IDB read — spy), release+sweep revokes; existing `photos.test.ts` untouched |
| 4.4 | Favourites: derive from the W1 index (drop the `performedExercises` per-set scan on this page, keeping finished-only recency semantics) and cap the un-virtualized section at ~12 | Library tests updated; favourites ordering/dedup tests still pass |

### Phase 5 — performance test harness & budgets (can start in parallel after 1.4)

| Task | Description | Done when |
|---|---|---|
| 5.1 | Test seeding hook: `window.__bodycacheTest = { seed }` exposed **only** when `import.meta.env.VITE_TEST_HOOKS === '1'`; the e2e webServer build command sets it. `seed({ exercises, sessions, setsPerSession })` batch-inserts via the existing mutations | Hook is absent from a normal prod build (asserted by the 2.3 chunk-guard script); fixture helper `seedLibrary(page, opts)` in `e2e/fixtures.ts` |
| 5.2 | `e2e/perf.spec.ts`: budgets B1–B5, B7 with 4× CPU throttle via CDP (`Emulation.setCPUThrottlingRate`); timings via `performance.now()` around navigation → `expect.poll` on first visible row | Suite green in CI at the §3 budgets (start 2× loose, ratchet down after Phases 1–2 land) |
| 5.3 | `e2e/offline.spec.ts`: budgets B6 — load app once (SW installs), `context.setOffline(true)`, reload → library, picker, starter add (media skipped), set logging all work | Suite green; explicitly asserts starter add completes offline with photo-less exercises |
| 5.4 | Document how to profile (section in `e2e/README.md` + this doc): preview build, CPU throttle, what to look for | Doc merged |

---

## 6. Decision log (for implementing agents)

- **JS aggregation over SQL window functions** for last-performance (W1): the
  dataset is small; keep calculations pure/testable per CLAUDE.md. Revisit past
  ~50k sets.
- **`completedSetsIndex` matches `completedSetsForExercise` semantics** (any
  session status), not `finishedSessionSets`. Favourites keep their
  finished-only recency semantics (4.4 must preserve that filter when deduping).
- **Media queue is in-memory only**; interrupted downloads are simply lost
  (photo-less exercise), matching today's best-effort contract.
- **Keep `registerType: 'autoUpdate'`**; the stale-chunk race is handled by
  `lazyWithRetry` + the error boundary rather than prompt-style updates
  (a forced update prompt mid-workout is worse UX for a memory-aid app).
- **Do not** remove the per-exercise full-history query from
  `ExerciseDetailPage`; with W3 indexes it is cheap and genuinely needed there.
- **No new state library, no server, no accounts** — all fixes stay local-first
  (CLAUDE.md out-of-scope list unchanged).

## 7. Test plan summary

- **Unit (vitest, colocated):** `lastPerformance` parity + edge cases;
  `exerciseFilter`; `indexes` definitions snapshot; `starterMedia` queue
  (timers/abort/offline/concurrency); `photoUrlCache` (fake-indexeddb);
  `lazyWithRetry`; `check-chunks` script logic (against a fixture manifest).
- **Component (happy-dom, virtualizer mocked as in
  `ExerciseLibraryPage.test.tsx`):** `ExercisePickerList`; each adopted picker
  page; `ExerciseCard` with/without summary; starter `handleAdd` non-blocking.
- **E2E (Playwright, preview build, hermetic — relay off):** existing specs stay
  green; new `perf.spec.ts` (budgets, CPU-throttled, seeded via test hook) and
  `offline.spec.ts` (B6). The GIF host is always route-stubbed in e2e — never
  hit raw.githubusercontent.com from CI.
- **CI additions:** chunk-size/leak guard after build; perf suite as a separate
  job so flakes don't block unit lanes (retries ×2, as already configured).

## 8. Risks & mitigations

| Risk | Mitigation |
|---|---|
| `completedSetsIndex` grows with history and ships all sets to JS | Indexed scan + one query is far cheaper than N queries; decision-logged escalation path (window functions); budgets B1/B7 catch regressions |
| Evolu index creation on first boot of a large existing DB | Covered by the perf suite's seeded persistent context; index creation is additive/idempotent in Evolu |
| Catalog-as-JSON changes the generator contract | Update `scripts/import-exercises.mjs` + `starterCatalog.test.ts` in the same PR; the chunk guard enforces the outcome either way |
| `lazyWithRetry` reload loop | One-shot `sessionStorage` flag; the error boundary is the terminal state |
| Object-URL cache leaks memory | Ref-counted + idle sweep; only thumbnails cached |
| Budgets flaky on shared CI runners | Generous initial budgets, CPU throttle for determinism, ratchet down gradually |

## 9. Out of scope

Cross-device photo sync, a persistent media retry queue, pagination of the
Evolu store, SQL window functions, replacing Evolu, service-worker runtime
caching of GitHub GIFs (media is copied into IndexedDB at add time by design),
and any UX redesign of the library/picker beyond what virtualization needs.
