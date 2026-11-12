import * as React from 'react'

type ResolvedTheme = 'light' | 'dark'

/** Attributes a theme provider may write on <html>. */
const THEME_ATTRIBUTES = ['class', 'data-theme']

function detectTheme(): ResolvedTheme {
  const root = document.documentElement
  const attribute = root.getAttribute('data-theme')
  if (root.classList.contains('dark') || attribute === 'dark')
    return 'dark'
  if (root.classList.contains('light') || attribute === 'light')
    return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

/**
 * Lightweight theme detection hook for shadcn components.
 *
 * Pass `theme` when the caller already knows the resolved theme (for example
 * from a theme provider): the hook returns it and does not watch the DOM.
 * Without it the hook reads an explicit `dark`/`light` class or `data-theme`
 * on <html>, then falls back to the prefers-color-scheme media query.
 */
export function useTheme(theme?: ResolvedTheme): { resolvedTheme: ResolvedTheme } {
  const [detectedTheme, setDetectedTheme] = React.useState<ResolvedTheme>('light')

  React.useEffect(() => {
    if (theme)
      return

    const update = () => setDetectedTheme(detectTheme())
    update()

    const observer = new MutationObserver(update)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: THEME_ATTRIBUTES,
    })

    const mql = window.matchMedia('(prefers-color-scheme: dark)')
    mql.addEventListener('change', update)

    return () => {
      observer.disconnect()
      mql.removeEventListener('change', update)
    }
  }, [theme])

  return { resolvedTheme: theme ?? detectedTheme }
}
