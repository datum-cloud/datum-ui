import type { ComponentProps } from 'react'
import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { Button } from '@datum-cloud/datum-ui/button'
import { toast, Toaster } from '@datum-cloud/datum-ui/toast'

type Position = ComponentProps<typeof Toaster>['position']

const meta: Meta = {
  title: 'Features/Toast',
  parameters: {
    docs: {
      description: {
        component:
          'Ephemeral notification messages triggered by user actions.\n\n'
          + 'Toasts display brief, auto-dismissing messages at the edge of the screen. datum-ui wraps '
          + '[Sonner](https://sonner.emilkowal.dev/) — render the `<Toaster />` provider once in your root layout '
          + 'and call `toast()` (or `toast.success`, `toast.error`, `toast.warning`, `toast.promise`) anywhere in '
          + 'your app. Requires `sonner`.',
      },
    },
  },
  argTypes: {
    position: {
      control: 'select',
      options: ['top-left', 'top-center', 'top-right', 'bottom-left', 'bottom-center', 'bottom-right'],
    },
  },
  args: {
    position: 'top-right',
  },
}

export default meta

type Story = StoryObj

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Trigger the five core toast variants — success, error, info, warning, and plain message — '
          + 'via button clicks. The `<Toaster />` is rendered once at the canvas level; '
          + 'use the `position` control to change where toasts appear.',
      },
    },
  },
  render: (args: Record<string, unknown>) => (
    <div className="flex flex-col gap-4">
      <Toaster position={(args.position as Position) ?? 'top-right'} />
      <p className="text-muted-foreground text-sm">Click the buttons to trigger different toast variants.</p>
      <div className="flex flex-wrap gap-3">
        <Button type="primary" onClick={() => toast.success('Operation completed successfully')}>
          Success
        </Button>
        <Button
          type="danger"
          onClick={() => toast.error('Something went wrong', { description: 'Please try again later.' })}
        >
          Error
        </Button>
        <Button
          type="secondary"
          onClick={() => toast.info('New update available', { description: 'Version 2.0 is ready.' })}
        >
          Info
        </Button>
        <Button
          type="warning"
          onClick={() => toast.warning('Disk space low', { description: 'Only 500MB remaining.' })}
        >
          Warning
        </Button>
        <Button type="quaternary" theme="outline" onClick={() => toast.message('File uploaded')}>
          Message
        </Button>
      </div>
    </div>
  ),
}
