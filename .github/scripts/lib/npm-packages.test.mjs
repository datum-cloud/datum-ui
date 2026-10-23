import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import {
  classify,
  ignoredPackages,
  manifestWarnings,
  packagesInChangesets,
  publicPackages,
} from './npm-packages.mjs'

function project(config) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'changeset-config-'))
  fs.mkdirSync(path.join(root, '.changeset'), { recursive: true })
  if (config !== undefined) {
    fs.writeFileSync(
      path.join(root, '.changeset', 'config.json'),
      typeof config === 'string' ? config : JSON.stringify(config),
    )
  }
  return root
}

test('missing, targeted and not ignored is an error', () => {
  assert.equal(classify('@x/new', { status: 'missing' }, true, false).level, 'error')
})

test('missing, untargeted and not ignored is an error', () => {
  // Registry-driven plan: no changeset needed for Release to select it.
  assert.equal(classify('@x/new', { status: 'missing' }, false, false).level, 'error')
})

test('missing, untargeted and ignored is a warning', () => {
  assert.equal(classify('@x/new', { status: 'missing' }, false, true).level, 'warning')
})

test('missing, targeted and ignored is a warning', () => {
  assert.equal(classify('@x/new', { status: 'missing' }, true, true).level, 'warning')
})

test('a missing package error names the ignore entry', () => {
  const { level, message } = classify('@x/new', { status: 'missing' }, false, false)
  assert.equal(level, 'error')
  assert.match(message, /\.changeset\/config\.json ignore/)
  assert.match(message, /E404/)
})

test('a missing ignored package with a changeset says to remove it from ignore', () => {
  const { message } = classify('@x/new', { status: 'missing' }, true, true)
  assert.match(message, /Remove it from ignore/)
})

test('manual latest is a warning', () => {
  assert.equal(classify('@x/pkg', { status: 'manual', latest: '0.1.0' }, false, false).level, 'warning')
})

test('provenance on latest passes', () => {
  assert.equal(classify('@x/pkg', { status: 'ok', latest: '1.2.3' }, false, false).level, 'pass')
})

test('registry errors warn instead of failing the PR', () => {
  assert.equal(classify('@x/pkg', { status: 'error', detail: 'HTTP 503' }, true, true).level, 'warning')
})

test('ignoredPackages reads the ignore list', () => {
  const root = project({ ignore: ['@x/a', '@x/b'] })
  assert.deepEqual([...ignoredPackages(root)].sort(), ['@x/a', '@x/b'])
})

test('ignoredPackages is empty when the config is missing or invalid', () => {
  assert.deepEqual([...ignoredPackages(project(undefined))], [])
  assert.deepEqual([...ignoredPackages(project('{not json'))], [])
  assert.deepEqual([...ignoredPackages(project({ ignore: 'nope' }))], [])
})

test('packagesInChangesets reads quoted and unquoted frontmatter and ignores none', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'changesets-'))
  fs.mkdirSync(path.join(root, '.changeset'))
  fs.writeFileSync(path.join(root, '.changeset', 'a.md'),
    "---\n'@datum-cloud/datum-ui': minor\n'@datum-cloud/datum-ui-tokens': patch\n---\n\nSummary\n")
  fs.writeFileSync(path.join(root, '.changeset', 'b.md'),
    '---\n@datum-cloud/datum-ui-native: none\n---\n\nNothing\n')
  const names = packagesInChangesets(root)
  assert.deepEqual([...names].sort(), [
    '@datum-cloud/datum-ui',
    '@datum-cloud/datum-ui-tokens',
  ])
})

test('publicPackages ignores private packages', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'workspace-'))
  fs.mkdirSync(path.join(root, 'packages', 'public'), { recursive: true })
  fs.mkdirSync(path.join(root, 'packages', 'private'), { recursive: true })
  fs.writeFileSync(path.join(root, 'packages', 'public', 'package.json'),
    JSON.stringify({ name: '@x/public', version: '1.0.0' }))
  fs.writeFileSync(path.join(root, 'packages', 'private', 'package.json'),
    JSON.stringify({ name: '@x/private', version: '1.0.0', private: true }))
  assert.deepEqual(publicPackages(root).map(({ pkg }) => pkg.name), ['@x/public'])
})

test('manifestWarnings flags a missing public access', () => {
  const warnings = manifestWarnings({
    name: '@x/pkg',
    repository: { url: 'https://github.com/datum-cloud/datum-ui' },
  })
  assert.equal(warnings.length, 1)
  assert.match(warnings[0], /publishConfig\.access/)
})

test('manifestWarnings flags a repository url for another repo', () => {
  const warnings = manifestWarnings({
    name: '@x/pkg',
    publishConfig: { access: 'public' },
    repository: { url: 'https://github.com/someone/else' },
  })
  assert.equal(warnings.length, 1)
  assert.match(warnings[0], /repository\.url/)
})

test('manifestWarnings is silent for a correct manifest', () => {
  assert.deepEqual(
    manifestWarnings({
      name: '@x/pkg',
      publishConfig: { access: 'public' },
      repository: { url: 'https://github.com/datum-cloud/datum-ui', directory: 'packages/x' },
    }),
    [],
  )
})

test('manifestWarnings accepts a git+https url ending in .git', () => {
  assert.deepEqual(
    manifestWarnings({
      name: '@x/pkg',
      publishConfig: { access: 'public' },
      repository: { url: 'git+https://github.com/datum-cloud/datum-ui.git' },
    }),
    [],
  )
})
