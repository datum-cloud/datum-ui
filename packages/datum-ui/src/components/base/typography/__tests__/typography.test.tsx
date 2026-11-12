/// <reference types="@testing-library/jest-dom/vitest" />
import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { COPY_RESET_DELAY_MS } from '../../../../hooks/use-copy-to-clipboard'
import { Paragraph, Text, Title } from '../typography'

// The type scale's contract: every `size` renders the `text-*` utility of the
// same name, so the component and a raw class can never disagree.
const TEXT_SIZES = [
  '5xs',
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

const PARAGRAPH_SIZES = ['5xs', '4xs', '3xs', '2xs', 'xs', 'sm', 'base', 'lg', 'xl'] as const

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

  it('renders a heading element for sub-16px headings', () => {
    render(
      <Text as="h4" weight="medium">
        Section
      </Text>,
    )
    const el = screen.getByRole('heading', { level: 4 })
    expect(el).toHaveClass('text-sm', 'font-medium')
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

  it('renders level 7 at the 14px floor, as an h6 since there is no h7', () => {
    render(<Title level={7}>floor</Title>)
    const el = screen.getByRole('heading', { level: 6 })
    expect(el).toHaveClass('text-sm')
  })

  it('keeps the element when as overrides a level', () => {
    render(
      <Title as="h2" level={7}>
        outline
      </Title>,
    )
    const el = screen.getByRole('heading', { level: 2 })
    expect(el).toHaveClass('text-sm')
  })

  it('defaults to level 4 (text-xl, h4)', () => {
    render(<Title>default</Title>)
    const el = screen.getByRole('heading', { level: 4 })
    expect(el).toHaveClass('text-xl')
  })
})

describe('text copyable', () => {
  function stubClipboard(value: unknown) {
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value })
  }

  /** Clicks the button and lets the hook's async clipboard write settle. */
  async function clickCopy() {
    fireEvent.click(screen.getByRole('button', { name: 'Copy text' }))
    await act(async () => {})
  }

  afterEach(() => {
    vi.useRealTimers()
    Reflect.deleteProperty(navigator, 'clipboard')
  })

  it('renders no copy button unless copyable is set', () => {
    render(<Text>plain</Text>)

    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('copies the text and shows the copied state until the reset delay passes', async () => {
    vi.useFakeTimers()
    const writeText = vi.fn().mockResolvedValue(undefined)
    stubClipboard({ writeText })
    render(<Text copyable>api-key-123</Text>)

    await clickCopy()

    expect(writeText).toHaveBeenCalledWith('api-key-123')
    expect(screen.getByRole('button', { name: 'Copied' })).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('Copied')

    act(() => {
      vi.advanceTimersByTime(COPY_RESET_DELAY_MS)
    })

    expect(screen.getByRole('button', { name: 'Copy text' })).toBeInTheDocument()
  })

  it('copies the text of nested element children', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    stubClipboard({ writeText })
    render(
      <Text copyable>
        Project
        {' '}
        <strong>
          datum-
          {42}
        </strong>
      </Text>,
    )

    await clickCopy()

    expect(writeText).toHaveBeenCalledWith('Project datum-42')
  })

  it('renders no copy button when the children have no plain text to copy', () => {
    function Label() {
      return <span>from a component</span>
    }
    render(
      <Text copyable>
        <Label />
      </Text>,
    )

    expect(screen.getByText('from a component')).toBeInTheDocument()
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('does not throw or show the copied state when the clipboard is unavailable', async () => {
    stubClipboard(undefined)
    render(<Text copyable>secret</Text>)

    await clickCopy()

    expect(screen.getByRole('button', { name: 'Copy text' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Copied' })).not.toBeInTheDocument()
  })

  it('keeps the copy state when the clipboard write is rejected', async () => {
    stubClipboard({ writeText: vi.fn().mockRejectedValue(new Error('denied')) })
    render(<Text copyable>secret</Text>)

    await clickCopy()

    expect(screen.getByRole('button', { name: 'Copy text' })).toBeInTheDocument()
  })
})
