import type { RenderOptions, RenderResult } from '@testing-library/react'
import type { UserEvent } from '@testing-library/user-event'
import type { ReactElement } from 'react'

declare function renderWithProviders(ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>): RenderResult & {
  user: UserEvent
}
export { renderWithProviders }
// # sourceMappingURL=utils.d.ts.map
