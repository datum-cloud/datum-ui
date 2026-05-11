/**
 * Slot classes for the Datum logo family.
 *
 * - `base`: applied to the `<svg>` root. Defaults to `block h-auto max-w-full`
 *   so the size is driven by consumer-supplied Tailwind classes
 *   (e.g. `className="h-8 w-auto"` or `size-8` for the icon).
 * - `mark`: applied to the "D" mark `<path>` element(s).
 * - `text`: applied to the wordmark `<path>` element(s).
 *
 * Four tones are exposed:
 * - `brand` (default) — rose mark `#BF9595` + navy text `#0C1D31`.
 * - `mono-light` — lime mark `#E6F59F` + white text, matching
 *   `Logo - flat - light.svg`; the standard treatment on dark surfaces.
 * - `mono-dark` — both slots in the navy brand colour `#0C1D31`, for
 *   monochrome use on light surfaces.
 * - `white` — both slots in `white`, matching `Logo - flat - white - light.svg`;
 *   use over photographic or strongly coloured surfaces where the lime
 *   accent would clash.
 */

export type LogoTone = 'brand' | 'mono-light' | 'mono-dark' | 'white'

export interface LogoSlotClasses {
  base: string
  mark: string
  text: string
}

const BASE = 'block h-auto max-w-full'

const TONES: Record<LogoTone, Pick<LogoSlotClasses, 'mark' | 'text'>> = {
  'brand': {
    mark: 'fill-[#BF9595]',
    text: 'fill-[#0C1D31]',
  },
  'mono-light': {
    mark: 'fill-[#E6F59F]',
    text: 'fill-white',
  },
  'mono-dark': {
    mark: 'fill-[#0C1D31]',
    text: 'fill-[#0C1D31]',
  },
  'white': {
    mark: 'fill-white',
    text: 'fill-white',
  },
}

/** Resolve slot classes for a tone. Defaults to `brand` when `tone` is undefined. */
export function logoStyles(tone: LogoTone = 'brand'): LogoSlotClasses {
  const { mark, text } = TONES[tone]
  return { base: BASE, mark, text }
}
