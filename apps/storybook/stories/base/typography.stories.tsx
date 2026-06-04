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
  parameters: {
    docs: {
      description: {
        component:
          'Semantic typography components with responsive sizing, weight, and color variants.\n\n'
          + 'The Typography module provides `Title`, `Text`, `Paragraph`, `Link`, `List`, `ListItem`, '
          + '`Blockquote`, and `Code`. All components use CVA variants for consistent sizing, weight, and color. '
          + '`Title` renders responsive heading elements (h1–h6), `Text` supports inline formatting shortcuts '
          + '(`strong`, `italic`, `code`, `mark`, `underline`, `delete`) and a `copyable` prop, and `Paragraph` '
          + 'handles block-level text with spacing control.',
      },
    },
  },
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
  parameters: {
    docs: {
      description: {
        story: 'Showcase of all Typography sub-components together: Title, Paragraph, Text variants, Blockquote, List, Code, and Link.',
      },
    },
  },
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

export const TitleLevels: Story = {
  parameters: {
    docs: {
      description: {
        story: 'The `level` prop controls both the rendered heading element (h1–h6) and its responsive sizing.',
      },
    },
  },
  render: () => (
    <div className="space-y-2">
      <Title level={1}>Heading 1</Title>
      <Title level={2}>Heading 2</Title>
      <Title level={3}>Heading 3</Title>
      <Title level={4}>Heading 4</Title>
      <Title level={5}>Heading 5</Title>
      <Title level={6}>Heading 6</Title>
    </div>
  ),
}

export const TitleColors: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Use the `textColor` prop to apply semantic color variants to headings.',
      },
    },
  },
  render: () => (
    <div className="space-y-2">
      <Title level={3} textColor="default">Default</Title>
      <Title level={3} textColor="muted">Muted</Title>
      <Title level={3} textColor="primary">Primary</Title>
      <Title level={3} textColor="destructive">Destructive</Title>
      <Title level={3} textColor="success">Success</Title>
      <Title level={3} textColor="warning">Warning</Title>
      <Title level={3} textColor="info">Info</Title>
    </div>
  ),
}

export const TextVariants: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Text supports boolean shortcut props for common inline formatting: `strong`, `italic`, `underline`, `delete`, `code`, and `mark`.',
      },
    },
  },
  render: () => (
    <div className="space-y-2">
      <div><Text>Default text</Text></div>
      <div><Text strong>Strong text</Text></div>
      <div><Text italic>Italic text</Text></div>
      <div><Text underline>Underlined text</Text></div>
      <div><Text delete>Deleted text</Text></div>
      <div><Text code>Code text</Text></div>
      <div><Text mark>Marked text</Text></div>
    </div>
  ),
}

export const TextSizes: Story = {
  parameters: {
    docs: {
      description: {
        story: 'The `size` prop controls font size across a scale from `xs` to `xl`.',
      },
    },
  },
  render: () => (
    <div className="space-y-2">
      <div><Text size="xs">Extra small</Text></div>
      <div><Text size="sm">Small</Text></div>
      <div><Text size="base">Base</Text></div>
      <div><Text size="lg">Large</Text></div>
      <div><Text size="xl">Extra large</Text></div>
    </div>
  ),
}

export const ParagraphSpacing: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Control line-height with the `spacing` prop: `tight`, `normal` (default), or `loose`.',
      },
    },
  },
  render: () => (
    <div className="max-w-prose space-y-4">
      <Paragraph spacing="tight">Tight line spacing. Useful for compact layouts and secondary descriptive text.</Paragraph>
      <Paragraph spacing="normal">Normal line spacing. The default for body text in articles and general content areas.</Paragraph>
      <Paragraph spacing="loose">Loose line spacing. Provides extra breathing room for reading-heavy interfaces.</Paragraph>
    </div>
  ),
}

export const ListTypes: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Use `listType="ordered"` for numbered lists or the default `"unordered"` for bulleted lists.',
      },
    },
  },
  render: () => (
    <div className="flex gap-12">
      <List>
        <ListItem>First item</ListItem>
        <ListItem>Second item</ListItem>
        <ListItem>Third item</ListItem>
      </List>
      <List listType="ordered">
        <ListItem>Step one</ListItem>
        <ListItem>Step two</ListItem>
        <ListItem>Step three</ListItem>
      </List>
    </div>
  ),
}
