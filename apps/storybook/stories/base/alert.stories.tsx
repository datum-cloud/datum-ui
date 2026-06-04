import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { Alert, AlertDescription, AlertTitle } from '@datum-cloud/datum-ui/alert'

const meta: Meta<typeof Alert> = {
  title: 'Base/Alert',
  component: Alert,
  parameters: {
    docs: {
      description: {
        component:
          'Display contextual feedback messages with semantic variants and optional dismiss functionality.\n\n'
          + 'The Alert component supports seven semantic variants for different contexts: `default`, '
          + '`secondary`, `outline`, `destructive`, `success`, `info`, and `warning`. It includes an '
          + 'optional close button (`closable`) for dismissible alerts, with an `onClose` callback for '
          + 'custom handling or auto-hide behavior when omitted.',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'outline', 'destructive', 'success', 'info', 'warning'],
    },
    closable: {
      control: 'boolean',
    },
  },
  args: {
    variant: 'default',
    closable: false,
  },
}

export default meta

type Story = StoryObj<typeof Alert>

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Basic usage of the Alert component with the default variant.',
      },
    },
  },
  render: args => (
    <Alert {...args}>
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription>You can add components to your app using the CLI.</AlertDescription>
    </Alert>
  ),
}

export const Variants: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The Alert supports seven semantic variants: `default`, `secondary`, `outline`, `destructive`, '
          + '`success`, `info`, and `warning`. Each maps to a distinct color palette for contextual feedback.',
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-4">
      <Alert variant="default">
        <AlertTitle>Default</AlertTitle>
        <AlertDescription>This is a default alert.</AlertDescription>
      </Alert>
      <Alert variant="secondary">
        <AlertTitle>Secondary</AlertTitle>
        <AlertDescription>This is a secondary alert.</AlertDescription>
      </Alert>
      <Alert variant="outline">
        <AlertTitle>Outline</AlertTitle>
        <AlertDescription>This is an outline alert.</AlertDescription>
      </Alert>
      <Alert variant="destructive">
        <AlertTitle>Destructive</AlertTitle>
        <AlertDescription>Your session has expired. Please log in again.</AlertDescription>
      </Alert>
      <Alert variant="success">
        <AlertTitle>Success</AlertTitle>
        <AlertDescription>Your changes have been saved successfully.</AlertDescription>
      </Alert>
      <Alert variant="info">
        <AlertTitle>Info</AlertTitle>
        <AlertDescription>A new software update is available.</AlertDescription>
      </Alert>
      <Alert variant="warning">
        <AlertTitle>Warning</AlertTitle>
        <AlertDescription>Your account is approaching its storage limit.</AlertDescription>
      </Alert>
    </div>
  ),
}

export const Closable: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Set `closable` to `true` to show a dismiss button. Provide `onClose` for custom handling, '
          + 'or omit it to auto-hide the alert when dismissed.',
      },
    },
  },
  render: () => (
    <Alert variant="info" closable>
      <AlertTitle>Dismissible</AlertTitle>
      <AlertDescription>Click the close button to dismiss this alert.</AlertDescription>
    </Alert>
  ),
}
