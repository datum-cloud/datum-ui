import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { Skeleton } from '@datum-cloud/datum-ui/skeleton'

const meta: Meta<typeof Skeleton> = {
  title: 'Base/Skeleton',
  component: Skeleton,
}

export default meta

type Story = StoryObj<typeof Skeleton>

export const Default: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <Skeleton className="h-4 w-[250px]" />
      <Skeleton className="h-4 w-[200px]" />
      <Skeleton className="h-4 w-[150px]" />
    </div>
  ),
}
