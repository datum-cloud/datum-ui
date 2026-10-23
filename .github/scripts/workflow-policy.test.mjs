import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'

const ci = fs.readFileSync('.github/workflows/ci.yml', 'utf8')

test('CI uploads a generic public package artifact', () => {
  assert.match(ci, /name: public-packages-dist/)
  assert.match(ci, /packages\/\*\/dist\//)
})

test('CI keeps artifacts for a week', () => {
  assert.equal((ci.match(/retention-days: 7/g) ?? []).length, 2)
})

const release = fs.readFileSync('.github/workflows/release.yml', 'utf8')

test('release has the four plan-driven jobs', () => {
  for (const job of ['select-mode', 'version', 'pack', 'publish']) {
    assert.match(release, new RegExp(`^  ${job}:`, 'm'))
  }
})

test('publish needs select-mode directly for its mode output', () => {
  const job = release.match(/\n {2}publish:\n([\s\S]*?)(?=\n {2}[a-z][\w-]*:\n|$)/)?.[1]
  assert.ok(job, 'publish job is defined')
  const needs = job.match(/^ {4}needs: (.+)$/m)?.[1] ?? ''
  const directNeeds = needs
    .replace(/^\[|\]$/g, '')
    .split(',')
    .map((name) => name.trim())
  assert.ok(
    directNeeds.includes('select-mode'),
    `publish needs must list select-mode directly, got: ${needs}`,
  )
})

test('release cancels nothing', () => {
  assert.match(release, /cancel-in-progress: false/)
})

test('only the publish job gets id-token', () => {
  assert.equal((release.match(/id-token: write/g) ?? []).length, 1)
})

test('no npm token fallback exists', () => {
  assert.doesNotMatch(release, /NPM_TOKEN|NODE_AUTH_TOKEN|registry-url/)
})

test('only the version job can edit pull requests', () => {
  assert.equal((release.match(/pull-requests: write/g) ?? []).length, 1)
})
