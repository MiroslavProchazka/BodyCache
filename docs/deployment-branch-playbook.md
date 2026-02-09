# Deployment Branch Playbook

## Branch model

- `dev` for daily integration
- `staging` for release candidate validation
- `main` for production only

Promotion path
1. `feature/*` to `dev`
2. `dev` to `staging`
3. `staging` to `main`

Only promote with pull requests.

## Vercel mapping

Use three Vercel projects.

1. `bodycache-dev`
- production branch `dev`
- domain `dev.bodycache.app`

2. `bodycache-staging`
- production branch `staging`
- domain `staging.bodycache.app`

3. `bodycache-prod`
- production branch `main`
- domain `bodycache.app`

Use the same build configuration in all projects.
- framework preset `Vite`
- install command `npm ci`
- build command `npm run build`
- output directory `dist`

## GitHub branch protection checklist

### dev

- require a pull request before merge
- require status check `test-build-e2e`
- disallow force pushes
- disallow branch deletion

### staging

- require a pull request before merge
- require status checks
- `test-build-e2e`
- `enforce-promotion-direction`
- disallow force pushes
- disallow branch deletion
- restrict direct pushes

### main

- require a pull request before merge
- require status checks
- `test-build-e2e`
- `enforce-promotion-direction`
- require at least one approval
- dismiss stale approvals on new commits
- disallow force pushes
- disallow branch deletion
- restrict direct pushes

## Required workflows

- `.github/workflows/ci.yml`
- `.github/workflows/release-flow-guard.yml`

## Initial bootstrap sequence

1. Create Vercel projects and connect repository
2. Set production branch for each project
3. Add domains to each project
4. Configure branch protection rules in GitHub
5. Open a small test PR into `dev` and confirm workflow status checks
6. Promote `dev` to `staging`, then `staging` to `main`
