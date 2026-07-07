import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'

const PKG_ROOT = path.resolve(import.meta.dirname, '..')
const SRC_STYLES = path.join(PKG_ROOT, 'src', 'styles')
const DIST = path.join(PKG_ROOT, 'dist')
const DIST_STYLES = path.join(DIST, 'styles')
const SHADCN_STYLES = path.resolve(PKG_ROOT, '..', 'shadcn', 'styles')

// 1. Copy the whole src/styles/ tree to dist/styles/ (fonts, tokens, themes,
//    and top-level *.css). Copying the tree wholesale avoids a hand-maintained
//    per-file list that drifts as stylesheets are added.
fs.rmSync(DIST_STYLES, { recursive: true, force: true })
fs.cpSync(SRC_STYLES, DIST_STYLES, { recursive: true })

// 2. Copy every shadcn stylesheet to dist/styles/shadcn/ (glob, not a fixed
//    list) so any CSS referenced from datum-ui's stylesheets is reachable.
const DIST_SHADCN = path.join(DIST_STYLES, 'shadcn')
fs.mkdirSync(DIST_SHADCN, { recursive: true })

for (const entry of fs.readdirSync(SHADCN_STYLES, { withFileTypes: true })) {
  if (!entry.isFile() || !entry.name.endsWith('.css'))
    continue
  fs.copyFileSync(
    path.join(SHADCN_STYLES, entry.name),
    path.join(DIST_SHADCN, entry.name),
  )
}

// 3. Rewrite every `@repo/shadcn/styles/*` import in EVERY copied CSS file to
//    the local ./shadcn/ copy, walking dist/styles recursively so nested CSS
//    (the copied dist/styles/shadcn/ subdir and any future src/styles subdir)
//    is rewritten and guarded too — not just the top-level files. Generic regex
//    (not a single literal) so new @import lines are rewritten automatically.
function rewriteStylesRecursively(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const entryPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      rewriteStylesRecursively(entryPath)
      continue
    }
    if (!entry.isFile() || !entry.name.endsWith('.css'))
      continue
    const css = fs.readFileSync(entryPath, 'utf-8')
    const rewritten = css.replace(/@repo\/shadcn\/styles\//g, './shadcn/')
    if (rewritten !== css)
      fs.writeFileSync(entryPath, rewritten, 'utf-8')

    // Validate no @repo/ references remain (the guard the rewrite must satisfy).
    if (rewritten.includes('@repo/')) {
      const rel = path.relative(DIST_STYLES, entryPath)
      console.error(`ERROR: Unrewritten @repo/ imports remain in dist/styles/${rel}`)
      process.exit(1)
    }
  }
}

rewriteStylesRecursively(DIST_STYLES)

// 4. Copy component CSS to its published subpath (the `style` export condition).
const componentCopies = [
  {
    src: path.join(PKG_ROOT, 'src', 'components', 'features', 'grid', 'style.css'),
    dest: path.join(DIST, 'grid', 'style.css'),
  },
  {
    src: path.join(PKG_ROOT, 'src', 'components', 'features', 'nprogress', 'nprogress.css'),
    dest: path.join(DIST, 'nprogress', 'nprogress.css'),
  },
]

for (const { src, dest } of componentCopies) {
  fs.mkdirSync(path.dirname(dest), { recursive: true })
  fs.copyFileSync(src, dest)
}

console.log('Styles copied to dist/')
