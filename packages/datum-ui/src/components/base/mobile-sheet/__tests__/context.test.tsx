import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { InSheetContext, useInSheet } from '../context'

function Probe() {
  const inSheet = useInSheet()
  return <span data-testid="probe">{inSheet ? 'yes' : 'no'}</span>
}

describe('inSheetContext', () => {
  it('defaults to false when no provider is present', () => {
    render(<Probe />)
    expect(screen.getByTestId('probe')).toHaveTextContent('no')
  })

  it('returns true when wrapped in a provider with value={true}', () => {
    render(
      <InSheetContext value={true}>
        <Probe />
      </InSheetContext>,
    )
    expect(screen.getByTestId('probe')).toHaveTextContent('yes')
  })

  it('returns false when wrapped in a provider with value={false}', () => {
    render(
      <InSheetContext value={false}>
        <Probe />
      </InSheetContext>,
    )
    expect(screen.getByTestId('probe')).toHaveTextContent('no')
  })
})
