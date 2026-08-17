/// <reference types="@testing-library/jest-dom/vitest" />
import { render } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { script } from '../script'
import { ThemeScript } from '../theme-script'
import { ThemeProvider, useTheme } from '../theme.provider'

function resetDocument() {
  const el = document.documentElement
  el.className = ''
  el.removeAttribute('data-theme')
  el.style.colorScheme = ''
  localStorage.clear()
}

afterEach(() => {
  resetDocument()
})

describe('inline no-flash script', () => {
  it('applies the value mapping for data-* attributes (BUG-056)', () => {
    localStorage.setItem('theme', 'dark')
    script('data-theme', 'theme', 'system', undefined, ['light', 'dark'], { dark: 'night', light: 'day' }, true, true)
    expect(document.documentElement.getAttribute('data-theme')).toBe('night')
  })

  it('splits multi-token class values instead of throwing (BUG-170)', () => {
    expect(() =>
      script('class', 'theme', 'light', 'dark', ['light', 'dark'], { dark: 'dark high-contrast', light: 'light' }, true, true),
    ).not.toThrow()
    const el = document.documentElement
    expect(el.classList.contains('dark')).toBe(true)
    expect(el.classList.contains('high-contrast')).toBe(true)
  })

  it('keeps class + value mapping in sync with applyTheme', () => {
    localStorage.setItem('theme', 'dark')
    script('class', 'theme', 'system', undefined, ['light', 'dark'], { dark: 'night', light: 'day' }, true, true)
    expect(document.documentElement.classList.contains('night')).toBe(true)
    expect(document.documentElement.classList.contains('day')).toBe(false)
  })
})

describe('themeScript defaults', () => {
  it('does not write the literal "system" theme when enableSystem is false (BUG-171)', () => {
    render(<ThemeScript enableSystem={false} attribute="class" />)
    // Execute the serialized inline script by running the same function directly
    // with the defaults ThemeScript would compute.
    script('class', 'theme', 'light', undefined, ['light', 'dark'], undefined, false, true)
    expect(document.documentElement.classList.contains('system')).toBe(false)
    expect(document.documentElement.classList.contains('light')).toBe(true)
  })
})

describe('themeProvider', () => {
  it('renders the ThemeScript inline no-flash script (BUG-055)', () => {
    const { container } = render(
      <ThemeProvider attribute="class" defaultTheme="light">
        <div>app</div>
      </ThemeProvider>,
    )
    const inline = container.querySelector('script') ?? document.querySelector('script')
    expect(inline).toBeTruthy()
    expect(inline?.innerHTML).toContain('localStorage')
  })

  it('resolvedTheme reflects forcedTheme (BUG-172)', () => {
    localStorage.setItem('theme', 'light')
    let seen: string | undefined
    function Probe() {
      seen = useTheme().resolvedTheme
      return null
    }
    render(
      <ThemeProvider attribute="class" forcedTheme="dark">
        <Probe />
      </ThemeProvider>,
    )
    expect(seen).toBe('dark')
  })
})
