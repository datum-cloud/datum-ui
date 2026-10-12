/**
 * Variant unions shared with the web components (`@datum-cloud/datum-ui`).
 * `test/type-parity.ts` fails typecheck if these drift from the web cva
 * variants.
 */

export const BUTTON_TYPES = ['primary', 'secondary', 'tertiary', 'quaternary', 'warning', 'danger', 'success'] as const
export const BUTTON_THEMES = ['solid', 'light', 'outline', 'borderless', 'link'] as const
export const BUTTON_SIZES = ['xs', 'small', 'default', 'large', 'icon', 'link'] as const

export type ButtonType = (typeof BUTTON_TYPES)[number]
export type ButtonTheme = (typeof BUTTON_THEMES)[number]
export type ButtonSize = (typeof BUTTON_SIZES)[number]

export const BADGE_TYPES = ['primary', 'secondary', 'tertiary', 'quaternary', 'info', 'warning', 'danger', 'success', 'muted'] as const
export const BADGE_THEMES = ['solid', 'outline', 'light'] as const

export type BadgeType = (typeof BADGE_TYPES)[number]
export type BadgeTheme = (typeof BADGE_THEMES)[number]

export const ALERT_TYPES = ['default', 'secondary', 'outline', 'destructive', 'success', 'info', 'warning'] as const
export type AlertType = (typeof ALERT_TYPES)[number]
