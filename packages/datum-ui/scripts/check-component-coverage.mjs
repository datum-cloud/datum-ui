import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'

/**
 * Test/story reconciliation gate.
 *
 * Walks the package `exports` map, resolves each public component to its source
 * directory, and asserts every public component has BOTH:
 *   (a) at least one *.test.{ts,tsx} file, and
 *   (b) at least one *.stories.tsx in the Storybook app.
 *
 * This is the per-component floor from the audit (STRUCT-068 / STRUCT-071):
 * aggregate coverage percentages can be masked by a handful of heavily-tested
 * features, so we enforce presence per component instead.
 *
 * Because ~two dozen primitives currently ship with no test and/or story, the
 * check runs against a committed BASELINE of known gaps (ratchet): it fails only
 * when a NEW gap appears (a component regresses, or a new component lands without
 * a test/story). Run with `--update-baseline` after legitimately adding coverage
 * to shrink the baseline. The goal is a baseline that trends to empty.
 */

const PKG_ROOT = path.resolve(import.meta.dirname, '..')
const REPO_ROOT = path.resolve(PKG_ROOT, '..', '..')
const STORIES_ROOT = path.join(REPO_ROOT, 'apps', 'storybook', 'stories')
const BASELINE_PATH = path.join(PKG_ROOT, 'scripts', 'component-coverage-baseline.json')

/** Recursively list files under a directory (returns [] if it does not exist). */
function walk(dir) {
  if (!fs.existsSync(dir)) {
    return []
  }
  const out = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      out.push(...walk(full))
    }
    else {
      out.push(full)
    }
  }
  return out
}

/** Public component exports resolved to { key, name, dir }. */
function collectComponents() {
  const pkg = JSON.parse(fs.readFileSync(path.join(PKG_ROOT, 'package.json'), 'utf8'))
  const seen = new Map()
  for (const entry of Object.values(pkg.exports ?? {})) {
    const source = entry && typeof entry === 'object' ? entry.source : null
    if (typeof source !== 'string') {
      continue
    }
    const m = source.match(/^\.\/src\/components\/(base|features)\/([^/]+)\//)
    if (!m) {
      continue
    }
    const [, section, name] = m
    const key = `${section}/${name}`
    if (!seen.has(key)) {
      seen.set(key, { key, name, dir: path.join(PKG_ROOT, 'src', 'components', section, name) })
    }
  }
  return [...seen.values()].sort((a, b) => a.key.localeCompare(b.key))
}

function main() {
  const updateBaseline = process.argv.includes('--update-baseline')
  const components = collectComponents()

  const storyFiles = walk(STORIES_ROOT)
    .filter(f => f.endsWith('.stories.tsx'))
    .map(f => f.replaceAll('\\', '/'))

  const gaps = {}
  for (const c of components) {
    const files = walk(c.dir)
    const hasTest = files.some(f => /\.test\.tsx?$/.test(f))
    const hasStory = storyFiles.some((f) => {
      const base = path.basename(f, '.stories.tsx')
      // Match a `<name>.stories.tsx` / `<name>-*.stories.tsx` file, or any story
      // nested under a `/<name>/` directory (form/, picker/ organise stories that way).
      return base === c.name || base.startsWith(`${c.name}-`) || f.includes(`/${c.name}/`)
    })
    const missing = []
    if (!hasTest) {
      missing.push('test')
    }
    if (!hasStory) {
      missing.push('story')
    }
    if (missing.length > 0) {
      gaps[c.key] = missing
    }
  }

  if (updateBaseline) {
    fs.writeFileSync(BASELINE_PATH, `${JSON.stringify(gaps, null, 2)}\n`)
    console.log(`Baseline written: ${path.relative(REPO_ROOT, BASELINE_PATH)} (${Object.keys(gaps).length} components with gaps)`)
    return
  }

  const baseline = fs.existsSync(BASELINE_PATH)
    ? JSON.parse(fs.readFileSync(BASELINE_PATH, 'utf8'))
    : {}

  // A regression is any gap that is worse than (or absent from) the baseline.
  const regressions = []
  for (const [key, missing] of Object.entries(gaps)) {
    const allowed = baseline[key] ?? []
    const newlyMissing = missing.filter(kind => !allowed.includes(kind))
    if (newlyMissing.length > 0) {
      regressions.push(`  ${key}: missing ${newlyMissing.join(', ')}`)
    }
  }

  // Stale baseline entries (now fully covered) are reported but do not fail —
  // run --update-baseline to clean them up and tighten the ratchet.
  const stale = Object.keys(baseline).filter(key => !gaps[key])

  if (regressions.length > 0) {
    console.error('Component coverage gate FAILED — new test/story gaps:')
    console.error(regressions.join('\n'))
    console.error('\nAdd the missing test and/or story, or run `pnpm check:coverage-matrix --update-baseline` if this is an intentional, reviewed change.')
    process.exitCode = 1
    return
  }

  console.log(`Component coverage gate passed: ${components.length} public components checked, ${Object.keys(gaps).length} known gaps grandfathered.`)
  if (stale.length > 0) {
    console.log(`Note: ${stale.length} baseline entr${stale.length === 1 ? 'y is' : 'ies are'} now fully covered and can be removed via --update-baseline: ${stale.join(', ')}`)
  }
}

main()
