/**
 * Strips workspace:* dependencies from package.json before packing/publishing.
 * These are internal packages bundled by tsdown — they must not appear in the
 * published package.json because they don't exist on npm. Workspace deps live
 * in both `dependencies` and `devDependencies`, so we strip both fields.
 *
 * Usage: called via prepack/postpack scripts in package.json
 *   --strip   removes workspace deps and saves a backup (run on prepack)
 *   --restore restores the backup (run on postpack, so it always runs even if
 *             publish later fails)
 */
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'

const DEPENDENCY_FIELDS = ['dependencies', 'devDependencies']

const pkgPath = path.resolve(import.meta.dirname, '..', 'package.json')
const backupPath = `${pkgPath}.backup`

const mode = process.argv[2]

if (mode === '--strip') {
  const raw = fs.readFileSync(pkgPath, 'utf-8')
  fs.writeFileSync(backupPath, raw)

  const pkg = JSON.parse(raw)
  for (const field of DEPENDENCY_FIELDS) {
    if (!pkg[field])
      continue

    const stripped = Object.entries(pkg[field]).filter(
      ([, v]) => !String(v).startsWith('workspace:'),
    )
    pkg[field] = Object.fromEntries(stripped)
  }

  fs.writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`)
  console.log('Stripped workspace dependencies for publish')
}
else if (mode === '--restore') {
  if (fs.existsSync(backupPath)) {
    fs.copyFileSync(backupPath, pkgPath)
    fs.unlinkSync(backupPath)
    console.log('Restored package.json')
  }
}
else {
  console.error('Usage: strip-workspace-deps.mjs --strip | --restore')
  process.exit(1)
}
