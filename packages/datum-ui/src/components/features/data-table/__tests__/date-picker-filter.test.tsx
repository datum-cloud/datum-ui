/// <reference types="@testing-library/jest-dom/vitest" />
import type { ReactNode } from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { DataTableStoreContext, TableInstanceContext } from '../core/data-table-context'
import { createDataTableStore } from '../core/store'
import { DatePickerFilter } from '../filters/date-picker-filter'

vi.mock('../../calendar-date-picker/calendar-date-picker', () => ({
  CalendarDatePicker: ({ placeholder, onDateSelect, disableFuture, disablePast }: any) => (
    <button
      type="button"
      data-testid="calendar-date-picker"
      data-disable-future={disableFuture}
      data-disable-past={disablePast}
      onClick={() => onDateSelect({ from: new Date('2025-01-15'), to: new Date('2025-01-15') })}
    >
      {placeholder}
    </button>
  ),
}))

const mockTable = {
  getCanNextPage: () => false,
  getCanPreviousPage: () => false,
  nextPage: vi.fn(),
  previousPage: vi.fn(),
  getPageCount: () => 1,
  getRowModel: () => ({ rows: [] }),
  getHeaderGroups: () => [],
  getAllColumns: () => [],
  getFilteredSelectedRowModel: () => ({ rows: [] }),
  getState: () => ({ pagination: { pageIndex: 0, pageSize: 20 } }),
  getFilteredRowModel: () => ({ rows: [] }),
} as any

function renderFilter(props: {
  readonly setFilter?: (...args: any[]) => void
  readonly extraProps?: Record<string, unknown>
}) {
  const { setFilter, extraProps = {} } = props
  const store = createDataTableStore<Record<string, unknown>>({ data: [], mode: 'client' })

  if (setFilter) {
    vi.spyOn(store, 'setFilter').mockImplementation(setFilter as any)
  }

  function Wrapper({ children }: { readonly children: ReactNode }) {
    return (
      <DataTableStoreContext value={store}>
        <TableInstanceContext value={mockTable}>
          {children}
        </TableInstanceContext>
      </DataTableStoreContext>
    )
  }

  return render(
    <Wrapper>
      <DatePickerFilter column="createdAt" label="Created" {...extraProps as any} />
    </Wrapper>,
  )
}

describe('datePickerFilter', () => {
  it('renders with label', () => {
    renderFilter({})

    expect(screen.getByText('Created')).toBeInTheDocument()
  })

  it('renders CalendarDatePicker component', () => {
    renderFilter({})

    expect(screen.getByTestId('calendar-date-picker')).toBeInTheDocument()
  })

  it('calls setFilter when a date is selected', () => {
    const setFilter = vi.fn()
    renderFilter({ setFilter })

    fireEvent.click(screen.getByTestId('calendar-date-picker'))
    expect(setFilter).toHaveBeenCalledWith('createdAt', new Date('2025-01-15').toISOString())
  })

  it('passes date constraint props to CalendarDatePicker', () => {
    renderFilter({ extraProps: { disableFuture: true, disablePast: true } })

    const picker = screen.getByTestId('calendar-date-picker')
    expect(picker).toHaveAttribute('data-disable-future', 'true')
    expect(picker).toHaveAttribute('data-disable-past', 'true')
  })
})
