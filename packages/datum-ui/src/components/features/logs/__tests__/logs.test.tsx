/// <reference types="@testing-library/jest-dom/vitest" />
import type { ReactNode } from 'react'
import type { LogEntry } from '../types'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { Logs } from '../logs'

const entries: LogEntry[] = [
  {
    id: '1',
    timestamp: new Date('2026-08-13T11:35:28.000Z'),
    timestampNs: '1786225028000000000',
    line: 'GET /api/v1/checkout 200 12ms upstream=gateway-eu-west',
    labels: { severity: 'INFO', service_name: 'envoy-gateway', resource_name: 'gateway-eu-west' },
  },
  {
    id: '2',
    timestamp: new Date('2026-08-13T11:35:20.000Z'),
    timestampNs: '1786225020000000000',
    line: 'WARN: upstream timeout service=checkout-api',
    labels: { severity: 'WARN', service_name: 'compute-workload', resource_name: 'checkout-api' },
  },
]

function Wrapper({
  children,
  selectedId: initialSelectedId = null,
}: {
  children: ReactNode
  selectedId?: string | null
}) {
  const [selectedId, setSelectedId] = useState(initialSelectedId)

  return (
    <Logs.Root
      entries={entries}
      selectedId={selectedId}
      onSelectedIdChange={setSelectedId}
      facets={[
        {
          name: 'severity',
          label: 'Severity',
          options: [
            { value: 'INFO', count: 1 },
            { value: 'WARN', count: 1 },
          ],
        },
      ]}
    >
      {children}
    </Logs.Root>
  )
}

describe('logs filters', () => {
  it('toggles a facet checkbox into matcher state', async () => {
    const user = userEvent.setup()
    render(
      <Wrapper>
        <Logs.Filters />
      </Wrapper>,
    )

    const checkbox = screen.getByRole('checkbox', { name: 'WARN' })
    expect(checkbox).not.toBeChecked()
    await user.click(checkbox)
    expect(checkbox).toBeChecked()

    await user.click(screen.getByRole('button', { name: 'Reset' }))
    expect(checkbox).not.toBeChecked()
  })
})

describe('logs explorer', () => {
  it('renders the composed explorer layout', () => {
    render(
      <Wrapper>
        <Logs.Explorer />
      </Wrapper>,
    )

    expect(screen.getByText('Filters')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Search logs...')).toBeInTheDocument()
    expect(screen.getByText('Time')).toBeInTheDocument()
  })
})

describe('logs table and detail', () => {
  it('selects a row and opens detail', async () => {
    const user = userEvent.setup()
    render(
      <Wrapper>
        <Logs.Table />
        <Logs.Detail />
      </Wrapper>,
    )

    await user.click(screen.getByText('/api/v1/checkout'))
    expect(screen.getByRole('heading', { name: 'GET /api/v1/checkout' })).toBeInTheDocument()
    expect(screen.getByText('Labels')).toBeInTheDocument()
  })

  it('moves to the next row from the detail panel', async () => {
    const user = userEvent.setup()
    render(
      <Wrapper selectedId="1">
        <Logs.Table />
        <Logs.Detail />
      </Wrapper>,
    )

    await user.click(screen.getByRole('button', { name: 'Next log' }))
    expect(screen.getByRole('heading', { name: 'compute-workload' })).toBeInTheDocument()
  })

  it('closes the detail panel', async () => {
    const user = userEvent.setup()
    render(
      <Wrapper selectedId="1">
        <Logs.Table />
        <Logs.Detail />
      </Wrapper>,
    )

    await user.click(screen.getByRole('button', { name: 'Close details' }))
    expect(screen.queryByRole('heading', { name: 'GET /api/v1/checkout' })).not.toBeInTheDocument()
  })

  it('moves to the previous row', async () => {
    const user = userEvent.setup()
    render(
      <Wrapper selectedId="2">
        <Logs.Table />
        <Logs.Detail />
      </Wrapper>,
    )

    await user.click(screen.getByRole('button', { name: 'Previous log' }))
    expect(screen.getByRole('heading', { name: 'GET /api/v1/checkout' })).toBeInTheDocument()
  })
})

describe('logs toolbar and empty states', () => {
  it('toggles live mode and calls refresh/export', async () => {
    const user = userEvent.setup()
    const onRefresh = vi.fn()
    const onExport = vi.fn()

    render(
      <Logs.Root entries={entries} onRefresh={onRefresh} onExport={onExport}>
        <Logs.Toolbar />
      </Logs.Root>,
    )

    const live = screen.getByRole('button', { name: 'Live' })
    expect(live).toHaveAttribute('aria-pressed', 'false')
    await user.click(live)
    expect(live).toHaveAttribute('aria-pressed', 'true')

    await user.click(screen.getByRole('button', { name: 'Refresh logs' }))
    expect(onRefresh).toHaveBeenCalled()

    await user.click(screen.getByRole('button', { name: 'Export logs' }))
    expect(onExport).toHaveBeenCalled()
  })

  it('shows loading skeletons and an empty state', () => {
    const { rerender } = render(
      <Logs.Root entries={[]} isLoading>
        <Logs.Table />
      </Logs.Root>,
    )
    expect(document.querySelectorAll('[data-slot="table-row"]').length).toBeGreaterThan(1)

    rerender(
      <Logs.Root entries={[]} error="Query failed">
        <Logs.Table />
      </Logs.Root>,
    )
    expect(screen.getByRole('alert')).toHaveTextContent('Query failed')
    expect(screen.getByText('No logs in this time range')).toBeInTheDocument()
  })
})
