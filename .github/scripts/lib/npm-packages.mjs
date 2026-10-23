import fs from 'node:fs'
import path from 'node:path'

const REGISTRY = 'https://registry.npmjs.org'
const REPOSITORY_URL = 'https://github.com/datum-cloud/datum-ui'
const WORKSPACE_DIRS = ['packages', 'apps']

/**
 * Public workspace packages, in directory order per workspace root.
 * @returns {Array<{ file: string, pkg: object }>}
 */
export function publicPackages(root) {
  const found = []
  for (const group of WORKSPACE_DIRS) {
    const groupDir = path.join(root, group)
    let entries
    try {
      entries = fs.readdirSync(groupDir, { withFileTypes: true })
    } catch {
      continue
    }
    for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
      if (!entry.isDirectory()) continue
      const file = path.join(groupDir, entry.name, 'package.json')
      let pkg
      try {
        pkg = JSON.parse(fs.readFileSync(file, 'utf8'))
      } catch {
        continue
      }
      if (!pkg.name || pkg.private) continue
      found.push({ file, pkg })
    }
  }
  return found
}

/**
 * Package names targeted by changeset frontmatter, excluding `none` bumps.
 * Only the first `---` block of each changeset is read, so prose is never parsed.
 * @returns {Set<string>}
 */
export function packagesInChangesets(root) {
  const changesetDir = path.join(root, '.changeset')
  let files
  try {
    files = fs.readdirSync(changesetDir)
  } catch {
    return new Set()
  }

  const names = new Set()
  for (const file of files.sort()) {
    if (!file.endsWith('.md') || file === 'README.md') continue
    const lines = fs.readFileSync(path.join(changesetDir, file), 'utf8').split(/\r?\n/)
    const start = lines.findIndex((line) => line.trim() === '---')
    if (start === -1) continue
    const end = lines.findIndex((line, index) => index > start && line.trim() === '---')
    if (end === -1) continue

    for (const line of lines.slice(start + 1, end)) {
      const match = /^\s*(?:'([^']+)'|"([^"]+)"|([^:]+?))\s*:\s*(major|minor|patch|none)\s*$/.exec(line)
      if (!match) continue
      const name = (match[1] ?? match[2] ?? match[3]).trim()
      const bump = match[4]
      if (bump === 'none') continue
      names.add(name)
    }
  }
  return names
}

/**
 * Package names in `.changeset/config.json` `ignore`, i.e. packages that the
 * registry-driven publish plan skips while they are being bootstrapped.
 * A missing or unreadable config yields an empty set: the guard then treats
 * every missing package as publishable, which is the safe direction.
 * @returns {Set<string>}
 */
export function ignoredPackages(root) {
  let config
  try {
    config = JSON.parse(fs.readFileSync(path.join(root, '.changeset', 'config.json'), 'utf8'))
  } catch {
    return new Set()
  }
  const ignore = Array.isArray(config?.ignore) ? config.ignore : []
  return new Set(ignore.filter((name) => typeof name === 'string'))
}

function normalizeRepositoryUrl(url) {
  if (typeof url !== 'string') return ''
  return url
    .trim()
    .replace(/^git\+/i, '')
    .replace(/^git@github\.com:/i, 'https://github.com/')
    .replace(/\.git$/i, '')
    .replace(/\/+$/, '')
    .toLowerCase()
}

/**
 * Manifest problems that break the npm trusted-publishing exchange for a
 * public package. Both are warnings: they cannot be proven fatal until the
 * next CI publish attempts the exchange.
 * @returns {string[]}
 */
export function manifestWarnings(pkg) {
  const warnings = []
  if (pkg?.publishConfig?.access !== 'public') {
    warnings.push('publishConfig.access is not "public"; the package must be public to publish from CI')
  }
  if (normalizeRepositoryUrl(pkg?.repository?.url) !== REPOSITORY_URL) {
    warnings.push(
      `repository.url does not point at ${REPOSITORY_URL}; the npm trust exchange will reject it`,
    )
  }
  return warnings
}

/**
 * @param {string} name
 * @param {{ status: 'ok' | 'missing' | 'manual' | 'error', latest?: string, detail?: string }} result
 * @param {boolean} targeted whether a changeset in this PR names the package
 * @param {boolean} ignored whether `.changeset/config.json` `ignore` lists it
 * @returns {{ level: 'pass' | 'warning' | 'error', message: string }}
 */
export function classify(name, result, targeted, ignored) {
  switch (result.status) {
    case 'ok':
      return { level: 'pass', message: `${name}@${result.latest} is published with provenance` }
    case 'manual':
      return {
        level: 'warning',
        message: `${name}@${result.latest} was published without provenance; the next CI release attaches it`,
      }
    case 'missing':
      if (ignored) {
        return {
          level: 'warning',
          message: targeted
            ? `${name} is not on npm yet and is listed in .changeset/config.json ignore, so no publish is attempted. ` +
              'Remove it from ignore before adding a changeset, and bootstrap it with a manual first publish.'
            : `${name} is not on npm yet but is listed in .changeset/config.json ignore; bootstrap in progress, so no publish is attempted.`,
        }
      }
      return {
        level: 'error',
        message:
          `${name} is not on npm yet and is not listed in .changeset/config.json ignore. ` +
          'The registry-driven publish plan selects any non-ignored version missing from npm, so Release would fail with E404, whether or not a changeset exists. ' +
          'Add it to .changeset/config.json ignore until it is bootstrapped with a manual first publish.',
      }
    case 'error':
      return {
        level: 'warning',
        message: `could not check ${name} on npm (${result.detail ?? 'unknown error'}); not blocking this PR`,
      }
    default:
      return { level: 'warning', message: `unknown registry result for ${name}` }
  }
}

/**
 * @param {string} name
 * @param {typeof fetch} [fetchImpl]
 * @returns {Promise<{ status: 'ok' | 'missing' | 'manual' | 'error', latest?: string, detail?: string }>}
 */
export async function lookup(name, fetchImpl = globalThis.fetch) {
  const url = `${REGISTRY}/${name.replace('/', '%2f')}`
  try {
    const response = await fetchImpl(url, { headers: { accept: 'application/json' } })
    if (response.status === 404) return { status: 'missing' }
    if (!response.ok) return { status: 'error', detail: `HTTP ${response.status}` }

    const packument = await response.json()
    const latest = packument['dist-tags']?.latest
    if (!latest) return { status: 'error', detail: 'no dist-tags.latest in registry response' }

    const provenance = packument.versions?.[latest]?.dist?.attestations?.provenance
    return { status: provenance ? 'ok' : 'manual', latest }
  } catch (error) {
    return { status: 'error', detail: error instanceof Error ? error.message : String(error) }
  }
}
