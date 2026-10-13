/**
 * Strips workspace:* dependencies from package.json before packing/publishing.
 * These are internal packages bundled by tsdown — they must not appear in the
 * published package.json because they don't exist on npm. Workspace deps live
 * in both `dependencies` and `devDependencies`, so we strip both fields.
 *
 * Workspace packages that are published themselves (no `"private": true`,
 * e.g. @datum-cloud/datum-ui-assistant-core) are kept in `dependencies`:
 * they stay external and pnpm rewrites `workspace:^` to the released range.
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
const packagesDir = path.resolve(import.meta.dirname, '..', '..')

/** Names of the workspace packages that are published (not private). */
function publishedWorkspacePackages() {
  const names = new Set()
  for (const dir of fs.readdirSync(packagesDir)) {
    const manifest = path.join(packagesDir, dir, 'package.json')
    if (!fs.existsSync(manifest))
      continue
    const pkg = JSON.parse(fs.readFileSync(manifest, 'utf-8'))
    if (pkg.name && !pkg.private)
      names.add(pkg.name)
  }
  return names
}
const backupPath = `${pkgPath}.backup`

const mode = process.argv[2]

if (mode === '--strip') {
  const raw = fs.readFileSync(pkgPath, 'utf-8')
  fs.writeFileSync(backupPath, raw)

  const pkg = JSON.parse(raw)
  const published = publishedWorkspacePackages()
  for (const field of DEPENDENCY_FIELDS) {
    if (!pkg[field])
      continue

    const stripped = Object.entries(pkg[field]).filter(
      ([name, v]) => !String(v).startsWith('workspace:') || (field === 'dependencies' && published.has(name)),
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
