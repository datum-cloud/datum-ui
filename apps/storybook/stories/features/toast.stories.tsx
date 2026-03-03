import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { Button, toast, Toaster } from '@datum-cloud/datum-ui'

const meta: Meta = {
  title: 'Features/Toast',
}

export default meta

type Story = StoryObj

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Toaster position="top-right" />
      <p className="text-muted-foreground text-sm">
        Click the buttons below to trigger different toast variants.
      </p>
      <div className="flex flex-wrap gap-3">
        <Button
          type="primary"
          onClick={() => toast.success('Operation completed successfully')}
        >
          Success
        </Button>
        <Button
          type="danger"
          onClick={() =>
            toast.error('Something went wrong', {
              description: 'Please try again later.',
            })}
        >
          Error
        </Button>
        <Button
          type="secondary"
          onClick={() =>
            toast.info('New update available', {
              description: 'Version 2.0 is ready to install.',
            })}
        >
          Info
        </Button>
        <Button
          type="warning"
          onClick={() =>
            toast.warning('Disk space low', {
              description: 'Only 500MB remaining.',
            })}
        >
          Warning
        </Button>
        <Button
          type="quaternary"
          theme="outline"
          onClick={() => toast.message('File uploaded')}
        >
          Message
        </Button>
      </div>
    </div>
  ),
}
