/// <reference types="@testing-library/jest-dom/vitest" />
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { Tabs, TabsContent, TabsLinkTrigger, TabsList, TabsTrigger } from '../tabs'

describe('tabs', () => {
  it('renders tab triggers', () => {
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">First</TabsTrigger>
          <TabsTrigger value="tab2">Second</TabsTrigger>
        </TabsList>
      </Tabs>,
    )

    expect(screen.getByRole('tab', { name: 'First' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Second' })).toBeInTheDocument()
  })

  it('shows content for the default tab', () => {
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">First</TabsTrigger>
          <TabsTrigger value="tab2">Second</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content One</TabsContent>
        <TabsContent value="tab2">Content Two</TabsContent>
      </Tabs>,
    )

    expect(screen.getByText('Content One')).toBeInTheDocument()
    expect(screen.queryByText('Content Two')).not.toBeInTheDocument()
  })

  it('switches content when a different tab is clicked', async () => {
    const user = userEvent.setup()
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">First</TabsTrigger>
          <TabsTrigger value="tab2">Second</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content One</TabsContent>
        <TabsContent value="tab2">Content Two</TabsContent>
      </Tabs>,
    )

    await user.click(screen.getByRole('tab', { name: 'Second' }))

    expect(screen.getByText('Content Two')).toBeInTheDocument()
    expect(screen.queryByText('Content One')).not.toBeInTheDocument()
  })

  it('marks active tab with data-state="active"', () => {
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">First</TabsTrigger>
          <TabsTrigger value="tab2">Second</TabsTrigger>
        </TabsList>
      </Tabs>,
    )

    expect(screen.getByRole('tab', { name: 'First' })).toHaveAttribute('data-state', 'active')
    expect(screen.getByRole('tab', { name: 'Second' })).toHaveAttribute('data-state', 'inactive')
  })
})

describe('tabs line variant', () => {
  it('marks the list with data-variant="line"', () => {
    render(
      <Tabs defaultValue="tab1">
        <TabsList variant="line">
          <TabsTrigger value="tab1">First</TabsTrigger>
        </TabsList>
      </Tabs>,
    )

    expect(screen.getByRole('tablist')).toHaveAttribute('data-variant', 'line')
  })

  it('renders a single sliding indicator inside the active trigger', () => {
    const { container } = render(
      <Tabs defaultValue="tab1">
        <TabsList variant="line">
          <TabsTrigger value="tab1">First</TabsTrigger>
          <TabsTrigger value="tab2">Second</TabsTrigger>
        </TabsList>
      </Tabs>,
    )

    const indicators = container.querySelectorAll('[data-slot="tabs-indicator"]')
    expect(indicators).toHaveLength(1)
    expect(screen.getByRole('tab', { name: 'First' })).toContainElement(indicators[0] as HTMLElement)
  })

  it('moves the indicator when the active tab changes', async () => {
    const user = userEvent.setup()
    render(
      <Tabs defaultValue="tab1">
        <TabsList variant="line">
          <TabsTrigger value="tab1">First</TabsTrigger>
          <TabsTrigger value="tab2">Second</TabsTrigger>
        </TabsList>
      </Tabs>,
    )

    await user.click(screen.getByRole('tab', { name: 'Second' }))

    const second = screen.getByRole('tab', { name: 'Second' })
    expect(second.querySelector('[data-slot="tabs-indicator"]')).not.toBeNull()
    expect(screen.getByRole('tab', { name: 'First' }).querySelector('[data-slot="tabs-indicator"]')).toBeNull()
  })

  it('follows a controlled value', () => {
    const { rerender } = render(
      <Tabs value="tab1">
        <TabsList variant="line">
          <TabsTrigger value="tab1">First</TabsTrigger>
          <TabsTrigger value="tab2">Second</TabsTrigger>
        </TabsList>
      </Tabs>,
    )
    expect(screen.getByRole('tab', { name: 'First' }).querySelector('[data-slot="tabs-indicator"]')).not.toBeNull()

    rerender(
      <Tabs value="tab2">
        <TabsList variant="line">
          <TabsTrigger value="tab1">First</TabsTrigger>
          <TabsTrigger value="tab2">Second</TabsTrigger>
        </TabsList>
      </Tabs>,
    )
    expect(screen.getByRole('tab', { name: 'Second' }).querySelector('[data-slot="tabs-indicator"]')).not.toBeNull()
  })

  it('places the indicator inside the link when using TabsLinkTrigger', () => {
    render(
      <Tabs value="/overview">
        <TabsList variant="line">
          <TabsLinkTrigger value="/overview" href="/overview">Overview</TabsLinkTrigger>
          <TabsLinkTrigger value="/logs" href="/logs">Logs</TabsLinkTrigger>
        </TabsList>
      </Tabs>,
    )

    const link = screen.getByRole('tab', { name: 'Overview' })
    expect(link.tagName).toBe('A')
    expect(link).toHaveAttribute('href', '/overview')
    expect(link.querySelector('[data-slot="tabs-indicator"]')).not.toBeNull()
  })

  it('does not render an indicator for the default variant', () => {
    const { container } = render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">First</TabsTrigger>
        </TabsList>
      </Tabs>,
    )

    expect(container.querySelector('[data-slot="tabs-indicator"]')).toBeNull()
  })
})
