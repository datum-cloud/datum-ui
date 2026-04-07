import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { FileInputButton } from '@datum-cloud/datum-ui/dropzone'

const meta: Meta<typeof FileInputButton> = {
  title: 'Features/FileInputButton',
  component: FileInputButton,
  argTypes: {
    disabled: { control: 'boolean' },
    multiple: { control: 'boolean' },
    type: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary', 'quaternary'],
    },
    theme: {
      control: 'select',
      options: ['solid', 'light', 'outline', 'borderless'],
    },
    size: {
      control: 'select',
      options: ['xs', 'small', 'default', 'large'],
    },
  },
  args: {
    disabled: false,
    multiple: false,
    type: 'primary',
    theme: 'solid',
    size: 'default',
    children: 'Upload File',
  },
}

export default meta

type Story = StoryObj<typeof FileInputButton>

export const Default: Story = {
  render: args => (
    <FileInputButton
      {...args}
      onFileSelect={files => alert(`Selected: ${files.map(f => f.name).join(', ')}`)}
      onFileError={err => alert(err.message)}
    />
  ),
}
