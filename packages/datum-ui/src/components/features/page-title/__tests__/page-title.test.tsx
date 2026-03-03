/// <reference types="@testing-library/jest-dom/vitest" />
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { PageTitle } from '../page-title'

describe('pageTitle', () => {
  it('renders the title', () => {
    render(<PageTitle title="Dashboard" />)
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
  })

  it('renders description', () => {
    render(<PageTitle title="Dashboard" description="Overview of your data" />)
    expect(screen.getByText('Overview of your data')).toBeInTheDocument()
  })

  it('renders actions', () => {
    render(
      <PageTitle
        title="Dashboard"
        actions={<button type="button">Create</button>}
      />,
    )
    expect(screen.getByText('Create')).toBeInTheDocument()
  })

  it('merges className', () => {
    const { container } = render(
      <PageTitle title="Dashboard" className="custom-class" />,
    )
    expect(container.firstChild).toHaveClass('custom-class')
  })
})
