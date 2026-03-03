import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@datum-cloud/datum-ui'

const meta: Meta<typeof Card> = {
  title: 'Base/Card',
  component: Card,
}

export default meta
type Story = StoryObj<typeof Card>

export const Default: Story = {
  render: () => (
    <Card className="w-[380px]">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>
          Card description providing additional context.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          This is the main content area of the card. You can place any content
          here including forms, lists, or other components.
        </p>
      </CardContent>
      <CardFooter>
        <Button type="primary" theme="solid" size="default">
          Action
        </Button>
      </CardFooter>
    </Card>
  ),
}

export const Simple: Story = {
  render: () => (
    <Card className="w-[380px]">
      <CardContent>
        <p className="text-sm text-muted-foreground">
          A simple card with only content, no header or footer.
        </p>
      </CardContent>
    </Card>
  ),
}

export const WithActions: Story = {
  render: () => (
    <Card className="w-[380px]">
      <CardHeader>
        <CardTitle>Project Settings</CardTitle>
        <CardDescription>
          Manage your project configuration and preferences.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Review and update project settings below. Changes will be applied
          immediately after saving.
        </p>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button type="secondary" theme="outline" size="default">
          Cancel
        </Button>
        <Button type="primary" theme="solid" size="default">
          Save Changes
        </Button>
      </CardFooter>
    </Card>
  ),
}
