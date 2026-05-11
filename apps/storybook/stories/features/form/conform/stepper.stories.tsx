import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { ConformAdapter } from '@datum-cloud/datum-ui/form/adapters/conform'
import { StepperFormStory } from '../_shared'

const meta: Meta = {
  title: 'Features/Form/Conform/Stepper',
  decorators: [
    Story => (
      <ConformAdapter>
        <Story />
      </ConformAdapter>
    ),
  ],
}
export default meta
type Story = StoryObj

/**
 * Multi-step form with per-step zod schemas. Click "Next" with required
 * fields empty to verify zod validation errors render under each invalid
 * field — regression check for the `markAllFieldsTouched()` fix in
 * `StepForm`'s onSubmit handler.
 */
export const Default: Story = {
  render: () => (
    <div className="max-w-lg">
      <StepperFormStory />
    </div>
  ),
}
