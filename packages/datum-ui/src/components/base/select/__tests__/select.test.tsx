/// <reference types="@testing-library/jest-dom/vitest" />
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../select'

describe('select', () => {
  it('renders trigger with placeholder', () => {
    render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Pick one" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="a">Alpha</SelectItem>
        </SelectContent>
      </Select>,
    )

    expect(screen.getByRole('combobox')).toBeInTheDocument()
    expect(screen.getByText('Pick one')).toBeInTheDocument()
  })

  it('opens dropdown on trigger click', async () => {
    const user = userEvent.setup()
    render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Pick one" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="a">Alpha</SelectItem>
          <SelectItem value="b">Beta</SelectItem>
        </SelectContent>
      </Select>,
    )

    await user.click(screen.getByRole('combobox'))

    await waitFor(() => {
      expect(screen.getByRole('option', { name: 'Alpha' })).toBeInTheDocument()
      expect(screen.getByRole('option', { name: 'Beta' })).toBeInTheDocument()
    })
  })

  it('calls onValueChange when item is selected', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()

    render(
      <Select onValueChange={onValueChange}>
        <SelectTrigger>
          <SelectValue placeholder="Pick one" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="a">Alpha</SelectItem>
          <SelectItem value="b">Beta</SelectItem>
        </SelectContent>
      </Select>,
    )

    await user.click(screen.getByRole('combobox'))

    await waitFor(() => {
      expect(screen.getByRole('option', { name: 'Alpha' })).toBeInTheDocument()
    })

    await user.click(screen.getByRole('option', { name: 'Alpha' }))

    expect(onValueChange).toHaveBeenCalledWith('a')
  })

  it('shows selected value with defaultValue', () => {
    render(
      <Select defaultValue="b">
        <SelectTrigger>
          <SelectValue placeholder="Pick one" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="a">Alpha</SelectItem>
          <SelectItem value="b">Beta</SelectItem>
        </SelectContent>
      </Select>,
    )

    expect(screen.getByText('Beta')).toBeInTheDocument()
  })
})
