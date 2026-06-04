import type { ComponentProps } from 'react'
import { DocsContainer } from '@storybook/addon-docs/blocks'
import { useGlobals } from 'storybook/preview-api'
import { datumDark, datumLight } from './theme'

/**
 * Docs page wrapper that switches the Storybook docs theme (page background,
 * prose, tables, code blocks) to match the `theme` toolbar global, so docs
 * pages follow dark mode the same way component canvases do.
 *
 * Lives in its own file so `preview.tsx` only exports configuration — keeps
 * the `react-refresh/only-export-components` lint rule satisfied.
 */
export function ThemedDocsContainer(props: ComponentProps<typeof DocsContainer>) {
  const [globals] = useGlobals()
  const isDark = globals.theme === 'dark'

  return <DocsContainer {...props} theme={isDark ? datumDark : datumLight} />
}
