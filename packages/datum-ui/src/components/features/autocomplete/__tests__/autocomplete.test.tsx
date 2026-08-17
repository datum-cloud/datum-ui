import { resetViewport, setViewport } from '@test/viewport'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it } from 'vitest'
import { Autocomplete } from '../autocomplete'

const options = [
  { value: 'a', label: 'Alpha' },
  { value: 'b', label: 'Beta' },
]

describe('autocomplete — responsive', () => {
  afterEach(() => {
    resetViewport()
  })

  it('renders mobile sheet heading on mobile viewport', async () => {
    setViewport(500)
    render(
      <Autocomplete
        options={options}
        placeholder="Search items"
      />,
    )
    await userEvent.click(screen.getByRole('combobox'))
    expect(screen.getByRole('heading', { name: 'Search items' })).toBeInTheDocument()
  })

  it('stays as popover when responsive={false}', async () => {
    setViewport(500)
    render(
      <Autocomplete
        options={options}
        placeholder="Search items"
        responsive={false}
      />,
    )
    await userEvent.click(screen.getByRole('combobox'))
    expect(screen.queryByRole('heading', { name: 'Search items' })).not.toBeInTheDocument()
  })

  it('shows the selection in the trigger when uncontrolled (BUG-074)', async () => {
    setViewport(1200)
    render(
      <Autocomplete
        options={options}
        placeholder="Select..."
        responsive={false}
      />,
    )

    const trigger = screen.getByRole('combobox')
    expect(trigger).toHaveTextContent('Select...')

    await userEvent.click(trigger)
    await userEvent.click(screen.getByText('Beta'))

    // Engine tracks the pick internally — the trigger must reflect it even
    // though no `value` prop was supplied.
    expect(screen.getByRole('combobox')).toHaveTextContent('Beta')
  })
})
