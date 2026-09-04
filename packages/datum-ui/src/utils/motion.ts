/**
 * Motion tokens — the single source of truth for JS-driven animation
 * (Motion / `motion/react`). Mirrors the CSS motion tokens defined in
 * `@repo/shadcn/styles/shadcn.css` so component motion stays cohesive
 * whether it runs through CSS or Motion.
 *
 * Curves match the CSS `--ease-*` custom properties exactly.
 */

/** Cubic-bezier easing curves as Motion-compatible tuples. */
export const EASE = {
  /** Strong ease-out for entrances/exits. Mirrors `--ease-out`. */
  out: [0.23, 1, 0.32, 1],
  /** Strong ease-in-out for on-screen movement. Mirrors `--ease-in-out`. */
  inOut: [0.77, 0, 0.175, 1],
  /** iOS-style drawer curve. Mirrors `--ease-drawer`. */
  drawer: [0.32, 0.72, 0, 1],
} as const

/** Durations in seconds (Motion expects seconds, not ms). */
export const DURATION = {
  /** 150ms — button press, tooltips, small popovers. */
  fast: 0.15,
  /** 250ms — dropdowns, selects, standard UI. */
  medium: 0.25,
  /** 350ms — drawer/sheet enter. */
  drawerIn: 0.35,
  /** 200ms — drawer/sheet exit (faster than enter). */
  drawerOut: 0.2,
} as const

export type Ease = keyof typeof EASE
export type Duration = keyof typeof DURATION
