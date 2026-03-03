/// <reference types="@testing-library/jest-dom/vitest" />
import { act, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { useTheme } from '../../components/themes/theme.provider'
import { DatumProvider } from '../datum.provider'

function ThemeDisplay(): React.JSX.Element {
  const { theme, resolvedTheme } = useTheme()
  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <span data-testid="resolved">{resolvedTheme}</span>
    </div>
  )
}

describe('datumProvider', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.className = ''
    document.documentElement.removeAttribute('data-theme')
  })

  it('renders children', () => {
    render(
      <DatumProvider>
        <div data-testid="child">Hello</div>
      </DatumProvider>,
    )
    expect(screen.getByTestId('child')).toHaveTextContent('Hello')
  })

  it('defaults to system theme', () => {
    render(
      <DatumProvider>
        <ThemeDisplay />
      </DatumProvider>,
    )
    expect(screen.getByTestId('theme')).toHaveTextContent('system')
  })

  it('respects defaultTheme prop', () => {
    render(
      <DatumProvider defaultTheme="dark">
        <ThemeDisplay />
      </DatumProvider>,
    )
    expect(screen.getByTestId('theme')).toHaveTextContent('dark')
  })

  it('persists theme to localStorage', () => {
    function ThemeChanger(): React.JSX.Element {
      const { setTheme } = useTheme()
      return <button onClick={() => setTheme('dark')}>Dark</button>
    }

    render(
      <DatumProvider storageKey="datum-theme">
        <ThemeChanger />
      </DatumProvider>,
    )

    act(() => {
      screen.getByText('Dark').click()
    })

    expect(localStorage.getItem('datum-theme')).toBe('dark')
  })
})
