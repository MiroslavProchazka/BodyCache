import { createEvolu, SimpleName, type OwnerTransport } from '@evolu/common'
import { createUseEvolu } from '@evolu/react'
import { evoluReactWebDeps } from '@evolu/react-web'
import { Schema } from './schema'

/**
 * Relay endpoint for sync.
 *
 * Defaults to Evolu's public relay. Point at your own relay with
 * `VITE_EVOLU_RELAY_URL` (must be a bare `wss://`/`ws://` base URL, no query
 * string), or set it to an empty string to stay fully local-only (no sync).
 */
const RELAY_URL = import.meta.env.VITE_EVOLU_RELAY_URL ?? 'wss://free.evoluhq.com'

/**
 * Transports for the app owner. A WebSocket relay when configured, otherwise
 * an empty array (local-only). Evolu is end-to-end encrypted: the relay only
 * ever sees ciphertext, never plaintext sets or exercises.
 */
const transports: ReadonlyArray<OwnerTransport> = RELAY_URL
  ? [{ type: 'WebSocket', url: RELAY_URL }]
  : []

/**
 * The Evolu instance for BodyCache.
 *
 * Offline-first and non-blocking: writes always commit to the local SQLite DB
 * first and sync in the background, so logging never waits on the network. The
 * relay syncs structured data only — photo binaries stay device-local
 * (IndexedDB), as cross-device image sync is out of MVP scope.
 */
export const evolu = createEvolu(evoluReactWebDeps)(Schema, {
  name: SimpleName.orThrow('bodycache'),
  transports,
})

/** Typed `useEvolu` hook bound to the BodyCache schema. */
export const useEvolu = createUseEvolu(evolu)
