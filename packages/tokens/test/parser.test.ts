import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { buildTokens, SOURCES } from '../scripts/lib/build.mjs'
import {
  camelCase,
  declsAt,
  formatColor,
  parseBlocks,
  parseColor,
  resolveColor,
  resolveVars,
  toPx,
} from '../scripts/lib/css.mjs'
import { serializeTokens } from '../scripts/lib/serialize.mjs'
import { parseRgba, withAlpha } from '../src/color'
import { colors } from '../src/tokens.gen'

const color = (css: string, scope: Record<string, string> = {}) => resolveColor(css, scope)

describe('parseBlocks', () => {
  it('collects custom properties per block path, ignoring comments and non-custom props', () => {
    const blocks = parseBlocks(`
      /* comment { with braces } */
      :root { --a: 1px; color: red; --b: hsl(0 0% 100%); }
      .dark { --a: 2px }
      @media (width < 48rem) { :root { --c: 3px; } }
      html, body { @apply font-sans; }
    `)
    expect(declsAt(blocks, [':root'])).toEqual({ '--a': '1px', '--b': 'hsl(0 0% 100%)' })
    expect(declsAt(blocks, ['.dark'])).toEqual({ '--a': '2px' })
    expect(declsAt(blocks, ['@media (width < 48rem)', ':root'])).toEqual({ '--c': '3px' })
  })

  it('keeps semicolons inside parentheses as part of the value', () => {
    const blocks = parseBlocks(':root { --x: url(data:a;b); --y: 1px; }')
    expect(declsAt(blocks, [':root'])).toEqual({ '--x': 'url(data:a;b)', '--y': '1px' })
  })
})

describe('resolveVars', () => {
  it('follows var() chains', () => {
    const scope = { '--a': 'var(--b)', '--b': 'var(--c)', '--c': '#fff' }
    expect(resolveVars('var(--a)', scope)).toBe('#fff')
  })

  it('uses fallbacks for undefined variables, including nested var() fallbacks', () => {
    expect(resolveVars('var(--missing, red)', {})).toBe('red')
    expect(resolveVars('var(--missing, var(--b))', { '--b': 'blue' })).toBe('blue')
  })

  it('substitutes inside larger expressions', () => {
    const scope = { '--x': 'oklch(0.5 0.1 120)' }
    expect(resolveVars('color-mix(in srgb, var(--x) 80%, black 20%)', scope)).toBe(
      'color-mix(in srgb, oklch(0.5 0.1 120) 80%, black 20%)',
    )
  })

  it('throws on undefined variables and on cycles', () => {
    expect(() => resolveVars('var(--nope)', {})).toThrow(/Undefined CSS variable --nope/)
    expect(() => resolveVars('var(--a)', { '--a': 'var(--b)', '--b': 'var(--a)' })).toThrow(/Cyclic/)
  })
})

describe('colour conversion', () => {
  it('passes hex through, lower-cased and expanded', () => {
    expect(color('#16A34A')).toBe('#16a34a')
    expect(color('#fff')).toBe('#ffffff')
  })

  it('converts hsl() in both syntaxes', () => {
    expect(color('hsl(0 0% 100%)')).toBe('#ffffff')
    expect(color('hsl(240 10% 3.9%)')).toBe('#09090b')
    expect(color('hsl(34, 100%, 50%)')).toBe('#ff9100')
  })

  it('converts oklch() to sRGB hex', () => {
    // --midnight-fjord: the brand navy, documented as #0c1d31
    expect(color('oklch(0.228 0.045 253.7)')).toBe('#0c1d31')
    expect(color('oklch(1 0 0)')).toBe('#ffffff')
    expect(color('oklch(0 0 0)')).toBe('#000000')
  })

  it('emits rgba() for translucent colours', () => {
    expect(color('rgba(236, 235, 231, 0.6)')).toBe('rgba(236, 235, 231, 0.6)')
    expect(color('#f4f9f53f')).toBe('rgba(244, 249, 245, 0.247)')
  })

  it('gamut-maps out-of-sRGB oklch instead of producing invalid channels', () => {
    const out = color('oklch(0.7 0.4 140)')
    expect(out).toMatch(/^#[\da-f]{6}$/)
  })

  it('returns null for values that are not colours', () => {
    expect(parseColor('0px 0px 0px 3px rgba(0, 0, 0, 0.1)')).toBeNull()
    expect(parseColor('0.375rem')).toBeNull()
    expect(parseColor('\'Alliance No1\', sans-serif')).toBeNull()
  })
})

describe('color-mix()', () => {
  it('mixes in srgb with explicit percentages', () => {
    // 80% white + 20% black = 0.8 * 255 = 204
    expect(color('color-mix(in srgb, white 80%, black 20%)')).toBe('#cccccc')
  })

  it('defaults missing percentages per CSS Color 5', () => {
    expect(color('color-mix(in srgb, white, black)')).toBe('#808080')
    expect(color('color-mix(in srgb, white 25%, black)')).toBe('#404040')
  })

  it('premultiplies alpha so mixing with transparent keeps the hue and fades it', () => {
    expect(color('color-mix(in oklch, #0c1d31 60%, transparent)')).toBe('rgba(12, 29, 49, 0.6)')
  })

  it('scales alpha when percentages sum below 100%', () => {
    expect(color('color-mix(in srgb, white 30%, black 20%)')).toBe('rgba(153, 153, 153, 0.5)')
  })

  it('resolves var() arguments and nested mixes', () => {
    const scope = {
      '--base': '#d25b5b',
      '--hover': 'color-mix(in srgb, var(--base) 80%, black 20%)',
      '--active': 'color-mix(in srgb, var(--hover) 80%, black 20%)',
    }
    expect(color('var(--hover)', scope)).toBe('#a84949')
    expect(color('var(--active)', scope)).toBe('#863a3a')
  })
})

describe('lengths', () => {
  it('converts rem/px/calc to unitless px', () => {
    expect(toPx('0.1875rem')).toBe(3)
    expect(toPx('9px')).toBe(9)
    expect(toPx('0')).toBe(0)
    expect(toPx('calc(6px - 4px)')).toBe(2)
    expect(toPx('calc(0.375rem + 4px)')).toBe(10)
    expect(toPx('auto')).toBeNull()
  })
})

describe('helpers', () => {
  it('camelCases custom property names', () => {
    expect(camelCase('--app-dark-utility-1')).toBe('appDarkUtility1')
    expect(camelCase('--btn-neutral-bg-hover')).toBe('btnNeutralBgHover')
    expect(camelCase('--chart-1')).toBe('chart1')
  })

  it('formats culori colours', () => {
    expect(formatColor({ mode: 'rgb', r: 1, g: 0, b: 0 })).toBe('#ff0000')
    expect(formatColor({ mode: 'rgb', r: 1, g: 0, b: 0, alpha: 0.5 })).toBe('rgba(255, 0, 0, 0.5)')
  })

  it('withAlpha multiplies alpha on hex and rgba token values', () => {
    expect(withAlpha('#0c1d31', 0.2)).toBe('rgba(12, 29, 49, 0.2)')
    expect(withAlpha('rgba(236, 235, 231, 0.6)', 0.5)).toBe('rgba(236, 235, 231, 0.3)')
    expect(parseRgba('#ffffff80')).toEqual([255, 255, 255, 0.502])
    expect(parseRgba('not-a-colour')).toBeNull()
  })
})

describe('buildTokens (real datum-ui sources)', () => {
  const tokens = buildTokens()

  it('produces the brand palette', () => {
    expect(tokens.palette.midnightFjord).toBe('#0c1d31')
    expect(tokens.palette.auroraMoss).toBe('#e6f59f')
    expect(tokens.palette.canyonClay).toBe('#bf9595')
  })

  it('resolves light and dark semantic colours with identical keys', () => {
    expect(Object.keys(tokens.colors.light)).toEqual(Object.keys(tokens.colors.dark))
    expect(tokens.colors.light.background).toBe(tokens.palette.glacierMist700)
    expect(tokens.colors.dark.background).toBe(tokens.palette.midnightFjord)
    expect(tokens.colors.dark.primary).toBe(tokens.palette.auroraMoss)
    // dark inherits light values it does not override
    expect(tokens.colors.dark.cardWarning).toBe(tokens.colors.light.cardWarning)
  })

  it('maps radius, spacing and the type scale to unitless px', () => {
    expect(tokens.radius).toMatchObject({ sm: 3, md: 6, lg: 9 })
    expect(tokens.radiusScale).toMatchObject({ sm: 2, md: 4, lg: 6, xl: 10 })
    expect(tokens.spacing['4']).toBe(16)
    expect(tokens.spacing.px).toBe(1)
    expect(tokens.typography.sizes.sm).toEqual({ fontSize: 14, lineHeight: 20 })
    expect(tokens.typography.sizesByBreakpoint.desktop['4xl']).toEqual({ fontSize: 36, lineHeight: 40 })
  })

  it('reads motion tokens from motion.css', () => {
    expect(tokens.motion.easing.out).toEqual([0.23, 1, 0.32, 1])
    expect(tokens.motion.duration.fast).toBe(150)
  })

  it('matches the committed src/tokens.gen.ts (run gen:tokens if this fails)', () => {
    const committed = fs.readFileSync(path.join(import.meta.dirname, '../src/tokens.gen.ts'), 'utf8')
    expect(serializeTokens(tokens)).toBe(committed)
    expect(colors.light.background).toBe(tokens.colors.light.background)
  })

  it('detects drift when a CSS variable changes', () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'tokens-'))
    const alpha = path.join(dir, 'alpha.css')
    fs.writeFileSync(
      alpha,
      fs.readFileSync(SOURCES.alpha, 'utf8').replace('--success: #16a34a;', '--success: #000000;'),
    )
    const drifted = buildTokens({ alpha })
    expect(drifted.colors.light.success).toBe('#000000')
    expect(serializeTokens(drifted)).not.toBe(serializeTokens(tokens))
  })
})
