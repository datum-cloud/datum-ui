/// <reference types="@testing-library/jest-dom/vitest" />
import type { SetLogsSearchParams } from '../hooks/use-logs-url-state'
import type { LogEntry } from '../types'
import { act, render, renderHook, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { afterEach, describe, expect, it } from 'vitest'
import { useLogsUrlState } from '../hooks/use-logs-url-state'
import { Logs } from '../logs'
import { logsUrlStateKey, parseLogsUrlState, writeLogsUrlState } from '../utils/url-state'

const NOW = new Date('2026-11-09T10:13:00.000Z')

describe('parseLogsUrlState', () => {
  it('falls back to defaults for an empty query string', () => {
    expect(parseLogsUrlState('', { now: NOW })).toEqual({
      timeRange: { from: '2026-11-09T09:43:00.000Z', to: '2026-11-09T10:13:00.000Z', preset: 'last-30m' },
      filters: {},
      search: '',
      live: false,
      selectedId: null,
    })
  })

  it('reads every part', () => {
    const state = parseLogsUrlState(
      '?q=timeout&range=last-1h&filter=severity:ERROR&filter=severity:WARN&filter=service_name:waf&live=1&log=abc-0-1',
      { now: NOW },
    )
    expect(state).toEqual({
      timeRange: { from: '2026-11-09T09:13:00.000Z', to: '2026-11-09T10:13:00.000Z', preset: 'last-1h' },
      filters: { severity: ['ERROR', 'WARN'], service_name: ['waf'] },
      search: 'timeout',
      live: true,
      selectedId: 'abc-0-1',
    })
  })

  it('reads an absolute range', () => {
    const state = parseLogsUrlState('from=2026-11-09T10:08:00Z&to=2026-11-09T10:13:00Z', { now: NOW })
    expect(state.timeRange).toEqual({ from: '2026-11-09T10:08:00.000Z', to: '2026-11-09T10:13:00.000Z' })
  })

  it('ignores malformed values instead of failing', () => {
    const state = parseLogsUrlState(
      'range=last-forever&from=nope&to=2026-11-09T10:13:00Z&filter=bad-label:x&filter=:x&filter=severity:&filter=severity:INFO&filter=severity:INFO',
      { now: NOW },
    )
    expect(state.timeRange.preset).toBe('last-30m')
    expect(state.filters).toEqual({ severity: ['INFO'] })
  })

  it('rejects a range that ends before it starts', () => {
    const state = parseLogsUrlState('from=2026-11-09T10:13:00Z&to=2026-11-09T10:08:00Z', { now: NOW })
    expect(state.timeRange.preset).toBe('last-30m')
  })

  it('keeps colons in filter values', () => {
    expect(parseLogsUrlState('filter=path:/a:b').filters).toEqual({ path: ['/a:b'] })
  })

  it('honours a prefix', () => {
    const state = parseLogsUrlState('q=app&logs.q=mine', { prefix: 'logs.' })
    expect(state.search).toBe('mine')
  })
})

describe('writeLogsUrlState', () => {
  it('round-trips through parse', () => {
    const state = {
      timeRange: { from: '2026-11-09T10:08:00.000Z', to: '2026-11-09T10:13:00.000Z' },
      filters: { severity: ['ERROR'], service_name: ['waf', 'envoy'] },
      search: 'status=5',
      live: true,
      selectedId: '1-0-0',
    }
    const params = writeLogsUrlState('', state)
    expect(parseLogsUrlState(params, { now: NOW })).toEqual(state)
  })

  it('keeps params it does not own', () => {
    const params = writeLogsUrlState('tab=logs&q=old', { search: 'new' })
    expect(params.get('tab')).toBe('logs')
    expect(params.get('q')).toBe('new')
  })

  it('leaves defaults out of the URL', () => {
    const params = writeLogsUrlState('q=x&live=1&filter=severity:INFO&range=last-1h&log=1', {
      search: '',
      live: false,
      filters: { severity: [] },
      timeRange: { from: 'a', to: 'b', preset: 'last-30m' },
      selectedId: null,
    })
    expect(params.toString()).toBe('')
  })

  it('writes a preset as its key and drops stale from/to', () => {
    const params = writeLogsUrlState('from=2026-01-01T00:00:00Z&to=2026-01-02T00:00:00Z', {
      timeRange: { from: 'x', to: 'y', preset: 'last-6h' },
    })
    expect(params.toString()).toBe('range=last-6h')
  })

  it('treats a custom default range as the default', () => {
    const defaultTimeRange = { from: '', to: '', preset: 'last-1h' }
    expect(writeLogsUrlState('', { timeRange: { from: 'a', to: 'b', preset: 'last-1h' } }, { defaultTimeRange }).toString()).toBe('')
    expect(writeLogsUrlState('', { timeRange: { from: 'a', to: 'b', preset: 'last-30m' } }, { defaultTimeRange }).toString()).toBe('range=last-30m')
  })
})

describe('logsUrlStateKey', () => {
  it('ignores params the explorer does not own', () => {
    expect(logsUrlStateKey('q=a&tab=1')).toBe(logsUrlStateKey('tab=2&q=a'))
    expect(logsUrlStateKey('q=a')).not.toBe(logsUrlStateKey('q=b'))
  })
})

describe('useLogsUrlState', () => {
  afterEach(() => {
    window.history.replaceState(null, '', '/')
  })

  it('reads and writes window.location by default', () => {
    window.history.replaceState(null, '', '/logs?tab=1&q=boot#row')
    const { result } = renderHook(() => useLogsUrlState())
    expect(result.current.search).toBe('boot')

    act(() => result.current.onFiltersChange({ severity: ['ERROR'] }))
    expect(window.location.pathname).toBe('/logs')
    expect(window.location.hash).toBe('#row')
    expect(new URLSearchParams(window.location.search).getAll('filter')).toEqual(['severity:ERROR'])
    expect(new URLSearchParams(window.location.search).get('tab')).toBe('1')
    expect(result.current.filters).toEqual({ severity: ['ERROR'] })
  })

  it('replaces the history entry by default and pushes when asked', () => {
    const before = window.history.length
    const { result, rerender } = renderHook(({ history }: { history?: 'push' | 'replace' }) => useLogsUrlState({ history }), { initialProps: {} })
    act(() => result.current.onLiveChange(true))
    expect(window.history.length).toBe(before)

    rerender({ history: 'push' })
    act(() => result.current.onLiveChange(false))
    expect(window.history.length).toBe(before + 1)
  })

  it('follows back/forward navigation', () => {
    const { result } = renderHook(() => useLogsUrlState())
    act(() => {
      window.history.replaceState(null, '', '/?q=from-history')
      window.dispatchEvent(new PopStateEvent('popstate'))
    })
    expect(result.current.search).toBe('from-history')
  })

  it('keeps the same timeRange object when an unrelated param changes', () => {
    window.history.replaceState(null, '', '/?range=last-1h')
    const { result } = renderHook(() => useLogsUrlState())
    const first = result.current.timeRange
    act(() => {
      window.history.replaceState(null, '', '/?range=last-1h&tab=2')
      window.dispatchEvent(new PopStateEvent('popstate'))
    })
    expect(result.current.timeRange).toBe(first)
  })

  it('keeps state and handlers stable across renders with an inline default range', () => {
    const { result, rerender } = renderHook(() => useLogsUrlState({ defaultTimeRange: { from: '', to: '', preset: 'last-1h' } }))
    const first = result.current
    rerender()
    expect(result.current).toBe(first)
    expect(result.current.timeRange.preset).toBe('last-1h')
  })

  it('uses a router adapter when given one', () => {
    let params = new URLSearchParams('q=router')
    const calls: Array<{ replace?: boolean }> = []
    const setSearchParams: SetLogsSearchParams = (update, options) => {
      params = update(params)
      calls.push(options ?? {})
    }
    const { result, rerender } = renderHook(() => useLogsUrlState({ searchParams: params, setSearchParams }))
    expect(result.current.search).toBe('router')

    act(() => result.current.onSearchChange('next'))
    rerender()
    expect(params.get('q')).toBe('next')
    expect(result.current.search).toBe('next')
    expect(calls).toEqual([{ replace: true }])
    expect(window.location.search).toBe('')
  })
})

const entries: LogEntry[] = [
  {
    id: 'e1',
    timestamp: new Date('2026-11-09T10:10:00.000Z'),
    timestampNs: '1794222600000000000',
    line: 'ERROR: upstream reset',
    labels: { severity: 'ERROR', service_name: 'envoy-gateway', resource_name: 'gw' },
  },
  {
    id: 'e2',
    timestamp: new Date('2026-11-09T10:11:00.000Z'),
    timestampNs: '1794222660000000000',
    line: 'INFO: ok',
    labels: { severity: 'INFO', service_name: 'envoy-gateway', resource_name: 'gw' },
  },
]

function UrlExplorer() {
  const logsState = useLogsUrlState()
  const [source] = useState(entries)
  return (
    <Logs.Root {...logsState} entries={source}>
      <Logs.Explorer />
    </Logs.Root>
  )
}

describe('useLogsUrlState with Logs.Root', () => {
  afterEach(() => {
    window.history.replaceState(null, '', '/')
  })

  it('writes facet clicks to the URL and restores them on mount', async () => {
    const user = userEvent.setup()
    const { unmount } = render(<UrlExplorer />)
    await user.click(screen.getByRole('checkbox', { name: /ERROR/ }))
    expect(new URLSearchParams(window.location.search).getAll('filter')).toEqual(['severity:ERROR'])

    unmount()
    render(<UrlExplorer />)
    expect(screen.getByRole('checkbox', { name: /ERROR/ })).toBeChecked()
  })
})
