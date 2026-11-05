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
          + 'Spinner draws a faint track with an arc that fades from a transparent tail to a solid head, '
          + 'turning clockwise once every 0.8s. The rotation runs through Motion as a Web Animations API '
          + 'transform, so it stays smooth while the main thread is busy. '
          + 'Size and colour come from `className` (e.g. `size-6`, `text-white`); the track follows the arc colour. '
          + 'It defaults to `text-primary`, which is clay in light mode and moss in dark mode.',
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

export const OnColor: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Recolour with a text colour class. The track follows the arc, so one class covers both.',
      },
    },
  },
  render: () => (
    <div className="flex items-center gap-4">
      <div className="bg-primary flex size-14 items-center justify-center rounded-lg">
        <Spinner className="text-primary-foreground size-6" />
      </div>
      <div className="bg-foreground flex size-14 items-center justify-center rounded-lg">
        <Spinner className="text-background size-6" />
      </div>
    </div>
  ),
}
