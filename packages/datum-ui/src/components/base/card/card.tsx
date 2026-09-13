import type { VariantProps } from 'class-variance-authority'
import { CardDescription, CardTitle } from '@repo/shadcn/ui/card'
import { cva } from 'class-variance-authority'
import * as React from 'react'
import { cn } from '../../../utils/cn'

/**
 * Datum Card
 *
 * Extends the shadcn Card with layout variants so consumers can build dense
 * dashboard tiles, sectioned settings cards, and flush lists/tables without
 * fighting the default padding with className overrides.
 *
 * Spacing model
 * -------------
 * The root publishes two CSS variables that every slot reads:
 *
 *   --card-px  horizontal inset shared by header, content, and footer
 *   --card-py  vertical inset used by header/footer/content in sectioned cards
 *
 * Both are equal for a given `size` (1rem for `sm`, 1.5rem for `md`), so the
 * card frame is uniform. `CardHeader size` is a separate density scale
 * (`sm` | `md` | `lg`) for title/description gap and sectioned min-height —
 * it does not change `--card-px` / `--card-py`.
 *
 * Consumers building their own rows inside a flush `CardContent` can use
 * `px-(--card-px)` to line up with the card chrome regardless of `size`.
 *
 * Layouts
 * -------
 * - Stacked (default): the root carries vertical padding and a gap between
 *   slots; slots only carry horizontal padding. This is the historical
 *   behaviour and the default visuals are unchanged.
 * - Sectioned (`sectioned`): the root carries no padding or gap; each slot
 *   owns its own vertical inset and slots are separated by dividers
 *   (`CardHeader bordered`, `CardFooter bordered`). Use for headers that sit
 *   above flush lists/tables, and for settings cards with a sticky footer.
 */

const cardVariants = cva(
  'group/card bg-card text-card-foreground border-card-border flex flex-col rounded-xl border',
  {
    variants: {
      size: {
        // Insets are equal on both axes so slot padding reads as a uniform
        // frame around the content rather than a letterboxed one.
        sm: '[--card-px:1rem] [--card-py:1rem]',
        md: '[--card-px:1.5rem] [--card-py:1.5rem]',
      },
      sectioned: {
        true: 'gap-0 py-0',
        false: '',
      },
    },
    compoundVariants: [
      { size: 'sm', sectioned: false, className: 'gap-3 py-4' },
      { size: 'md', sectioned: false, className: 'gap-4 py-6' },
    ],
    defaultVariants: {
      size: 'md',
      sectioned: false,
    },
  },
)

export interface CardProps extends React.ComponentProps<'div'>, VariantProps<typeof cardVariants> {}

function Card({ className, size, sectioned, ...props }: CardProps) {
  return (
    <div
      data-slot="card"
      data-size={size ?? 'md'}
      data-layout={sectioned ? 'sectioned' : 'stacked'}
      className={cn(cardVariants({ size, sectioned }), className)}
      {...props}
    />
  )
}

const cardHeaderVariants = cva(
  // Grid rather than flex so a trailing `CardAction` can sit in a second
  // column spanning title + description without wrapping the header in
  // a flex row at every call site.
  //
  // Alignment: a title-only header centres the title against the action
  // (and within `min-h` in sectioned cards, hence `content-center`). Once a
  // description is present the pair top-aligns with the action instead.
  '@container/card-header group/card-header border-card-border grid auto-rows-min grid-rows-[auto_auto] content-center items-center px-(--card-px) has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:items-start',
  {
    variants: {
      /**
       * Header density (not the card's inset `size`). Controls the gap
       * between title and description and, in sectioned cards, the header's
       * minimum height (`lg` also grows the vertical inset). Stacked cards
       * take their vertical spacing from the root.
       */
      // The title/description gap is only applied when a description exists;
      // grid gaps otherwise still separate the empty second row and add
      // phantom height under title-only headers.
      size: {
        sm: 'has-data-[slot=card-description]:gap-1 group-data-[layout=sectioned]/card:min-h-12 group-data-[layout=sectioned]/card:py-(--card-py)',
        md: 'has-data-[slot=card-description]:gap-3 group-data-[layout=sectioned]/card:min-h-14 group-data-[layout=sectioned]/card:py-(--card-py)',
        lg: 'has-data-[slot=card-description]:gap-3 group-data-[layout=sectioned]/card:min-h-16 group-data-[layout=sectioned]/card:py-[calc(var(--card-py)*1.25)]',
      },
      /** Draw a divider under the header. Pairs with `sectioned` cards. */
      bordered: {
        true: 'border-b',
        false: '',
      },
    },
    defaultVariants: {
      size: 'md',
      bordered: false,
    },
  },
)

export interface CardHeaderProps
  extends React.ComponentProps<'div'>, VariantProps<typeof cardHeaderVariants> {}

function CardHeader({ className, size, bordered, ...props }: CardHeaderProps) {
  return (
    <div
      data-slot="card-header"
      className={cn(cardHeaderVariants({ size, bordered }), className)}
      {...props}
    />
  )
}

/**
 * Trailing header action (button, link, badge). Renders in the header's
 * second grid column. With a description it spans both rows and top-aligns;
 * title-only it shares the title's row and centres against it.
 */
function CardAction({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-action"
      // Flex (not block) so inline children don't sit on a baseline line box
      // taller than themselves and inflate the header. Spanning only the
      // title row when there is no description keeps the grid from handing
      // half the action's height to the empty second row. `row-end-3` rather
      // than `row-span-2`: the span shorthand sets grid-row-start too and
      // would clobber `row-start-1` when emitted under a variant.
      className={cn(
        'col-start-2 row-start-1 flex items-center gap-2 self-center justify-self-end',
        'group-has-data-[slot=card-description]/card-header:row-end-3 group-has-data-[slot=card-description]/card-header:self-start',
        className,
      )}
      {...props}
    />
  )
}

/**
 * Shared by CardContent and CardFooter.
 * - `default`: inset to match the card chrome.
 * - `x-none`: no horizontal inset — rows, tables, and dividers run to the
 *   card edge while the header stays inset.
 * - `none`: no inset at all.
 */
const cardPadding = {
  'default': 'px-(--card-px) group-data-[layout=sectioned]/card:py-(--card-py)',
  'x-none': 'px-0 group-data-[layout=sectioned]/card:py-(--card-py)',
  'none': 'p-0',
} as const

const cardContentVariants = cva('', {
  variants: {
    padding: cardPadding,
  },
  defaultVariants: {
    padding: 'default',
  },
})

export interface CardContentProps
  extends React.ComponentProps<'div'>, VariantProps<typeof cardContentVariants> {}

function CardContent({ className, padding, ...props }: CardContentProps) {
  return (
    <div
      data-slot="card-content"
      className={cn(cardContentVariants({ padding }), className)}
      {...props}
    />
  )
}

const cardFooterVariants = cva('border-card-border', {
  variants: {
    padding: cardPadding,
    /** Draw a divider above the footer. Pairs with `sectioned` cards. */
    bordered: {
      true: 'border-t',
      false: '',
    },
  },
  defaultVariants: {
    padding: 'default',
    bordered: false,
  },
})

export interface CardFooterProps
  extends React.ComponentProps<'div'>, VariantProps<typeof cardFooterVariants> {}

function CardFooter({ className, padding, bordered, ...props }: CardFooterProps) {
  return (
    <div
      data-slot="card-footer"
      className={cn(cardFooterVariants({ padding, bordered }), className)}
      {...props}
    />
  )
}

/**
 * Label | value definition row for sectioned settings cards.
 *
 * Two equal columns from `sm` up (stacked below), so labels, values, inline
 * inputs, and status chips share the same midline down a card and across
 * neighbouring cards. Both columns are `minmax(0, 1fr)` so long mono values
 * can truncate instead of pushing the value column out. Pair with
 * `CardContent padding="none"`: the row insets itself with `mx-(--card-px)`
 * (not padding) so the divider between rows runs only as wide as the content,
 * while the card header's own divider still spans the full card.
 * Compose a help control inside `CardFieldLabel`; keep Tooltip/icons in the
 * consumer, not here.
 */
function CardField({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-field"
      className={cn(
        'border-card-border mx-(--card-px) grid grid-cols-1 items-start gap-1 border-b py-3.5 last:border-b-0 sm:grid-cols-2 sm:items-center sm:gap-x-6',
        className,
      )}
      {...props}
    />
  )
}

function CardFieldLabel({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-field-label"
      className={cn('flex min-w-0 items-center gap-1.5 text-sm font-medium', className)}
      {...props}
    />
  )
}

function CardFieldValue({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-field-value"
      className={cn('min-w-0 text-sm', className)}
      {...props}
    />
  )
}

export { CardDescription, CardTitle }
export { Card, CardAction, CardContent, CardField, CardFieldLabel, CardFieldValue, CardFooter, CardHeader }
