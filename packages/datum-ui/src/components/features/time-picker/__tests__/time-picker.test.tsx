import { resetViewport, setViewport } from '@test/viewport'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { TimePicker } from '../time-picker'

describe('timePicker', () => {
  afterEach(() => {
    resetViewport()
  })

  it('renders trigger with placeholder when no value', () => {
    render(<TimePicker placeholder="Select time" />)
    expect(screen.getByRole('combobox')).toHaveTextContent('Select time')
  })

  it('renders trigger with formatted time when value is set', () => {
    render(<TimePicker value="14:30" />)
    expect(screen.getByRole('combobox')).toHaveTextContent('2:30 PM')
  })

  it('opens dropdown with time slots on click', async () => {
    const user = userEvent.setup()
    render(<TimePicker step={60} />)
    await user.click(screen.getByRole('combobox'))
    expect(screen.getByRole('option', { name: /12:00 PM/i })).toBeInTheDocument()
  })

  it('calls onChange when a time slot is selected', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()
    render(<TimePicker onChange={onChange} step={60} />)
    await user.click(screen.getByRole('combobox'))
    await user.click(screen.getByRole('option', { name: '2:00 PM' }))
    expect(onChange).toHaveBeenCalledWith('14:00')
  })

  it('renders mobile sheet on mobile viewport', async () => {
    setViewport(500)
    const user = userEvent.setup()
    render(<TimePicker sheetTitle="Pick time" step={60} />)
    await user.click(screen.getByRole('combobox'))
    expect(screen.getByRole('heading', { name: 'Pick time' })).toBeInTheDocument()
  })
})
