import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@datum-cloud/datum-ui/select'

const meta: Meta<typeof Select> = {
  title: 'Base/Select',
  component: Select,
  parameters: {
    docs: {
      description: {
        component:
          'A dropdown select menu with support for groups and Datum design tokens.\n\n'
          + 'The `Select` component is a styled dropdown built on Radix UI Select. It supports '
          + 'grouped options and placeholder text. '
          + 'The Datum wrapper adds custom border, background, and focus tokens on top of the '
          + 'shadcn base.\n\n'
          + 'Compose `Select` with `SelectTrigger` + `SelectValue` (the button) and '
          + '`SelectContent` + `SelectItem` (the dropdown). Use `SelectGroup` and `SelectLabel` '
          + 'to organize options into labeled sections.',
      },
    },
  },
  argTypes: {
    disabled: { control: 'boolean' },
  },
  args: {
    disabled: false,
  },
}

export default meta

type Story = StoryObj<typeof Select>

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Basic select with a placeholder and a list of simple options.',
      },
    },
  },
  render: args => (
    <Select {...args}>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="banana">Banana</SelectItem>
        <SelectItem value="cherry">Cherry</SelectItem>
        <SelectItem value="grape">Grape</SelectItem>
      </SelectContent>
    </Select>
  ),
}

export const WithGroups: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Use `SelectGroup` with a `SelectLabel` to organize options into labeled sections within the dropdown.',
      },
    },
  },
  render: () => (
    <Select>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Select a food" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Fruits</SelectLabel>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
        </SelectGroup>
        <SelectGroup>
          <SelectLabel>Vegetables</SelectLabel>
          <SelectItem value="carrot">Carrot</SelectItem>
          <SelectItem value="broccoli">Broccoli</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
}

export const Disabled: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Set `disabled` on the root `Select` to prevent interaction and apply disabled styling to the trigger.',
      },
    },
  },
  render: () => (
    <Select disabled>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Disabled select" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="option-1">Option One</SelectItem>
      </SelectContent>
    </Select>
  ),
}
