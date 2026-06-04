import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { AvatarStack } from '@datum-cloud/datum-ui/avatar-stack'

const avatars = [
  { name: 'Alice Johnson', image: 'https://i.pravatar.cc/40?u=alice' },
  { name: 'Bob Smith', image: 'https://i.pravatar.cc/40?u=bob' },
  { name: 'Charlie Brown', image: 'https://i.pravatar.cc/40?u=charlie' },
  { name: 'Diana Prince', image: 'https://i.pravatar.cc/40?u=diana' },
  { name: 'Eve Davis', image: 'https://i.pravatar.cc/40?u=eve' },
  { name: 'Frank Miller', image: 'https://i.pravatar.cc/40?u=frank' },
  { name: 'Grace Lee', image: 'https://i.pravatar.cc/40?u=grace' },
]

const meta: Meta<typeof AvatarStack> = {
  title: 'Features/AvatarStack',
  component: AvatarStack,
  parameters: {
    docs: {
      description: {
        component:
          'Display a group of overlapping avatars with overflow count and tooltip names.\n\n'
          + 'AvatarStack renders a row of overlapping avatar images with automatic overflow handling. '
          + 'When the number of avatars exceeds `maxAvatarsAmount`, a "+N" indicator appears showing '
          + 'the count of hidden avatars. Each avatar displays a tooltip with the user\'s name on hover.',
      },
    },
  },
  argTypes: {
    maxAvatarsAmount: { control: { type: 'number', min: 1, max: 10 } },
    orientation: {
      control: 'select',
      options: ['vertical', 'horizontal'],
    },
    spacing: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl'],
    },
  },
  args: {
    maxAvatarsAmount: 3,
    orientation: 'vertical',
    spacing: 'md',
  },
}

export default meta

type Story = StoryObj<typeof AvatarStack>

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Basic usage with three avatars. Each avatar shows a tooltip with the user\'s name on hover.',
      },
    },
  },
  args: {
    avatars: avatars.slice(0, 3),
  },
}

export const OverflowIndicator: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'When there are more avatars than `maxAvatarsAmount`, a "+N" badge appears. '
          + 'Hovering the badge reveals the names of the hidden avatars in a tooltip.',
      },
    },
  },
  args: {
    avatars,
    maxAvatarsAmount: 3,
  },
}

export const SpacingVariants: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Control the overlap amount between avatars with the `spacing` prop: `sm`, `md` (default), `lg`, and `xl`.',
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-6">
      {(['sm', 'md', 'lg', 'xl'] as const).map(spacing => (
        <div key={spacing} className="flex items-center gap-4">
          <span className="text-muted-foreground w-8 text-sm">{spacing}</span>
          <AvatarStack spacing={spacing} avatars={avatars.slice(0, 3)} />
        </div>
      ))}
    </div>
  ),
}

export const OrientationVariants: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The `orientation` prop controls layout direction. '
          + '`vertical` (default) overlaps avatars horizontally in a row; '
          + '`horizontal` overlaps them vertically in a column.',
      },
    },
  },
  render: () => (
    <div className="flex items-start gap-12">
      <div className="flex flex-col items-center gap-2">
        <span className="text-muted-foreground text-sm">vertical (default)</span>
        <AvatarStack orientation="vertical" avatars={avatars.slice(0, 3)} />
      </div>
      <div className="flex flex-col items-center gap-2">
        <span className="text-muted-foreground text-sm">horizontal</span>
        <AvatarStack orientation="horizontal" avatars={avatars.slice(0, 3)} />
      </div>
    </div>
  ),
}

export const CustomMaxAmount: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Adjust `maxAvatarsAmount` to control how many avatars are shown before the overflow indicator. '
          + 'The same 5-avatar list is shown with `max=2` and `max=4`.',
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-6">
      {([2, 4] as const).map(max => (
        <div key={max} className="flex items-center gap-4">
          <span className="text-muted-foreground w-16 text-sm">{`max=${max}`}</span>
          <AvatarStack maxAvatarsAmount={max} avatars={avatars.slice(0, 5)} />
        </div>
      ))}
    </div>
  ),
}
