/// <reference types="@testing-library/jest-dom/vitest" />
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Card, CardAction, CardContent, CardFooter, CardHeader, CardTitle } from '../card'

describe('card', () => {
  it('renders children with data-slot="card"', () => {
    render(<Card>Card content</Card>)
    const card = screen.getByText('Card content')
    expect(card).toHaveAttribute('data-slot', 'card')
  })

  it('merges className', () => {
    render(<Card className="extra">Content</Card>)
    expect(screen.getByText('Content')).toHaveClass('extra')
  })

  it('defaults to the stacked md layout', () => {
    render(<Card>Content</Card>)
    const card = screen.getByText('Content')
    expect(card).toHaveAttribute('data-size', 'md')
    expect(card).toHaveAttribute('data-layout', 'stacked')
    expect(card).toHaveClass('py-6', 'gap-4', '[--card-px:1.5rem]')
  })

  it('tightens spacing for size="sm"', () => {
    render(<Card size="sm">Content</Card>)
    const card = screen.getByText('Content')
    expect(card).toHaveAttribute('data-size', 'sm')
    expect(card).toHaveClass('py-4', 'gap-3', '[--card-px:1rem]')
  })

  it('drops root padding and gap when sectioned', () => {
    render(<Card sectioned>Content</Card>)
    const card = screen.getByText('Content')
    expect(card).toHaveAttribute('data-layout', 'sectioned')
    expect(card).toHaveClass('py-0', 'gap-0')
    expect(card).not.toHaveClass('py-6')
  })
})

describe('cardHeader', () => {
  it('renders with data-slot="card-header"', () => {
    render(<CardHeader>Header</CardHeader>)
    const header = screen.getByText('Header')
    expect(header).toHaveAttribute('data-slot', 'card-header')
  })

  it('inherits the card inset via --card-px', () => {
    render(<CardHeader>Header</CardHeader>)
    expect(screen.getByText('Header')).toHaveClass('px-(--card-px)')
  })

  it('adds a divider when bordered', () => {
    render(<CardHeader bordered>Header</CardHeader>)
    expect(screen.getByText('Header')).toHaveClass('border-b')
  })

  it('exposes density via size', () => {
    render(<CardHeader size="sm">Header</CardHeader>)
    expect(screen.getByText('Header')).toHaveClass('has-data-[slot=card-description]:gap-1')
  })

  it('places CardAction in the trailing column', () => {
    render(
      <CardHeader>
        <CardTitle>Title</CardTitle>
        <CardAction>Action</CardAction>
      </CardHeader>,
    )
    const action = screen.getByText('Action')
    expect(action).toHaveAttribute('data-slot', 'card-action')
    expect(action).toHaveClass('col-start-2', 'justify-self-end')
  })
})

describe('cardContent', () => {
  it('renders children', () => {
    render(<CardContent>Body</CardContent>)
    expect(screen.getByText('Body')).toBeInTheDocument()
  })

  it('is inset by default', () => {
    render(<CardContent>Body</CardContent>)
    expect(screen.getByText('Body')).toHaveClass('px-(--card-px)')
  })

  it('removes horizontal inset with padding="x-none"', () => {
    render(<CardContent padding="x-none">Body</CardContent>)
    const content = screen.getByText('Body')
    expect(content).toHaveClass('px-0')
    expect(content).not.toHaveClass('px-(--card-px)')
  })

  it('removes all inset with padding="none"', () => {
    render(<CardContent padding="none">Body</CardContent>)
    expect(screen.getByText('Body')).toHaveClass('p-0')
  })
})

describe('cardFooter', () => {
  it('renders with data-slot="card-footer"', () => {
    render(<CardFooter>Footer</CardFooter>)
    const footer = screen.getByText('Footer')
    expect(footer).toHaveAttribute('data-slot', 'card-footer')
  })

  it('supports a top divider and flush padding', () => {
    render(
      <CardFooter bordered padding="none">
        Footer
      </CardFooter>,
    )
    const footer = screen.getByText('Footer')
    expect(footer).toHaveClass('border-t', 'p-0')
  })
})

describe('card composition', () => {
  it('renders all sections together', () => {
    render(
      <Card>
        <CardHeader>Header</CardHeader>
        <CardContent>Body</CardContent>
        <CardFooter>Footer</CardFooter>
      </Card>,
    )

    expect(screen.getByText('Header')).toBeInTheDocument()
    expect(screen.getByText('Body')).toBeInTheDocument()
    expect(screen.getByText('Footer')).toBeInTheDocument()
  })
})
