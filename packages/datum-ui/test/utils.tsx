import type { RenderOptions, RenderResult } from '@testing-library/react'
import type { UserEvent } from '@testing-library/user-event'
import type { ReactElement } from 'react'
import { TooltipProvider } from '@repo/shadcn/ui/tooltip'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DatumProvider } from '../src/providers/datum.provider'

/**
 * Wraps components in DatumProvider + TooltipProvider.
 * Use renderWithProviders() instead of bare render() when the component
 * depends on theme context or uses Tooltip internally (e.g., AvatarStack).
 */
function AllProviders({ children }: { children: React.ReactNode }) {
  return (
    <DatumProvider>
      <TooltipProvider>{children}</TooltipProvider>
    </DatumProvider>
  )
}

function renderWithProviders(ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>): RenderResult & { user: UserEvent } {
  return {
    user: userEvent.setup(),
    ...render(ui, { wrapper: AllProviders, ...options }),
  }
}

export { renderWithProviders }
