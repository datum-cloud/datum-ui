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
}

export default meta

type Story = StoryObj<typeof Card>

export const Default: Story = {
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
