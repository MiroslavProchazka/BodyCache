# End-to-end tests

Playwright specs that drive the real app, including Evolu's local-first SQLite
store. They cover the journeys that unit tests can't:

- **`workout.spec.ts`** — start a workout, create an exercise inline, log a set,
  finish, and confirm it's remembered; plus discarding an empty workout.
- **`library.spec.ts`** — create an exercise and find it in the library.
- **`settings.spec.ts`** — the unit preference persists; "Back up now"
  downloads a backup file.

## Running

```bash
npm run e2e:install   # one-time: downloads Chromium
npm run e2e           # starts the dev server and runs the suite
```

`playwright.config.ts` boots `npm run dev` automatically and uses a fresh
browser context per test, so IndexedDB / OPFS start empty each time.

## Note on the remote sandbox

These tests **cannot run in the Claude Code remote sandbox**: the browser
download host `cdn.playwright.dev` is not in the network allowlist, so
`e2e:install` fails there. Run them locally or in CI (add the host to egress
settings if your CI sandboxes network access). The unit + integration suite
(`npm test`) runs everywhere and covers the logic layer.
