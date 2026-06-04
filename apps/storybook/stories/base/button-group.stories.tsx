import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { Button } from '@datum-cloud/datum-ui/button'
import { ButtonGroup } from '@datum-cloud/datum-ui/button-group'

const meta: Meta<typeof ButtonGroup> = {
  title: 'Base/ButtonGroup',
  component: ButtonGroup,
  parameters: {
    docs: {
      description: {
        component:
          'Group related buttons together with consistent spacing and styling.\n\n'
          + 'ButtonGroup joins a set of buttons into a cohesive unit, removing intermediate gaps and '
          + 'adjusting border radii so only the outer edges are rounded. Supports both `horizontal` '
          + '(default) and `vertical` orientations.',
      },
    },
  },
  argTypes: {
    orientation: {
      control: 'radio',
      options: ['horizontal', 'vertical'],
    },
  },
  args: {
    orientation: 'horizontal',
  },
}

export default meta

type Story = StoryObj<typeof ButtonGroup>

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Three outline buttons grouped horizontally with shared borders and consistent styling.',
      },
    },
  },
  render: args => (
    <ButtonGroup {...args}>
      <Button type="primary" theme="outline">Left</Button>
      <Button type="primary" theme="outline">Center</Button>
      <Button type="primary" theme="outline">Right</Button>
    </ButtonGroup>
  ),
}

export const Vertical: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Set `orientation` to `"vertical"` to stack buttons in a column instead of a row.',
      },
    },
  },
  render: () => (
    <ButtonGroup orientation="vertical">
      <Button type="primary" theme="outline">Top</Button>
      <Button type="primary" theme="outline">Middle</Button>
      <Button type="primary" theme="outline">Bottom</Button>
    </ButtonGroup>
  ),
}
