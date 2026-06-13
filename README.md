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

## Current Status

- Data layer is defined and typed (schema, queries, mutations).
- Feature pages are still minimal and need progressive UI wiring to Evolu.
