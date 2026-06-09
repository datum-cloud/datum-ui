import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { GroupedToolbar } from '../components/grouped-toolbar'

describe('groupedToolbar', () => {
  it('debounces changes before calling onSearchChange', async () => {
    const onSearchChange = vi.fn()
    render(<GroupedToolbar search="" onSearchChange={onSearchChange} debounceMs={20} placeholder="Search resources" />)
    fireEvent.change(screen.getByLabelText('Search resources'), { target: { value: 'http' } })
    expect(onSearchChange).not.toHaveBeenCalledWith('http')
    await waitFor(() => expect(onSearchChange).toHaveBeenCalledWith('http'))
  })
})
