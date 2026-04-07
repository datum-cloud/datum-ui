import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import {
  Blockquote,
  Code,
  Link,
  List,
  ListItem,
  Paragraph,
  Text,
  Title,
} from '@datum-cloud/datum-ui/typography'

const meta: Meta<typeof Title> = {
  title: 'Base/Typography',
  component: Title,
  argTypes: {
    level: {
      control: 'select',
      options: [1, 2, 3, 4, 5, 6],
    },
    weight: {
      control: 'select',
      options: ['normal', 'medium', 'semibold', 'bold', 'extrabold'],
    },
    textColor: {
      control: 'select',
      options: ['default', 'muted', 'primary', 'secondary', 'destructive', 'success', 'warning', 'info'],
    },
  },
  args: {
    level: 2,
    weight: 'semibold',
    textColor: 'default',
  },
}

export default meta

type Story = StoryObj<typeof Title>

export const Default: Story = {
  render: args => (
    <div className="max-w-prose space-y-6">
      <Title {...args}>Typography Component</Title>
      <Paragraph>
        This is a paragraph demonstrating the
        {' '}
        <Text strong>Text</Text>
        {' '}
        component with
        {' '}
        <Text italic>italic</Text>
        ,
        <Text code>code</Text>
        , and
        {' '}
        <Text mark>marked</Text>
        {' '}
        variants.
      </Paragraph>
      <Blockquote>Design is not just what it looks like. Design is how it works.</Blockquote>
      <List>
        <ListItem>First item</ListItem>
        <ListItem>Second item</ListItem>
        <ListItem>Third item</ListItem>
      </List>
      <Code as="pre">{`import { Title } from '@datum-cloud/datum-ui/typography'`}</Code>
      <Link href="#">Visit Datum Cloud</Link>
    </div>
  ),
}
