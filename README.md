# BodyCache

BodyCache is a mobile-first, offline-first PWA that helps you track gym exercises, sets, weights, reps, duration, and progress.

## Requirements

- Node.js >= 22.0.0 (see `.nvmrc`)
- npm >= 10
- Modern browser with IndexedDB support

### Node Version Management

Use a Node version manager so local and CI runtimes match.

With nvm:

```bash
nvm install
nvm use
```

With fnm:

```bash
fnm use
```

## Quick Start

```bash
npm install
npm run dev
```

Dev server runs on http://localhost:5173 by default.

## Scripts

- `npm run dev`: start Vite dev server
- `npm run build`: run TypeScript project build check and create production bundle
- `npm run preview`: preview production build
- `npm run type-check`: run TypeScript checks for app and node configs
- `npm run lint`: run ESLint
- `npm run lint:fix`: run ESLint with auto-fix
- `npm run format`: format repository files with Prettier
- `npm run format:check`: check formatting with Prettier
- `npm run test`: run Vitest once
- `npm run test:watch`: run Vitest in watch mode
- `npm run test:coverage`: run Vitest with coverage

## Tech Stack

- React 19 + TypeScript
- Vite 6
- Tailwind CSS
- React Router
- Evolu for offline-first local data storage
- Vite PWA plugin with Workbox

## Architecture

- `src/app`: app composition and providers
- `src/evolu`: schema, queries, and mutations
- `src/features`: feature pages (workouts, exercises, settings)
- `src/shared`: shared UI components

## Offline and PWA Notes

- Evolu is configured for encrypted relay sync by default (`VITE_EVOLU_RELAY_URL`, defaults to `wss://free.evoluhq.com`).
- Set `VITE_EVOLU_RELAY_URL=` (empty value) to force local-only mode with no sync.
- End-to-end tests intentionally run with sync disabled to keep test data local and deterministic.
- PWA assets and manifest are configured through Vite PWA plugin.

## Cross-device sync notes (relay hardening)

- **Cross-origin isolation must match everywhere.** Evolu's SQLite worker wants
  `Cross-Origin-Opener-Policy: same-origin` + `Cross-Origin-Embedder-Policy: require-corp`.
  These are set for the Vite dev/preview servers (`vite.config.ts`) **and** for the
  production deploy (`vercel.json`). If you host elsewhere, send the same two headers on
  the app's HTML responses — otherwise the deployed app runs un-isolated and can behave
  differently from local.
- **The default relay is the shared free one.** `wss://free.evoluhq.com` is Evolu's public
  best-effort relay with no delivery/retention guarantees. For reliable multi-device sync,
  point `VITE_EVOLU_RELAY_URL` at a **dedicated relay** you control (a bare `wss://…` base
  URL, no query string) — see the Evolu relay docs for self-hosting.
- **Sync is background and currently unobservable.** Evolu 7.x exposes no live `SyncState`
  (the React `useSyncState` hook throws a TODO), so the app cannot confirm when a device has
  finished uploading or downloading. Settings shows connectivity as an honest proxy, not a
  "synced" guarantee.
- **Photos never sync over the relay** (they live in IndexedDB, device-local by design). A
  device restored from a recovery phrase gets structured data only. For a complete copy
  including photos, use **Back up now → Restore from backup** in Settings.

## Current Status

- Data layer is defined and typed (schema, queries, mutations).
- Feature pages are still minimal and need progressive UI wiring to Evolu.
