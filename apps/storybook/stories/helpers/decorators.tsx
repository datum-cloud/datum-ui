import type { Decorator } from 'storybook-react-rsbuild'
import { RHFAdapter } from '@datum-cloud/datum-ui/form/adapters/rhf'

export function withMaxWidth(maxWidth: string): Decorator {
  return Story => (
    <div style={{ maxWidth }}>
      <Story />
    </div>
  )
}

export const withFormProvider: Decorator = Story => (
  <RHFAdapter>
    <Story />
  </RHFAdapter>
)
