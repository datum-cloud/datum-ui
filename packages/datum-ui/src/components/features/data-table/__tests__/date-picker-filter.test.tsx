/// <reference types="@testing-library/jest-dom/vitest" />
import { fireEvent, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { DatePickerFilter } from '../filters/date-picker-filter'
import { renderWithStore } from './test-helpers'

vi.mock('../../calendar-date-picker/calendar-date-picker', () => ({
  CalendarDatePicker: ({ placeholder, onDateSelect, disableFuture, disablePast, disabled }: any) => (
    <button
      type="button"
      data-testid="calendar-date-picker"
      data-disable-future={disableFuture}
      data-disable-past={disablePast}
      disabled={disabled}
      onClick={() => onDateSelect({ from: new Date('2025-01-15'), to: new Date('2025-01-15') })}
    >
      {placeholder}
    </button>
  ),
}))

describe('datePickerFilter', () => {
  it('renders with label', () => {
    renderWithStore(
      <DatePickerFilter column="createdAt" label="Created" />,
    )

    expect(screen.getByText('Created')).toBeInTheDocument()
  })

  it('renders CalendarDatePicker component', () => {
    renderWithStore(
      <DatePickerFilter column="createdAt" label="Created" />,
    )

    expect(screen.getByTestId('calendar-date-picker')).toBeInTheDocument()
  })

  it('calls setFilter when a date is selected', () => {
    const setFilter = vi.fn()
    renderWithStore(
      <DatePickerFilter column="createdAt" label="Created" />,
      { setFilter },
    )

    fireEvent.click(screen.getByTestId('calendar-date-picker'))
    expect(setFilter).toHaveBeenCalledWith('createdAt', new Date('2025-01-15').toISOString())
  })

  it('passes date constraint props to CalendarDatePicker', () => {
    renderWithStore(
      <DatePickerFilter column="createdAt" label="Created" disableFuture disablePast />,
    )

    const picker = screen.getByTestId('calendar-date-picker')
    expect(picker).toHaveAttribute('data-disable-future', 'true')
    expect(picker).toHaveAttribute('data-disable-past', 'true')
  })

  it('renders trigger as disabled when disabled prop is true', () => {
    renderWithStore(
      <DatePickerFilter column="createdAt" label="Created" disabled />,
    )

    expect(screen.getByTestId('calendar-date-picker')).toBeDisabled()
  })
})
