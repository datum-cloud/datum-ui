import type { ReactElement } from 'react'
import type { ColorScheme } from '../../theme/theme'
import { render } from '@testing-library/react-native'
import { DatumThemeProvider } from '../../theme/theme'

export const SCHEMES: ColorScheme[] = ['light', 'dark']

export async function renderIn(scheme: ColorScheme, ui: ReactElement): ReturnType<typeof render> {
  return render(<DatumThemeProvider scheme={scheme}>{ui}</DatumThemeProvider>)
}

/** Flatten a style prop (arrays, falsy entries) into one object. */
export function flat(style: unknown): Record<string, unknown> {
  if (Array.isArray(style))
    return Object.assign({}, ...style.map(flat))
  return (style && typeof style === 'object') ? style as Record<string, unknown> : {}
}
