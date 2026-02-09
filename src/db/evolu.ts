import { createEvolu, SimpleName } from '@evolu/common'
import { createUseEvolu } from '@evolu/react'
import { evoluReactWebDeps } from '@evolu/react-web'
import { schema } from './schema'

export const evolu = createEvolu(evoluReactWebDeps)(schema, {
  name: SimpleName.orThrow('bodycache'),
  transports: [{ type: 'WebSocket', url: 'wss://free.evoluhq.com' }]
})

export const useEvolu = createUseEvolu(evolu)
