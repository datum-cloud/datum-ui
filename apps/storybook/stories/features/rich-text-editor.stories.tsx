import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { RichTextContent, RichTextEditor } from '@datum-cloud/datum-ui/rich-text-editor'
import { useState } from 'react'

const meta: Meta<typeof RichTextEditor> = {
  title: 'Features/RichTextEditor',
  component: RichTextEditor,
}

export default meta

type Story = StoryObj<typeof RichTextEditor>

function EditorStory() {
  const [content, setContent] = useState('<p>Start editing here…</p>')
  return (
    <div className="w-full max-w-2xl space-y-4">
      <RichTextEditor
        content={content}
        placeholder="Write something…"
        onChange={setContent}
      >
        <RichTextEditor.Toolbar>
          <RichTextEditor.Bold />
          <RichTextEditor.Italic />
          <RichTextEditor.Underline />
          <RichTextEditor.Strike />
          <RichTextEditor.Separator />
          <RichTextEditor.Link />
        </RichTextEditor.Toolbar>
        <RichTextEditor.Content />
      </RichTextEditor>

      <details className="rounded border p-3">
        <summary className="text-muted-foreground cursor-pointer text-xs">
          Raw HTML output
        </summary>
        <pre className="mt-2 text-xs break-all whitespace-pre-wrap">{content}</pre>
      </details>
    </div>
  )
}

export const Editor: Story = {
  render: () => <EditorStory />,
}

export const ReadOnly: Story = {
  render: () => (
    <div className="w-full max-w-2xl">
      <RichTextContent
        content="<p>Rich <strong>HTML</strong> with <em>italic</em>, <u>underline</u>, and a <a href='https://example.com'>link</a>.</p>"
      />
    </div>
  ),
}
