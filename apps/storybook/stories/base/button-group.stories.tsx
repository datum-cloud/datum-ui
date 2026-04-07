import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { Button } from '@datum-cloud/datum-ui/button'
import { ButtonGroup } from '@datum-cloud/datum-ui/button-group'

const meta: Meta<typeof ButtonGroup> = {
  title: 'Base/ButtonGroup',
  component: ButtonGroup,
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
  render: args => (
    <ButtonGroup {...args}>
      <Button type="primary" theme="outline">Left</Button>
      <Button type="primary" theme="outline">Center</Button>
      <Button type="primary" theme="outline">Right</Button>
    </ButtonGroup>
  ),
}
