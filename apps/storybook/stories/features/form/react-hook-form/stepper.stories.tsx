import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { RHFAdapter } from '@datum-cloud/datum-ui/form/adapters/rhf'
import { StepperFormStory } from '../_shared'

const meta: Meta = {
  title: 'Features/Form/React Hook Form/Stepper',
  decorators: [
    Story => (
      <RHFAdapter>
        <Story />
      </RHFAdapter>
    ),
  ],
}
export default meta
type Story = StoryObj

/**
 * Multi-step form with per-step zod schemas, using the React Hook Form
 * adapter. Compare error display behaviour to
 * `Features/Form/Conform/Stepper` — they should be identical.
 */
export const Default: Story = {
  render: () => (
    <div className="max-w-lg">
      <StepperFormStory />
    </div>
  ),
}
