/**
 * Fixes @repo/shadcn references in generated .d.ts files.
 *
 * tsc preserves import specifiers verbatim, so declarations end up with
 * `import { X } from '@repo/shadcn/ui/foo'` which doesn't exist for consumers.
 *
 * This script:
 *   1. Generates declarations for the shadcn workspace package via tsc
 *   2. Copies them into dist/_shadcn/
 *   3. Rewrites every @repo/shadcn/* reference in dist/**\/*.d.ts to a
 *      relative path pointing at dist/_shadcn/
 *
 * Usage: node scripts/fix-dts-imports.mjs
 *   Run after `tsc -p tsconfig.build.json`
 */
import { execSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'

const ROOT = path.resolve(import.meta.dirname, '..')
const DIST = path.join(ROOT, 'dist')
const SHADCN_PKG = path.resolve(ROOT, '..', 'shadcn')
const SHADCN_DEST = path.join(DIST, '_shadcn')
const TMP_DIR = path.join(ROOT, '.shadcn-dts-tmp')

// ── Step 1: Generate shadcn declarations ────────────────────────────
console.log('Generating shadcn declarations...')

// Clean up any previous temp directory
if (fs.existsSync(TMP_DIR)) {
  fs.rmSync(TMP_DIR, { recursive: true })
}

try {
  execSync(
    [
      'npx tsc',
      '--declaration',
      '--emitDeclarationOnly',
      '--skipLibCheck',
      `--outDir ${TMP_DIR}`,
      `--rootDir ${SHADCN_PKG}`,
      `--project ${path.join(SHADCN_PKG, 'tsconfig.json')}`,
    ].join(' '),
    { cwd: SHADCN_PKG, stdio: 'pipe' },
  )
}
catch (err) {
  console.error('tsc failed:', err.stderr?.toString() || err.message)
  process.exit(1)
}

// ── Step 2: Copy into dist/_shadcn/ ─────────────────────────────────
console.log('Copying shadcn declarations to dist/_shadcn/...')

if (fs.existsSync(SHADCN_DEST)) {
  fs.rmSync(SHADCN_DEST, { recursive: true })
}
fs.cpSync(TMP_DIR, SHADCN_DEST, { recursive: true })

// Clean up temp
fs.rmSync(TMP_DIR, { recursive: true })

// ── Step 3: Rewrite @repo/shadcn imports in all .d.ts files ─────────
console.log('Rewriting @repo/shadcn imports...')

let rewriteCount = 0

function walkDts(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      walkDts(fullPath)
      continue
    }
    if (!entry.name.endsWith('.d.ts'))
      continue

    const content = fs.readFileSync(fullPath, 'utf-8')
    if (!content.includes('@repo/shadcn'))
      continue

    const fileDir = path.dirname(fullPath)

    const updated = content.replace(
      /@repo\/shadcn\/([^'"]+)/g,
      (_match, importPath) => {
        // Calculate relative path from this file to dist/_shadcn/<importPath>
        const target = path.join(SHADCN_DEST, importPath)
        let rel = path.relative(fileDir, target)
        if (!rel.startsWith('.')) {
          rel = `./${rel}`
        }
        // Use posix separators
        return rel.replace(/\\/g, '/')
      },
    )

    if (updated !== content) {
      fs.writeFileSync(fullPath, updated)
      rewriteCount++
    }
  }
}

walkDts(DIST)

console.log(`Rewrote @repo/shadcn references in ${rewriteCount} .d.ts files`)
