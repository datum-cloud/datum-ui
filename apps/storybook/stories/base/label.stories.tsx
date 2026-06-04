import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { Input } from '@datum-cloud/datum-ui/input'
import { Label } from '@datum-cloud/datum-ui/label'

const meta: Meta<typeof Label> = {
  title: 'Base/Label',
  component: Label,
  parameters: {
    docs: {
      description: {
        component:
          'An accessible text label for form controls, built on Radix UI Label.\n\n'
          + 'The `Label` component renders an accessible `<label>` element that pairs with form '
          + 'inputs. It automatically handles disabled states and provides consistent typography '
          + 'across your application.',
      },
    },
  },
  args: {
    children: 'Label Text',
  },
}

export default meta

type Story = StoryObj<typeof Label>

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Basic label rendering with the default typography styles.',
      },
    },
  },
}

export const WithInput: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Pair a `Label` with an `Input` using matching `htmlFor` and `id` attributes for accessible form fields.',
      },
    },
  },
  render: () => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="email">Email</Label>
      <Input id="email" type="email" placeholder="you@example.com" />
    </div>
  ),
}
