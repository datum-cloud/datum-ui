import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { VisuallyHidden } from '@datum-cloud/datum-ui/visually-hidden'
import { SearchIcon } from 'lucide-react'

const meta: Meta = {
  title: 'Base/VisuallyHidden',
  parameters: {
    docs: {
      description: {
        component:
          'Hide content visually while keeping it accessible to screen readers.\n\n'
          + 'VisuallyHidden is re-exported from shadcn/ui. Use `VisuallyHidden.Root` to wrap text that '
          + 'should be announced by screen readers but not visible on screen — for example, labelling '
          + 'icon-only buttons.',
      },
    },
  },
}

export default meta

type Story = StoryObj

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'An icon-only button where `VisuallyHidden.Root` provides a screen-reader label without visible text.',
      },
    },
  },
  render: () => (
    <button
      type="button"
      className="rounded-md border p-2"
      aria-label="Search"
    >
      <SearchIcon className="size-4" />
      <VisuallyHidden.Root>Search</VisuallyHidden.Root>
    </button>
  ),
}
