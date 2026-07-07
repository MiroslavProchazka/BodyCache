import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

export default defineConfig({
  server: {
    headers: {
      // Evolu's SQLite OPFS worker requires SharedArrayBuffer, which Chromium
      // exposes only when the app is cross-origin isolated. Playwright serves
      // the Vite dev app in CI, so keep the dev server isolated too.
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'credentialless',
    },
  },
  preview: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'credentialless',
    },
  },
  optimizeDeps: {
    // Evolu's web package creates the DB worker with `new Worker(new URL(...))`.
    // If Vite pre-bundles it into node_modules/.vite/deps, the generated worker
    // URL points at a non-existent optimized file and startup suspends forever.
    exclude: ['@evolu/web', '@evolu/sqlite-wasm'],
  },
  build: {
    // Emit `.vite/manifest.json` so the CI chunk guard (scripts/check-chunks.mjs)
    // can assert the starter catalog never leaks into the detail-page or index
    // chunk. See docs/exercise-library-performance.md §W4.
    manifest: true,
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'BodyCache',
        short_name: 'BodyCache',
        description: 'Your workout memory',
        theme_color: '#494fdf',
        background_color: '#000000',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2,wasm}'],
        // The Evolu SQLite WASM binary can exceed Workbox's default 2 MiB
        // precache cap; without this it is silently skipped and the DB cannot
        // boot offline.
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true,
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
