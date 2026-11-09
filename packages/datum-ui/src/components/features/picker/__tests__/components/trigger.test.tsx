import { fireEvent, render } from '@testing-library/react'
import { renderToString } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'
import { Picker } from '../../components/root'
import { PickerTrigger } from '../../components/trigger'

describe('picker.Trigger', () => {
  it('renders the placeholder when value is null', () => {
    const { getByRole } = render(
      <Picker.Root mode="date" value={null} onChange={vi.fn()}>
        <PickerTrigger placeholder="Pick a date" />
      </Picker.Root>,
    )
    expect(getByRole('combobox', { name: /pick a date/i })).toBeDefined()
  })

  it('uses the same corner radius as Input and Select', () => {
    const { getByRole } = render(
      <Picker.Root mode="date" value={null} onChange={vi.fn()}>
        <PickerTrigger placeholder="Pick a date" />
      </Picker.Root>,
    )
    const btn = getByRole('combobox', { name: /pick a date/i })
    expect(btn.className).toContain('rounded-lg')
    expect(btn.className).not.toContain('rounded-md')
  })

  it('opens the picker when clicked', () => {
    const onChange = vi.fn()
    const { getByRole } = render(
      <Picker.Root mode="date" value={null} onChange={onChange}>
        <PickerTrigger placeholder="Pick a date" />
      </Picker.Root>,
    )
    const btn = getByRole('combobox', { name: /pick a date/i })
    fireEvent.click(btn)
    expect(btn.getAttribute('aria-expanded')).toBe('true')
  })

  it('renders a Clear button when value is set and clearable=true', () => {
    const { getByRole } = render(
      <Picker.Root mode="date" value={new Date(2026, 0, 15)} onChange={vi.fn()}>
        <PickerTrigger placeholder="Pick a date" clearable />
      </Picker.Root>,
    )
    expect(getByRole('button', { name: /clear/i })).toBeDefined()
  })

  it('clear stops propagation and calls clear()', () => {
    const onChange = vi.fn()
    const { getByRole } = render(
      <Picker.Root mode="date" value={new Date(2026, 0, 15)} onChange={onChange}>
        <PickerTrigger placeholder="Pick a date" clearable />
      </Picker.Root>,
    )
    const trigger = getByRole('combobox')
    fireEvent.click(getByRole('button', { name: /clear/i }))
    expect(onChange).toHaveBeenCalledWith(null)
    expect(trigger.getAttribute('aria-expanded')).toBe('false')
  })

  it.each(['Enter', ' '])('clear works from the keyboard (%j)', (key) => {
    const onChange = vi.fn()
    const { getByRole } = render(
      <Picker.Root mode="date" value={new Date(2026, 0, 15)} onChange={onChange}>
        <PickerTrigger placeholder="Pick a date" clearable />
      </Picker.Root>,
    )
    const clearBtn = getByRole('button', { name: /clear/i })
    expect(clearBtn.tabIndex).toBe(0)
    fireEvent.keyDown(clearBtn, { key })
    expect(onChange).toHaveBeenCalledWith(null)
  })

  it('never nests a button in the trigger, so server HTML keeps the X inside', () => {
    const html = renderToString(
      <Picker.Root mode="date" value={new Date(2026, 0, 15)} onChange={vi.fn()}>
        <PickerTrigger placeholder="Pick a date" clearable />
      </Picker.Root>,
    )
    expect(html.match(/<button/g)).toHaveLength(1)
    const doc = new DOMParser().parseFromString(html, 'text/html')
    expect(doc.querySelector('button [aria-label="Clear"]')).not.toBeNull()
  })

  it('does not render Clear when clearable is false', () => {
    const { queryByRole } = render(
      <Picker.Root mode="date" value={new Date(2026, 0, 15)} onChange={vi.fn()}>
        <PickerTrigger placeholder="Pick a date" />
      </Picker.Root>,
    )
    expect(queryByRole('button', { name: /clear/i })).toBeNull()
  })

  it('renders the default CalendarIcon when icon is undefined', () => {
    const { container } = render(
      <Picker.Root mode="date" value={null} onChange={vi.fn()}>
        <PickerTrigger placeholder="Pick a date" />
      </Picker.Root>,
    )
    // lucide-react's CalendarIcon renders an <svg class="lucide-calendar...">.
    expect(container.querySelector('svg.lucide-calendar')).not.toBeNull()
  })

  it('renders a custom icon node when provided', () => {
    const { container } = render(
      <Picker.Root mode="date" value={null} onChange={vi.fn()}>
        <PickerTrigger
          placeholder="Pick a date"
          icon={<span data-testid="custom-icon">★</span>}
        />
      </Picker.Root>,
    )
    expect(container.querySelector('[data-testid="custom-icon"]')).not.toBeNull()
    // Custom icon replaces the default — the default CalendarIcon should be absent.
    expect(container.querySelector('svg.lucide-calendar')).toBeNull()
  })

  it('renders no icon when icon={false}', () => {
    const { container } = render(
      <Picker.Root mode="date" value={null} onChange={vi.fn()}>
        <PickerTrigger placeholder="Pick a date" icon={false} />
      </Picker.Root>,
    )
    expect(container.querySelector('svg.lucide-calendar')).toBeNull()
  })
})
