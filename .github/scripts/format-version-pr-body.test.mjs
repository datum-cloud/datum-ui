import test from 'node:test'
import assert from 'node:assert/strict'
import { buildBody } from './format-version-pr-body.mjs'

test('highest bump wins the title suffix', () => {
  const body = buildBody({
    changesets: [
      { summary: 'Add density', releases: [{ name: '@datum-cloud/datum-ui', type: 'minor' }] },
      { summary: 'Break tokens', releases: [{ name: '@datum-cloud/datum-ui-tokens', type: 'major' }] },
    ],
    releases: [
      { name: '@datum-cloud/datum-ui', type: 'minor' },
      { name: '@datum-cloud/datum-ui-tokens', type: 'major' },
    ],
  })
  assert.match(body, /^## Release Type: `major`/)
  assert.match(body, /@datum-cloud\/datum-ui-tokens/)
  assert.match(body, /Break tokens/)
  assert.match(body, /@datum-cloud\/datum-ui\b/)
  assert.match(body, /Add density/)
})

test('a non-datum-ui-only release still produces a body', () => {
  const body = buildBody({
    changesets: [{ summary: 'Fix native layout', releases: [{ name: '@datum-cloud/datum-ui-native', type: 'patch' }] }],
    releases: [{ name: '@datum-cloud/datum-ui-native', type: 'patch' }],
  })
  assert.match(body, /^## Release Type: `patch`/)
  assert.match(body, /Fix native layout/)
  assert.doesNotMatch(body, /No changesets found/)
})

test('one changeset touching two packages appears under both', () => {
  const body = buildBody({
    changesets: [{
      summary: 'Shared change',
      releases: [
        { name: '@datum-cloud/datum-ui', type: 'patch' },
        { name: '@datum-cloud/datum-ui-tokens', type: 'patch' },
      ],
    }],
    releases: [
      { name: '@datum-cloud/datum-ui', type: 'patch' },
      { name: '@datum-cloud/datum-ui-tokens', type: 'patch' },
    ],
  })
  assert.equal(body.match(/Shared change/g).length, 2)
})

test('an empty plan is explicit', () => {
  assert.equal(buildBody({ changesets: [], releases: [] }), 'No changesets found.\n')
})
