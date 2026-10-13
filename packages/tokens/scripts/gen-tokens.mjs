#!/usr/bin/env node
/**
 * Generate src/tokens.gen.ts from the datum-ui CSS sheets.
 *
 *   node scripts/gen-tokens.mjs           write src/tokens.gen.ts
 *   node scripts/gen-tokens.mjs --check   exit 1 if the committed file is stale
 */
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { buildTokens } from './lib/build.mjs'
import { serializeTokens } from './lib/serialize.mjs'

const outFile = path.resolve(import.meta.dirname, '..', 'src', 'tokens.gen.ts')
const check = process.argv.includes('--check')

const tokens = buildTokens()
const next = serializeTokens(tokens)

if (tokens.dropped.length > 0) {
  console.warn(
    `gen-tokens: skipped colour roles defined in only one scheme: ${tokens.dropped.join(', ')}`,
  )
}

if (check) {
  const current = fs.existsSync(outFile) ? fs.readFileSync(outFile, 'utf8') : ''
  if (current === next) {
    console.log('check:tokens — src/tokens.gen.ts is in sync with the CSS.')
    process.exit(0)
  }
  const a = current.split('\n')
  const b = next.split('\n')
  const diffs = []
  for (let i = 0; i < Math.max(a.length, b.length) && diffs.length < 20; i++) {
    if (a[i] !== b[i])
      diffs.push(`  line ${i + 1}:\n    - ${a[i] ?? '<missing>'}\n    + ${b[i] ?? '<missing>'}`)
  }
  console.error('check:tokens — src/tokens.gen.ts is out of date with the datum-ui CSS.')
  console.error(diffs.join('\n'))
  console.error('Run `pnpm --filter @datum-cloud/datum-ui-tokens gen:tokens` and commit the result.')
  process.exit(1)
}

fs.writeFileSync(outFile, next)
console.log(`gen-tokens: wrote ${path.relative(process.cwd(), outFile)}`)
