import { describe, expect, it } from 'vitest'
import pkg from '../../package.json'
import { buildPackageExports, buildTsdownEntry, entryKeyFor } from '../../scripts/exports-manifest.mjs'

/**
 * Guards the export-map single source of truth (scripts/exports-manifest.mjs).
 *
 * The committed package.json `exports` map is generated from the manifest by
 * `scripts/gen-exports.mjs`. This test fails the suite if the committed file has
 * drifted from the manifest — the same guarantee as `pnpm check:exports`, wired
 * into the normal test gate so drift cannot be merged without running the CLI.
 */

const committedExports = (pkg as { exports: Record<string, Record<string, string>> }).exports

describe('export map single source of truth', () => {
  it('package.json `exports` matches the generated map (run `pnpm gen:exports` on drift)', () => {
    expect(committedExports).toEqual(buildPackageExports())
  })

  it('every module entry point resolves to a tsdown output bundle', () => {
    const tsdownEntry = buildTsdownEntry()
    for (const [subpath, conditions] of Object.entries(committedExports)) {
      // Style-only entries (e.g. `./styles`) intentionally have no JS bundle.
      if (!('source' in conditions)) {
        continue
      }
      const key = entryKeyFor(subpath)
      expect(tsdownEntry, `missing tsdown entry for ${subpath}`).toHaveProperty(key)
      expect(conditions.default).toBe(`./dist/${key}.mjs`)
    }
  })

  it('tsdown entry keys and package.json module subpaths are the same set', () => {
    const moduleSubpaths = Object.entries(committedExports)
      .filter(([, conditions]) => 'source' in conditions)
      .map(([subpath]) => entryKeyFor(subpath))
      .sort()
    const tsdownKeys = Object.keys(buildTsdownEntry()).sort()
    expect(tsdownKeys).toEqual(moduleSubpaths)
  })
})
