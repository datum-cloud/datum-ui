import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'
import { CopyIcon } from 'lucide-react'
import * as React from 'react'
import { cn } from '../../../utils/cn'

// ---------------------------------------------------------------------------
// Variants
//
// Every `size` maps to the `text-*` utility of the same name, so
// `<Text size="sm">` and `className="text-sm"` always render the same size.
// The scale itself lives in `styles/themes/alpha.css` (see Storybook
// "Docs/Type Scale").
// ---------------------------------------------------------------------------

// Title levels use a single step each. Display steps (`xl` and up) already
// shrink per breakpoint in the theme, so adding `md:` / `lg:` classes here
// would scale headings twice.
const titleVariants = cva('font-semibold leading-tight tracking-tight', {
  variants: {
    level: {
      1: 'text-4xl',
      2: 'text-3xl',
      3: 'text-2xl',
      4: 'text-xl',
      5: 'text-lg',
      6: 'text-base',
      7: 'text-sm',
    },
    weight: {
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
      extrabold: 'font-extrabold',
    },
    textColor: {
      default: 'text-foreground',
      muted: 'text-muted-foreground',
      primary: 'text-primary',
      secondary: 'text-secondary-foreground',
      destructive: 'text-destructive',
      success: 'text-success',
      warning: 'text-warning',
      info: 'text-info',
    },
  },
  defaultVariants: {
    level: 4,
    weight: 'semibold',
    // No textColor default: headings inherit their parent's color, like a raw
    // <h4>. `textColor="default"` forces the foreground color.
  },
})

// No base line height: each step in the scale carries its own, so Text renders
// exactly what the matching `text-*` class renders. A caller that wants a
// different rhythm passes a `leading-*` class.
const textVariants = cva('', {
  variants: {
    size: {
      '5xs': 'text-5xs',
      '4xs': 'text-4xs',
      '3xs': 'text-3xs',
      '2xs': 'text-2xs',
      'xs': 'text-xs',
      'sm': 'text-sm',
      'base': 'text-base',
      'lg': 'text-lg',
      'xl': 'text-xl',
      '2xl': 'text-2xl',
      '3xl': 'text-3xl',
      '4xl': 'text-4xl',
      '5xl': 'text-5xl',
      '6xl': 'text-6xl',
      '7xl': 'text-7xl',
      '8xl': 'text-8xl',
    },
    weight: {
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
      extrabold: 'font-extrabold',
    },
    textColor: {
      default: 'text-foreground',
      muted: 'text-muted-foreground',
      primary: 'text-primary',
      secondary: 'text-secondary-foreground',
      destructive: 'text-destructive',
      success: 'text-success',
      warning: 'text-warning',
      info: 'text-info',
    },
    type: {
      default: '',
      code: 'font-mono bg-muted px-1.5 py-0.5 rounded text-sm',
      mark: 'bg-yellow-100 dark:bg-yellow-900/30 px-1.5 py-0.5 rounded',
      underline: 'underline underline-offset-4',
      delete: 'line-through',
      strong: 'font-semibold',
      italic: 'italic',
    },
  },
  defaultVariants: {
    // Body text is 14px. `sm` is that step; `base` is the 16px reading size.
    size: 'sm',
    weight: 'normal',
    // No textColor default: text inherits its parent's color, like a raw
    // <span>, so it works inside alerts, badges and muted containers.
    type: 'default',
  },
})

const paragraphVariants = cva('leading-relaxed', {
  variants: {
    size: {
      '5xs': 'text-5xs',
      '4xs': 'text-4xs',
      '3xs': 'text-3xs',
      '2xs': 'text-2xs',
      'xs': 'text-xs',
      'sm': 'text-sm',
      'base': 'text-base',
      'lg': 'text-lg',
      'xl': 'text-xl',
    },
    spacing: {
      tight: 'leading-tight',
      normal: 'leading-relaxed',
      loose: 'leading-loose',
    },
  },
  defaultVariants: {
    size: 'sm',
    spacing: 'normal',
  },
})

// ---------------------------------------------------------------------------
// Title
// ---------------------------------------------------------------------------

interface TitleProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
  VariantProps<typeof titleVariants> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}

function Title({ className, level, weight, textColor, as, children, ...props }: TitleProps) {
  // Level 7 is the 14px floor of the scale and has no element of its own —
  // there is no <h7> — so it renders an <h6> unless `as` says otherwise.
  const resolvedLevel = level ?? 4
  const Component
    = as ?? (`h${Math.min(resolvedLevel, 6)}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6')

  return React.createElement(
    Component,
    {
      className: cn(titleVariants({ level, weight, textColor, className })),
      ...props,
    },
    children,
  )
}

// ---------------------------------------------------------------------------
// Text
// ---------------------------------------------------------------------------

interface TextProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'color'>,
  VariantProps<typeof textVariants> {
  /**
   * Headings are allowed because the scale's display steps start at 16px
   * (`Title` level 6), so a smaller heading — a card or section label at 13
   * or 14px — has no `Title` level. Render it as `<Text as="h4">` rather than
   * dropping to a raw size class.
   */
  as?: 'span' | 'p' | 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  copyable?: boolean
  ellipsis?: boolean
  mark?: boolean
  underline?: boolean
  delete?: boolean
  strong?: boolean
  italic?: boolean
  code?: boolean
}

function Text({
  className,
  size,
  weight,
  textColor,
  type,
  as = 'span',
  copyable,
  ellipsis,
  mark,
  underline,
  delete: deleteProp,
  strong,
  italic,
  code,
  children,
  ...props
}: TextProps) {
  const resolvedType = code
    ? 'code'
    : italic
      ? 'italic'
      : strong
        ? 'strong'
        : deleteProp
          ? 'delete'
          : underline
            ? 'underline'
            : mark
              ? 'mark'
              : type

  const content = (
    <>
      {children}
      {copyable && (
        <button
          type="button"
          aria-label="Copy text"
          className="hover:bg-accent hover:text-accent-foreground ml-2 inline-flex size-4 items-center justify-center rounded-md text-sm font-medium transition-colors"
          onClick={() => {
            if (typeof children === 'string') {
              navigator.clipboard.writeText(children).catch(() => {})
            }
          }}
          title="Copy text"
        >
          <CopyIcon className="size-3" aria-hidden="true" />
        </button>
      )}
    </>
  )

  return React.createElement(
    as,
    {
      className: cn(
        textVariants({ size, weight, textColor, type: resolvedType }),
        ellipsis && 'truncate',
        className,
      ),
      ...props,
    },
    content,
  )
}

// ---------------------------------------------------------------------------
// Paragraph
// ---------------------------------------------------------------------------

interface ParagraphProps
  extends React.HTMLAttributes<HTMLParagraphElement>,
  VariantProps<typeof paragraphVariants> {
  as?: 'p' | 'div'
}

function Paragraph({ className, size, spacing, as = 'p', children, ...props }: ParagraphProps) {
  return React.createElement(
    as,
    {
      className: cn(paragraphVariants({ size, spacing, className })),
      ...props,
    },
    children,
  )
}

// ---------------------------------------------------------------------------
// Link
// ---------------------------------------------------------------------------

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string
  target?: '_blank' | '_self' | '_parent' | '_top'
  rel?: string
}

function Link({
  className,
  children,
  href,
  target = '_self',
  rel,
  ...props
}: LinkProps) {
  const defaultRel = target === '_blank' ? 'noopener noreferrer' : undefined

  return (
    <a
      href={href}
      target={target}
      rel={rel ?? defaultRel}
      className={cn(
        'text-primary focus-visible:ring-ring underline-offset-4 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
        className,
      )}
      {...props}
    >
      {children}
    </a>
  )
}

// ---------------------------------------------------------------------------
// List
// ---------------------------------------------------------------------------

interface ListProps extends Omit<React.OlHTMLAttributes<HTMLOListElement>, 'type'> {
  as?: 'ol' | 'ul'
  listType?: 'ordered' | 'unordered'
}

function List({ className, as, listType = 'unordered', children, ...props }: ListProps) {
  const Component = as ?? (listType === 'ordered' ? 'ol' : 'ul')

  return React.createElement(
    Component,
    {
      className: cn(
        'space-y-2',
        listType === 'ordered' ? 'list-decimal list-inside' : 'list-disc list-inside',
        className,
      ),
      ...props,
    },
    children,
  )
}

interface ListItemProps extends React.LiHTMLAttributes<HTMLLIElement> {}

function ListItem({ className, children, ...props }: ListItemProps) {
  return (
    <li className={cn('leading-relaxed', className)} {...props}>
      {children}
    </li>
  )
}

// ---------------------------------------------------------------------------
// Blockquote
// ---------------------------------------------------------------------------

interface BlockquoteProps extends React.BlockquoteHTMLAttributes<HTMLQuoteElement> {}

function Blockquote({ className, children, ...props }: BlockquoteProps) {
  return (
    <blockquote
      className={cn('border-primary text-muted-foreground border-l-4 pl-4 italic', className)}
      {...props}
    >
      {children}
    </blockquote>
  )
}

// ---------------------------------------------------------------------------
// Code
// ---------------------------------------------------------------------------

interface CodeProps extends React.HTMLAttributes<HTMLElement> {
  as?: 'code' | 'pre'
}

function Code({ className, as = 'code', children, ...props }: CodeProps) {
  if (as === 'pre') {
    return (
      <pre
        className={cn(
          'bg-muted relative overflow-x-auto rounded p-4 font-mono text-sm',
          className,
        )}
        {...props}
      >
        {children}
      </pre>
    )
  }

  return (
    <code
      className={cn(
        'bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm',
        className,
      )}
      {...props}
    >
      {children}
    </code>
  )
}

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

export {
  Blockquote,
  Code,
  Link,
  List,
  ListItem,
  Paragraph,
  paragraphVariants,
  Text,
  textVariants,
  Title,
  titleVariants,
}

export type { BlockquoteProps, CodeProps, LinkProps, ListItemProps, ListProps, ParagraphProps, TextProps, TitleProps }
