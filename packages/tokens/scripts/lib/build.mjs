/**
 * Turns the datum-ui CSS sheets into a plain token object.
 *
 * Sources (all inside packages/datum-ui and packages/shadcn — CSS stays the
 * source of truth; this package only mirrors it):
 *   - styles/tokens/figma-tokens.css  raw palette, spacing, radius, letter spacing
 *   - styles/themes/alpha.css         semantic colours (:root light, .dark dark), type scale
 *   - styles/motion.css               easing + duration
 *   - shadcn/styles/shadcn.css        the `rounded-*` scale derived from --radius
 *   - styles/fonts/*.ttf              PostScript names (read from the font files)
 */
import fs from 'node:fs'
import path from 'node:path'
import {
  camelCase,
  declsAt,
  parseBlocks,
  parseColor,
  resolveColor,
  resolveVars,
  toPx,
} from './css.mjs'
import { readFontNames } from './fonts.mjs'

const repoRoot = path.resolve(import.meta.dirname, '..', '..', '..', '..')

export const SOURCES = {
  figma: path.join(repoRoot, 'packages/datum-ui/src/styles/tokens/figma-tokens.css'),
  alpha: path.join(repoRoot, 'packages/datum-ui/src/styles/themes/alpha.css'),
  motion: path.join(repoRoot, 'packages/datum-ui/src/styles/motion.css'),
  shadcn: path.join(repoRoot, 'packages/shadcn/styles/shadcn.css'),
  fonts: path.join(repoRoot, 'packages/datum-ui/src/styles/fonts'),
}

/** Font faces shipped to native, keyed by the family name apps use. */
export const FONT_FILES = {
  'AllianceNo1-Regular': 'AllianceNo1-Regular.ttf',
  'AllianceNo1-Medium': 'AllianceNo1-Medium.ttf',
  'AllianceNo1-SemiBold': 'AllianceNo1-SemiBold.ttf',
  'CanelaText-Regular': 'CanelaText-Regular.ttf',
}

const TYPE_STEPS = ['5xs', '4xs', '3xs', '2xs', 'xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl', '7xl', '8xl']

/** Spacing key in Tailwind step units (`4` = 16px), matching web `p-4` etc. */
function spacingKey(px) {
  if (px === 1)
    return 'px'
  return String(px / 4)
}

function read(file) {
  return fs.readFileSync(file, 'utf8')
}

/**
 * Build the semantic colour map for one scheme.
 * @param {Record<string,string>} scope   resolved-variable scope for the scheme
 * @param {string[]} names                custom properties to try, in order
 */
function semanticColors(scope, names) {
  const out = {}
  for (const name of names) {
    let value
    try {
      value = resolveColor(`var(${name})`, scope)
    }
    catch {
      value = null
    }
    if (value !== null)
      out[camelCase(name)] = value
  }
  return out
}

function typeScale(decls) {
  const sizes = {}
  for (const step of TYPE_STEPS) {
    const fontSize = toPx(decls[`--text-${step}`] ?? '')
    const lineHeight = toPx(decls[`--text-${step}--line-height`] ?? '')
    if (fontSize === null || lineHeight === null)
      throw new Error(`Type scale step "${step}" is missing or not a length`)
    sizes[step] = { fontSize, lineHeight }
  }
  return sizes
}

function cubicBezier(value) {
  const m = /^cubic-bezier\(([^)]*)\)$/.exec(value.trim())
  if (!m)
    throw new Error(`Expected cubic-bezier(), got ${value}`)
  return m[1].split(',').map(n => Number.parseFloat(n))
}

function ms(value) {
  const m = /^(\d+(?:\.\d+)?|\.\d+)(ms|s)$/.exec(value.trim())
  if (!m)
    throw new Error(`Expected a duration, got ${value}`)
  return m[2] === 's' ? Number.parseFloat(m[1]) * 1000 : Number.parseFloat(m[1])
}

/**
 * @param {Partial<typeof SOURCES>} [overrides] alternate source paths (tests)
 */
export function buildTokens(overrides = {}) {
  const src = { ...SOURCES, ...overrides }
  const figma = parseBlocks(read(src.figma))
  const alpha = parseBlocks(read(src.alpha))
  const motionCss = parseBlocks(read(src.motion))
  const shadcn = parseBlocks(read(src.shadcn))

  const figmaRoot = declsAt(figma, [':root'])
  const figmaTheme = declsAt(figma, ['@theme'])
  const alphaRoot = declsAt(alpha, [':root'])
  const alphaDark = declsAt(alpha, ['.dark'])

  // ---- palette: the Figma colour collection -------------------------------
  const paletteScope = { ...figmaRoot, ...figmaTheme }
  const palette = {}
  for (const name of Object.keys(figmaTheme)) {
    const color = parseColor(resolveVars(figmaTheme[name], paletteScope))
    if (color)
      palette[camelCase(name)] = resolveColor(figmaTheme[name], paletteScope)
  }

  // ---- semantic colours -----------------------------------------------------
  const lightScope = { ...figmaRoot, ...figmaTheme, ...alphaRoot }
  const darkScope = { ...lightScope, ...alphaDark }
  const names = [...new Set([...Object.keys(alphaRoot), ...Object.keys(alphaDark)])]
  const light = semanticColors(lightScope, names)
  const dark = semanticColors(darkScope, names)
  // Only keep keys both schemes define, so `SemanticColors` is one shape.
  const shared = Object.keys(light).filter(k => k in dark)
  const dropped = [...Object.keys(light), ...Object.keys(dark)].filter(k => !shared.includes(k))
  const pick = obj => Object.fromEntries(shared.map(k => [k, obj[k]]))

  // ---- spacing / radius ----------------------------------------------------
  const spacing = {}
  for (const [name, value] of Object.entries(figmaRoot)) {
    if (!/^--spacing-scale-\d+px$/.test(name))
      continue
    const px = toPx(value)
    spacing[spacingKey(px)] = px
  }

  const radius = {}
  for (const [name, value] of Object.entries(figmaRoot)) {
    const m = /^--radius-([a-z]+)$/.exec(name)
    if (m)
      radius[m[1]] = toPx(value)
  }

  // `rounded-*` as datum-ui actually renders it: shadcn derives the scale from
  // --radius, and alpha.css points --radius at the Figma md radius.
  const radiusBase = toPx(resolveVars('var(--radius)', lightScope))
  const shadcnTheme = shadcn
    .filter(b => b.path.some(p => p.startsWith('@theme')))
    .reduce((acc, b) => Object.assign(acc, b.decls), {})
  const radiusScale = {}
  for (const step of ['sm', 'md', 'lg', 'xl']) {
    const expr = shadcnTheme[`--radius-${step}`]
    if (!expr)
      throw new Error(`shadcn.css is missing --radius-${step}`)
    radiusScale[step] = toPx(resolveVars(expr, { '--radius': `${radiusBase}px` }))
  }
  radiusScale.full = 9999

  // ---- typography ----------------------------------------------------------
  const typeTheme = declsAt(alpha, ['@theme'])
  const tabletOverrides = declsAt(alpha, ['@media (width < 64rem)', ':root'])
  const mobileOverrides = declsAt(alpha, ['@media (width < 48rem)', ':root'])
  const desktop = typeScale(typeTheme)
  const tablet = typeScale({ ...typeTheme, ...tabletOverrides })
  const mobile = typeScale({ ...typeTheme, ...tabletOverrides, ...mobileOverrides })

  const letterSpacing = {}
  for (const [name, value] of Object.entries(figmaRoot)) {
    const m = /^--letter-spacing-([a-z]+)$/.exec(name)
    if (m)
      letterSpacing[m[1]] = toPx(value)
  }

  // ---- fonts ---------------------------------------------------------------
  const fontPostScriptNames = {}
  for (const [family, file] of Object.entries(FONT_FILES)) {
    const names = readFontNames(fs.readFileSync(path.join(src.fonts, file)))
    if (!names.postScriptName)
      throw new Error(`${file} has no PostScript name`)
    fontPostScriptNames[family] = names.postScriptName
  }

  // ---- motion --------------------------------------------------------------
  const motionTheme = declsAt(motionCss, ['@theme'])
  const easing = {}
  const duration = {}
  for (const [name, value] of Object.entries(motionTheme)) {
    const e = /^--ease-(.+)$/.exec(name)
    const d = /^--duration-(.+)$/.exec(name)
    if (e)
      easing[camelCase(e[1])] = cubicBezier(value)
    else if (d)
      duration[camelCase(d[1])] = ms(value)
  }

  return {
    palette,
    colors: { light: pick(light), dark: pick(dark) },
    dropped: [...new Set(dropped)],
    spacing,
    radius,
    radiusScale,
    typography: {
      sizes: mobile,
      sizesByBreakpoint: { desktop, tablet, mobile },
      letterSpacing,
      weights: { regular: '400', medium: '500', semibold: '600' },
    },
    fonts: {
      sans: {
        regular: 'AllianceNo1-Regular',
        medium: 'AllianceNo1-Medium',
        semibold: 'AllianceNo1-SemiBold',
      },
      title: 'CanelaText-Regular',
      mono: 'Menlo',
    },
    fontFiles: FONT_FILES,
    fontPostScriptNames,
    motion: { easing, duration },
  }
}
