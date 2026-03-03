import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { Alert, AlertDescription, AlertTitle } from '@datum-cloud/datum-ui'
import { AlertTriangleIcon, CheckCircleIcon, InfoIcon, XCircleIcon } from 'lucide-react'

const meta: Meta<typeof Alert> = {
  title: 'Base/Alert',
  component: Alert,
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'default',
        'secondary',
        'outline',
        'destructive',
        'success',
        'info',
        'warning',
      ],
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
  render: args => (
    <Alert {...args}>
      <AlertTitle>Default Alert</AlertTitle>
      <AlertDescription>This is a default alert message.</AlertDescription>
    </Alert>
  ),
}

export const AllVariants: Story = {
  render: () => {
    const variants = [
      'default',
      'secondary',
      'outline',
      'destructive',
      'success',
      'info',
      'warning',
    ] as const

    return (
      <div className="flex flex-col gap-4">
        {variants.map(variant => (
          <Alert key={variant} variant={variant}>
            <AlertTitle className="capitalize">{variant}</AlertTitle>
            <AlertDescription>
              This is a
              {' '}
              {variant}
              {' '}
              alert variant.
            </AlertDescription>
          </Alert>
        ))}
      </div>
    )
  },
}

export const Closable: Story = {
  render: args => (
    <Alert {...args} closable>
      <AlertTitle>Closable Alert</AlertTitle>
      <AlertDescription>
        Click the close button to dismiss this alert.
      </AlertDescription>
    </Alert>
  ),
}

export const WithIcon: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Alert variant="info">
        <InfoIcon className="size-4" />
        <AlertTitle>Information</AlertTitle>
        <AlertDescription>
          This alert includes an informational icon.
        </AlertDescription>
      </Alert>
      <Alert variant="warning">
        <AlertTriangleIcon className="size-4" />
        <AlertTitle>Warning</AlertTitle>
        <AlertDescription>
          This alert includes a warning icon.
        </AlertDescription>
      </Alert>
      <Alert variant="success">
        <CheckCircleIcon className="size-4" />
        <AlertTitle>Success</AlertTitle>
        <AlertDescription>
          This alert includes a success icon.
        </AlertDescription>
      </Alert>
      <Alert variant="destructive">
        <XCircleIcon className="size-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          This alert includes a destructive icon.
        </AlertDescription>
      </Alert>
    </div>
  ),
}
