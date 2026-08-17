import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { buildPackageExports } from './exports-manifest.mjs'

/**
 * Export-map single-source-of-truth generator.
 *
 * The package.json `exports` map is derived from `scripts/exports-manifest.mjs`
 * (the one place public entry points are declared). This script keeps the
 * committed package.json in sync with that manifest.
 *
 * The sibling tsdown `entry` map is consumed directly from the manifest by
 * tsdown.config.ts at build time, so it needs no generation step and cannot
 * drift — only package.json is a committed artifact that must be reconciled.
 *
 * Usage:
 *   node scripts/gen-exports.mjs           Rewrite package.json `exports` in place.
 *   node scripts/gen-exports.mjs --check   Exit non-zero if package.json is stale
 *                                          (CI guard — makes no edits).
 */

const PKG_PATH = path.resolve(import.meta.dirname, '..', 'package.json')

function readPackageJson() {
  const raw = fs.readFileSync(PKG_PATH, 'utf8')
  return { raw, pkg: JSON.parse(raw) }
}

/** Serialize a package.json object the way this repo formats it (2-space, trailing newline). */
function serialize(pkg) {
  return `${JSON.stringify(pkg, null, 2)}\n`
}

function main() {
  const check = process.argv.includes('--check')
  const { raw, pkg } = readPackageJson()

  const next = { ...pkg, exports: buildPackageExports() }
  const nextRaw = serialize(next)

  if (nextRaw === raw) {
    if (!check) {
      console.log('package.json `exports` already up to date with scripts/exports-manifest.mjs')
    }
    return
  }

  if (check) {
    console.error('Export map is STALE — package.json `exports` does not match scripts/exports-manifest.mjs.')
    console.error('Run `pnpm gen:exports` and commit the result.')
    process.exitCode = 1
    return
  }

  fs.writeFileSync(PKG_PATH, nextRaw)
  console.log('Regenerated package.json `exports` from scripts/exports-manifest.mjs')
}

main()
