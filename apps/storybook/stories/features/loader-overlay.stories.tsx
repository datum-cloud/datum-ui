import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { LoaderOverlay } from '@datum-cloud/datum-ui/loader-overlay'

const meta: Meta<typeof LoaderOverlay> = {
  title: 'Features/LoaderOverlay',
  component: LoaderOverlay,
  argTypes: {
    message: { control: 'text' },
  },
  args: {
    message: 'Loading...',
  },
}

export default meta

type Story = StoryObj<typeof LoaderOverlay>

export const Default: Story = {
  render: args => (
    <div className="relative h-48 w-full rounded-lg border p-6">
      <h3 className="text-lg font-medium">Content</h3>
      <p className="text-muted-foreground mt-2 text-sm">This content is behind the overlay when loading is active.</p>
      <LoaderOverlay message={args.message} />
    </div>
  ),
}
