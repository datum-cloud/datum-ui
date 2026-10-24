/**
 * Refuses to pack a public package that has no build output.
 *
 * Release packs the packages named by the changesets publish plan with
 * `pnpm pack`, which ships whatever is on disk under `dist/` and never builds.
 * If a package's build or artifact download silently produced nothing, the
 * tarball would publish without code, so the pack job fails here instead.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * Names of non-private packages under `packages/` with no `dist/` directory.
 * @param {string} root repository root
 * @returns {string[]} package names, in directory order
 */
export function missingDists(root) {
  const packagesDir = path.join(root, 'packages')
  let entries
  try {
    entries = fs.readdirSync(packagesDir, { withFileTypes: true })
  } catch {
    return []
  }

  const missing = []
  for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
    if (!entry.isDirectory()) continue
    const dir = path.join(packagesDir, entry.name)

    let pkg
    try {
      pkg = JSON.parse(fs.readFileSync(path.join(dir, 'package.json'), 'utf8'))
    } catch {
      continue
    }
    if (!pkg.name || pkg.private) continue

    let built = false
    try {
      built = fs.statSync(path.join(dir, 'dist')).isDirectory()
    } catch {
      built = false
    }
    if (!built) missing.push(pkg.name)
  }
  return missing
}

function main() {
  const missing = missingDists(process.cwd())
  if (missing.length > 0) {
    console.log(`missing dist for ${missing.join(', ')}; build or artifact upload is incomplete`)
    process.exit(1)
  }
  console.log('ok')
}

/** True when this file is the script Node was asked to run, not an import. */
function invokedDirectly() {
  if (typeof process.argv[1] !== 'string') return false
  try {
    return fs.realpathSync(process.argv[1]) === fs.realpathSync(fileURLToPath(import.meta.url))
  } catch {
    return false
  }
}

if (invokedDirectly()) main()
