/// <reference types="@testing-library/jest-dom/vitest" />
import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { z } from 'zod'
import { TagsInput } from '../tag-input'

describe('tagsInput', () => {
  it('renders existing tags', () => {
    render(<TagsInput value={['React', 'Vue']} onValueChange={vi.fn()} />)

    expect(screen.getByText('React')).toBeInTheDocument()
    expect(screen.getByText('Vue')).toBeInTheDocument()
  })

  it('renders placeholder when empty', () => {
    render(
      <TagsInput value={[]} onValueChange={vi.fn()} placeholder="Add tags..." />,
    )

    expect(screen.getByPlaceholderText('Add tags...')).toBeInTheDocument()
  })

  it('adds a tag when Enter is pressed', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(
      <TagsInput value={[]} onValueChange={onValueChange} placeholder="Add tags..." />,
    )

    const input = screen.getByPlaceholderText('Add tags...')
    await user.click(input)
    await user.type(input, 'NewTag{Enter}')

    expect(onValueChange).toHaveBeenCalledWith(['NewTag'])
  })

  it('adds a tag when comma is typed', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(
      <TagsInput value={[]} onValueChange={onValueChange} placeholder="Add tags..." />,
    )

    const input = screen.getByPlaceholderText('Add tags...')
    await user.click(input)
    await user.type(input, 'NewTag,')

    expect(onValueChange).toHaveBeenCalledWith(['NewTag'])
  })

  it('removes a tag when remove button is clicked', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(
      <TagsInput value={['React', 'Vue']} onValueChange={onValueChange} />,
    )

    const removeButton = screen.getByLabelText('Remove React option')
    await user.click(removeButton)

    expect(onValueChange).toHaveBeenCalledWith(['Vue'])
  })

  it('does not add duplicate tags', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(
      <TagsInput
        value={['React']}
        onValueChange={onValueChange}
        placeholder="Add tags..."
      />,
    )

    const input = screen.getByPlaceholderText('Add tags...')
    await user.click(input)
    await user.type(input, 'React{Enter}')

    expect(onValueChange).not.toHaveBeenCalled()
  })

  it('respects maxItems', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(
      <TagsInput
        value={['React', 'Vue']}
        onValueChange={onValueChange}
        maxItems={2}
        placeholder="Add tags..."
      />,
    )

    const input = screen.getByPlaceholderText('Add tags...')
    await user.click(input)
    await user.type(input, 'Angular{Enter}')

    expect(onValueChange).not.toHaveBeenCalled()
  })
})

describe('tagsInput — configurable delimiters', () => {
  it('confirms pending tag when a configured delimiter key is pressed', () => {
    const onValueChange = vi.fn()
    render(
      <TagsInput value={[]} onValueChange={onValueChange} delimiters={[':']} />,
    )
    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'hello' } })
    fireEvent.keyDown(input, { key: ':' })
    expect(onValueChange).toHaveBeenCalledWith(['hello'])
  })

  it('does not confirm when a non-delimiter key is pressed', () => {
    const onValueChange = vi.fn()
    render(
      <TagsInput value={[]} onValueChange={onValueChange} delimiters={[':']} />,
    )
    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'hello' } })
    fireEvent.keyDown(input, { key: 'Enter' })
    expect(onValueChange).not.toHaveBeenCalled()
  })

  it('confirms with Tab key (always active regardless of delimiters)', () => {
    const onValueChange = vi.fn()
    render(
      <TagsInput value={[]} onValueChange={onValueChange} delimiters={[]} />,
    )
    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'hello' } })
    fireEvent.keyDown(input, { key: 'Tab' })
    expect(onValueChange).toHaveBeenCalledWith(['hello'])
  })
})

describe('tagsInput — auto-confirm on blur', () => {
  it('confirms pending input on blur', () => {
    const onValueChange = vi.fn()
    render(<TagsInput value={[]} onValueChange={onValueChange} />)
    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'hello' } })
    fireEvent.blur(input)
    expect(onValueChange).toHaveBeenCalledWith(['hello'])
  })

  it('does not call onValueChange on blur when input is empty', () => {
    const onValueChange = vi.fn()
    render(<TagsInput value={[]} onValueChange={onValueChange} />)
    const input = screen.getByRole('textbox')
    fireEvent.blur(input)
    expect(onValueChange).not.toHaveBeenCalled()
  })
})

describe('tagsInput — normalizer', () => {
  it('applies normalizer before adding the tag', () => {
    const onValueChange = vi.fn()
    render(
      <TagsInput
        value={[]}
        onValueChange={onValueChange}
        normalizer={raw => raw.toLowerCase()}
      />,
    )
    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'HELLO' } })
    fireEvent.keyDown(input, { key: 'Enter' })
    expect(onValueChange).toHaveBeenCalledWith(['hello'])
  })

  it('rejects tags when normalizer returns a falsy value', () => {
    const onValueChange = vi.fn()
    render(
      <TagsInput
        value={[]}
        onValueChange={onValueChange}
        normalizer={raw => (raw.length > 1 ? raw.toLowerCase() : null)}
      />,
    )
    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'A' } })
    fireEvent.keyDown(input, { key: 'Enter' })
    expect(onValueChange).not.toHaveBeenCalled()
  })
})

describe('tagsInput — Zod validator', () => {
  it('accepts tags passing the provided schema', () => {
    const onValueChange = vi.fn()
    render(
      <TagsInput
        value={[]}
        onValueChange={onValueChange}
        validator={z.string().email()}
      />,
    )
    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'user@example.com' } })
    fireEvent.keyDown(input, { key: 'Enter' })
    expect(onValueChange).toHaveBeenCalledWith(['user@example.com'])
  })

  it('rejects tags failing the provided schema', () => {
    const onValueChange = vi.fn()
    render(
      <TagsInput
        value={[]}
        onValueChange={onValueChange}
        validator={z.string().email()}
      />,
    )
    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'not-an-email' } })
    fireEvent.keyDown(input, { key: 'Enter' })
    expect(onValueChange).not.toHaveBeenCalled()
  })
})
