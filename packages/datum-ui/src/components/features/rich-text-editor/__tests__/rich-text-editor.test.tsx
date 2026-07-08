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
