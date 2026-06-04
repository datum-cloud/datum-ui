import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { Button } from '@datum-cloud/datum-ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@datum-cloud/datum-ui/card'

const meta: Meta<typeof Card> = {
  title: 'Base/Card',
  component: Card,
  parameters: {
    docs: {
      description: {
        component:
          'A container component for grouping related content with optional header, footer, and description sections.\n\n'
          + 'The Card component provides a styled container for grouping related content. It includes '
          + 'sub-components for structured layouts: `CardHeader`, `CardTitle`, `CardDescription`, '
          + '`CardContent`, and `CardFooter`.',
      },
    },
  },
}

export default meta

type Story = StoryObj<typeof Card>

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'A card with header (title + description), content, and footer action buttons.',
      },
    },
  },
  render: args => (
    <Card className="w-[380px]" {...args}>
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card description providing additional context.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-sm">
          This is the main content area of the card. You can place any content here.
        </p>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button type="secondary" theme="outline">Cancel</Button>
        <Button type="primary">Save Changes</Button>
      </CardFooter>
    </Card>
  ),
}

export const SimpleCard: Story = {
  parameters: {
    docs: {
      description: {
        story: 'A card with content only, without a header or footer.',
      },
    },
  },
  render: () => (
    <Card className="w-[380px]">
      <CardContent>
        <p className="text-muted-foreground text-sm">
          A simple card with only content, no header or footer.
        </p>
      </CardContent>
    </Card>
  ),
}

export const WithFooterActions: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Use `CardFooter` to place actions at the bottom of the card.',
      },
    },
  },
  render: () => (
    <Card className="w-[380px]">
      <CardHeader>
        <CardTitle>Project Settings</CardTitle>
        <CardDescription>Manage your project configuration and preferences.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-sm">
          Review and update project settings below. Changes will be applied immediately after saving.
        </p>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button type="secondary" theme="outline">Cancel</Button>
        <Button type="primary" theme="solid">Save Changes</Button>
      </CardFooter>
    </Card>
  ),
}

export const FullExample: Story = {
  parameters: {
    docs: {
      description: {
        story: 'A complete card showcasing all sub-components: header, title, description, content, and footer.',
      },
    },
  },
  render: () => (
    <Card className="w-[380px]">
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>Configure how you receive notifications.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2 text-sm">
          <div className="flex items-center justify-between">
            <span>Email notifications</span>
            <span className="text-muted-foreground">Enabled</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Push notifications</span>
            <span className="text-muted-foreground">Disabled</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button type="primary" theme="solid" block>Update Preferences</Button>
      </CardFooter>
    </Card>
  ),
}
