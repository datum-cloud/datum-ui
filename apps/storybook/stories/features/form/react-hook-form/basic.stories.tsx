import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { RHFAdapter } from '@datum-cloud/datum-ui/form/adapters/rhf'
import { BasicFormStory } from '../_shared'

const meta: Meta = {
  title: 'Features/Form/React Hook Form/Basic',
  parameters: {
    docs: {
      description: {
        component:
          'A compound component form system with pluggable adapter support for Conform.js or React Hook Form, powered by Zod schema validation.\n\n'
          + 'The `Form` component provides a declarative API for building forms through a pluggable adapter system — '
          + 'choose between Conform.js or React Hook Form as the form backend while the component API stays identical. '
          + 'All sub-components are accessed through the `Form` namespace (`Form.Root`, `Form.Field`, `Form.Input`, '
          + '`Form.Select`, `Form.Checkbox`, `Form.Switch`, `Form.RadioGroup`, `Form.FieldArray`, `Form.When`, '
          + '`Form.Dialog`, and more). This story uses the React Hook Form adapter; see the Conform folder for the '
          + 'Conform.js adapter variant.',
      },
    },
  },
  decorators: [
    Story => (
      <RHFAdapter>
        <Story />
      </RHFAdapter>
    ),
  ],
}
export default meta
type Story = StoryObj

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Basic form with `Form.Root`, `Form.Field`, `Form.Input`, and `Form.Submit`. '
          + 'Pass a Zod `schema` and an `onSubmit` handler to `Form.Root`; validation runs automatically. '
          + 'Required fields show an asterisk and error messages appear below the input.',
      },
    },
  },
  render: () => <BasicFormStory />,
}
