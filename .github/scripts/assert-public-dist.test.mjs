import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { distProblems } from './assert-public-dist.mjs'

/** Writes `rel` under `dir`, creating parents. */
function touch(dir, rel) {
  const file = path.join(dir, rel)
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, 'x')
}

/**
 * Builds a throwaway repo root with one directory per package.
 * `dirs` lists directories to create with one file each; `emptyDirs` lists
 * directories to create with nothing in them.
 */
function workspace(pkgs) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'dist-'))
  for (const [name, spec] of Object.entries(pkgs)) {
    const { private: isPrivate = false, files, dirs = [], emptyDirs = [], plainFiles = [] } = spec
    const dir = path.join(root, 'packages', name)
    fs.mkdirSync(dir, { recursive: true })
    fs.writeFileSync(path.join(dir, 'package.json'),
      JSON.stringify({ name: `@x/${name}`, version: '1.0.0', private: isPrivate, files }))
    for (const d of dirs) touch(dir, path.join(d, 'index.js'))
    for (const d of emptyDirs) fs.mkdirSync(path.join(dir, d), { recursive: true })
    for (const f of plainFiles) touch(dir, f)
  }
  return root
}

const NATIVE_FILES = ['LICENSE', 'README.md', 'assets', 'dist', 'fonts', 'src']

test('passes when every public package has a non-empty dist', () => {
  assert.deepEqual(distProblems(workspace({ a: { dirs: ['dist'] }, b: { dirs: ['dist'] } })), [])
})

test('names public packages without dist', () => {
  assert.deepEqual(distProblems(workspace({ a: { dirs: ['dist'] }, b: {} })), ['@x/b: dist is missing'])
})

test('fails an empty dist', () => {
  assert.deepEqual(distProblems(workspace({ a: { emptyDirs: ['dist'] } })), ['@x/a: dist is empty'])
})

test('fails a dist that holds only empty subdirectories', () => {
  assert.deepEqual(distProblems(workspace({ a: { emptyDirs: ['dist/esm', 'dist/types'] } })), ['@x/a: dist is empty'])
})

test('accepts a dist whose files are nested', () => {
  assert.deepEqual(distProblems(workspace({ a: { dirs: ['dist/esm/components'] } })), [])
})

test('ignores private packages', () => {
  assert.deepEqual(distProblems(workspace({ a: { dirs: ['dist'] }, secret: { private: true } })), [])
})

test('passes a native-like package with dist, fonts and assets built', () => {
  const root = workspace({
    native: { files: NATIVE_FILES, dirs: ['dist', 'fonts', 'assets/images'], plainFiles: ['LICENSE', 'README.md'] },
  })
  assert.deepEqual(distProblems(root), [])
})

test('does not require LICENSE, README.md or src to be built', () => {
  const root = workspace({ native: { files: NATIVE_FILES, dirs: ['dist', 'fonts', 'assets'] } })
  assert.deepEqual(distProblems(root), [])
})

test('names every missing or empty files directory of a native-like package', () => {
  const root = workspace({ native: { files: NATIVE_FILES, dirs: ['dist'], emptyDirs: ['fonts'] } })
  assert.deepEqual(distProblems(root), ['@x/native: assets is missing', '@x/native: fonts is empty'])
})

test('skips glob and negated files entries', () => {
  const root = workspace({ a: { files: ['dist', '*.css', '!dist/**/*.map'], dirs: ['dist'] } })
  assert.deepEqual(distProblems(root), [])
})

test('normalises ./ prefixes and trailing slashes in files entries', () => {
  const root = workspace({ a: { files: ['./dist/', 'fonts/'], dirs: ['dist'] } })
  assert.deepEqual(distProblems(root), ['@x/a: fonts is missing'])
})

test('accepts a files entry that names a built file', () => {
  const root = workspace({ a: { files: ['dist', 'styles.css'], dirs: ['dist'], plainFiles: ['styles.css'] } })
  assert.deepEqual(distProblems(root), [])
})

test('throws when packages/ cannot be read', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'dist-'))
  assert.throws(() => distProblems(root), /cannot read .*packages: ENOENT/)
})
