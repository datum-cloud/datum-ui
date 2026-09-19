/// <reference types="@testing-library/jest-dom/vitest" />
import type { ColumnDef } from '@tanstack/react-table'
import type { ReactNode } from 'react'
import type { DataTableFeatures } from '../core/features'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { DataTableListPanel } from '../components/list-panel'
import { ClientProvider } from '../core/client-provider'

interface TestRow {
  readonly id: string
  readonly name: string
}

const testColumns: ColumnDef<DataTableFeatures, TestRow, any>[] = [{ accessorKey: 'name', header: 'Name' }]
const testData: TestRow[] = [
  { id: '1', name: 'Pod A' },
  { id: '2', name: 'Pod B' },
]

function TestWrapper({
  data,
  columns,
  children,
}: {
  readonly data: TestRow[]
  readonly columns: ColumnDef<DataTableFeatures, TestRow, any>[]
  readonly children: ReactNode
}) {
  return (
    <ClientProvider data={data} columns={columns}>
      {children}
    </ClientProvider>
  )
}

describe('dataTableListPanel', () => {
  it('renders the table content', () => {
    render(
      <TestWrapper data={testData} columns={testColumns}>
        <DataTableListPanel />
      </TestWrapper>,
    )

    expect(screen.getByText('Pod A')).toBeInTheDocument()
    expect(screen.getByText('Pod B')).toBeInTheDocument()
  })

  it('renders the built-in search by default', () => {
    render(
      <TestWrapper data={testData} columns={testColumns}>
        <DataTableListPanel search={{ placeholder: 'Search pods...' }} />
      </TestWrapper>,
    )

    expect(screen.getByPlaceholderText('Search pods...')).toBeInTheDocument()
  })

  it('hides the search row when search is false', () => {
    render(
      <TestWrapper data={testData} columns={testColumns}>
        <DataTableListPanel search={false} />
      </TestWrapper>,
    )

    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
  })

  it('filters rows using the built-in (uncontrolled) search', async () => {
    const user = userEvent.setup()

    render(
      <TestWrapper data={testData} columns={testColumns}>
        <DataTableListPanel search={{ placeholder: 'Search...' }} />
      </TestWrapper>,
    )

    await user.type(screen.getByPlaceholderText('Search...'), 'Pod A')

    // Search is debounced (see DataTableSearch), so the filtered rows land a beat later.
    await vi.waitFor(() => {
      expect(screen.queryByText('Pod B')).not.toBeInTheDocument()
    })
    expect(screen.getByText('Pod A')).toBeInTheDocument()
  })

  it('renders a controlled search input driven by value/onChange, not the store', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()

    render(
      <TestWrapper data={testData} columns={testColumns}>
        <DataTableListPanel search={{ placeholder: 'Search...', value: 'Pod A', onChange }} />
      </TestWrapper>,
    )

    const input = screen.getByPlaceholderText('Search...') as HTMLInputElement
    expect(input.value).toBe('Pod A')

    await user.type(input, 'x')

    expect(onChange).toHaveBeenCalled()
    // Controlled search doesn't filter client-side — data is rendered as-is.
    expect(screen.getByText('Pod A')).toBeInTheDocument()
    expect(screen.getByText('Pod B')).toBeInTheDocument()
  })

  it('renders searchSlot next to the search input', () => {
    render(
      <TestWrapper data={testData} columns={testColumns}>
        <DataTableListPanel searchSlot={<button type="button">Filters</button>} />
      </TestWrapper>,
    )

    expect(screen.getByRole('button', { name: 'Filters' })).toBeInTheDocument()
  })

  it('renders toolbar between the search row and the table', () => {
    render(
      <TestWrapper data={testData} columns={testColumns}>
        <DataTableListPanel toolbar={<div data-testid="toolbar">Active filters</div>} />
      </TestWrapper>,
    )

    expect(screen.getByTestId('toolbar')).toBeInTheDocument()
  })

  it('renders a skeleton instead of the table when loading', () => {
    const { container } = render(
      <TestWrapper data={testData} columns={testColumns}>
        <DataTableListPanel loading />
      </TestWrapper>,
    )

    expect(container.querySelector('[data-slot="dt-list-panel-loading"]')).toBeInTheDocument()
    expect(container.querySelector('[data-slot="dt"]')).not.toBeInTheDocument()
    expect(screen.queryByText('Pod A')).not.toBeInTheDocument()
  })

  it('applies compact density to the underlying content', () => {
    const { container } = render(
      <TestWrapper data={testData} columns={testColumns}>
        <DataTableListPanel />
      </TestWrapper>,
    )

    expect(container.querySelector('[data-slot="dt-header-cell"]')).toHaveClass('sticky')
  })

  it('forwards onRowClick to the content', async () => {
    const user = userEvent.setup()
    const onRowClick = vi.fn()

    render(
      <TestWrapper data={testData} columns={testColumns}>
        <DataTableListPanel onRowClick={onRowClick} />
      </TestWrapper>,
    )

    await user.click(screen.getByText('Pod A'))

    expect(onRowClick).toHaveBeenCalledWith(testData[0])
  })

  it('renders emptyMessage when there is no data', () => {
    render(
      <TestWrapper data={[]} columns={testColumns}>
        <DataTableListPanel emptyMessage="No pods found" />
      </TestWrapper>,
    )

    expect(screen.getByText('No pods found')).toBeInTheDocument()
  })

  it('sets data-slot on the outer panel', () => {
    const { container } = render(
      <TestWrapper data={testData} columns={testColumns}>
        <DataTableListPanel />
      </TestWrapper>,
    )

    expect(container.querySelector('[data-slot="dt-list-panel"]')).toBeInTheDocument()
  })
})
