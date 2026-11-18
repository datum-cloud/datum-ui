import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { ErrorContent, ErrorDescriptionProvider } from '@datum-cloud/datum-ui/error-content'

const RBAC_DENIAL = 'forbidden: User \'jane@example.com\' cannot patch resource "dnsrecordsets" in API group "dns.networking.miloapis.com" in the namespace "default"'

const meta: Meta<typeof ErrorContent> = {
  title: 'Features/ErrorContent',
  component: ErrorContent,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Shows an error in plain language: a headline, the next step and actions, with the raw '
          + 'technical text in a collapsed **Error details** section. `describeApiError` writes the '
          + 'headline; wrap the app in `ErrorDescriptionProvider` to change the wording.',
      },
    },
  },
  argTypes: {
    variant: { control: 'select', options: ['default', 'minimal'] },
  },
  args: {
    variant: 'default',
  },
}

export default meta
type Story = StoryObj<typeof ErrorContent>

export const PermissionDenied: Story = {
  args: {
    error: { kind: 'Status', reason: 'Forbidden', code: 403, message: RBAC_DENIAL, requestId: 'req-7f3a' },
    actions: [{ label: 'Retry', onClick: () => {} }],
  },
}

export const WithProductAreaLabels: Story = {
  render: args => (
    <ErrorDescriptionProvider apiGroupLabels={{ 'dns.networking.miloapis.com': 'Networking/DNS' }}>
      <ErrorContent {...args} />
    </ErrorDescriptionProvider>
  ),
  args: {
    error: { kind: 'Status', reason: 'Forbidden', code: 403, message: RBAC_DENIAL },
  },
}

export const ReadableMessage: Story = {
  args: {
    error: new Error('Project is not ready: the quota for load balancers is used up.'),
  },
}

export const SessionExpired: Story = {
  args: {
    error: { kind: 'Status', reason: 'Unauthorized', code: 401, message: 'Unauthorized' },
    actions: [{ label: 'Sign in', as: 'link', to: '/login' }],
  },
}
