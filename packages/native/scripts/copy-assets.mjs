#!/usr/bin/env node
/**
 * Copy the font files and empty-state artwork from @datum-cloud/datum-ui into
 * this package, so there is one source of truth for both. The copies are
 * git-ignored and shipped in the npm tarball (`fonts/`, `assets/`).
 */
import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve(import.meta.dirname, '..')
const web = path.resolve(root, '..', 'datum-ui', 'src')

const COPIES = [
  {
    from: path.join(web, 'styles/fonts'),
    to: path.join(root, 'fonts'),
    files: [
      'AllianceNo1-Regular.ttf',
      'AllianceNo1-Medium.ttf',
      'AllianceNo1-SemiBold.ttf',
      'CanelaText-Regular.ttf',
    ],
  },
  {
    from: path.join(web, 'components/features/empty-content/assets'),
    to: path.join(root, 'assets'),
    files: ['scene-5.png', 'scene-6.png', 'scene-7.png'],
  },
]

for (const { from, to, files } of COPIES) {
  fs.mkdirSync(to, { recursive: true })
  for (const file of files) {
    const src = path.join(from, file)
    const dest = path.join(to, file)
    if (!fs.existsSync(src))
      throw new Error(`copy-assets: missing source ${path.relative(root, src)}`)
    const same = fs.existsSync(dest) && fs.readFileSync(dest).equals(fs.readFileSync(src))
    if (!same)
      fs.copyFileSync(src, dest)
  }
}
console.log('copy-assets: fonts/ and assets/ are up to date')
