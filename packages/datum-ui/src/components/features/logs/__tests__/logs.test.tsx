/// <reference types="@testing-library/jest-dom/vitest" />
import type { ReactNode } from 'react'
import type { LogEntry } from '../types'
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
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

function SearchHarness() {
  const [search, setSearch] = useState('timeout')
  return (
    <Logs.Root entries={entries} search={search} onSearchChange={setSearch}>
      <Logs.Search />
      <button type="button" onClick={() => setSearch('')}>Clear search</button>
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
    expect(screen.getByRole('columnheader', { name: 'Severity' })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: 'Path' })).toBeInTheDocument()
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
    expect(screen.getByRole('complementary')).toHaveClass('absolute')
  })

  it('lets the user widen the detail panel but not shrink below 400px', async () => {
    const user = userEvent.setup()
    render(
      <Wrapper selectedId="1">
        <div className="relative" style={{ width: 1200 }}>
          <Logs.Table />
          <Logs.Detail />
        </div>
      </Wrapper>,
    )

    const panel = screen.getByRole('complementary')
    const handle = screen.getByRole('separator', { name: 'Resize details' })
    expect(panel).toHaveStyle({ width: '400px' })

    handle.focus()
    await user.keyboard('{ArrowRight}')
    expect(panel).toHaveStyle({ width: '400px' })

    await user.keyboard('{ArrowLeft}')
    expect(panel).toHaveStyle({ width: '416px' })
  })

  it('resizes the detail panel by dragging the handle', () => {
    render(
      <Wrapper selectedId="1">
        <div className="relative" style={{ width: 1200 }}>
          <Logs.Table />
          <Logs.Detail />
        </div>
      </Wrapper>,
    )

    const panel = screen.getByRole('complementary')
    const handle = screen.getByRole('separator', { name: 'Resize details' })
    // jsdom has no pointer capture; the handle guards both calls.
    handle.setPointerCapture = vi.fn()
    handle.hasPointerCapture = vi.fn(() => true)
    handle.releasePointerCapture = vi.fn()

    fireEvent.pointerDown(handle, { button: 0, clientX: 800, pointerId: 1 })
    fireEvent.pointerMove(handle, { clientX: 600, pointerId: 1 })
    expect(panel).toHaveStyle({ width: '600px' })
    expect(handle).toHaveAttribute('aria-valuenow', '600')
    expect(Number(handle.getAttribute('aria-valuemax'))).toBeGreaterThanOrEqual(600)

    // Dragging past the right edge clamps at the minimum width.
    fireEvent.pointerMove(handle, { clientX: 1100, pointerId: 1 })
    expect(panel).toHaveStyle({ width: '400px' })

    fireEvent.pointerUp(handle, { pointerId: 1 })
    expect(handle.releasePointerCapture).toHaveBeenCalledWith(1)

    // Movement after release is ignored.
    fireEvent.pointerMove(handle, { clientX: 100, pointerId: 1 })
    expect(panel).toHaveStyle({ width: '400px' })
  })

  it('renders a readable LOG badge when severity is missing', () => {
    render(
      <Logs.Root
        entries={[
          {
            id: '3',
            timestamp: new Date('2026-08-13T11:35:28.000Z'),
            timestampNs: '1786225028000000000',
            line: 'worker started',
            labels: {},
          },
        ]}
        defaultSelectedId="3"
      >
        <Logs.Detail />
      </Logs.Root>,
    )

    expect(screen.getByText('LOG')).toBeInTheDocument()
  })

  it('shows the HTTP status inline with the title and an absolute timestamp', () => {
    render(
      <Wrapper selectedId="1">
        <Logs.Detail />
      </Wrapper>,
    )

    const heading = screen.getByRole('heading', { name: 'GET /api/v1/checkout' })
    const chip = document.querySelector('[data-slot="logs-http-status"]')
    expect(chip).toHaveTextContent('200')
    expect(heading.parentElement).toContainElement(chip as HTMLElement)

    const time = document.querySelector('[data-slot="logs-detail-time"]')
    expect(time).toHaveTextContent(/AUG 13 \d{2}:\d{2}:\d{2}\.\d{2}/)
    expect(time).not.toHaveTextContent('ago')
  })

  it('lists search params under the request block and strips them from the path', () => {
    render(
      <Logs.Root
        entries={[
          {
            id: '4',
            timestamp: new Date('2026-08-13T11:35:28.000Z'),
            timestampNs: '1786225028000000000',
            line: 'GET /api/v1/products?category=shoes&page=2 200 12ms',
            labels: {},
          },
        ]}
        defaultSelectedId="4"
      >
        <Logs.Detail />
      </Logs.Root>,
    )

    expect(screen.getByRole('heading', { name: 'GET /api/v1/products' })).toBeInTheDocument()
    const params = document.querySelector('[data-slot="logs-search-params"]')
    expect(params).toHaveTextContent('category')
    expect(params).toHaveTextContent('shoes')
    expect(params).toHaveTextContent('page')
    expect(params).toHaveTextContent('2')
    expect(screen.getByRole('button', { name: 'Copy search params' })).toBeInTheDocument()
  })

  it('shows the status code before the method in the table', () => {
    render(
      <Wrapper>
        <Logs.Table />
      </Wrapper>,
    )

    const status = screen.getByText('200').parentElement
    expect(status?.textContent).toBe('200GET')
  })

  it('renders Envoy OTEL access logs that have an empty Body', () => {
    render(
      <Logs.Root
        entries={[
          {
            id: 'otel',
            timestamp: new Date('2026-09-10T12:46:33.472Z'),
            timestampNs: '1789044394384967739',
            line: '',
            labels: {
              method: 'GET',
              path: '/projects/demo-app?_rsc=1qiq5',
              response_code: '304',
              duration: '47',
              requested_server_name: 'app.example.com',
            },
          },
        ]}
        columns={['time', 'status', 'host', 'path']}
        defaultSelectedId="otel"
      >
        <Logs.Table />
        <Logs.Detail />
      </Logs.Root>,
    )

    expect(screen.getAllByText('304')[0]?.parentElement).toHaveTextContent('304GET')
    expect(screen.getAllByText('/projects/demo-app?_rsc=1qiq5').length).toBeGreaterThan(0)
    expect(screen.getAllByText('app.example.com').length).toBeGreaterThan(0)
    expect(screen.getByRole('heading', { name: 'GET /projects/demo-app' })).toBeInTheDocument()
    expect(screen.getByText('GET /projects/demo-app?_rsc=1qiq5 304 47ms')).toBeInTheDocument()
    expect(document.querySelector('[data-slot="logs-search-params"]')).toHaveTextContent('_rsc')
  })

  it('summarises the client from the user_agent label', async () => {
    const user = userEvent.setup()
    const ua = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1'
    render(
      <Logs.Root
        entries={[
          {
            id: 'ua',
            timestamp: new Date('2026-09-10T12:46:33.472Z'),
            timestampNs: '1789044394384967739',
            line: '',
            labels: { method: 'GET', path: '/', response_code: '200', user_agent: ua },
          },
        ]}
        defaultSelectedId="ua"
      >
        <Logs.Detail />
      </Logs.Root>,
    )

    const client = document.querySelector('[data-slot="logs-client"]')
    expect(client).toHaveTextContent('Client')
    expect(client?.querySelector('[data-slot="logs-client-summary"]')).toHaveTextContent('Safari 17 on iOS 17.5.1')
    expect(client).toHaveTextContent('mobile')
    expect(client).toHaveTextContent(ua)
    await user.click(screen.getByRole('button', { name: 'Copy user agent' }))
  })

  it('omits the client row when there is no user agent', () => {
    render(
      <Wrapper selectedId="1">
        <Logs.Detail />
      </Wrapper>,
    )
    expect(document.querySelector('[data-slot="logs-client"]')).toBeNull()
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
    await waitFor(() => {
      expect(screen.queryByRole('heading', { name: 'GET /api/v1/checkout' })).not.toBeInTheDocument()
    })
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

  it('focuses the table on row click so keyboard navigation works', async () => {
    const user = userEvent.setup()
    render(
      <Wrapper>
        <Logs.Table />
        <Logs.Detail />
      </Wrapper>,
    )

    await user.click(screen.getByText('/api/v1/checkout'))
    expect(screen.getByRole('row', { selected: true })).toBeInTheDocument()
    await user.keyboard('j')
    expect(screen.getByRole('heading', { name: 'compute-workload' })).toBeInTheDocument()
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

  it('does not write a stale search back after the host clears it', () => {
    vi.useFakeTimers()

    render(<SearchHarness />)
    const input = screen.getByRole('textbox', { name: 'Search logs...' })
    expect(input).toHaveValue('timeout')

    act(() => {
      screen.getByRole('button', { name: 'Clear search' }).click()
    })
    expect(input).toHaveValue('')
    act(() => {
      vi.advanceTimersByTime(300)
    })
    expect(input).toHaveValue('')
    vi.useRealTimers()
  })

  it('shows loading skeletons and an empty state', () => {
    const { rerender } = render(
      <Logs.Root entries={[]} isLoading>
        <Logs.Table />
      </Logs.Root>,
    )
    expect(document.querySelectorAll('[data-slot="logs-skeleton-row"]').length).toBeGreaterThan(1)

    rerender(
      <Logs.Root entries={[]} error="Query failed">
        <Logs.Table />
      </Logs.Root>,
    )
    expect(screen.getByRole('alert')).toHaveTextContent('Query failed')
    expect(screen.getByRole('alert')).toHaveTextContent('Couldn\'t load logs')
    expect(screen.queryByText('No logs in this time range')).not.toBeInTheDocument()
  })

  it('offers Retry on error when the host can refresh', async () => {
    const user = userEvent.setup()
    const onRefresh = vi.fn()
    render(
      <Logs.Root entries={[]} error="boom" onRefresh={onRefresh}>
        <Logs.Table />
      </Logs.Root>,
    )

    await user.click(screen.getByRole('button', { name: 'Retry' }))
    expect(onRefresh).toHaveBeenCalledTimes(1)
  })

  it('shows one state at a time: error wins over loading and empty', () => {
    render(
      <Logs.Root entries={[]} isLoading error="boom">
        <Logs.Table />
      </Logs.Root>,
    )

    expect(document.querySelector('[data-slot="logs-error"]')).toBeInTheDocument()
    expect(document.querySelectorAll('[data-slot="logs-skeleton-row"]')).toHaveLength(0)
    expect(screen.queryByText('No logs in this time range')).not.toBeInTheDocument()
  })

  it('keeps the last result on screen and shows a banner when a refresh fails', () => {
    const { rerender } = render(
      <Logs.Root entries={entries} onRefresh={() => {}}>
        <Logs.Table />
      </Logs.Root>,
    )
    expect(document.querySelector('[data-slot="logs-error-banner"]')).toBeNull()

    // Same rows, but the refresh failed.
    rerender(
      <Logs.Root entries={entries} error="upstream timeout" onRefresh={() => {}}>
        <Logs.Table />
      </Logs.Root>,
    )

    const banner = document.querySelector('[data-slot="logs-error-banner"]')
    expect(banner).toHaveAttribute('role', 'alert')
    expect(banner).toHaveTextContent('upstream timeout')
    expect(document.querySelector('[data-slot="logs-error"]')).not.toBeInTheDocument()
    expect(screen.getByText('/api/v1/checkout')).toBeInTheDocument()
    // The banner sits above the table, not inside the row list.
    expect(banner?.closest('tbody')).toBeNull()
  })

  it('skips unknown column ids instead of crashing', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    render(
      // @ts-expect-error deliberately invalid id, as a URL-driven list might produce
      <Logs.Root entries={entries} columns={['time', 'nope', 'path']}>
        <Logs.Table />
      </Logs.Root>,
    )

    expect(screen.getAllByRole('columnheader')).toHaveLength(2)
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('Unknown column id "nope"'))
    warn.mockRestore()
  })

  it('offers Clear filters on an empty result when filters are active', async () => {
    const user = userEvent.setup()
    const onFiltersChange = vi.fn()
    render(
      <Logs.Root entries={[]} defaultFilters={{ severity: ['ERROR'] }} onFiltersChange={onFiltersChange}>
        <Logs.Table />
      </Logs.Root>,
    )

    await user.click(screen.getByRole('button', { name: 'Clear filters' }))
    expect(onFiltersChange).toHaveBeenCalledWith({})
    expect(screen.queryByRole('button', { name: 'Clear filters' })).not.toBeInTheDocument()
  })

  it('renders a skeleton cell per column so loading matches row shape', () => {
    render(
      <Logs.Root entries={[]} isLoading columns={['time', 'status', 'path']}>
        <Logs.Table />
      </Logs.Root>,
    )

    const skeletonRows = document.querySelectorAll('[data-slot="logs-skeleton-row"]')
    expect(skeletonRows.length).toBe(12)
    expect(skeletonRows[0]?.querySelectorAll('[data-slot="table-cell"]')).toHaveLength(3)

    const status = skeletonRows[0]?.querySelector('[data-slot="logs-skeleton-status"]')
    expect(status?.querySelectorAll('[data-slot="logs-skeleton"]')).toHaveLength(2)

    const pathWidths = [...skeletonRows].map((row) => {
      const pathCell = row.querySelectorAll('[data-slot="table-cell"]')[2] as HTMLElement | undefined
      const bar = pathCell?.querySelector('[data-slot="logs-skeleton"]') as HTMLElement | null
      return bar?.style.width
    })
    expect(new Set(pathWidths).size).toBeGreaterThan(1)
  })
})

describe('logs custom columns', () => {
  it('renders the built-in Host column from host or resource_name', () => {
    render(
      <Logs.Root entries={entries} columns={['time', 'host', 'path']}>
        <Logs.Table />
      </Logs.Root>,
    )

    expect(screen.getByRole('columnheader', { name: 'Host' })).toBeInTheDocument()
    expect(screen.getAllByText('gateway-eu-west').length).toBeGreaterThan(0)
  })

  it('renders a custom Host column beside built-in ids', () => {
    render(
      <Logs.Root
        entries={entries}
        columns={[
          'time',
          {
            id: 'host',
            header: 'Host',
            size: 'fixed',
            width: 160,
            cell: ({ entry }) => entry.labels.resource_name ?? '—',
          },
          'path',
        ]}
      >
        <Logs.Table />
      </Logs.Root>,
    )

    expect(screen.getByRole('columnheader', { name: 'Host' })).toBeInTheDocument()
    expect(screen.queryByRole('columnheader', { name: 'Severity' })).not.toBeInTheDocument()
    expect(screen.getAllByText('gateway-eu-west').length).toBeGreaterThan(0)
  })
})

describe('logs time range', () => {
  it('labels the trigger with the active preset and switches presets', async () => {
    const user = userEvent.setup()
    const onTimeRangeChange = vi.fn()
    render(
      <Logs.Root entries={entries} onTimeRangeChange={onTimeRangeChange}>
        <Logs.TimeRangeFilter />
      </Logs.Root>,
    )

    const trigger = screen.getByRole('combobox')
    expect(trigger).toHaveTextContent('Last 30 minutes')

    await user.click(trigger)
    await user.click(screen.getByRole('button', { name: /Last hour/ }))

    expect(onTimeRangeChange).toHaveBeenCalledWith(expect.objectContaining({ preset: 'last-1h' }))
    const { from, to } = onTimeRangeChange.mock.calls[0]![0]
    expect(new Date(to).getTime() - new Date(from).getTime()).toBe(60 * 60 * 1000)
    expect(trigger).toHaveTextContent('Last hour')
  })

  it('labels absolute ranges with a compact date range', () => {
    render(
      <Logs.Root
        entries={entries}
        timeRange={{ from: '2026-08-13T11:00:00.000Z', to: '2026-08-13T12:00:00.000Z' }}
      >
        <Logs.TimeRangeFilter />
      </Logs.Root>,
    )

    expect(screen.getByRole('combobox')).toHaveTextContent(/Aug 13, \d{2}:\d{2} – \d{2}:\d{2}/)
  })
})

describe('logs timeline', () => {
  const range = { from: '2026-08-13T11:30:00.000Z', to: '2026-08-13T12:00:00.000Z' }

  it('buckets entries across the time range and marks the selected bucket', () => {
    render(
      <Logs.Root entries={entries} timeRange={range} defaultSelectedId="1">
        <Logs.Timeline />
      </Logs.Root>,
    )

    const buckets = document.querySelectorAll('[data-slot="logs-timeline-bucket"]')
    expect(buckets).toHaveLength(60)
    expect(screen.getByRole('img', { name: /2 logs between/ })).toBeInTheDocument()
    expect(document.querySelectorAll('[data-slot="logs-timeline-bucket"][data-selected]')).toHaveLength(1)
  })

  it('prefers host-supplied histogram buckets', () => {
    render(
      <Logs.Root
        entries={entries}
        timeRange={range}
        histogram={[
          { start: range.from, end: '2026-08-13T11:45:00.000Z', count: 7 },
          { start: '2026-08-13T11:45:00.000Z', end: range.to, count: 3 },
        ]}
      >
        <Logs.Timeline />
      </Logs.Root>,
    )

    expect(document.querySelectorAll('[data-slot="logs-timeline-bucket"]')).toHaveLength(2)
    expect(screen.getByRole('img', { name: /10 logs between/ })).toBeInTheDocument()
  })

  it('shows skeleton bars while loading without data', () => {
    render(
      <Logs.Root entries={[]} isLoading histogram={[]}>
        <Logs.Timeline />
      </Logs.Root>,
    )

    expect(document.querySelector('[data-slot="logs-timeline-skeleton"]')).toBeTruthy()
  })
})

describe('logs filter loading', () => {
  it('shows filter skeletons when loading with no facets', () => {
    render(
      <Logs.Root entries={[]} isLoading facets={[]}>
        <Logs.Filters />
      </Logs.Root>,
    )

    expect(document.querySelector('[data-slot="logs-filters-skeleton"]')).toBeTruthy()
  })

  it('keeps facet groups when they already exist while loading', () => {
    render(
      <Logs.Root
        entries={entries}
        isLoading
        facets={[
          { name: 'severity', label: 'Severity', options: [{ value: 'INFO', count: 1 }] },
        ]}
      >
        <Logs.Filters />
      </Logs.Root>,
    )

    expect(document.querySelector('[data-slot="logs-filters-skeleton"]')).toBeNull()
    expect(screen.getByRole('checkbox', { name: 'INFO' })).toBeInTheDocument()
  })
})
