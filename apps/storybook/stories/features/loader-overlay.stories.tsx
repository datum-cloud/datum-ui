import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { LoaderOverlay } from '@datum-cloud/datum-ui/loader-overlay'

const meta: Meta<typeof LoaderOverlay> = {
  title: 'Features/LoaderOverlay',
  component: LoaderOverlay,
  parameters: {
    docs: {
      description: {
        component:
          'A full-area loading overlay with spinner and optional message, rendered on top of content.\n\n'
          + 'LoaderOverlay renders a semi-transparent backdrop with a spinner and optional message over '
          + 'its parent container. Place it inside a `position: relative` element to cover that area '
          + 'with a loading state — useful for sections that are fetching data or processing actions. '
          + 'The `message` prop accepts a plain string or any `ReactNode`.',
      },
    },
  },
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
  parameters: {
    docs: {
      description: {
        story:
          'Overlay placed inside a relatively positioned container with background content. '
          + 'Use the `message` control to change the label next to the spinner.',
      },
    },
  },
  render: args => (
    <div className="relative h-48 w-full rounded-lg border p-6">
      <h3 className="text-lg font-medium">Content</h3>
      <p className="text-muted-foreground mt-2 text-sm">This content is behind the overlay when loading is active.</p>
      <LoaderOverlay message={args.message} />
    </div>
  ),
}

export const WithoutMessage: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Omit `message` to show only the spinner with no accompanying text.',
      },
    },
  },
  render: () => (
    <div className="relative h-32 w-full rounded-lg border">
      <LoaderOverlay />
    </div>
  ),
}

export const OverContent: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The overlay preserves the underlying layout. Place it as the last child of a '
          + 'relatively positioned container to cover existing content during a loading state.',
      },
    },
  },
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

export const CustomMessageNode: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The `message` prop accepts a `ReactNode`, so you can pass custom markup — '
          + 'for example a two-line block with a bold heading and a muted sub-line.',
      },
    },
  },
  render: () => (
    <div className="relative h-32 w-full rounded-lg border">
      <LoaderOverlay
        message={(
          <div className="flex flex-col items-center gap-1">
            <span className="text-sm font-semibold">Please wait</span>
            <span className="text-muted-foreground text-xs">Processing your request...</span>
          </div>
        )}
      />
    </div>
  ),
}
