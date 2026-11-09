/**
 * Shared look for every input-like trigger: Select, Autocomplete, MultiSelect
 * and the date/time pickers. They sit next to each other in toolbars and
 * filter rows, so they must line up with `Input` and with each other:
 *
 * - 12px (`px-3`) inline padding, the same as `Input`
 * - `text-sm`, regular weight for both the value and the placeholder
 * - 8px (`gap-2`) between the leading icon, the value and trailing icons
 * - trailing chevrons are 16px and muted, with no extra margin, so the
 *   chevron sits 12px from the right edge on every trigger
 * - clear (X) icons are 14px: lucide's X fills more of its box than the
 *   chevron, so at 16px it looks heavier than the chevron beside it
 *
 * Internal: not part of the public `utils` entry.
 */

/** Box, type and focus styles. Height is left to each component. */
export const fieldTriggerClassName = [
  'flex w-full items-center gap-2 rounded-lg border px-3 text-left text-sm font-normal',
  'border-input-border bg-input-background/50 text-input-foreground shadow-none',
  'transition-[color,background-color,border-color,box-shadow] outline-none',
  'focus-visible:border-input-focus-border focus-visible:shadow-(--input-focus-shadow)',
  'focus-visible:ring-0 focus-visible:ring-offset-0',
  'aria-invalid:border-destructive',
  'disabled:cursor-not-allowed disabled:opacity-50',
].join(' ')

/** Placeholder text inside a trigger. Same colour as `Input`'s placeholder. */
export const fieldPlaceholderClassName = 'text-input-placeholder'

/** Leading icons and the trailing chevron. Clear icons use `size-3.5`. */
export const fieldIconClassName = 'text-muted-foreground size-4 shrink-0'
