import { defineConfig } from 'vitest/config'
import path from 'path'

// Unit tests run in Node by default (pure helpers); files that need browser
// APIs opt into happy-dom with a `// @vitest-environment happy-dom` docblock.
// Playwright E2E lives in `e2e/` and is run separately via `npm run e2e`.
export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      // Measure the logic we own; exclude wiring, types and the test files.
      include: ['src/**/*.ts'],
      exclude: [
        'src/**/*.test.ts',
        'src/**/*.d.ts',
        'src/main.tsx',
        // Type-only re-exports (no runtime code).
        'src/evolu/rows.ts',
        // Thin Evolu wiring — schema/queries/mutations are declarative.
        'src/evolu/evolu.ts',
        'src/evolu/queries.ts',
        'src/evolu/mutations.ts',
        'src/evolu/schema.ts',
        // Browser/Evolu-bound integration code — exercised by the Playwright
        // E2E suite rather than unit tests.
        'src/features/settings/useDataTransfer.ts',
        'src/shared/utils/usePhotoUrl.ts',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
