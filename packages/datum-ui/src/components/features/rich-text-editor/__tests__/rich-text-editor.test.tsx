import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { RichTextContent } from '../rich-text-content'
import { RichTextEditor } from '../rich-text-editor'

describe('richTextEditor', () => {
  it('renders the editor shell without crashing', () => {
    const { container } = render(
      <RichTextEditor>
        <RichTextEditor.Toolbar>
          <RichTextEditor.Bold />
        </RichTextEditor.Toolbar>
        <RichTextEditor.Content />
      </RichTextEditor>,
    )
    // The outer wrapper div should be present
    expect(container.firstChild).not.toBeNull()
  })
})

describe('richTextContent', () => {
  it('renders read-only HTML content', () => {
    const { container } = render(<RichTextContent content="<p>Read only</p>" />)
    expect(container.innerHTML).toContain('Read only')
  })

  it('renders nothing when content is empty', () => {
    const { container } = render(<RichTextContent content="" />)
    expect(container.firstChild).toBeNull()
  })
})
