# BodyCache: PWA → React Native — Migration Plan & Specs

Status: **proposal / spec** — no code changes yet.
Scope: rewrite the app shell as a native iOS/Android app while reusing the
data layer and the pure-logic layer nearly verbatim. The product stays exactly
what it is: a workout **memory aid**, offline-first, no accounts, no coach.

---

## 1. Executive summary

The good news: BodyCache is unusually well positioned for this migration.
The codebase already separates **pure logic** (stats, plan/session
instantiation, supersets, filters, backup format — all tested with Vitest and
free of DOM APIs) from **UI** (React components) and from a **thin platform
layer** (IndexedDB photos, localStorage prefs, `navigator.onLine`). Evolu — the
single most load-bearing dependency — ships an official React Native package,
**`@evolu/react-native` (v14.3.0)**, whose peer range matches the exact
versions already in `package.json` (`@evolu/common ^7.4.0`, `@evolu/react
^10.4.0`). The schema, queries, mutations, and indexes files can be reused
**unchanged**, and sync via the same relay means an existing user can restore
their entire history into the native app with their existing mnemonic.

What actually gets rewritten is the render layer: JSX markup (`div` → `View`,
Tailwind classes → NativeWind), navigation (react-router → Expo Router), and
five small platform adapters (photos, key-value prefs, connectivity, haptics,
backup file transfer). Roughly:

| Layer | LOC share (approx.) | Fate |
| --- | --- | --- |
| Evolu data layer (`src/evolu/*` except `evolu.ts`) | ~10% | **Reused verbatim** |
| Pure logic + tests (`*Stats`, `planToSession`, `supersets`, `backup`, `progress`, `rpe`, `units`, `dates`, filters, starter catalog…) | ~35% | **Reused verbatim** |
| Platform utils (`photos.ts`, `UnitsContext`, `RestTimerContext`, `useOnlineStatus`, `useDataTransfer`, `starterMedia`) | ~5% | **Re-implemented behind existing interfaces** |
| Components & pages (`features/*/*.tsx`, `shared/components`) | ~50% | **Rewritten** (markup + styling), logic lifted from the existing files |

Recommended stack: **Expo (SDK 54+) + Expo Router + NativeWind v4 +
`@evolu/react-native` (expo-sqlite driver) + FlashList + expo-image**.

Recommended repo shape: **npm-workspaces monorepo** — `packages/core`
(shared schema + pure logic), `apps/web` (current PWA, kept alive during the
transition), `apps/native` (new Expo app).

---

## 2. Goals & non-goals

### Goals

- Native iOS + Android app with feature parity with the current PWA
  (milestones 1–9: library, logging, history/stats, settings, sync, profile,
  plans, repeat workout, supersets, RPE, rest timer).
- Offline-first without caveats: logging works in a basement gym, always.
- Existing users migrate losslessly via (a) Evolu mnemonic restore over the
  relay for structured data, and (b) the existing v2 backup JSON for photos.
- Keep the pure-logic test suite running unchanged in CI.
- Faster-than-a-notes-app logging, now with native affordances (haptics,
  keep-awake, rest-timer notifications) the PWA can't deliver.

### Non-goals (unchanged from CLAUDE.md, plus migration-specific ones)

- No social/sharing, nutrition, AI coach, Health/Fit integration, accounts,
  cloud image sync, paid tiers, multi-user.
- **No visual redesign.** Same dark, mobile-first, one-handed UI; NativeWind
  keeps the existing Tailwind design tokens.
- No new features during the port (except trivially-cheap native wins listed
  in §8 — each individually skippable).
- The web PWA is not deleted in this project; retiring it is a separate later
  decision (§10).

---

## 3. Framework decision

### Recommendation: Expo (managed workflow, SDK 54+), expo-sqlite driver

Rationale:

- `@evolu/react-native@14.3.0` peers on `expo >= 54`, `expo-sqlite >= 16`,
  `react-native >= 0.81`, `react-native-svg >= 15`, `expo-secure-store >= 15`.
  The Expo path is Evolu's first-class RN target; the alternative op-sqlite
  path (`@op-engineering/op-sqlite` + `react-native-nitro-modules` +
  `react-native-sensitive-info`) exists for bare RN but buys nothing here.
- Expo gives us image picking, file system, haptics, notifications,
  keep-awake, secure storage and OTA updates (EAS Update) as maintained
  modules instead of a self-assembled native dependency graph.
- EAS Build produces store-ready binaries without local Xcode/Android Studio
  wrangling, which matters for a solo/hobby cadence.

### Alternatives considered (rejected)

| Option | Why not |
| --- | --- |
| **Capacitor** (wrap the existing PWA in a WebView) | Cheapest, but it's not a rewrite — keyboard/input jank, IndexedDB eviction risk persists on iOS, no real native UI. Doesn't meet the ask. |
| **Bare React Native** (no Expo) | All of Expo's module maintenance burden lands on us; Evolu's RN driver still wants the same modules. No upside for this app. |
| **Expo DOM components** (render existing pages in WebViews inside RN) | Viable as a *transition crutch*, but per-screen WebViews defeat the point (perf, native inputs). Not used in this plan. |
| **Flutter / Kotlin+Swift rewrite** | Throws away the React/TypeScript codebase and the Evolu integration entirely. |

---

## 4. Repository & package architecture

Convert the repo to npm workspaces. Nothing moves *conceptually* — the
feature-first layout survives — but shared code gets a package boundary so
both apps consume it:

```
bodycache/
├── package.json                 # workspaces root
├── packages/
│   └── core/                    # @bodycache/core — platform-free TS
│       ├── src/
│       │   ├── evolu/           # schema.ts, queries.ts, mutations.ts,
│       │   │                    #   indexes.ts, rows.ts  (moved verbatim)
│       │   ├── stats/           # exerciseStats, workoutStats, historyStats,
│       │   │                    #   weeklyStats, weeklyMomentum, sessionPrs,
│       │   │                    #   sessionSummary, progress, oneRepMax, rpe
│       │   ├── domain/          # planToSession, sessionToSession, supersets,
│       │   │                    #   setTypes, setFields, lastPerformance,
│       │   │                    #   history, exerciseFilter, muscleMap,
│       │   │                    #   muscleDistribution, cues, legacyExercises
│       │   ├── catalog/         # starterCatalog(.generated), starterMedia
│       │   │                    #   (with injected fetch/store — already DI'd)
│       │   ├── backup/          # backup.ts (v1/v2 format, parse/serialize)
│       │   └── utils/           # dates, units, chunk, bodyParts, avatar seeds
│       └── (all existing *.test.ts move with their modules; Vitest stays)
├── apps/
│   ├── web/                     # the current PWA, imports @bodycache/core
│   └── native/                  # new Expo app
│       ├── app/                 # Expo Router file routes (see §6)
│       ├── src/
│       │   ├── evolu.ts         # createEvolu(evoluReactNativeDeps)(Schema,…)
│       │   ├── platform/        # photos, prefs, connectivity, haptics,
│       │   │                    #   backupTransfer  (see §7)
│       │   ├── features/        # ported components (RN JSX)
│       │   └── shared/          # RN primitives: Button, Chips, ListRow, …
│       ├── app.json / eas.json
│       └── tailwind.config.js   # same tokens as web, consumed by NativeWind
└── docs/
```

Rules for `@bodycache/core`:

- **Zero** imports of `react-dom`, DOM globals, `import.meta.env`, or Expo.
  Enforced by an ESLint `no-restricted-imports`/`no-restricted-globals` rule
  on the package.
- React is allowed only for hooks that are already platform-free
  (`useDebouncedValue`, `useLastPerformanceIndex`); DOM-touching hooks
  (`useScrollParent`, `useListScrollMargin`, `usePhotoUrl`, `useOnlineStatus`)
  stay in the respective app.
- `useBodyCacheMutations()` and the query definitions move into core — they
  depend only on `@evolu/common`/`@evolu/react`, both platform-neutral. Each
  app supplies its own Evolu *instance* via the existing provider pattern
  (`createUseEvolu(evolu)`); core exposes a `createBodyCacheApi(evolu)`
  factory so queries/mutations bind to whichever instance the app created.

---

## 5. Data layer spec

### 5.1 Evolu instance (native)

`apps/native/src/evolu.ts` mirrors the web file, swapping only the deps and
the env var mechanism:

```ts
import { createEvolu, SimpleName, type OwnerTransport } from '@evolu/common'
import { createUseEvolu } from '@evolu/react'
import { evoluReactNativeDeps } from '@evolu/react-native' // expo-sqlite driver
import { Schema, buildIndexes } from '@bodycache/core'

const RELAY_URL = process.env.EXPO_PUBLIC_EVOLU_RELAY_URL ?? 'wss://free.evoluhq.com'
const transports: ReadonlyArray<OwnerTransport> = RELAY_URL
  ? [{ type: 'WebSocket', url: RELAY_URL }]
  : []

export const evolu = createEvolu(evoluReactNativeDeps)(Schema, {
  name: SimpleName.orThrow('bodycache'),
  transports,
  indexes: (create) => buildIndexes(create),
})
export const useEvolu = createUseEvolu(evolu)
```

- Storage backend: SQLite via `expo-sqlite` (real file-backed DB — strictly
  more durable than the browser's OPFS/IndexedDB, no eviction risk).
- Mnemonic at rest: Evolu's RN deps use `expo-secure-store` (Keychain /
  Keystore) — an upgrade over web storage. Surface this in Settings copy.
- `useQuery` Suspense semantics are identical; every routed screen keeps a
  `<Suspense>` boundary above it, same as the web `AppShell` does today.

### 5.2 Schema & migration

**No schema changes.** Same tables (`exercise`, `exercisePhoto`,
`workoutSession`, `workoutExercise`, `exerciseSet`, `profile`, `plan`,
`planExercise`, `planSet`), same enum-as-`NonEmptyString100` convention, same
soft-delete convention. Because Evolu is CRDT-synced and E2E-encrypted, the
native app restoring the same mnemonic against the same relay receives the
full existing dataset — this *is* the structured-data migration.

`exercisePhoto.localUri` keeps its role as an opaque reference string; the
scheme just gains a second variant (see §7.1). Web rows carry `idb://…` refs
which the native photo resolver treats as "unresolvable → photo-less" (exactly
how the web app treats unknown schemes today), so cross-device rows degrade
gracefully instead of crashing — consistent with "cross-device image sync is
out of scope".

### 5.3 User data migration paths

1. **Same-mnemonic sync (primary).** Settings → show mnemonic on web → enter
   in native onboarding ("Restore existing data"). Everything except photo
   binaries arrives via the relay. Zero new code beyond the restore UI the
   Settings page already has.
2. **Backup file (photos + belt-and-suspenders).** The v2 backup JSON already
   embeds photo binaries as base64. Native import (§7.4) writes them to the
   native photo store under the *same refs*, so restored `exercisePhoto` rows
   resolve again. v1 backups keep restoring with empty plan tables, per the
   existing contract.

---

## 6. Navigation spec (react-router → Expo Router)

Tab bar (current `BottomNav`) becomes a native tab navigator; stacked flows
become real push navigation with native back gestures. File-route mapping:

| Web route | Expo Router file | Notes |
| --- | --- | --- |
| `/` | `app/(tabs)/index.tsx` | Today |
| `/history` | `app/(tabs)/history/index.tsx` | |
| `/library` | `app/(tabs)/library/index.tsx` | |
| `/plans` | `app/(tabs)/plans/index.tsx` | |
| `/settings` | `app/(tabs)/settings/index.tsx` | |
| `/workout` | `app/workout/index.tsx` | full-screen stack over tabs |
| `/workout/add-exercise` | `app/workout/add-exercise.tsx` | |
| `/workout/log/:exerciseId` | `app/workout/log/[exerciseId].tsx` | |
| `/workout/finish` | `app/workout/finish.tsx` | |
| `/history/:id` | `app/(tabs)/history/[id]/index.tsx` | |
| `/history/:id/edit` | `app/(tabs)/history/[id]/edit.tsx` | |
| `/history/:id/add-exercise` | `app/(tabs)/history/[id]/add-exercise.tsx` | |
| `/library/new` | `app/(tabs)/library/new.tsx` | |
| `/library/starter` | `app/(tabs)/library/starter.tsx` | |
| `/library/:id` | `app/(tabs)/library/[id].tsx` | |
| `/plans/:id` | `app/(tabs)/plans/[id]/index.tsx` | |
| `/plans/:id/edit` | `app/(tabs)/plans/[id]/edit.tsx` | |
| `/plans/:id/add-exercise` | `app/(tabs)/plans/[id]/add-exercise.tsx` | |
| `/settings/profile` | `app/(tabs)/settings/profile.tsx` | |
| `*` → `/` | `app/+not-found.tsx` redirect | |

Cross-cutting chrome:

- **`RootGate`** (required onboarding) → a check in the root `app/_layout.tsx`
  that renders the onboarding screen until a profile row exists. Same logic,
  lifted from `src/app/RootGate.tsx`.
- **`ResumeBar`** (persistent "workout in progress" bar) → rendered inside the
  tabs layout above the tab bar; navigates to `/workout`.
- **`RestTimerBar`** → same placement; see §7.5 for background behavior.
- Providers (`UnitsProvider`, `RestTimerProvider`, `EvoluProvider`, Toast) →
  root layout, same nesting order as `providers.tsx`.

Route lazy-loading (`routes.lazy.tsx`) has no equivalent and is dropped —
Expo Router code-splits per route on native automatically via the bundler.

---

## 7. Platform adapter specs

Each adapter re-implements an existing module's **exact exported interface**
so feature code ports mechanically. These are the only genuinely new designs
in the project.

### 7.1 Photos — `apps/native/src/platform/photos.ts`

Replaces IndexedDB with the app's document directory via `expo-file-system`.

- Ref scheme: `photo://<key>` (native), stored in `exercisePhoto.localUri` /
  `thumbnailUri` exactly like `idb://<key>` on web. Refs are opaque per the
  existing contract, so no schema or query changes. Never store absolute
  `file://` paths — iOS rewrites the app container path on update; resolve
  `photo://<key>` → `${FileSystem.documentDirectory}photos/<key>` at read
  time.
- Same exports, same signatures: `storePhoto(blob) → { ref, thumbnailRef }`,
  `resolvePhotoUrl(ref)` (returns a resolvable URI for `expo-image` instead
  of an object URL — callers already treat it as an opaque `src`),
  `readPhotoBlob` / `writePhotoBlob` (base64 payloads for backup, via
  `expo-file-system`'s base64 read/write — conveniently, backup interchange
  is already base64, so the native version skips the Blob↔base64 dance),
  `deletePhoto(...refs)`.
- Thumbnails: `expo-image-manipulator` resize to max 400px JPEG q0.8 —
  the same policy as `makeThumbnail`. GIF special case (starter media): the
  manipulator's first-frame JPEG is the thumbnail, mirroring the web's
  `createImageBitmap` behavior; the full ref keeps the animated GIF, which
  `expo-image` plays natively.
- Unknown schemes (`idb://…` rows synced from web) resolve to `null` →
  photo-less card, matching current web behavior for unknown refs.

### 7.2 Key-value prefs — `apps/native/src/platform/prefs.ts`

`react-native-mmkv` (synchronous, so `UnitsContext` and `RestTimerContext`
keep their current synchronous-init shape — AsyncStorage would force both
contexts async for no benefit). Exports `getItem/setItem` with the
localStorage signature; the two contexts swap `localStorage` for this import
and are otherwise copied verbatim.

### 7.3 Connectivity — `useOnlineStatus`

`expo-network`'s `useNetworkState()` (or `@react-native-community/netinfo`)
wrapped to return the same `boolean`. Used by the Settings sync card and
`starterMedia`'s injected `isOnline` — both already take it as an injectable,
so core code is untouched.

### 7.4 Backup transfer — `useDataTransfer`

The pure parts (`backup.ts` serialize/parse, v1/v2 handling, photo
collection loops) live in core already. Only the two I/O edges change:

- **Export**: replace the anchor-download hack with
  `FileSystem.writeAsStringAsync(cacheDir + name, json)` +
  `expo-sharing.shareAsync(uri)` → native share sheet (Files, AirDrop,
  Drive…).
- **Import**: replace `<input type="file">` with
  `expo-document-picker.getDocumentAsync({ type: 'application/json' })` +
  `FileSystem.readAsStringAsync`.

Restore semantics (insert rows, `writePhotoBlob` under exact refs) unchanged.

### 7.5 Rest timer — background behavior + haptics

Current web timer is foreground-only (`setInterval` + `navigator.vibrate`).
Native spec:

- Keep the in-app countdown UI/logic as-is (`RestTimerContext` ports with the
  prefs swap from §7.2).
- `navigator.vibrate([120,60,120])` → `expo-haptics`
  `notificationAsync(Success)`.
- **New (cheap, in scope):** on timer start, schedule a local notification
  (`expo-notifications`) for the fire time; cancel it if the timer is
  stopped/finished in-foreground. This fixes the PWA's worst gym-floor flaw —
  lock the phone and the rest timer dies silently. Store elapsed-target as a
  timestamp (not a tick count) so backgrounding doesn't drift; the context
  already recomputes remaining time from `Date`, verify on port.
- Timer state survives process death only as far as the scheduled
  notification — acceptable; parity plus one improvement, not a stopwatch app.

### 7.6 Starter media

`starterMedia.ts` already injects `fetch`, `storePhoto`, and `isOnline` — it
moves to core untouched. The native app passes RN's global `fetch` (response
`.blob()` is supported), the §7.1 `storePhoto`, and §7.3 connectivity. CORS/
COEP concerns from the web (raw.githubusercontent GIFs) simply vanish —
native fetch has no CORS.

### 7.7 Camera / photo capture

Web `<input type="file" accept="image/*" capture>` →
`expo-image-picker`: `launchCameraAsync` / `launchImageLibraryAsync`
(`mediaTypes: Images`, quality ~0.8). Result URI → `storePhoto`. Add
`NSCameraUsageDescription` / `NSPhotoLibraryAddUsageDescription` strings:
"BodyCache photographs gym machines so you recognize them later." No photo
library *read* permission needed on iOS if we use the picker flow.

---

## 8. UI layer spec

### 8.1 Styling: NativeWind v4

Port the existing `tailwind.config.js` tokens (colors incl. brand cobalt
`#494fdf`, spacing, radii, font stack from `public/fonts`) into the native
app's NativeWind config. Most `className` strings transfer with mechanical
fixes (no `hover:`, `divide-*`, or arbitrary selectors; gap/flex defaults
differ — RN is `flexDirection: column` by default, which mobile-first
Tailwind markup mostly assumes anyway). Dark mode: the app is dark-only
today; keep hard-coded dark tokens, don't wire `useColorScheme` yet.

### 8.2 Component mapping

| Web | Native | Notes |
| --- | --- | --- |
| `div/span/p` + Tailwind | `View/Text` + NativeWind | every text node must be inside `<Text>` — the bulk of the mechanical work |
| `<button>` | `Pressable` | wrap once in the ported `Button`/`CircleButton`/`ListRow` primitives; add `expo-haptics` selection tick on set-complete taps |
| `<input inputmode="decimal">` big numeric fields | `TextInput keyboardType="decimal-pad"` | add `selectTextOnFocus` — faster than the web today |
| `<input type="search">` (`SearchField`) | `TextInput` + clear button | debounce hook reused from core |
| `@tanstack/react-virtual` lists (library, picker, starter ~1,088 rows) | **FlashList** | `estimatedItemSize` from current row heights; replaces `useScrollParent`/`useListScrollMargin` entirely |
| `<img>` + object URLs | `expo-image` | plays starter GIFs natively; `contentFit="cover"`; recyclingKey for FlashList |
| Inline `<svg>` (`ProgressChart`, `BodyMap`, `SplitBar`, `BarWeek`) | `react-native-svg` | 1:1 element mapping (`<svg>`→`<Svg>`, `path`→`<Path>`…); the math (`progress.ts` `scalePoints`/`linePath`) is core and reused |
| DiceBear avatar (SVG string) | `react-native-svg` `SvgXml` | `@dicebear/core` is pure JS; verify RN bundling, else pre-render seeds |
| `lucide-react` | `lucide-react-native` | same icon names, needs `react-native-svg` (already a peer of Evolu RN) |
| `Toast` | ported `Toast` on RN `Animated`/Reanimated | keep the existing context API |
| `StickyAction` / `FloatingAction` | absolutely-positioned `View` + `useSafeAreaInsets` | replaces CSS `env(safe-area-inset-*)` |
| Route transitions | native stack transitions | free |
| PWA manifest / service worker / `vite:preloadError` reload | — deleted | native bundles are inherently offline; updates via store + EAS Update |

### 8.3 Screens

All 19 screens port 1:1 (see route table §6). Highest-effort screens, in
order: `ActiveWorkoutPage` (entry cards, reorder chevrons, superset controls,
ghost sets, tap-to-complete, RPE picker), `LogExercisePage` /
`WorkoutExerciseEditor` (per-type metric fields from `setFields.ts`, Previous
column, PR badge), `ExerciseLibraryPage` (favourites + search + body-part
filter + FlashList), `PlanEditorPage` (mirrors the active-workout editor),
`SessionDetailPage` (repeat workout, PR summary). Everything else is forms
and lists.

Keyboard handling is the one genuinely new UX problem class:
`KeyboardAvoidingView` around the set editor, `keyboardShouldPersistTaps=
"handled"` on logging screens so tap-to-complete works with the keyboard up.
Add `expo-keep-awake` while a session is `active` (screen never sleeps
mid-set — a real gym-floor win the PWA can't do).

---

## 9. Testing & release spec

- **Core (unchanged):** every existing pure-logic Vitest suite moves with its
  module into `packages/core` and runs in CI as today. This is the regression
  net for the whole migration — stats, instantiation, backup, filters stay
  provably identical.
- **Native components:** Jest (`jest-expo`) + `@testing-library/react-native`
  for ported interactive components, porting the intent of the existing
  `.test.tsx` files (ExerciseTile, picker list, AddExercisePage,
  StarterLibraryPage, Avatar).
- **E2E:** **Maestro** flows mirroring the Playwright `e2e/` suite: onboard →
  add starter exercise → start workout → log sets (tap-complete, PR badge) →
  finish → history shows session → repeat workout → plan create → start from
  plan → backup export/import. Run on EAS Workflows or a Mac runner.
- **Manual device matrix:** one small iPhone (SE-class), one large Android,
  airplane mode throughout a full workout (the core promise).
- **Release:** EAS Build + Submit; internal TestFlight/Play internal track
  first. OTA JS fixes via EAS Update. Version scheme independent of the web
  app.

---

## 10. Phased plan

Phases are ordered so the app is usable-in-the-gym as early as possible;
each phase ends with a buildable, testable app.

| Phase | Deliverable | Contents | Exit criteria |
| --- | --- | --- | --- |
| **0. Workspace split** | monorepo, web app green | Create `packages/core`, move `evolu/` (minus `evolu.ts`) + pure modules + tests; web app imports core; ESLint platform-purity rule | `npm test` + web `build` + e2e pass unchanged |
| **1. Native skeleton** | Expo app boots with data | Expo SDK 54 app, NativeWind tokens, Evolu instance (§5.1), tab shell + Expo Router scaffold, providers, RootGate + onboarding, mnemonic restore | New mnemonic creates profile; existing mnemonic pulls full history from relay onto device; airplane-mode relaunch works |
| **2. Log a workout** | core loop usable in a gym | Today page, start/pause/finish session, ActiveWorkout, add-exercise picker (FlashList), LogExercise with per-type fields, Previous ghost values, tap-to-complete, PR badge, rest timer (fg + notification), keep-awake | Full offline workout loggable end-to-end; unit toggle works; haptic + notification on rest end |
| **3. Library & photos** | photo-first library | Library with favourites/search/filters, exercise detail (last/best/history), create exercise, camera capture (§7.7), photo store (§7.1), starter catalog browse/add with GIF streaming | Photograph a machine → appears on card & detail, offline afterwards; starter add stores GIF + thumbnail |
| **4. History & stats** | memory features complete | History list, session detail, edit session, repeat workout, weekly momentum, muscle distribution, progress charts (SVG), body map | Stats visually match web for the same synced dataset |
| **5. Plans** | Phase D parity | Plan library/detail/editor/add-exercise, supersets editing, start-from-plan ghost sets | Plan → session instantiation matches web behavior (shared core code, so verify UI only) |
| **6. Settings & migration** | user-migration ready | Settings (sync status, mnemonic show/restore, relay URL), profile edit + avatar, backup export/import (§7.4) incl. photo restore, third-party notices | Web-exported v2 backup restores fully on device, photos included; v1 restores per contract |
| **7. Hardening & release** | store builds | Maestro e2e suite, device matrix, perf pass (FlashList tuning, startup), icons/splash (brand cobalt), store metadata, EAS pipelines, TestFlight/internal | e2e green; cold start < 2s on mid-range Android; TestFlight build in hand |

Rough effort feel (not commitments): phases 0–1 are small; 2–4 are the bulk;
5–6 medium; 7 depends on store friction. The whole thing is tractable
precisely because ~45% of the code (data + logic + tests) is reused, and every
behavioral rule is already encoded in tests.

Suggested working order inside each phase: port the *page logic* first with
ugly default styling, verify against web behavior, then apply NativeWind
styling — separates "does it work" from "does it look right" reviews.

---

## 11. Risks & mitigations

| Risk | Likelihood | Mitigation |
| --- | --- | --- |
| **Evolu RN driver maturity** (v14 is newer than the web driver; Suspense + expo-sqlite under load) | Medium | Phase 1 is deliberately a data-layer spike: restore a real, full-size dataset (1k+ starter exercises, months of sets) before any UI investment. Fall back to op-sqlite driver if expo-sqlite underperforms. |
| `@dicebear` SVG generation not RN-compatible (DOM assumptions) | Medium | Verify in Phase 1; fallback: generate the small set of avatar-seed SVGs at build time and ship as assets (seeds are a finite enum in `avatarOptions.ts`). |
| NativeWind class incompatibilities pile up | Low | Primitives-first porting (Button, ListRow, Chips…) concentrates styling fixes in `shared/`; pages consume primitives. |
| Same-name Evolu DB (`bodycache`) but different device semantics causing confusion during dev | Low | It's a fresh SQLite file per install; name collision is only conceptual. Document that dev builds share the relay with prod data when using a real mnemonic — use throwaway mnemonics in dev. |
| Photo refs diverging across platforms (`idb://` vs `photo://`) confusing users who sync both | Medium | Already-specified graceful degradation (§5.2); Settings copy: "machine photos live on the device where you took them — move them with a backup file." |
| iOS keyboard vs. tap-to-complete fights | Medium | Dedicated keyboard pass in Phase 2 exit criteria; `keyboardShouldPersistTaps` from day one. |
| Scope creep ("while we're native, let's add Health sync…") | High | §2 non-goals; CLAUDE.md out-of-scope list applies to the native app verbatim. |
| Store review friction (Apple: "app is just a utility") | Low | Photo-first library + offline logging is a clear utility; no accounts also means no login-review pitfalls. |

---

## 12. Decision log (defaults chosen; flag disagreement early)

1. **Expo managed + expo-sqlite**, not bare RN/op-sqlite — matches Evolu's
   primary RN path, minimizes native maintenance.
2. **Monorepo with shared core**, not a clean-break rewrite repo — keeps the
   PWA alive as the migration reference and the test suite as the contract.
3. **NativeWind**, not StyleSheet — preserves the existing Tailwind design
   system and most classnames.
4. **Expo Router**, not bare React Navigation — file routes map 1:1 to the
   current route table and give per-screen code-splitting for free.
5. **MMKV** for prefs, not AsyncStorage — keeps `UnitsContext`/
   `RestTimerContext` synchronous.
6. **Photos stay device-local** (`photo://` scheme, backup-file portability)
   — cross-device image sync remains out of scope, per product rules.
7. **Rest-timer local notification** is the single deliberate scope addition
   — it repairs a real defect of the PWA form factor, not a new feature.
8. Web app retirement is **out of scope** for this plan; revisit after the
   native app has survived a few weeks of real gym use.
