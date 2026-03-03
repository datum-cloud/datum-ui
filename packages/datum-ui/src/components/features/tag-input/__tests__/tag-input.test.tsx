/// <reference types="@testing-library/jest-dom/vitest" />
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
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
