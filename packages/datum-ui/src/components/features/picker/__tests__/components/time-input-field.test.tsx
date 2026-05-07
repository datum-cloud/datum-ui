import { fireEvent, render } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { PickerApply } from '../../components/footer'
import { Picker } from '../../components/root'
import { PickerTimeInputField } from '../../components/time-input-field'

describe('picker.TimeInputField', () => {
  it('renders an input labeled "Select time"', () => {
    const { getByLabelText } = render(
      <Picker.Root mode="datetime" value={null} onChange={vi.fn()} timezone="UTC">
        <PickerTimeInputField />
      </Picker.Root>,
    )
    expect(getByLabelText('Select time')).toBeDefined()
  })

  it('input is disabled when pendingValue is null', () => {
    const { getByLabelText } = render(
      <Picker.Root mode="datetime" value={null} onChange={vi.fn()} timezone="UTC">
        <PickerTimeInputField />
      </Picker.Root>,
    )
    const input = getByLabelText('Select time') as HTMLInputElement
    expect(input.disabled).toBe(true)
    expect(input.value).toBe('')
  })

  it('input is enabled and shows HH:mm of pendingValue in declared timezone', () => {
    const { getByLabelText } = render(
      <Picker.Root
        mode="datetime"
        value="2024-01-15T14:30:00.000Z"
        onChange={vi.fn()}
        timezone="UTC"
      >
        <PickerTimeInputField />
      </Picker.Root>,
    )
    const input = getByLabelText('Select time') as HTMLInputElement
    expect(input.disabled).toBe(false)
    expect(input.value).toBe('14:30')
  })

  it('typing valid HH:mm + Apply fires onChange with recombined ISO', () => {
    // Datetime mode is pinned to commit="apply" — typing updates pending state,
    // explicit Apply click is what fires onChange.
    const onChange = vi.fn()
    const { getByLabelText, getByRole } = render(
      <Picker.Root
        mode="datetime"
        value="2024-01-15T10:00:00.000Z"
        onChange={onChange}
        timezone="UTC"
      >
        <PickerTimeInputField />
        <PickerApply />
      </Picker.Root>,
    )
    const input = getByLabelText('Select time') as HTMLInputElement
    fireEvent.change(input, { target: { value: '14:30' } })
    // Typing alone doesn't commit.
    expect(onChange).not.toHaveBeenCalled()
    fireEvent.click(getByRole('button', { name: /apply/i }))
    expect(onChange).toHaveBeenCalled()
    const last = onChange.mock.calls[onChange.mock.calls.length - 1]?.[0]
    expect(last).toMatch(/2024-01-15T14:30/)
    expect(last).toContain('Z')
  })

  it('typing invalid HH:mm does not update pending state', () => {
    // Even with commit="apply" baked in, invalid input should be a no-op:
    // Apply commits whatever pending value was before the invalid edits.
    const onChange = vi.fn()
    const { getByLabelText, getByRole } = render(
      <Picker.Root
        mode="datetime"
        value="2024-01-15T10:00:00.000Z"
        onChange={onChange}
        timezone="UTC"
      >
        <PickerTimeInputField />
        <PickerApply />
      </Picker.Root>,
    )
    const input = getByLabelText('Select time') as HTMLInputElement
    fireEvent.change(input, { target: { value: '1' } })
    fireEvent.change(input, { target: { value: '14:' } })
    fireEvent.change(input, { target: { value: 'abc' } })
    fireEvent.click(getByRole('button', { name: /apply/i }))
    // Apply commits the original prop value unchanged — no time edit was valid.
    expect(onChange).toHaveBeenCalledWith('2024-01-15T10:00:00.000Z')
  })

  it('returns null for non-datetime modes', () => {
    const { container } = render(
      <Picker.Root mode="date" value={null} onChange={vi.fn()}>
        <PickerTimeInputField />
      </Picker.Root>,
    )
    expect(container.querySelector('input')).toBeNull()
  })

  it('reflects external value-prop changes', () => {
    const { getByLabelText, rerender } = render(
      <Picker.Root
        mode="datetime"
        value="2024-01-15T10:00:00.000Z"
        onChange={vi.fn()}
        timezone="UTC"
      >
        <PickerTimeInputField />
      </Picker.Root>,
    )
    expect((getByLabelText('Select time') as HTMLInputElement).value).toBe('10:00')
    rerender(
      <Picker.Root
        mode="datetime"
        value="2024-01-16T18:45:00.000Z"
        onChange={vi.fn()}
        timezone="UTC"
      >
        <PickerTimeInputField />
      </Picker.Root>,
    )
    expect((getByLabelText('Select time') as HTMLInputElement).value).toBe('18:45')
  })
})
