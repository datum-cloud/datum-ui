import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useInSheet } from '../context'
import { MobileSheet } from '../mobile-sheet'

describe('mobileSheet', () => {
  it('renders title and children when open', () => {
    render(
      <MobileSheet open onOpenChange={() => {}} title="Menu">
        <div>Sheet body</div>
      </MobileSheet>,
    )
    expect(screen.getByRole('heading', { name: 'Menu' })).toBeInTheDocument()
    expect(screen.getByText('Sheet body')).toBeInTheDocument()
  })

  it('does not render body when closed', () => {
    render(
      <MobileSheet open={false} onOpenChange={() => {}} title="Menu">
        <div>Sheet body</div>
      </MobileSheet>,
    )
    expect(screen.queryByText('Sheet body')).not.toBeInTheDocument()
  })

  it('renders footer when provided', () => {
    render(
      <MobileSheet open onOpenChange={() => {}} title="Menu" footer={<button type="button">OK</button>}>
        <div>Body</div>
      </MobileSheet>,
    )
    expect(screen.getByRole('button', { name: 'OK' })).toBeInTheDocument()
  })

  it('provides InSheetContext=true to descendants when open', () => {
    function InSheetProbe() {
      const inSheet = useInSheet()
      return <span data-testid="in-sheet">{inSheet ? 'yes' : 'no'}</span>
    }

    render(
      <MobileSheet open onOpenChange={() => {}} title="Menu">
        <InSheetProbe />
      </MobileSheet>,
    )
    expect(screen.getByTestId('in-sheet')).toHaveTextContent('yes')
  })
})
