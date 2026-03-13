/// <reference types="@testing-library/jest-dom/vitest" />
import type { ColumnDef } from '@tanstack/react-table'
import type { ReactNode } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { DataTableSearch } from '../components/search'
import { ClientProvider } from '../core/client-provider'

interface TestRow {
  readonly id: string
}

const testColumns: ColumnDef<TestRow, any>[] = [{ accessorKey: 'id', header: 'ID' }]
const emptyData: TestRow[] = []

function TestWrapper({ children }: { readonly children: ReactNode }) {
  return (
    <ClientProvider data={emptyData} columns={testColumns}>
      {children}
    </ClientProvider>
  )
}

describe('dataTableSearch', () => {
  it('renders with placeholder', () => {
    render(
      <TestWrapper>
        <DataTableSearch placeholder="Search pods..." />
      </TestWrapper>,
    )

    expect(screen.getByPlaceholderText('Search pods...')).toBeInTheDocument()
  })

  it('accepts user input', async () => {
    const user = userEvent.setup()

    render(
      <TestWrapper>
        <DataTableSearch placeholder="Search..." />
      </TestWrapper>,
    )

    const input = screen.getByPlaceholderText('Search...')
    await user.type(input, 'hello')

    expect(input).toHaveValue('hello')
  })

  it('renders as disabled when disabled prop is true', () => {
    render(
      <TestWrapper>
        <DataTableSearch placeholder="Search..." disabled />
      </TestWrapper>,
    )

    expect(screen.getByPlaceholderText('Search...')).toBeDisabled()
  })

  it('does not accept input when disabled', async () => {
    const user = userEvent.setup()

    render(
      <TestWrapper>
        <DataTableSearch placeholder="Search..." disabled />
      </TestWrapper>,
    )

    const input = screen.getByPlaceholderText('Search...')
    await user.type(input, 'hello')

    expect(input).toHaveValue('')
  })
})
