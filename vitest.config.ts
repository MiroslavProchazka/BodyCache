import { defineConfig } from 'vitest/config'
import path from 'path'

// Lightweight config for unit tests of pure helpers — no app plugins needed.
export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
