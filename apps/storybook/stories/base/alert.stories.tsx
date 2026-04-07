import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { Alert, AlertDescription, AlertTitle } from '@datum-cloud/datum-ui/alert'
import { TerminalIcon } from 'lucide-react'

const meta: Meta<typeof Alert> = {
  title: 'Base/Alert',
  component: Alert,
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive'],
    },
  },
  args: {
    variant: 'default',
  },
}

export default meta

type Story = StoryObj<typeof Alert>

export const Default: Story = {
  render: args => (
    <Alert {...args}>
      <TerminalIcon className="size-4" />
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription>You can add components to your app using the CLI.</AlertDescription>
    </Alert>
  ),
}
