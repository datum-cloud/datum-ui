/// <reference types="@testing-library/jest-dom/vitest" />
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { DataTableColumnHeader } from '../components/column-header'

function createMockColumn(overrides: {
  canSort?: boolean
  isSorted?: false | 'asc' | 'desc'
} = {}) {
  const toggleSortingHandler = vi.fn()
  return {
    getCanSort: () => overrides.canSort ?? true,
    getIsSorted: () => overrides.isSorted ?? (false as const),
    toggleSorting: vi.fn(),
    getToggleSortingHandler: () => toggleSortingHandler,
    _toggleSortingHandler: toggleSortingHandler,
  } as any
}

describe('dataTableColumnHeader', () => {
  it('renders title as plain text when column is not sortable', () => {
    const column = createMockColumn({ canSort: false })

    render(<DataTableColumnHeader column={column} title="Name" />)

    expect(screen.getByText('Name')).toBeInTheDocument()
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('renders a button when column is sortable', () => {
    const column = createMockColumn({ canSort: true })

    render(<DataTableColumnHeader column={column} title="Name" />)

    expect(screen.getByRole('button')).toBeInTheDocument()
    expect(screen.getByText('Name')).toBeInTheDocument()
  })

  it('calls toggle sorting handler when clicked', async () => {
    const user = userEvent.setup()
    const column = createMockColumn({ canSort: true, isSorted: false })

    render(<DataTableColumnHeader column={column} title="Name" />)

    await user.click(screen.getByRole('button'))

    expect(column._toggleSortingHandler).toHaveBeenCalled()
  })

  it('calls toggle sorting handler when sorted asc and clicked', async () => {
    const user = userEvent.setup()
    const column = createMockColumn({ canSort: true, isSorted: 'asc' })

    render(<DataTableColumnHeader column={column} title="Name" />)

    await user.click(screen.getByRole('button'))

    expect(column._toggleSortingHandler).toHaveBeenCalled()
  })

  it('calls toggle sorting handler when sorted desc and clicked', async () => {
    const user = userEvent.setup()
    const column = createMockColumn({ canSort: true, isSorted: 'desc' })

    render(<DataTableColumnHeader column={column} title="Name" />)

    await user.click(screen.getByRole('button'))

    expect(column._toggleSortingHandler).toHaveBeenCalled()
  })

  it('sets data-slot on non-sortable header', () => {
    const column = createMockColumn({ canSort: false })

    const { container } = render(
      <DataTableColumnHeader column={column} title="Name" />,
    )

    expect(container.querySelector('[data-slot="dt-column-header"]')).toBeInTheDocument()
  })

  it('sets data-slot on sortable header', () => {
    const column = createMockColumn({ canSort: true })

    const { container } = render(
      <DataTableColumnHeader column={column} title="Name" />,
    )

    expect(container.querySelector('[data-slot="dt-column-header"]')).toBeInTheDocument()
  })
})
