/// <reference types="@testing-library/jest-dom/vitest" />
import { screen, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderWithProviders } from '../../../../../test/utils'
import { DateTime } from '../date-time'

describe('dateTime', () => {
  const date = new Date('2026-08-13T11:35:28.300Z')

  it('renders the absolute date in the given timezone', () => {
    renderWithProviders(
      <DateTime date={date} timezone="UTC" tooltip={false} />,
    )
    expect(screen.getByText('August 13th at 11:35 AM')).toBeInTheDocument()
  })

  it('shows the detailed tooltip with UTC, timezone, relative, and timestamp', async () => {
    const { user } = renderWithProviders(
      <DateTime date={date} timezone="UTC" variant="detailed" timestamp="1786620928300123456" />,
    )

    await user.hover(screen.getByText('August 13th at 11:35 AM'))
    await waitFor(() => {
      expect(screen.getByRole('tooltip')).toBeInTheDocument()
    })

    const tooltip = screen.getByRole('tooltip')
    expect(tooltip).toHaveTextContent('UTC')
    expect(tooltip).toHaveTextContent('13 Aug 26 11:35:28')
    expect(tooltip).toHaveTextContent('Relative')
    expect(tooltip).toHaveTextContent('Timestamp')
    expect(tooltip).toHaveTextContent('1786620928300123456')
  })

  it('renders custom trigger children', () => {
    renderWithProviders(
      <DateTime date={date} timezone="UTC" tooltip={false}>
        <time dateTime={date.toISOString()}>AUG 13 11:35:28.30</time>
      </DateTime>,
    )
    expect(screen.getByText('AUG 13 11:35:28.30')).toBeInTheDocument()
  })

  it('returns null for missing or invalid dates', () => {
    renderWithProviders(<DateTime date="not-a-date" />)
    expect(screen.queryByText(/August/)).not.toBeInTheDocument()
  })
})
