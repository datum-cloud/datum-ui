import type { RichTextEditorContextValue } from '../types'
import { act, render } from '@testing-library/react'
import { StrictMode } from 'react'
import { describe, expect, it } from 'vitest'
import { RichTextContent } from '../rich-text-content'
import { RichTextEditor, useRichTextEditor } from '../rich-text-editor'

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

describe('richTextEditor — after the editor is destroyed', () => {
  type Editor = NonNullable<RichTextEditorContextValue['editor']>

  /** Renders the editor and hands back the first Tiptap instance it created. */
  function renderEditor(props: { disabled?: boolean, content?: string, placeholder?: string }) {
    let firstEditor: Editor | null = null
    function Probe() {
      const { editor } = useRichTextEditor()
      firstEditor ??= editor
      return null
    }
    const ui = (next: typeof props) => (
      <RichTextEditor {...next}>
        <Probe />
        <RichTextEditor.Toolbar>
          <RichTextEditor.Bold />
        </RichTextEditor.Toolbar>
        <RichTextEditor.Content />
        <RichTextEditor.CharacterCount />
      </RichTextEditor>
    )
    const view = render(ui(props))
    if (!firstEditor)
      throw new Error('editor was not created')
    return { ...view, editor: firstEditor as Editor, rerenderWith: (next: typeof props) => view.rerender(ui(next)) }
  }

  it('does not throw when disabled changes', () => {
    const { editor, rerenderWith } = renderEditor({ disabled: false })
    act(() => editor.destroy())

    expect(() => rerenderWith({ disabled: true })).not.toThrow()
  })

  it('does not throw when content changes', () => {
    const { editor, rerenderWith } = renderEditor({ content: '<p>First</p>' })
    act(() => editor.destroy())

    expect(() => rerenderWith({ content: '<p>Second</p>' })).not.toThrow()
  })

  it('does not throw when placeholder changes', () => {
    const { editor, rerenderWith } = renderEditor({ placeholder: 'Write a note' })
    act(() => editor.destroy())

    expect(() => rerenderWith({ placeholder: 'Schreib eine Notiz' })).not.toThrow()
  })

  it('mounts and updates under StrictMode effect re-runs', () => {
    const ui = (content: string, disabled: boolean) => (
      <StrictMode>
        <RichTextEditor content={content} disabled={disabled} placeholder="Write a note">
          <RichTextEditor.Content />
        </RichTextEditor>
      </StrictMode>
    )
    const { rerender, container } = render(ui('<p>First</p>', true))

    expect(() => rerender(ui('<p>Second</p>', false))).not.toThrow()
    expect(container.innerHTML).toContain('Second')
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

  it('preserves relative, anchor, and tel links without corrupting hrefs', () => {
    const { container } = render(
      <RichTextContent content={'<p><a href="/pricing">Pricing</a> <a href="#faq">FAQ</a> <a href="tel:+15550100">Call</a></p>'} />,
    )
    const hrefs = Array.from(container.querySelectorAll('a')).map(a => a.getAttribute('href'))
    expect(hrefs).toEqual(['/pricing', '#faq', 'tel:+15550100'])
  })

  it('does not force new-tab on same-page and relative links', () => {
    const { container } = render(
      <RichTextContent content={'<p><a href="#faq">FAQ</a></p>'} />,
    )
    const link = container.querySelector('a')
    expect(link?.getAttribute('target')).toBeNull()
  })

  it('prefixes bare domains with https and hardens them as external links', () => {
    const { container } = render(
      <RichTextContent content={'<p><a href="example.com">Example</a></p>'} />,
    )
    const link = container.querySelector('a')
    expect(link?.getAttribute('href')).toBe('https://example.com')
    expect(link?.getAttribute('target')).toBe('_blank')
    expect(link?.getAttribute('rel')).toBe('noopener noreferrer')
  })
})
