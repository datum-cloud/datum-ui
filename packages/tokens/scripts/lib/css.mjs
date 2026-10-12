/**
 * Minimal CSS reader for the datum-ui token sheets.
 *
 * It understands exactly what the token files use: nested blocks
 * (`@media`, `@layer`, `@theme`, selectors), custom-property declarations,
 * `var()` with fallbacks, `calc()` on px/rem lengths, and every colour syntax
 * the sheets contain (hex, rgb[a], hsl[a], oklch, named colours,
 * `color-mix()`). Anything else is ignored rather than guessed at.
 */
import { converter, formatHex, parse, toGamut } from 'culori'

const REM_PX = 16

/** Strip `/* ... *\/` comments. */
export function stripComments(css) {
  return css.replace(/\/\*[\s\S]*?\*\//g, '')
}

/**
 * Parse a stylesheet into a flat list of blocks. Each block carries the
 * chain of enclosing preludes (`['@media (width < 48rem)', ':root']`) and
 * the custom properties declared directly inside it, in source order.
 *
 * @param {string} css
 * @returns {{ path: string[], decls: Record<string, string> }[]} blocks in source order
 */
export function parseBlocks(css) {
  const src = stripComments(css)
  const blocks = []

  function walk(start, path) {
    let i = start
    let buf = ''
    const decls = {}
    let depthParen = 0

    const flushDecl = () => {
      const text = buf.trim()
      buf = ''
      const m = /^(--[\w-]+)\s*:([\s\S]*)$/.exec(text)
      if (m)
        decls[m[1]] = m[2].trim().replace(/\s+/g, ' ')
    }

    while (i < src.length) {
      const ch = src[i]
      if (ch === '(') {
        depthParen++
        buf += ch
      }
      else if (ch === ')') {
        depthParen--
        buf += ch
      }
      else if (ch === ';' && depthParen === 0) {
        flushDecl()
      }
      else if (ch === '{' && depthParen === 0) {
        const prelude = buf.trim().replace(/\s+/g, ' ')
        buf = ''
        i = walk(i + 1, [...path, prelude])
        continue
      }
      else if (ch === '}' && depthParen === 0) {
        flushDecl()
        if (Object.keys(decls).length > 0)
          blocks.push({ path, decls })
        return i + 1
      }
      else {
        buf += ch
      }
      i++
    }
    flushDecl()
    if (Object.keys(decls).length > 0)
      blocks.push({ path, decls })
    return i
  }

  walk(0, [])
  return blocks
}

/** Find the declarations of every block whose path equals `path` exactly, merged in order. */
export function declsAt(blocks, path) {
  const out = {}
  for (const b of blocks) {
    if (b.path.length === path.length && b.path.every((p, i) => p === path[i]))
      Object.assign(out, b.decls)
  }
  return out
}

/**
 * Split on a separator at parenthesis depth 0.
 * @param {string} text
 * @param {string} sep single character
 */
export function splitTopLevel(text, sep) {
  const parts = []
  let depth = 0
  let cur = ''
  for (const ch of text) {
    if (ch === '(')
      depth++
    else if (ch === ')')
      depth--
    if (ch === sep && depth === 0) {
      parts.push(cur)
      cur = ''
    }
    else {
      cur += ch
    }
  }
  parts.push(cur)
  return parts.map(p => p.trim()).filter(p => p.length > 0)
}

/**
 * Substitute every `var(--name[, fallback])` in `value` from `scope`,
 * recursively. Throws on cycles and on undefined variables without a
 * fallback, so a typo in the CSS fails generation instead of emitting junk.
 *
 * @param {string} value
 * @param {Record<string, string>} scope
 * @param {string[]} [stack] variables currently being resolved (cycle guard)
 */
export function resolveVars(value, scope, stack = []) {
  let out = ''
  let i = 0
  while (i < value.length) {
    const idx = value.indexOf('var(', i)
    if (idx === -1) {
      out += value.slice(i)
      break
    }
    out += value.slice(i, idx)
    // find the matching close paren
    let depth = 0
    let j = idx + 3
    for (; j < value.length; j++) {
      if (value[j] === '(') {
        depth++
      }
      else if (value[j] === ')') {
        depth--
        if (depth === 0)
          break
      }
    }
    const inner = value.slice(idx + 4, j)
    const comma = splitTopLevel(inner, ',')
    const name = comma[0]
    const fallback = comma.length > 1 ? inner.slice(inner.indexOf(',') + 1).trim() : undefined
    if (stack.includes(name))
      throw new Error(`Cyclic var() reference: ${[...stack, name].join(' -> ')}`)
    let replacement
    if (Object.hasOwn(scope, name))
      replacement = resolveVars(scope[name], scope, [...stack, name])
    else if (fallback !== undefined)
      replacement = resolveVars(fallback, scope, stack)
    else
      throw new Error(`Undefined CSS variable ${name}${stack.length ? ` (via ${stack.join(' -> ')})` : ''}`)
    out += replacement
    i = j + 1
  }
  return out
}

function round(n, places = 3) {
  const f = 10 ** places
  const r = Math.round(n * f) / f
  return Object.is(r, -0) ? 0 : r
}

/**
 * Convert a resolved length to unitless px. Supports `px`, `rem`, bare `0`,
 * and `calc()` built from `+`/`-` of those. Returns `null` for anything else.
 * @param {string} value
 */
export function toPx(value) {
  const v = value.trim()
  const calc = /^calc\(([\s\S]*)\)$/.exec(v)
  if (calc) {
    // Only `a + b - c` sums of lengths; operators must be space-delimited per CSS.
    const tokens = calc[1].trim().split(/\s+([+-])\s+/)
    let total = toPx(tokens[0])
    if (total === null)
      return null
    for (let k = 1; k < tokens.length; k += 2) {
      const rhs = toPx(tokens[k + 1])
      if (rhs === null)
        return null
      total = tokens[k] === '+' ? total + rhs : total - rhs
    }
    return round(total)
  }
  const m = /^(-?(?:\d+(?:\.\d+)?|\.\d+))(px|rem)?$/.exec(v)
  if (!m)
    return null
  const n = Number.parseFloat(m[1])
  if (m[2] === 'rem')
    return round(n * REM_PX)
  if (m[2] === 'px' || n === 0)
    return round(n)
  return null
}

/** CSS `color-mix()` interpolation spaces -> culori modes. */
const MIX_MODES = {
  'srgb': 'rgb',
  'srgb-linear': 'lrgb',
  'display-p3': 'p3',
  'oklch': 'oklch',
  'oklab': 'oklab',
  'lch': 'lch',
  'lab': 'lab',
  'hsl': 'hsl',
  'hwb': 'hwb',
  'xyz': 'xyz65',
  'xyz-d65': 'xyz65',
  'xyz-d50': 'xyz50',
}

const CHANNELS = {
  rgb: ['r', 'g', 'b'],
  lrgb: ['r', 'g', 'b'],
  p3: ['r', 'g', 'b'],
  oklch: ['l', 'c', 'h'],
  oklab: ['l', 'a', 'b'],
  lch: ['l', 'c', 'h'],
  lab: ['l', 'a', 'b'],
  hsl: ['h', 's', 'l'],
  hwb: ['h', 'w', 'b'],
  xyz65: ['x', 'y', 'z'],
  xyz50: ['x', 'y', 'z'],
}

/** Split `"<color> <pct>?"` / `"<pct> <color>"` into its parts. */
function parseMixArg(arg) {
  const parts = splitTopLevel(arg, ' ')
  let pct = null
  const rest = []
  for (const p of parts) {
    const m = /^(\d+(?:\.\d+)?|\.\d+)%$/.exec(p)
    if (m && pct === null)
      pct = Number.parseFloat(m[1]) / 100
    else
      rest.push(p)
  }
  return { color: rest.join(' '), pct }
}

/**
 * CSS Color 5 `color-mix()`: percentage normalisation, premultiplied alpha,
 * shorter-arc hue interpolation, and "missing" (achromatic) hue carried from
 * the other colour.
 */
export function mixColors(space, c1, p1, c2, p2) {
  const mode = MIX_MODES[space]
  if (!mode)
    throw new Error(`Unsupported color-mix() space: ${space}`)

  if (p1 === null && p2 === null) {
    p1 = 0.5
    p2 = 0.5
  }
  else if (p1 === null) {
    p1 = 1 - p2
  }
  else if (p2 === null) {
    p2 = 1 - p1
  }
  const sum = p1 + p2
  if (sum <= 0)
    throw new Error('color-mix() percentages sum to zero')
  const alphaMultiplier = sum < 1 ? sum : 1
  p1 /= sum
  p2 /= sum

  const to = converter(mode)
  const a = to(c1)
  const b = to(c2)
  const aA = a.alpha ?? 1
  const bA = b.alpha ?? 1
  const alpha = aA * p1 + bA * p2
  const out = { mode }

  for (const ch of CHANNELS[mode]) {
    let va = a[ch]
    let vb = b[ch]
    if (va === undefined && vb === undefined)
      continue
    if (va === undefined)
      va = vb
    if (vb === undefined)
      vb = va
    if (ch === 'h') {
      const d = vb - va
      if (d > 180)
        va += 360
      else if (d < -180)
        vb += 360
      out.h = (((va * p1 + vb * p2) % 360) + 360) % 360
    }
    else {
      out[ch] = alpha === 0 ? 0 : (va * aA * p1 + vb * bA * p2) / alpha
    }
  }
  out.alpha = alpha * alphaMultiplier
  return out
}

/**
 * Parse a fully var()-resolved CSS colour value into a culori colour.
 * Returns `null` when the value is not a colour (lengths, shadows, font stacks).
 * @param {string} value
 */
export function parseColor(value) {
  const v = value.trim()
  const mix = /^color-mix\(([\s\S]*)\)$/i.exec(v)
  if (mix) {
    const args = splitTopLevel(mix[1], ',')
    if (args.length !== 3)
      throw new Error(`Malformed color-mix(): ${v}`)
    const space = /^in\s+([\w-]+)/i.exec(args[0])?.[1]?.toLowerCase()
    if (!space)
      throw new Error(`color-mix() missing interpolation space: ${v}`)
    const a = parseMixArg(args[1])
    const b = parseMixArg(args[2])
    const ca = parseColor(a.color)
    const cb = parseColor(b.color)
    if (!ca || !cb)
      throw new Error(`color-mix() argument is not a colour: ${v}`)
    return mixColors(space, ca, a.pct, cb, b.pct)
  }
  // culori accepts some non-colour strings (e.g. a bare number) — only feed it
  // things that look like a colour.
  if (!/^(?:#[\da-f]{3,8}|(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch|color)\(.*\)|[a-z]+)$/i.test(v))
    return null
  const parsed = parse(v)
  return parsed ?? null
}

const gamutMap = toGamut('rgb', 'oklch')

/**
 * Format a culori colour for React Native / canvas consumers:
 * opaque -> `#rrggbb`, translucent -> `rgba(r, g, b, a)`.
 * Out-of-gamut colours are gamut-mapped in OKLCH (CSS Color 4 algorithm).
 */
export function formatColor(color) {
  const rgb = gamutMap(color)
  const alpha = color.alpha ?? 1
  if (alpha >= 0.9995)
    return formatHex(rgb)
  const ch = n => Math.round(Math.min(1, Math.max(0, n ?? 0)) * 255)
  return `rgba(${ch(rgb.r)}, ${ch(rgb.g)}, ${ch(rgb.b)}, ${round(alpha, 3)})`
}

/** Resolve a CSS value to an RN colour string, or `null` if it is not a colour. */
export function resolveColor(value, scope) {
  const resolved = resolveVars(value, scope)
  const color = parseColor(resolved)
  return color ? formatColor(color) : null
}

/** `--app-dark-utility-1` / `app-dark-utility-1` -> `appDarkUtility1` */
export function camelCase(name) {
  return name
    .replace(/^--/, '')
    .replace(/-+([a-z\d])/gi, (_, c) => c.toUpperCase())
}
