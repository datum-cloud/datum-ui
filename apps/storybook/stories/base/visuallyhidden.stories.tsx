import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { VisuallyHidden } from '@datum-cloud/datum-ui/visually-hidden'
import { SearchIcon } from 'lucide-react'

const meta: Meta = {
  title: 'Base/VisuallyHidden',
}

export default meta

type Story = StoryObj

export const Default: Story = {
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
