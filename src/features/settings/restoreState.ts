/**
 * Cross-device restore hint.
 *
 * `restoreAppOwner` drops the local database and reloads the app, so any
 * in-memory "restoring…" state is lost across the reload. We instead stamp a
 * timestamp in `localStorage` right before restoring; on the next boot the app
 * reads it to show a non-blocking "still syncing" banner.
 *
 * Evolu 7.x exposes no live `SyncState` (the React `useSyncState` hook throws a
 * TODO), so we cannot detect when the background pull from the relay actually
 * finishes. The banner is therefore time-boxed and dismissible: it reassures
 * the user that a freshly restored device fills in from the relay in the
 * background rather than instantly, which is the common "my history is missing"
 * surprise.
 */

const KEY = 'bodycache:restored-at'

/** How long the post-restore sync banner stays up before auto-expiring. */
export const RESTORE_BANNER_MAX_AGE_MS = 15 * 60 * 1000

/**
 * Pure predicate: is a restore stamped at `restoredAt` still within the banner
 * window at `now`? `null`/invalid/expired all read as inactive. Kept pure (no
 * storage access) so it can be unit-tested in Node.
 */
export const isRestoreFlagActive = (restoredAt: number | null, now: number): boolean => {
  if (restoredAt == null || !Number.isFinite(restoredAt)) return false
  const age = now - restoredAt
  return age >= 0 && age <= RESTORE_BANNER_MAX_AGE_MS
}

/** Stamp "just restored" immediately before calling `restoreAppOwner`. */
export const markJustRestored = (now: number = Date.now()): void => {
  try {
    localStorage.setItem(KEY, String(now))
  } catch {
    // Private-mode / storage-disabled: the banner just won't show. No-op.
  }
}

/** Clear the flag (banner dismissed, or window elapsed). */
export const clearRestoreFlag = (): void => {
  try {
    localStorage.removeItem(KEY)
  } catch {
    // No-op — see `markJustRestored`.
  }
}

/**
 * Whether to show the post-restore banner now. Reads the stored stamp and,
 * when the window has elapsed, clears it so it never lingers.
 */
export const isRecentlyRestored = (now: number = Date.now()): boolean => {
  let raw: string | null = null
  try {
    raw = localStorage.getItem(KEY)
  } catch {
    return false
  }
  if (raw == null) return false
  const restoredAt = Number(raw)
  const active = isRestoreFlagActive(Number.isFinite(restoredAt) ? restoredAt : null, now)
  if (!active) clearRestoreFlag()
  return active
}
