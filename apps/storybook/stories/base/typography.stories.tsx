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
} from '@datum-cloud/datum-ui'

const meta: Meta = {
  title: 'Base/Typography',
}

export default meta

type Story = StoryObj

export const Titles: Story = {
  render: () => (
    <div className="space-y-4">
      <Title level={1}>Heading Level 1</Title>
      <Title level={2}>Heading Level 2</Title>
      <Title level={3}>Heading Level 3</Title>
      <Title level={4}>Heading Level 4</Title>
      <Title level={5}>Heading Level 5</Title>
      <Title level={6}>Heading Level 6</Title>
    </div>
  ),
}

export const TitleColors: Story = {
  render: () => (
    <div className="space-y-3">
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

export const TitleWeights: Story = {
  render: () => (
    <div className="space-y-3">
      <Title level={3} weight="normal">Normal</Title>
      <Title level={3} weight="medium">Medium</Title>
      <Title level={3} weight="semibold">Semibold</Title>
      <Title level={3} weight="bold">Bold</Title>
      <Title level={3} weight="extrabold">Extrabold</Title>
    </div>
  ),
}

export const TextVariants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Text>Default</Text>
      <Text strong>Strong</Text>
      <Text italic>Italic</Text>
      <Text underline>Underline</Text>
      <Text delete>Delete</Text>
      <Text code>Code</Text>
      <Text mark>Mark</Text>
    </div>
  ),
}

export const TextSizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-baseline gap-4">
      <Text size="xs">Extra Small</Text>
      <Text size="sm">Small</Text>
      <Text size="base">Base</Text>
      <Text size="lg">Large</Text>
      <Text size="xl">Extra Large</Text>
      <Text size="2xl">2XL</Text>
    </div>
  ),
}

export const TextColors: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Text textColor="default">Default</Text>
      <Text textColor="muted">Muted</Text>
      <Text textColor="primary">Primary</Text>
      <Text textColor="destructive">Destructive</Text>
      <Text textColor="success">Success</Text>
      <Text textColor="warning">Warning</Text>
      <Text textColor="info">Info</Text>
    </div>
  ),
}

export const CopyableText: Story = {
  render: () => (
    <div className="space-y-3">
      <Text copyable>Click the icon to copy this text</Text>
    </div>
  ),
}

export const EllipsisText: Story = {
  render: () => (
    <div className="w-48 border p-2">
      <Text ellipsis>
        This is a very long text that will be truncated with an ellipsis when it overflows
      </Text>
    </div>
  ),
}

export const Paragraphs: Story = {
  render: () => (
    <div className="max-w-prose space-y-6">
      <Paragraph>
        Default paragraph with relaxed leading. Useful for body text in articles,
        descriptions, and general content areas.
      </Paragraph>
      <Paragraph spacing="tight">
        Tight spacing paragraph. More compact line height for dense UI text like
        table descriptions or card subtitles.
      </Paragraph>
      <Paragraph spacing="loose">
        Loose spacing paragraph. Extra breathing room between lines, good for
        long-form reading or large text blocks.
      </Paragraph>
    </div>
  ),
}

export const Links: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Link href="https://datum.net">Default link</Link>
      <Link href="https://datum.net" target="_blank">Opens in new tab</Link>
    </div>
  ),
}

export const Lists: Story = {
  render: () => (
    <div className="flex gap-12">
      <div>
        <Title level={5} className="mb-3">Unordered</Title>
        <List>
          <ListItem>First item</ListItem>
          <ListItem>Second item</ListItem>
          <ListItem>Third item</ListItem>
        </List>
      </div>
      <div>
        <Title level={5} className="mb-3">Ordered</Title>
        <List listType="ordered">
          <ListItem>Step one</ListItem>
          <ListItem>Step two</ListItem>
          <ListItem>Step three</ListItem>
        </List>
      </div>
    </div>
  ),
}

export const Blockquotes: Story = {
  render: () => (
    <div className="max-w-prose">
      <Blockquote>
        The best way to predict the future is to invent it.
      </Blockquote>
    </div>
  ),
}

export const CodeExamples: Story = {
  render: () => (
    <div className="space-y-4">
      <Paragraph>
        Use the
        {' '}
        <Code>useState</Code>
        {' '}
        hook for local state management.
      </Paragraph>
      <Code as="pre">
        {`function hello() {
  console.log('Hello, world!')
}`}
      </Code>
    </div>
  ),
}

export const KitchenSink: Story = {
  render: () => (
    <div className="max-w-prose space-y-6">
      <Title level={1}>Kitchen Sink</Title>
      <Paragraph>
        This story demonstrates all typography components together. You can use
        {' '}
        <Text strong>strong</Text>
        ,
        <Text italic>italic</Text>
        ,
        {' '}
        <Text code>code</Text>
        , and
        <Text mark>marked</Text>
        {' '}
        text inline.
      </Paragraph>

      <Title level={2}>Section Heading</Title>
      <Paragraph>
        Visit
        {' '}
        <Link href="https://datum.net">Datum Cloud</Link>
        {' '}
        for more
        information about our platform.
      </Paragraph>

      <Blockquote>
        Design is not just what it looks like and feels like.
        Design is how it works.
      </Blockquote>

      <Title level={3}>Features</Title>
      <List>
        <ListItem>Responsive heading sizes</ListItem>
        <ListItem>Inline text formatting</ListItem>
        <ListItem>Theme-aware colors</ListItem>
      </List>

      <Code as="pre">
        {`import { Title, Text } from '@datum-cloud/datum-ui'

<Title level={1}>Hello</Title>
<Text strong>World</Text>`}
      </Code>
    </div>
  ),
}
