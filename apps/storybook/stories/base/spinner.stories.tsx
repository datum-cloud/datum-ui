import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { Spinner } from '@datum-cloud/datum-ui/spinner'

const meta: Meta<typeof Spinner> = {
  title: 'Base/Spinner',
  component: Spinner,
  parameters: {
    docs: {
      description: {
        component:
          'An animated circular loading indicator with configurable size and color.\n\n'
          + 'Spinner renders an animated SVG with a track circle and a spinning arc indicator. '
          + 'It is used inside buttons during loading states and as a standalone loading indicator. '
          + 'Size is controlled via the `className` prop using Tailwind size utilities (e.g. `size-4`, `size-6`).',
      },
    },
  },
  argTypes: {
    className: {
      control: 'text',
    },
  },
  args: {
    className: 'size-6',
  },
}

export default meta

type Story = StoryObj<typeof Spinner>

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Basic usage of the Spinner component with a default size.',
      },
    },
  },
}

export const Sizes: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Control spinner dimensions with Tailwind size utilities on the `className` prop.',
      },
    },
  },
  render: () => (
    <div className="flex items-center gap-4">
      <Spinner className="size-3" />
      <Spinner className="size-4" />
      <Spinner className="size-5" />
      <Spinner className="size-6" />
      <Spinner className="size-8" />
      <Spinner className="size-10" />
    </div>
  ),
}
