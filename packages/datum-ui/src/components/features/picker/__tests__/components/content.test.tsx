import { fireEvent, render } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { PickerContent } from '../../components/content'
import { Picker } from '../../components/root'
import { PickerTrigger } from '../../components/trigger'

describe('picker.Content', () => {
  it('opens content when trigger is clicked', () => {
    const { getByRole, queryByText } = render(
      <Picker.Root mode="date" value={null} onChange={vi.fn()}>
        <PickerContent
          sheetTitle="Pick a date"
          trigger={<PickerTrigger placeholder="Pick a date" />}
        >
          <div>content body</div>
        </PickerContent>
      </Picker.Root>,
    )
    expect(queryByText('content body')).toBeNull()
    fireEvent.click(getByRole('combobox', { name: /pick a date/i }))
    expect(queryByText('content body')).not.toBeNull()
  })

  it('renders footer in body when commit is apply on desktop', () => {
    const { getByRole, queryByTestId } = render(
      <Picker.Root mode="date-range" value={null} onChange={vi.fn()} commit="apply">
        <PickerContent
          sheetTitle="Pick a range"
          trigger={<PickerTrigger placeholder="Pick a range" />}
          footer={<div data-testid="footer">FOOTER</div>}
        >
          <div>body</div>
        </PickerContent>
      </Picker.Root>,
    )
    fireEvent.click(getByRole('combobox', { name: /pick a range/i }))
    expect(queryByTestId('footer')).not.toBeNull()
  })

  it('does not render footer in body when commit is immediate on desktop', () => {
    const { getByRole, queryByTestId } = render(
      <Picker.Root mode="date" value={null} onChange={vi.fn()} commit="immediate">
        <PickerContent
          sheetTitle="Pick a date"
          trigger={<PickerTrigger placeholder="Pick a date" />}
          footer={<div data-testid="footer">FOOTER</div>}
        >
          <div>body</div>
        </PickerContent>
      </Picker.Root>,
    )
    fireEvent.click(getByRole('combobox', { name: /pick a date/i }))
    expect(queryByTestId('footer')).toBeNull()
  })
})
