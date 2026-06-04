import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { Skeleton } from '@datum-cloud/datum-ui/skeleton'

const meta: Meta<typeof Skeleton> = {
  title: 'Base/Skeleton',
  component: Skeleton,
  parameters: {
    docs: {
      description: {
        component:
          'Animated placeholder shapes that indicate loading content.\n\n'
          + 'Skeleton renders a pulsing placeholder element that mimics the shape of content '
          + 'while it loads. Use it inside cards, lists, or any layout to provide visual feedback '
          + 'during data fetching.\n\n'
          + 'Control dimensions and shape entirely through `className` — for example '
          + '`h-4 w-full` for a text line or `size-12 rounded-full` for an avatar circle.',
      },
    },
  },
}

export default meta

type Story = StoryObj<typeof Skeleton>

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'A basic skeleton element. Set dimensions via `className`.',
      },
    },
  },
  render: () => (
    <Skeleton className="h-10 w-64" />
  ),
}

export const TextLines: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Stack multiple skeletons to simulate a paragraph of text. Vary widths to mimic natural line lengths.',
      },
    },
  },
  render: () => (
    <div className="w-96 flex flex-col gap-2">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
    </div>
  ),
}

export const CardSkeleton: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Compose multiple skeletons inside a card layout to represent a loading card with a title, body text, and action buttons.',
      },
    },
  },
  render: () => (
    <div className="w-96 rounded-lg border border-border p-6 flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-4 w-64" />
      </div>
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Skeleton className="h-9 w-20" />
        <Skeleton className="h-9 w-28" />
      </div>
    </div>
  ),
}

export const ProfileSkeleton: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Use a circular skeleton (`rounded-full`) alongside text-line skeletons to represent a loading user profile row.',
      },
    },
  },
  render: () => (
    <div className="w-80 flex items-center gap-4 p-4">
      <Skeleton className="size-12 rounded-full shrink-0" />
      <div className="flex flex-col gap-2 flex-1">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-48" />
      </div>
    </div>
  ),
}
