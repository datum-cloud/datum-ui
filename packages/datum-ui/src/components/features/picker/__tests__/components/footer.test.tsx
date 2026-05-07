import { fireEvent, render } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { PickerApply, PickerCancel, PickerClear, PickerFooter, PickerReset } from '../../components/footer'
import { Picker } from '../../components/root'

describe('picker.Footer', () => {
  it('renders children inside a flex container', () => {
    const { getByTestId } = render(
      <Picker.Root mode="date" value={null} onChange={vi.fn()}>
        <PickerFooter>
          <span data-testid="child">x</span>
        </PickerFooter>
      </Picker.Root>,
    )
    expect(getByTestId('child')).toBeDefined()
  })
})

describe('picker.Apply', () => {
  it('calls actions.apply()', () => {
    const onChange = vi.fn()
    const initial = { from: new Date(2026, 0, 1), to: new Date(2026, 0, 5) }
    const { getByRole } = render(
      <Picker.Root mode="date-range" value={initial} onChange={onChange} commit="apply">
        <PickerApply />
      </Picker.Root>,
    )
    fireEvent.click(getByRole('button', { name: /apply/i }))
    expect(onChange).toHaveBeenCalled()
  })

  it('is disabled when pendingValue is null (date mode)', () => {
    const { getByRole } = render(
      <Picker.Root mode="date" value={null} onChange={vi.fn()}>
        <PickerApply />
      </Picker.Root>,
    )
    expect(getByRole('button', { name: /apply/i })).toBeDisabled()
  })

  it('is disabled when pendingValue is null (date-range mode)', () => {
    const { getByRole } = render(
      <Picker.Root mode="date-range" value={null} onChange={vi.fn()} commit="apply">
        <PickerApply />
      </Picker.Root>,
    )
    expect(getByRole('button', { name: /apply/i })).toBeDisabled()
  })

  it('is enabled when pendingValue is set', () => {
    const initial = { from: new Date(2026, 0, 1), to: new Date(2026, 0, 5) }
    const { getByRole } = render(
      <Picker.Root mode="date-range" value={initial} onChange={vi.fn()} commit="apply">
        <PickerApply />
      </Picker.Root>,
    )
    expect(getByRole('button', { name: /apply/i })).not.toBeDisabled()
  })
})

describe('picker.Cancel + Reset + Clear', () => {
  it('cancel does not commit, just closes', () => {
    const onChange = vi.fn()
    const { getByRole } = render(
      <Picker.Root mode="date-range" value={null} onChange={onChange}>
        <PickerCancel />
      </Picker.Root>,
    )
    fireEvent.click(getByRole('button', { name: /cancel/i }))
    expect(onChange).not.toHaveBeenCalled()
  })

  it('clear emits null', () => {
    const onChange = vi.fn()
    const { getByRole } = render(
      <Picker.Root mode="date" value={new Date()} onChange={onChange}>
        <PickerClear />
      </Picker.Root>,
    )
    fireEvent.click(getByRole('button', { name: /clear/i }))
    expect(onChange).toHaveBeenCalledWith(null)
  })

  it('reset reverts pending state without firing onChange', () => {
    const onChange = vi.fn()
    const { getByRole } = render(
      <Picker.Root mode="date" value={new Date(2026, 0, 1)} onChange={onChange}>
        <PickerReset />
      </Picker.Root>,
    )
    fireEvent.click(getByRole('button', { name: /reset/i }))
    expect(onChange).not.toHaveBeenCalled()
  })
})
