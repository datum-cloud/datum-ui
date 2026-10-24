import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { missingDists } from './assert-public-dist.mjs'

function workspace(pkgs) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'dist-'))
  for (const [name, { private: isPrivate = false, dist = false }] of Object.entries(pkgs)) {
    const dir = path.join(root, 'packages', name)
    fs.mkdirSync(dir, { recursive: true })
    fs.writeFileSync(path.join(dir, 'package.json'),
      JSON.stringify({ name: `@x/${name}`, version: '1.0.0', private: isPrivate }))
    if (dist) fs.mkdirSync(path.join(dir, 'dist'))
  }
  return root
}

test('passes when every public package has dist', () => {
  assert.deepEqual(missingDists(workspace({ a: { dist: true }, b: { dist: true } })), [])
})

test('names public packages without dist', () => {
  assert.deepEqual(missingDists(workspace({ a: { dist: true }, b: {} })), ['@x/b'])
})

test('ignores private packages', () => {
  assert.deepEqual(missingDists(workspace({ a: { dist: true }, secret: { private: true } })), [])
})
