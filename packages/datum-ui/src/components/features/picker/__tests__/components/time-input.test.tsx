import { fireEvent, render } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { Picker } from '../../components/root'
import { PickerTimeInput } from '../../components/time-input'

describe('picker.TimeInput — single mode', () => {
  it('renders slots based on step', () => {
    const { container } = render(
      <Picker.Root mode="time" value="09:00" onChange={vi.fn()} step={60}>
        <PickerTimeInput target="single" />
      </Picker.Root>,
    )
    const items = container.querySelectorAll('[role="option"]')
    expect(items.length).toBe(24)
  })

  it('clicking a slot fires onChange with HH:mm', () => {
    const onChange = vi.fn()
    const { container } = render(
      <Picker.Root mode="time" value={null} onChange={onChange} step={60} commit="immediate">
        <PickerTimeInput target="single" />
      </Picker.Root>,
    )
    const items = container.querySelectorAll('[role="option"]')
    const target = items[14] as HTMLElement
    fireEvent.click(target)
    expect(onChange).toHaveBeenCalledWith('14:00')
  })
})

describe('picker.TimeInput — embedded mode', () => {
  it('renders embedded buttons for datetime-range from/to', () => {
    const value = {
      from: '2026-01-15T07:00:00.000Z',
      to: '2026-01-15T17:00:00.000Z',
    }
    const { getAllByRole } = render(
      <Picker.Root mode="datetime-range" value={value} onChange={vi.fn()} timezone="UTC">
        <PickerTimeInput target="embedded-from" />
        <PickerTimeInput target="embedded-to" />
      </Picker.Root>,
    )
    const buttons = getAllByRole('button')
    expect(buttons.length).toBeGreaterThanOrEqual(2)
  })

  it('disables the trigger when datetime mode has no date selected', () => {
    const { getByRole } = render(
      <Picker.Root mode="datetime" value={null} onChange={vi.fn()} timezone="UTC">
        <PickerTimeInput target="embedded-from" />
      </Picker.Root>,
    )
    expect(getByRole('button')).toBeDisabled()
  })

  it('disables both triggers when datetime-range has no value', () => {
    const { getAllByRole } = render(
      <Picker.Root mode="datetime-range" value={null} onChange={vi.fn()} timezone="UTC">
        <PickerTimeInput target="embedded-from" />
        <PickerTimeInput target="embedded-to" />
      </Picker.Root>,
    )
    const buttons = getAllByRole('button')
    expect(buttons[0]).toBeDisabled()
    expect(buttons[1]).toBeDisabled()
  })

  it('enables the trigger once a date is set (datetime mode)', () => {
    const { getByRole } = render(
      <Picker.Root
        mode="datetime"
        value="2026-01-15T07:00:00.000Z"
        onChange={vi.fn()}
        timezone="UTC"
      >
        <PickerTimeInput target="embedded-from" />
      </Picker.Root>,
    )
    expect(getByRole('button')).not.toBeDisabled()
  })
})

describe('picker.TimeInput — time-range range-to clamp', () => {
  it('hides times earlier than range-from from the range-to slot list', () => {
    // 60-min step → slots are 00:00, 01:00, ..., 23:00. With from=12:00, the
    // range-to list should drop everything before 12:00.
    const { container } = render(
      <Picker.Root
        mode="time-range"
        value={{ from: '12:00', to: '23:00' }}
        onChange={vi.fn()}
        step={60}
        hourCycle="24"
      >
        <PickerTimeInput target="range-to" />
      </Picker.Root>,
    )
    const items = Array.from(container.querySelectorAll('[role="option"]'))
    const values = items.map(el => (el as HTMLElement).textContent)
    expect(values).not.toContain('11:00')
    expect(values).not.toContain('00:00')
    expect(values[0]).toBe('12:00')
  })

  it('keeps the caller-supplied min when later than range-from', () => {
    // Caller passes min='15:00'. range-from='12:00' should NOT loosen that —
    // the effective lower bound is the later of the two.
    const { container } = render(
      <Picker.Root
        mode="time-range"
        value={{ from: '12:00', to: '23:00' }}
        onChange={vi.fn()}
        step={60}
        hourCycle="24"
      >
        <PickerTimeInput target="range-to" min="15:00" />
      </Picker.Root>,
    )
    const items = Array.from(container.querySelectorAll('[role="option"]'))
    const values = items.map(el => (el as HTMLElement).textContent)
    expect(values).not.toContain('14:00')
    expect(values[0]).toBe('15:00')
  })
})
