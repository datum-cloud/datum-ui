import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { OptionList } from '../option-list'
import { useOptionPicker } from '../use-option-picker'

const opts = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
]

const noop = vi.fn()

function SingleHarness({ onChange = noop }: { onChange?: (v: string) => void }) {
  const picker = useOptionPicker({
    multiple: false,
    options: opts,
    onValueChange: onChange,
    open: true,
    onOpenChange: () => {},
  })
  return <OptionList picker={picker} />
}

describe('optionList', () => {
  it('renders each flat option as an option role', () => {
    render(<SingleHarness />)
    expect(screen.getByRole('option', { name: /apple/i })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: /banana/i })).toBeInTheDocument()
  })

  it('fires onValueChange with the selected value on click', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()
    render(<SingleHarness onChange={onChange} />)
    await user.click(screen.getByRole('option', { name: /banana/i }))
    expect(onChange).toHaveBeenCalledWith('banana')
  })

  it('shows empty content when no options match the search', async () => {
    const user = userEvent.setup()
    render(<SingleHarness />)
    await user.type(screen.getByRole('combobox'), 'zzz')
    expect(screen.getByText(/no results found/i)).toBeInTheDocument()
  })

  it('renders header and footer slots', () => {
    function Harness() {
      const picker = useOptionPicker({
        multiple: false,
        options: opts,
        open: true,
        onOpenChange: () => {},
      })
      return (
        <OptionList
          picker={picker}
          header={<div data-testid="hdr">H</div>}
          footer={<div data-testid="ftr">F</div>}
        />
      )
    }
    render(<Harness />)
    expect(screen.getByTestId('hdr')).toBeInTheDocument()
    expect(screen.getByTestId('ftr')).toBeInTheDocument()
  })

  it('omits search input when disableSearch is true', () => {
    function Harness() {
      const picker = useOptionPicker({
        multiple: false,
        options: opts,
        open: true,
        onOpenChange: () => {},
      })
      return <OptionList picker={picker} disableSearch />
    }
    render(<Harness />)
    expect(screen.queryByRole('combobox')).not.toBeInTheDocument()
  })

  it('renders a creatable row when configured and search has no match', async () => {
    const user = userEvent.setup()
    function Harness() {
      const picker = useOptionPicker({
        multiple: false,
        options: opts,
        creatable: true,
        open: true,
        onOpenChange: () => {},
      })
      return <OptionList picker={picker} />
    }
    render(<Harness />)
    await user.type(screen.getByRole('combobox'), 'zzz')
    expect(screen.getByText(/use "zzz"/i)).toBeInTheDocument()
  })

  it('renders a custom creatableLabel when provided (BUG-118)', async () => {
    const user = userEvent.setup()
    function Harness() {
      const picker = useOptionPicker({
        multiple: false,
        options: opts,
        creatable: true,
        creatableLabel: search => <span>{`Add ${search}`}</span>,
        open: true,
        onOpenChange: () => {},
      })
      return <OptionList picker={picker} />
    }
    render(<Harness />)
    await user.type(screen.getByRole('combobox'), 'zzz')
    expect(screen.getByText('Add zzz')).toBeInTheDocument()
    expect(screen.queryByText(/use "zzz"/i)).not.toBeInTheDocument()
  })
})
