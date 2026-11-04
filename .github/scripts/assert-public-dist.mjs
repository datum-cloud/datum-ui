/**
 * Refuses to pack a public package whose build output is missing or empty.
 *
 * Release packs the packages named by the changesets publish plan with
 * `pnpm pack`, which ships whatever is on disk and never builds. If a package's
 * build or artifact download silently produced nothing, the tarball would
 * publish without code, so the pack job fails here instead.
 *
 * Every public package must have a non-empty `dist/`, and every other entry in
 * its `files` array must exist and, when it is a directory, hold at least one
 * file. `packages/native` ships `fonts/` and `assets/` from the CI artifact, so
 * those are checked the same way as `dist/`.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

/** `files` entries that come from the checkout, not from the build artifact. */
const SOURCE_ENTRIES = new Set(['LICENSE', 'README.md', 'src'])

/** True when `dir` contains at least one file, at any depth. */
function hasFile(dir) {
  return fs.readdirSync(dir, { recursive: true, withFileTypes: true }).some(entry => entry.isFile())
}

/**
 * Describes what is wrong with one built path, or returns null when it is fine.
 * @param {string} target absolute path
 * @param {string} label path relative to the package, for the message
 * @returns {string | null} the problem, or null
 */
function checkBuiltPath(target, label) {
  let stat
  try {
    stat = fs.statSync(target)
  }
  catch {
    return `${label} is missing`
  }
  if (!stat.isDirectory())
    return null
  try {
    return hasFile(target) ? null : `${label} is empty`
  }
  catch (err) {
    return `${label} is unreadable (${err.code ?? err.message})`
  }
}

/**
 * Entries a package must ship from its build: `dist` plus every plain `files`
 * entry outside SOURCE_ENTRIES. Globs and negations are skipped because they
 * do not name one path.
 * @param {{ files?: unknown }} pkg parsed package.json
 * @returns {string[]} package-relative paths
 */
function builtEntries(pkg) {
  const entries = new Set(['dist'])
  if (!Array.isArray(pkg.files))
    return [...entries]
  for (const raw of pkg.files) {
    if (typeof raw !== 'string')
      continue
    const entry = raw.replace(/^\.\//, '').replace(/\/+$/, '')
    if (!entry || SOURCE_ENTRIES.has(entry) || /[*?!{}[\]]/.test(entry))
      continue
    entries.add(entry)
  }
  return [...entries]
}

/**
 * Problems with the build output of every non-private package under `packages/`.
 * @param {string} root repository root
 * @returns {string[]} one `name: problem` line per problem, in directory order
 * @throws {Error} when `packages/` cannot be read
 */
export function distProblems(root) {
  const packagesDir = path.join(root, 'packages')
  let entries
  try {
    entries = fs.readdirSync(packagesDir, { withFileTypes: true })
  }
  catch (err) {
    throw new Error(`cannot read ${packagesDir}: ${err.code ?? err.message}`)
  }

  const problems = []
  for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
    if (!entry.isDirectory())
      continue
    const dir = path.join(packagesDir, entry.name)

    let pkg
    try {
      pkg = JSON.parse(fs.readFileSync(path.join(dir, 'package.json'), 'utf8'))
    }
    catch {
      continue
    }
    if (!pkg.name || pkg.private)
      continue

    for (const built of builtEntries(pkg)) {
      const problem = checkBuiltPath(path.join(dir, built), built)
      if (problem)
        problems.push(`${pkg.name}: ${problem}`)
    }
  }
  return problems
}

function main() {
  let problems
  try {
    problems = distProblems(process.cwd())
  }
  catch (err) {
    console.log(err.message)
    process.exit(1)
  }
  if (problems.length > 0) {
    console.log(`build output incomplete; build or artifact upload is broken:\n${problems.map(p => `  ${p}`).join('\n')}`)
    process.exit(1)
  }
  console.log('ok')
}

/** True when this file is the script Node was asked to run, not an import. */
function invokedDirectly() {
  if (typeof process.argv[1] !== 'string')
    return false
  try {
    return fs.realpathSync(process.argv[1]) === fs.realpathSync(fileURLToPath(import.meta.url))
  }
  catch {
    return false
  }
}

if (invokedDirectly())
  main()
