/// <reference types="@testing-library/jest-dom/vitest" />
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Card, CardContent, CardFooter, CardHeader } from '../card'

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
})

describe('cardHeader', () => {
  it('renders with data-slot="card-header"', () => {
    render(<CardHeader>Header</CardHeader>)
    const header = screen.getByText('Header')
    expect(header).toHaveAttribute('data-slot', 'card-header')
  })
})

describe('cardContent', () => {
  it('renders children', () => {
    render(<CardContent>Body</CardContent>)
    expect(screen.getByText('Body')).toBeInTheDocument()
  })
})

describe('cardFooter', () => {
  it('renders with data-slot="card-footer"', () => {
    render(<CardFooter>Footer</CardFooter>)
    const footer = screen.getByText('Footer')
    expect(footer).toHaveAttribute('data-slot', 'card-footer')
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
