import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { LoaderOverlay } from '@datum-cloud/datum-ui'

const meta: Meta<typeof LoaderOverlay> = {
  title: 'Features/LoaderOverlay',
  component: LoaderOverlay,
  argTypes: {
    message: {
      control: { type: 'text' },
    },
  },
  args: {
    message: 'Loading...',
  },
}

export default meta

type Story = StoryObj<typeof LoaderOverlay>

export const Default: Story = {
  render: args => (
    <div className="relative h-48 w-full rounded-lg border">
      <LoaderOverlay message={args.message} />
    </div>
  ),
}

export const WithContent: Story = {
  render: () => (
    <div className="relative h-64 w-full rounded-lg border p-6">
      <h3 className="text-lg font-medium">Dashboard</h3>
      <p className="text-muted-foreground mt-2 text-sm">
        This content is behind the loading overlay.
      </p>
      <div className="mt-4 grid grid-cols-3 gap-4">
        <div className="h-20 rounded bg-gray-100" />
        <div className="h-20 rounded bg-gray-100" />
        <div className="h-20 rounded bg-gray-100" />
      </div>
      <LoaderOverlay message="Fetching data..." />
    </div>
  ),
}
