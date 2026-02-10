# BodyCache

BodyCache is a local first gym tracking PWA built with React, TypeScript, Vite, Evolu, Tailwind, and shadcn style UI primitives.

Milestone 0 is complete and Milestone 1 is in progress. The current build includes active workout start, rename autosave, add exercise, and finish session flows with unit and e2e coverage.

## Stack

- React 19
- TypeScript
- Vite
- Evolu (`@evolu/common`, `@evolu/react`, `@evolu/react-web`)
- Tailwind CSS
- shadcn style UI building blocks (Radix Slot + CVA utilities)
- PWA via `vite-plugin-pwa`
- Charts via `recharts`, ready for milestone 3 and 4
- Validation via `zod`
- Tests via `vitest`, `@testing-library/react`, `playwright`

## Quick Start

Prerequisites
- Node.js 20+
- npm 10+

Install and run

```bash
npm ci
npm run dev
```

Build and preview

```bash
npm run build
npm run preview
```

Run tests

```bash
npm run test
npm run test:e2e
npm run check
```

`npm run check` runs unit tests, build, and e2e smoke test.

## Project Structure

```text
src/
  app/
    main.tsx
    routes.tsx
    providers.tsx
  db/
    evolu.ts
    schema.ts
    mutations.ts
    queries.ts
    migrations.ts
    seedExercises.ts
  domain/
    metrics.ts
    pr.ts
    units.ts
    importExport.ts
  components/
    ui/
    Workout/
    Exercise/
    Template/
  pages/
    Home.tsx
    WorkoutActive.tsx
    WorkoutDetail.tsx
    Exercises.tsx
    ExerciseDetail.tsx
    Templates.tsx
    TemplateEditor.tsx
    Settings.tsx
  styles/
    globals.css
  tests/
    *.test.ts
e2e/
  smoke.spec.ts
```

## Architecture Overview

- App shell and routing live in `/src/app`
- Evolu client setup and schema live in `/src/db`
- Domain logic and pure computations live in `/src/domain`
- Page-level route components live in `/src/pages`
- Shared UI primitives and feature components live in `/src/components`
- PWA registration is wired in `/src/app/main.tsx`

The app remains an SPA with no backend server. Evolu local store is the source of truth for user data.

## Evolu Schema

Milestone 0 defines all required logical tables for v1:

- `exercises`
- `workoutTemplates`
- `templateExercises`
- `workoutSessions`
- `sessionExercises`
- `setEntries`

Each table includes `createdAt` and `updatedAt`, and archive-capable tables include `archivedAt`.

Seed exercises are inserted on first run by `/src/db/mutations.ts` using `/src/db/seedExercises.ts` and a localStorage seed flag.

## Migrations

Migration metadata starts in `/src/db/migrations.ts` with `0001_bodycache_init`.

Rule for upcoming milestones:
- every schema change must add a new migration entry
- no breaking schema edits without a corresponding migration

## Import Merge Strategy

Import and merge helpers are in `/src/domain/importExport.ts`.

Current merge behavior:
- validate input with `zod`
- merge by stable `id`
- on conflict, prefer row with newer `updatedAt`
- return merge report counters: `inserted`, `updated`, `skipped`, `errors`

## PWA and Offline Notes

- Vite PWA plugin is configured in `/vite.config.ts`
- Manifest and icons are generated and served from the app root
- Service worker caches app shell and static assets only
- User workout data is not cached by service worker, Evolu local store remains authoritative

## Vercel Deployment

This repo is configured for static deployment on Vercel.

Required Vercel settings:
- Framework preset: `Vite`
- Install command: `npm ci`
- Build command: `npm run build`
- Output directory: `dist`

SPA and PWA routing is handled in `/vercel.json`:
- all routes rewrite to `/index.html`
- `sw.js` is served with safe no-cache headers
- manifest content type header is set

## Milestone 0 Manual Checks

1. Run `npm run dev`
2. Open Home, Exercises, Templates, History, Settings pages
3. Reload and confirm shell still renders
4. Run `npm run check`

## Next Milestone

Milestone 1 implements workout logging MVP:
- start session
- add exercises
- inline set editing and completion
- finish session
- last time hints per exercise

## Branch and Environment Strategy

Long lived branches
- `dev`, daily integration branch
- `staging`, release candidate branch
- `main`, production branch

Feature workflow
1. Branch from `dev` into `feature/*`
2. Open PR into `dev`
3. Promote with PR `dev -> staging`
4. Promote with PR `staging -> main`

The workflow `/Users/miroslav/Documents/DEVELOPMENT/BodyCache/.github/workflows/release-flow-guard.yml` enforces this promotion direction.

## Vercel Environment Mapping

Use three Vercel projects for simple branch based deployments.

1. `bodycache-dev`
- Production branch: `dev`
- Suggested domain: `dev.bodycache.app`

2. `bodycache-staging`
- Production branch: `staging`
- Suggested domain: `staging.bodycache.app`

3. `bodycache-prod`
- Production branch: `main`
- Suggested domain: `bodycache.app`

Shared build settings for all three projects
- Framework preset: `Vite`
- Install command: `npm ci`
- Build command: `npm run build`
- Output directory: `dist`

## GitHub Branch Protection Rules

Apply in GitHub repository settings.

For `dev`
- Require PR before merge
- Require status check: `test-build-e2e`

For `staging`
- Require PR before merge
- Require status checks: `test-build-e2e`, `enforce-promotion-direction`
- Restrict who can push directly

For `main`
- Require PR before merge
- Require status checks: `test-build-e2e`, `enforce-promotion-direction`
- Require approvals before merging
- Restrict who can push directly

## Deployment Playbook

Deployment and branch protection setup is documented in `/Users/miroslav/Documents/DEVELOPMENT/BodyCache/docs/deployment-branch-playbook.md`.
