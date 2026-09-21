/// <reference types="@testing-library/jest-dom/vitest" />
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Paragraph, Text, Title } from '../typography'

// The type scale's contract: every `size` renders the `text-*` utility of the
// same name, so the component and a raw class can never disagree.
const TEXT_SIZES = [
  '4xs',
  '3xs',
  '2xs',
  'xs',
  'sm',
  'base',
  'lg',
  'xl',
  '2xl',
  '3xl',
  '4xl',
  '5xl',
  '6xl',
  '7xl',
  '8xl',
] as const

const PARAGRAPH_SIZES = ['4xs', '3xs', '2xs', 'xs', 'sm', 'base', 'lg', 'xl'] as const

describe('text', () => {
  it.each(TEXT_SIZES)('renders size="%s" as text-%s', (size) => {
    render(<Text size={size}>sample</Text>)
    expect(screen.getByText('sample')).toHaveClass(`text-${size}`)
  })

  it('defaults to the 14px body step (sm)', () => {
    render(<Text>body</Text>)
    expect(screen.getByText('body')).toHaveClass('text-sm')
  })

  it('renders base as its own 16px step, not a duplicate of sm', () => {
    render(<Text size="base">reading</Text>)
    const el = screen.getByText('reading')
    expect(el).toHaveClass('text-base')
    expect(el).not.toHaveClass('text-sm')
  })

  it('adds no line height of its own, so it matches the raw class', () => {
    render(<Text>plain</Text>)
    expect(screen.getByText('plain').className).not.toMatch(/\bleading-/)
  })

  it('lets a className size override the size prop', () => {
    render(
      <Text size="sm" className="text-2xs">
        override
      </Text>,
    )
    const el = screen.getByText('override')
    expect(el).toHaveClass('text-2xs')
    expect(el).not.toHaveClass('text-sm')
  })
})

// Colors come from theme tokens, never raw palette classes, so a theme can
// retune them in one place.
const TEXT_COLORS = [
  ['default', 'text-foreground'],
  ['muted', 'text-muted-foreground'],
  ['primary', 'text-primary'],
  ['secondary', 'text-secondary-foreground'],
  ['destructive', 'text-destructive'],
  ['success', 'text-success'],
  ['warning', 'text-warning'],
  ['info', 'text-info'],
] as const

describe('text color', () => {
  it.each(TEXT_COLORS)('renders textColor="%s" as %s', (textColor, token) => {
    render(<Text textColor={textColor}>tinted</Text>)
    expect(screen.getByText('tinted')).toHaveClass(token)
  })

  it.each(TEXT_COLORS)('renders Title textColor="%s" as %s', (textColor, token) => {
    render(<Title textColor={textColor}>tinted</Title>)
    expect(screen.getByRole('heading')).toHaveClass(token)
  })

  it('inherits the parent color when no textColor is set', () => {
    render(
      <div className="text-destructive">
        <Text>nested text</Text>
        <Title>nested title</Title>
      </div>,
    )
    const colorClass = /\btext-(foreground|muted-foreground|primary|secondary-foreground|destructive|success|warning|info)\b/
    expect(screen.getByText('nested text').className).not.toMatch(colorClass)
    expect(screen.getByRole('heading').className).not.toMatch(colorClass)
  })

  it('uses no raw palette colors', () => {
    render(<Text textColor="success">ok</Text>)
    expect(screen.getByText('ok').className).not.toMatch(/\b(dark:)?text-(green|yellow|blue|red)-\d+/)
  })
})

describe('paragraph', () => {
  it.each(PARAGRAPH_SIZES)('renders size="%s" as text-%s', (size) => {
    render(<Paragraph size={size}>sample</Paragraph>)
    expect(screen.getByText('sample')).toHaveClass(`text-${size}`)
  })

  it('defaults to the 14px body step (sm)', () => {
    render(<Paragraph>body</Paragraph>)
    expect(screen.getByText('body')).toHaveClass('text-sm')
  })
})

describe('title', () => {
  it.each([
    [1, 'text-4xl'],
    [2, 'text-3xl'],
    [3, 'text-2xl'],
    [4, 'text-xl'],
    [5, 'text-lg'],
    [6, 'text-base'],
  ] as const)('renders level %i as a single %s step', (level, step) => {
    render(<Title level={level}>heading</Title>)
    const el = screen.getByRole('heading', { level })
    expect(el).toHaveClass(step)
    // Breakpoint scaling lives in the theme; per-level md:/lg: sizes would
    // shrink headings twice.
    expect(el.className).not.toMatch(/\b(md|lg):text-/)
  })

  it('defaults to level 4 (text-xl, h4)', () => {
    render(<Title>default</Title>)
    const el = screen.getByRole('heading', { level: 4 })
    expect(el).toHaveClass('text-xl')
  })
})
