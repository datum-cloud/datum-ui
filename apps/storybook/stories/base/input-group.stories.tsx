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
  parameters: {
    docs: {
      description: {
        component:
          'Group input elements with labels, addons, and icons.\n\n'
          + '`InputGroup` composes an input with inline addons — icons, text prefixes, suffix '
          + 'buttons, or other decorators — via `InputGroupAddon`, `InputGroupText`, '
          + '`InputGroupInput`, `InputGroupButton`, and `InputGroupTextarea`.',
      },
    },
  },
}

export default meta

type Story = StoryObj<typeof InputGroup>

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'An input with an inline search icon addon positioned at the start.',
      },
    },
  },
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
