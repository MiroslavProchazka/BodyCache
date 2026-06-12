/// <reference types="vite/client" />

interface ImportMetaEnv {
  /**
   * WebSocket relay URL for Evolu sync. A bare `wss://`/`ws://` base URL
   * (no query string). Omit to use the default public relay; set to an empty
   * string to disable sync (local-only). See `src/evolu/evolu.ts`.
   */
  readonly VITE_EVOLU_RELAY_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
