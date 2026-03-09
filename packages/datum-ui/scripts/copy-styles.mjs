import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'

const PKG_ROOT = path.resolve(import.meta.dirname, '..')
const SRC_STYLES = path.join(PKG_ROOT, 'src', 'styles')
const DIST_STYLES = path.join(PKG_ROOT, 'dist', 'styles')
const SHADCN_STYLES = path.resolve(PKG_ROOT, '..', 'shadcn', 'styles')

// 1. Copy src/styles/ assets to dist/styles/
fs.mkdirSync(DIST_STYLES, { recursive: true })

fs.copyFileSync(
  path.join(SRC_STYLES, 'root.css'),
  path.join(DIST_STYLES, 'root.css'),
)

fs.copyFileSync(
  path.join(SRC_STYLES, 'fonts.css'),
  path.join(DIST_STYLES, 'fonts.css'),
)

fs.cpSync(
  path.join(SRC_STYLES, 'fonts'),
  path.join(DIST_STYLES, 'fonts'),
  { recursive: true },
)

fs.cpSync(
  path.join(SRC_STYLES, 'tokens'),
  path.join(DIST_STYLES, 'tokens'),
  { recursive: true },
)

fs.cpSync(
  path.join(SRC_STYLES, 'themes'),
  path.join(DIST_STYLES, 'themes'),
  { recursive: true },
)

// 2. Copy shadcn CSS to dist/styles/shadcn/
const DIST_SHADCN = path.join(DIST_STYLES, 'shadcn')
fs.mkdirSync(DIST_SHADCN, { recursive: true })

fs.copyFileSync(
  path.join(SHADCN_STYLES, 'shadcn.css'),
  path.join(DIST_SHADCN, 'shadcn.css'),
)

fs.copyFileSync(
  path.join(SHADCN_STYLES, 'animations.css'),
  path.join(DIST_SHADCN, 'animations.css'),
)

// 3. Rewrite import path in dist/styles/root.css
const rootCssPath = path.join(DIST_STYLES, 'root.css')
const rootCss = fs.readFileSync(rootCssPath, 'utf-8')
const rewritten = rootCss.replace(
  '@import \'@repo/shadcn/styles/shadcn.css\'',
  '@import \'./shadcn/shadcn.css\'',
)
fs.writeFileSync(rootCssPath, rewritten, 'utf-8')

// Validate no @repo/ references remain
if (rewritten.includes('@repo/')) {
  console.error('ERROR: Unrewritten @repo/ imports remain in dist/styles/root.css')
  process.exit(1)
}

// 4. Copy component CSS to separate export locations
const componentCopies = [
  {
    src: path.join(PKG_ROOT, 'src', 'components', 'features', 'grid', 'style.css'),
    dest: path.join(PKG_ROOT, 'dist', 'grid', 'style.css'),
  },
  {
    src: path.join(PKG_ROOT, 'src', 'components', 'features', 'nprogress', 'nprogress.css'),
    dest: path.join(PKG_ROOT, 'dist', 'nprogress', 'nprogress.css'),
  },
]

for (const { src, dest } of componentCopies) {
  fs.mkdirSync(path.dirname(dest), { recursive: true })
  fs.copyFileSync(src, dest)
}

console.log('Styles copied to dist/')
