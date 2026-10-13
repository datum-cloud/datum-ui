/**
 * Apply an opacity to a token colour — the equivalent of Tailwind's `bg-x/20`.
 *
 * Accepts the two formats the generated tokens use (`#rrggbb` and
 * `rgba(r, g, b, a)`), plus `#rgb` / `#rrggbbaa`. Existing alpha is
 * multiplied, as CSS does for `color-mix(... transparent)` / `/20` on an
 * already-translucent colour.
 */
export function withAlpha(color: string, alpha: number): string {
  const rgba = parseRgba(color)
  if (!rgba)
    return color
  const a = Math.round(Math.min(1, Math.max(0, rgba[3] * alpha)) * 1000) / 1000
  return `rgba(${rgba[0]}, ${rgba[1]}, ${rgba[2]}, ${a})`
}

/** Parse `#rgb`, `#rrggbb`, `#rrggbbaa` or `rgb[a](r, g, b[, a])` into `[r, g, b, a]`. */
export function parseRgba(color: string): [number, number, number, number] | null {
  const c = color.trim()
  if (c.startsWith('#')) {
    let hex = c.slice(1)
    if (hex.length === 3 || hex.length === 4)
      hex = [...hex].map(ch => ch + ch).join('')
    if (hex.length !== 6 && hex.length !== 8)
      return null
    const n = (i: number): number => Number.parseInt(hex.slice(i, i + 2), 16)
    return [n(0), n(2), n(4), hex.length === 8 ? Math.round((n(6) / 255) * 1000) / 1000 : 1]
  }
  const m = /^rgba?\(([^)]+)\)$/i.exec(c)
  if (!m || !m[1])
    return null
  const parts = m[1].split(/[\s,/]+/).filter(Boolean).map(Number)
  if (parts.length < 3 || parts.some(Number.isNaN))
    return null
  return [parts[0]!, parts[1]!, parts[2]!, parts[3] ?? 1]
}
