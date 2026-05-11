/// <reference types="@testing-library/jest-dom/vitest" />
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Logo, LogoFlat, LogoIcon, LogoStacked, LogoText } from '../index'

describe('logo namespace', () => {
  it('exposes Flat, Stacked, Icon, and Text under Logo.*', () => {
    expect(Logo.Flat).toBe(LogoFlat)
    expect(Logo.Stacked).toBe(LogoStacked)
    expect(Logo.Icon).toBe(LogoIcon)
    expect(Logo.Text).toBe(LogoText)
  })
})

describe('logoFlat', () => {
  it('applies brand tone classes by default', () => {
    render(<LogoFlat data-testid="flat" />)
    const svg = screen.getByTestId('flat')
    const paths = svg.querySelectorAll('path')
    // First path is the mark; subsequent paths are the wordmark.
    expect(paths[0]).toHaveClass('fill-[#BF9595]')
    expect(paths[1]).toHaveClass('fill-[#0C1D31]')
  })

  it('applies mono-light tone classes (lime mark + white text)', () => {
    render(<LogoFlat data-testid="flat" tone="mono-light" />)
    const paths = screen.getByTestId('flat').querySelectorAll('path')
    expect(paths[0]).toHaveClass('fill-[#E6F59F]')
    expect(paths[1]).toHaveClass('fill-white')
  })

  it('applies mono-dark tone classes', () => {
    render(<LogoFlat data-testid="flat" tone="mono-dark" />)
    const paths = screen.getByTestId('flat').querySelectorAll('path')
    expect(paths[0]).toHaveClass('fill-[#0C1D31]')
    expect(paths[1]).toHaveClass('fill-[#0C1D31]')
  })

  it('applies white tone classes (solid white, no lime accent)', () => {
    render(<LogoFlat data-testid="flat" tone="white" />)
    const paths = screen.getByTestId('flat').querySelectorAll('path')
    expect(paths[0]).toHaveClass('fill-white')
    expect(paths[1]).toHaveClass('fill-white')
  })

  it('defaults to role="img" and aria-label="Datum"', () => {
    render(<LogoFlat />)
    const svg = screen.getByRole('img', { name: 'Datum' })
    expect(svg).toBeInTheDocument()
  })

  it('accepts a custom aria-label', () => {
    render(<LogoFlat aria-label="Datum Cloud" />)
    expect(screen.getByRole('img', { name: 'Datum Cloud' })).toBeInTheDocument()
  })

  it('hides from a11y tree when decorative', () => {
    render(<LogoFlat data-testid="flat" decorative />)
    const svg = screen.getByTestId('flat')
    expect(svg).toHaveAttribute('aria-hidden', 'true')
    expect(svg).not.toHaveAttribute('role')
    expect(svg).not.toHaveAttribute('aria-label')
  })

  it('merges consumer className with the base classes', () => {
    render(<LogoFlat data-testid="flat" className="h-8 w-auto" />)
    const svg = screen.getByTestId('flat')
    expect(svg).toHaveClass('h-8')
    expect(svg).toHaveClass('w-auto')
    expect(svg).toHaveClass('block') // base
  })
})

describe('logoStacked', () => {
  it('applies tone classes consistently with LogoFlat', () => {
    render(<LogoStacked data-testid="stacked" tone="mono-light" />)
    const paths = screen.getByTestId('stacked').querySelectorAll('path')
    // First path is the D mark (lime), rest are wordmark (white).
    expect(paths[0]).toHaveClass('fill-[#E6F59F]')
    for (let i = 1; i < paths.length; i++) {
      expect(paths[i]).toHaveClass('fill-white')
    }
  })

  it('uses an 82×67 viewBox (stacked artwork)', () => {
    render(<LogoStacked data-testid="stacked" />)
    expect(screen.getByTestId('stacked')).toHaveAttribute('viewBox', '0 0 82 67')
  })
})

describe('logoIcon', () => {
  it('renders a single mark path', () => {
    render(<LogoIcon data-testid="icon" />)
    const paths = screen.getByTestId('icon').querySelectorAll('path')
    expect(paths).toHaveLength(1)
    expect(paths[0]).toHaveClass('fill-[#BF9595]')
  })

  it('uses a near-square viewBox (the D mark only)', () => {
    render(<LogoIcon data-testid="icon" />)
    expect(screen.getByTestId('icon')).toHaveAttribute('viewBox', '0 0 149 148')
  })

  it('uses lime mark on mono-light tone', () => {
    render(<LogoIcon data-testid="icon" tone="mono-light" />)
    expect(screen.getByTestId('icon').querySelector('path')).toHaveClass('fill-[#E6F59F]')
  })
})

describe('logoText', () => {
  it('renders only wordmark paths (no D mark)', () => {
    render(<LogoText data-testid="text" />)
    const paths = screen.getByTestId('text').querySelectorAll('path')
    expect(paths).toHaveLength(5)
    // All paths use the text slot (navy in brand tone).
    for (const path of paths) expect(path).toHaveClass('fill-[#0C1D31]')
  })

  it('uses the cropped wordmark viewBox', () => {
    render(<LogoText data-testid="text" />)
    expect(screen.getByTestId('text')).toHaveAttribute('viewBox', '247 38 495 76')
  })

  it('applies mono-light tone (white text — no mark to colour)', () => {
    render(<LogoText data-testid="text" tone="mono-light" />)
    const paths = screen.getByTestId('text').querySelectorAll('path')
    for (const path of paths) expect(path).toHaveClass('fill-white')
  })

  it('hides from a11y tree when decorative', () => {
    render(<LogoText data-testid="text" decorative />)
    expect(screen.getByTestId('text')).toHaveAttribute('aria-hidden', 'true')
  })
})
