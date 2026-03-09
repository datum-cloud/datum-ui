/// <reference types="@testing-library/jest-dom/vitest" />
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../tabs'

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
