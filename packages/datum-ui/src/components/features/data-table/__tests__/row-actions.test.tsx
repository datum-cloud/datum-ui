/// <reference types="@testing-library/jest-dom/vitest" />
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { DataTableRowActions } from '../components/row-actions'

// Create a minimal row mock
function createMockRow<T>(data: T) {
  return { original: data } as any
}

describe('dataTableRowActions', () => {
  it('renders dropdown trigger', () => {
    render(
      <DataTableRowActions
        row={createMockRow({ id: '1', name: 'Pod A' })}
        actions={[
          { label: 'Edit', onClick: () => {} },
          { label: 'Delete', onClick: () => {}, variant: 'destructive' as const },
        ]}
      />,
    )

    expect(screen.getByRole('button', { name: 'Open menu' })).toBeInTheDocument()
  })

  it('shows actions in dropdown when clicked', async () => {
    const user = userEvent.setup()

    render(
      <DataTableRowActions
        row={createMockRow({ id: '1', name: 'Pod A' })}
        actions={[
          { label: 'Edit', onClick: () => {} },
          { label: 'Delete', onClick: () => {}, variant: 'destructive' as const },
        ]}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Open menu' }))

    expect(screen.getByText('Edit')).toBeInTheDocument()
    expect(screen.getByText('Delete')).toBeInTheDocument()
  })

  it('hides actions when hidden is true', () => {
    render(
      <DataTableRowActions
        row={createMockRow({ id: '1' })}
        actions={[
          { label: 'Visible', onClick: () => {} },
          { label: 'Hidden', onClick: () => {}, hidden: true },
        ]}
      />,
    )

    // Only visible action exists, so trigger should render
    expect(screen.getByRole('button', { name: 'Open menu' })).toBeInTheDocument()
  })

  it('returns null when all actions hidden', () => {
    const { container } = render(
      <DataTableRowActions
        row={createMockRow({ id: '1' })}
        actions={[
          { label: 'Hidden', onClick: () => {}, hidden: true },
        ]}
      />,
    )

    expect(container.innerHTML).toBe('')
  })
})
