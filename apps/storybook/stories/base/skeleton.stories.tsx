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

export const CardSkeleton: Story = {
  render: () => (
    <div className="flex flex-col gap-4 rounded-xl border p-6 w-[380px]">
      <div className="flex items-center gap-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-[160px]" />
          <Skeleton className="h-3 w-[120px]" />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-[80%]" />
      </div>
      <div className="flex justify-end gap-2">
        <Skeleton className="h-9 w-[80px] rounded-md" />
        <Skeleton className="h-9 w-[80px] rounded-md" />
      </div>
    </div>
  ),
}
