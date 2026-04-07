import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from '@datum-cloud/datum-ui/input-group'
import { SearchIcon } from 'lucide-react'

const meta: Meta<typeof InputGroup> = {
  title: 'Base/InputGroup',
  component: InputGroup,
}

export default meta

type Story = StoryObj<typeof InputGroup>

export const Default: Story = {
  render: args => (
    <InputGroup className="w-80" {...args}>
      <InputGroupAddon align="inline-start">
        <InputGroupText>
          <SearchIcon />
        </InputGroupText>
      </InputGroupAddon>
      <InputGroupInput placeholder="Search..." />
    </InputGroup>
  ),
}
