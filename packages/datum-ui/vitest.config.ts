import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    alias: {
      '@test': fileURLToPath(new URL('./test', import.meta.url)),
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./test/setup.ts'],
    // Match any *.test.{ts,tsx} under src (the `__tests__/` layout still matches).
    // Do NOT require a `__tests__/` directory — a test placed elsewhere must still run.
    include: ['src/**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/**/__tests__/**', 'src/**/index.ts', 'src/styles/**'],
      reporter: ['text', 'json-summary', 'html'],
      // Enforced floor (ratchet). These are the current measured coverage numbers,
      // rounded down for headroom, so CI fails on any REGRESSION below today's floor.
      // Raise these toward the 80% target as untested components are backfilled.
      thresholds: {
        statements: 55,
        branches: 47,
        functions: 55,
        lines: 55,
      },
    },
    globals: true,
  },
})
