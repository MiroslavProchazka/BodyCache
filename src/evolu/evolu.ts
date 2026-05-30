import { createEvolu, SimpleName } from '@evolu/common'
import { createUseEvolu } from '@evolu/react'
import { evoluReactWebDeps } from '@evolu/react-web'
import { Schema } from './schema'

/**
 * The Evolu instance for BodyCache.
 *
 * Offline-first: `transports: []` makes this a local-only instance with no
 * sync. The app works fully without a network. Sync can be enabled later by
 * configuring WebSocket relay transports.
 *
 * TODO: sync — add relay `transports` once a sync backend is chosen.
 */
export const evolu = createEvolu(evoluReactWebDeps)(Schema, {
  name: SimpleName.orThrow('bodycache'),
  transports: [],
})

/** Typed `useEvolu` hook bound to the BodyCache schema. */
export const useEvolu = createUseEvolu(evolu)
